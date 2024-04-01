"use client"
import Loading from '@/components/Loading';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/src/app/i18n/client';
import Link from 'next/link';

const ThanksPage = () => {
    const { t } = useTranslation();

    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataMismatch, setDataMismatch] = useState(false);
    const [id, setId] = useState(null);
    const [status, setStatus] = useState(null);
    const [amount, setAmount] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const orderId = queryParams.get('id');
        const orderStatus = queryParams.get('status');
        const orderAmount = queryParams.get('amount');
        const orderMessage = queryParams.get('message');

        const fetchPayment = async () => {
            try {
                const response = await axios.get(`https://api.moyasar.com/v1/payments/${orderId}`, {
                    auth: {
                        username: "sk_test_dbBExQy4X9oY4vLykgdmR2iHZfV8CkGKH67ag6HZ",
                        password: ""
                    }
                });
                setPaymentData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching payment data:', error);
                setLoading(false);
            }
        };

        if (typeof window !== 'undefined') {
            fetchPayment();
        }

        // Set state variables
        setId(orderId);
        setStatus(orderStatus);
        setAmount(orderAmount);
        setMessage(orderMessage);
    }, []);

    useEffect(() => {
        if (paymentData) {
            console.log(paymentData.id !== id ||
                paymentData.status !== status ||
                parseFloat(paymentData.amount) !== parseFloat(amount)
            );
            // Check for data mismatch
            if (
                paymentData.id !== id ||
                paymentData.status !== status ||
                parseFloat(paymentData.amount) !== parseFloat(amount)
            ) {
                setDataMismatch(true);
            }
        }
    }, [paymentData, id, status, amount]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto py-10 text-center">
            <h1 className="text-3xl font-bold mb-6">{t('Thank You!')}</h1>
            {dataMismatch ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                    <p className="font-semibold">{t('Oops!')}</p>
                    <p>{t('Data mismatch detected. Please try again later or contact support for assistance.')}</p>
                </div>
            ) : (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4 text-start">
                    <p className="font-semibold text-center">{t('Order Details')}</p>
                    <div className="flex flex-col gap-4">
                        <div className='border-b border-mainColor pb-2'>
                            <p className="font-semibold">{t('Order ID')} :</p>
                            <p>{id}</p>
                        </div>
                        <div className='border-b border-mainColor pb-2'>
                            <p className="font-semibold">{t('Status')} :</p>
                            <p>{status}</p>
                        </div>
                        <div className='border-b border-mainColor pb-2'>
                            <p className="font-semibold">{t('Amount')} :</p>
                            <p>{amount}</p>
                        </div>
                        <div className='border-b border-mainColor pb-2'>
                            <p className="font-semibold">{t('Message')} :</p>
                            <p>{message}</p>
                        </div>
                    </div>
                </div>
            )}
            <p className='mb-4'>{t('We appreciate your business and hope to see you again soon. For any inquiries, please contact our customer support team.')}</p>
            <Link className='main-btn' href="/purchases">{t("Go To Your Purchases")}</Link>
        </div>
    );
};

export default ThanksPage;
