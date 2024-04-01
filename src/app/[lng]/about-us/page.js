"use client"
import Image from 'next/image';
import React, { useContext } from 'react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import PaymentImage from "../../../../public/payments.png"
import { useTranslation } from '../../i18n/client';
import { MainContext } from '@/mainContext';

const Page = () => {
    const { t } = useTranslation(); // Initialize useTranslation hook

    const { settings } = useContext(MainContext);

    return (
        <div dir='rtl' className='container flex flex-col items-center justify-center gap-4 mx-auto py-8'>
            <Image src={settings?.logo?.url} alt={settings?.siteName} className='object-contain' width={150} height={50} />
            <h2>{settings?.siteName}</h2>
            <p className='max-w-md'>{settings?.description}</p>
            <div className="flex flex-col items-center justify-center gap-4">
                <h2 className='text-xl font-bold'>{t('Contact Us')}</h2>
                <p>{t('Address')}: {settings?.contactInfo?.address}</p>
                <p>{t('Phone')}: {settings?.contactInfo?.phone}</p>
                <p>{t('Email')}: {settings?.contactInfo?.email}</p>
            </div>
            <div className="flex flex-col justify-center">
                <div className="flex gap-2 justify-center ">
                    <a href={settings?.socialLinks?.filter(item => item?.platform == "Facebook")[0].url} target="_blank" rel="noopener noreferrer">
                        <FaFacebook size={24} />
                    </a>
                    <a href={settings?.socialLinks?.filter(item => item?.platform == "WhatsApp")[0].url} target="_blank" rel="noopener noreferrer">
                        <FaWhatsapp size={24} />
                    </a>
                    <a href={settings?.socialLinks?.filter(item => item?.platform == "Instagram")[0].url} target="_blank" rel="noopener noreferrer">
                        <FaInstagram size={24} />
                    </a>
                </div>
                <Image src={PaymentImage} alt={t('Payment Methods')} className='object-contain' width={150} height={50} />
            </div>
        </div>
    )
}

export default Page;
