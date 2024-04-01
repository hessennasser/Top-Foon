"use client"
import { useEffect, useState } from 'react';
import { mainRequest } from '@/axiosConfig';
import { apiUrl } from '@/apiUrl';
import Loading from '@/components/Loading';
import { useTranslation } from '../../i18n/client';

const Page = () => {
    const { t, i18n } = useTranslation(); // Initialize useTranslation hook
    const [purchasesOrders, setOrders] = useState([]);
    const [showDetails, setShowDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await mainRequest.get(`${apiUrl}/user-orders/me`);
            setOrders(response.data?.orders);
        } catch (error) {
            console.error('Error fetching purchases data:', error);
        } finally {
            setLoading(false)
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Function to toggle visibility of order details
    const toggleDetails = (index) => {
        setShowDetails((prev) => {
            const updatedShowDetails = [...prev];
            updatedShowDetails[index] = !updatedShowDetails[index];
            return updatedShowDetails;
        });
    };

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <div className="container pt-5 pb-10">
                <div className="bg-white p-5 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4 bg-primaryColor py-4 text-center text-white">{t('Payments')}</h2>
                    {
                        purchasesOrders.length == 0 ? (
                            <h1>{t('No purchases yet')}</h1>
                        )
                            :
                            (
                                <div className="mt-5">
                                    {purchasesOrders.map((order, index) => (
                                        <div key={order._id} className="border-2 border-mainColor rounded-lg p-4 mb-4">
                                            <div className="flex mb-2 items-center justify-between flex-wrap">
                                                <h3 className="text-sm sm:text-lg font-semibold">{t('Order ID')}: {order._id}</h3>
                                                <div>
                                                    {order.status === 'Paid' ? (
                                                        <span className="px-2 inline-flex text-md leading-8 font-semibold rounded-full bg-green-500 text-white">
                                                            {order.status}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-md leading-8 font-semibold rounded-full bg-orange-500 text-white">
                                                            {order.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button onClick={() => toggleDetails(index)} className="mb-2 px-2 py-1 text-sm text-white rounded-md bg-primaryColor">{showDetails[index] ? t('Hide Details') : t('Show Details')}</button>
                                            <div className="mb-2 border-t pt-2 overflow-auto">
                                                <h3 className="text-md text-primaryColor sm:text-lg font-semibold mb-2">{t('Order Products')}</h3>
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                {t('Product Name')}
                                                            </th>
                                                            <th scope="col" className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                {t('Price')}
                                                            </th>
                                                            <th scope="col" className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                {t('Quantity')}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {order.items.map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="px-6 py-2 whitespace-nowrap">{item.product.name[i18n.language]}</td>
                                                                <td className="px-6 py-2 whitespace-nowrap">${item.totalForItem}</td>
                                                                <td className="px-6 py-2 whitespace-nowrap">{item.quantity}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {showDetails[index] && (
                                                <>
                                                    <div className="mb-2 border-t pt-2">
                                                        <h3 className="text-md text-primaryColor sm:text-lg font-semibold mb-2">{t('Delivery information')}</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <p>
                                                                <strong>{t('Name')}:</strong> {order.userName}
                                                            </p>
                                                            <p>
                                                                <strong>{t('Email')}:</strong> {order.userEmail}
                                                            </p>
                                                            <p>
                                                                <strong>{t('Phone')}:</strong> {order.phone}
                                                            </p>
                                                            <p>
                                                                <strong>{t('Shipping Address')}:</strong> {order.shippingAddress}
                                                            </p>
                                                            <p>
                                                                <strong>{t('City')}:</strong> {order.city}
                                                            </p>
                                                            <p>
                                                                <strong>{t('Country')}:</strong> {order.country}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {!order.isPaidInFull ? (
                                                        <div className="mb-2 border-t pt-2">
                                                            <h3 className="text-md text-primaryColor sm:text-lg font-semibold mb-2">{t('Installment information')}</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <p>
                                                                    <strong>{t('Duration')}:</strong> {order.installmentDuration} {t('Months')}
                                                                </p>
                                                                <p>
                                                                    <strong>{t('Installment Start Date')}:</strong>{' '}
                                                                    {formatDate(order.installmentStartDate)}
                                                                </p>
                                                                <p>
                                                                    <strong>{t('Installment End Date')}:</strong> {formatDate(order.installmentEndDate)}
                                                                </p>
                                                                <p>
                                                                    <strong>{t('Installment Amount')}:</strong> {order.installmentAmount}
                                                                </p>
                                                            </div>
                                                            <div className="overflow-auto mt-4">
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                {t('Month')}
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                {t('Payment ID')}
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                {t('Payment Date')}
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                {t('Amount Paid')}
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                {t('Payment Status')}
                                                                            </th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                {t('Actions')}
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                                        {order.installmentPayments.map((payment, index) => (
                                                                            <tr key={index}>
                                                                                <td className="px-6 py-4 whitespace-nowrap">{payment.month}</td>
                                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                                    {
                                                                                        index == 0 ? payment.paymentId :
                                                                                            payment.invoiceId ? payment.invoiceId : 'N/A'
                                                                                    }
                                                                                </td>
                                                                                <td className="px-6 py-4 whitespace-nowrap">{payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A'}</td>
                                                                                <td className="px-6 py-4 whitespace-nowrap">${payment.amountPaid}</td>
                                                                                <td className={`px-6 py-4 whitespace-nowrap ${payment.paymentStatus === 'Paid' ? 'bg-green-100' : 'bg-orange-100'}`}>
                                                                                    {payment.paymentStatus === 'Paid' ? (
                                                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500 text-white">
                                                                                            {payment.paymentStatus}
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-500 text-white">
                                                                                            {payment.paymentStatus}
                                                                                        </span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                                    {
                                                                                        payment.paymentStatus !== 'Paid' ?
                                                                                            <a href={payment?.invoiceUrl} target="_blank" rel="noopener noreferrer" className='main-btn'>
                                                                                                {t('Pay now')}
                                                                                            </a>
                                                                                            :
                                                                                            <span >
                                                                                                {t('Paid')}
                                                                                            </span>
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )
                                                        :
                                                        (
                                                            <div className="mb-2 border-t pt-2">
                                                                <h3 className="text-md text-primaryColor sm:text-lg font-semibold mb-2">{t('Payment Details')}</h3>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <p>
                                                                        <strong>{t('Payment Id')}:</strong> {order.paymentId}
                                                                    </p>
                                                                    <p>
                                                                        <strong>{t('Total Amount')}:</strong> {order.totalAmount}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </>
                                            )
                                            }
                                        </div>
                                    ))}
                                </div>
                            )
                    }
                </div>
            </div>
        </>
    );
};

export default Page;
