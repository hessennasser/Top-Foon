"use client"
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MainContext } from '@/mainContext';
import MoyasarForm from '@/components/payment/MoyasarForm';
import { toast } from 'react-toastify';
import { mainRequest } from '@/axiosConfig';
import { apiUrl } from '@/apiUrl';
import InvoiceInfo from '@/components/payment/InvoiceInfo';
import CartISavedItems from '@/components/payment/CartISavedItems';
import InstallmentManagement from '@/components/payment/InstallmentManagement';
import Loading from '@/components/Loading';
import { useTranslation } from '../../i18n/client';

const Page = () => {
    const { cart, calculateTotalPrice, loadingCart } = useContext(MainContext)
    const { t, i18n } = useTranslation();

    const [cardInfo, setCardInfo] = useState({
        "source[number]": '',
        "source[name]": '',
        "source[month]": '',
        "source[year]": '',
        "source[cvc]": '',
    });

    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState('creditcard');
    const [installmentDuration, setInstallmentDuration] = useState('0'); // New state for installment duration
    const [installmentDetails, setInstallmentDetails] = useState([]);
    const [calculateInstallmentAmountData, setCalculateInstallmentAmountData] = useState({});
    const [loading, setLoading] = useState(false);
    // Generate paragraph with product details
    let productDetailsParagraph;

    if (cart?.length > 0) {
        productDetailsParagraph = cart.map(item => (
            `${item.product.name[i18n.language]} - ${t('quantity')}: ${item.quantity} - ${t('color')}: ${item.color} - ${t('storage')}: ${item.storage} - ${t('price')}: ${item.product.price} SAR - ${t('total_price')}: ${item.totalForItem} SAR\n`
        )).join('. ');
    }


    const calculateInstallmentAmount = () => {
        if (installmentDuration !== '0') {
            let interestRate = installmentDuration === '6' ? 0.05 : installmentDuration === '12' ? 0.1 : installmentDuration === '18' ? 0.15 : null; // Set interest rate based on installment duration
            let totalPrice = parseInt(calculateTotalPrice());
            let totalInterest = Math.ceil(totalPrice * (1 + interestRate));
            let firstInstallment = Math.ceil(totalInterest * 0.25) + 25; // Calculate first installment including 25% down payment and shipping fee
            let remainingAmount = totalInterest - (firstInstallment - 25); // Calculate remaining amount after first installment
            let monthlyInstallment = remainingAmount / (parseInt(installmentDuration) - 1); // Calculate monthly installment for remaining installments

            // Array to store installment months and amounts
            let installmentDetails = [];

            // First installment (25% of total price + interest + shipping fee)
            installmentDetails.push({
                month: 1,
                amount: firstInstallment
            });

            // Remaining installments
            for (let i = 2; i <= parseInt(installmentDuration); i++) {
                installmentDetails.push({
                    month: i,
                    amount: Math.ceil(monthlyInstallment)
                });
            }
            setInstallmentDetails(installmentDetails);
            setCalculateInstallmentAmountData({
                rateAmount: Math.ceil(totalInterest - totalPrice),
                totalPrice: Math.ceil(totalInterest) + 25,
                installmentDetails: installmentDetails
            });
        } else {
            setCalculateInstallmentAmountData({
                rateAmount: t('not_found'),
                totalPrice: Math.ceil(parseInt(calculateTotalPrice()) + 25),
                installmentDetails: [] // No installments for full payment
            });
        }
    };

    const handleOrderSubmit = async (cardInfo) => {
        if (!userName || !phone || !userEmail || !shippingAddress || !city || !country || !paymentMethodId || !installmentDuration) {
            return toast.error(t('fill_required_fields'));
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            return toast.error(t('invalid_email'));
        }

        // Include installment duration in the description
        const productDetailsParagraph = cart.map(item => (
            `${item.product.name[i18n.language]} - ${t('quantity')}: ${item.quantity} - ${t('price')}: ${item.product.price} USD - ${t('total_price')}: ${item.quantity * item.product.price} USD\n`
        )).join('. ');

        setLoading(true);
        try {
            let installmentDetails = [];
            let installmentStartDate = new Date(); // Initialize start date
            let installmentEndDate = new Date(); // Initialize end date

            if (installmentDuration !== '0') {
                // Populate installmentDetails array
                for (let i = 0; i < parseInt(installmentDuration); i++) {
                    installmentDetails.push({
                        month: i + 1,
                        amount: calculateInstallmentAmountData.installmentDetails[i]?.amount || 0
                    });
                }
                // Calculate installmentEndDate
                installmentEndDate.setMonth(installmentEndDate.getMonth() + parseInt(installmentDuration));
            }

            const response = await mainRequest.post(`${apiUrl}/create-order`, {
                items: cart,
                userName,
                phone,
                userEmail,
                shippingAddress,
                city,
                country,
                installmentDuration,
                installmentOfMonthNum: 1,
                installmentDetails,
                installmentAmount: calculateInstallmentAmountData.totalPrice,
                installmentStartDate,
                installmentEndDate,
                isPaidInFull: installmentDuration == "0" ? true : false,
            });
            console.log(response);
            if (response.status === 201) {
                if (installmentDuration == 0) {
                    window.open(response.data.orderCreated.redirect_url, "blank");
                    window.location.href = "/purchases"
                } else {
                    window.open(response.data.orderCreated.installmentPayments[0].redirect_url, "blank");
                    window.location.href = "/purchases"
                }
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            if (error.response && error.response.data && error.response.data.message) {
                return toast.error(error.response.data.message);
            } else {
                return toast.error(t('processing_error'));
            }
        }
    };


    useEffect(() => {
        if (installmentDuration !== '0') {
            calculateInstallmentAmount();
        } else {
            setCalculateInstallmentAmountData({
                rateAmount: t('not_found'),
                totalPrice: Math.ceil(parseInt(calculateTotalPrice()) + 25),
                installmentDetails: []
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [installmentDuration, calculateTotalPrice]);

    if (loading || loadingCart) {
        return <Loading />
    }

    if (cart?.items?.length == 0 || cart?.length == 0) {
        return <div className="container mx-auto my-8 text-start" >
            <h1 className="text-3xl font-bold mb-4">{t('payment_page')}</h1>
            <p className="text-gray-600">{t('emptyCart')}</p>
        </div>
    }

    return (
        <>
            <div className="container mx-auto my-8" >
                <h1 className="text-3xl font-bold mb-4">{t('payment_page')}</h1>
                <InstallmentManagement
                    calculateInstallmentAmountData={calculateInstallmentAmountData}
                    installmentDuration={installmentDuration}
                    setInstallmentDuration={setInstallmentDuration}
                    cart={cart}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 relative">
                    <InvoiceInfo
                        userName={userName}
                        setUserName={setUserName}
                        phone={phone}
                        setPhone={setPhone}
                        userEmail={userEmail}
                        setUserEmail={setUserEmail}
                        shippingAddress={shippingAddress}
                        setShippingAddress={setShippingAddress}
                        city={city}
                        setCity={setCity}
                        country={country}
                        setCountry={setCountry}
                        paymentMethodId={paymentMethodId}
                        setPaymentMethodId={setPaymentMethodId}
                        handleOrderSubmit={handleOrderSubmit}
                        total={
                            installmentDuration == 0 ?
                                parseInt(calculateTotalPrice())
                                :
                                (Math.ceil(calculateInstallmentAmountData.installmentDetails?.[0]?.amount))
                        }
                        installmentDuration={installmentDuration}
                    />
                    {/* {
                        installmentDuration == 0 &&
                        <MoyasarForm handleOrderSubmit={handleOrderSubmit} total={
                            installmentDuration == 0 ?
                                parseInt(calculateTotalPrice())
                                :
                                (Math.ceil(calculateInstallmentAmountData.installmentDetails?.[0]?.amount))
                        }
                            cardInfo={cardInfo} setCardInfo={setCardInfo} />
                    } */}

                    <CartISavedItems
                        cart={cart}
                        calculateTotalPrice={calculateTotalPrice}
                        calculateInstallmentAmountData={calculateInstallmentAmountData}
                        installmentDuration={installmentDuration}
                    />
                </div>
            </div>
        </>
    );
};

export default Page;
