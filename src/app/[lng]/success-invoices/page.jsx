"use client"
import Loading from '@/components/Loading';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/src/app/i18n/client';
import Link from 'next/link';
import { apiUrl } from '@/apiUrl';

const ThanksPage = () => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    useEffect(() => {

        const fetchPayment = async () => {
            try {
                const response = await axios.get(`${apiUrl}/orders-async`);
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


    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto py-10 text-center">
            <h1 className="text-3xl font-bold mb-6">{t('Thank You!')}</h1>
            <p className='mb-4'>{t('We appreciate your business and hope to see you again soon. For any inquiries, please contact our customer support team.')}</p>
            <Link className='main-btn' href="/purchases">{t("Go To Your Purchases")}</Link>
        </div>
    );
};

export default ThanksPage;
