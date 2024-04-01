"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from '@/src/app/i18n/client';
import Link from 'next/link';
import { mainRequest } from '@/axiosConfig';
import { apiUrl } from '@/apiUrl';
import Loading from '@/components/Loading';

const SuccessInvoicesPage = () => {
    const { t } = useTranslation();

    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataMismatch, setDataMismatch] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const invoice_id = queryParams.get('invoice_id');

        const fetchPayment = async () => {
            try {
                const response = await axios.get(`https://api.moyasar.com/v1/invoices/${invoice_id}`, {
                    auth: {
                        username: "sk_test_dbBExQy4X9oY4vLykgdmR2iHZfV8CkGKH67ag6HZ",
                        password: ""
                    }
                });
                setPaymentData(response.data);
                const check = await mainRequest.put(`${apiUrl}/orders/changeInvoiceState/${response.data.id}`);
                console.log(check);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching payment data:', error);
                setLoading(false);
            }
        };

        if (typeof window !== 'undefined') {
            fetchPayment();
        }
    }, []);

    useEffect(() => {
        if (paymentData) {
            const queryParams = new URLSearchParams(window.location.search);
            const invoice_id = queryParams.get('invoice_id');
            const status = queryParams.get('status');
            const message = queryParams.get('message');

            if (
                paymentData.payments[0]?.invoice_id !== invoice_id ||
                paymentData.status !== status
            ) {
                setDataMismatch(true);
            }
        }
    }, [paymentData]);

    if (loading) {
        return <Loading />;
    }

    const queryParams = new URLSearchParams(window.location.search);
    const invoice_id = queryParams.get('invoice_id');
    const status = queryParams.get('status');
    const message = queryParams.get('message');

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
                            <p className="font-semibold">{t('Invoice ID')} :</p>
                            <p>{invoice_id}</p>
                        </div>
                        <div className='border-b border-mainColor pb-2'>
                            <p className="font-semibold">{t('Status')} :</p>
                            <p>{status}</p>
                        </div>
                        <div className='border-b border-mainColor pb-2'>
                            <p className="font-semibold">{t('Amount')} :</p>
                            <p>{paymentData?.amount_format}</p>
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

export default SuccessInvoicesPage;
