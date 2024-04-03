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

    let queryParams = new URLSearchParams(window.location.search);
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataMismatch, setDataMismatch] = useState(false);
    const [id, setId] = useState(null);

    useEffect(() => {
        queryParams = new URLSearchParams(window.location.search);
        const invoice_id = queryParams.get('invoice_id');

        const fetchPayment = async () => {
            const token = DJuHJ / WVmZyG4luOr / vLWB / GdpmyPx51Q3cNeWVedeYF2CwBVuZmFGdlAnrE2Spl
            const baseURL = 'https://api-v2.ziina.com/api';
            const options = {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            };
            try {
                const response = await axios.get(baseURL + `/payment_intent/${invoice_id}`, { headers: options.headers });
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
        const invoice_id = queryParams.get('id');
        setId(invoice_id);
    }, [queryParams]);

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
                            <p className="font-semibold">{t('Invoice ID')} :</p>
                            <p>{invoice_id}</p>
                        </div>
                        <div className='border-b border-mainColor pb-2'>
                            <p className="font-semibold">{t('Status')} :</p>
                            <p>{paymentData?.status}</p>
                        </div>
                        <div className='border-b border-mainColor pb-2'>
                            <p className="font-semibold">{t('Amount')} :</p>
                            <p>{paymentData?.amount}</p>
                        </div>
                        <div className='border-b border-mainColor pb-2'>
                            <p className="font-semibold">{t('Message')} :</p>
                            <p>{paymentData?.message}</p>
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
