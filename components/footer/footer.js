"use client"
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import { MainContext } from '@/mainContext';
import Image from 'next/image';
import React, { useContext } from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    const { t } = useTranslation(); // Use useTranslation hook to get the t function
    const { settings } = useContext(MainContext);

    return (
        <footer dir='rtl' className='bg-primaryColor text-white w-full px-4 pt-16 pb-6 mx-auto sm:px-6 lg:px-8 lg:pt-24'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                <div className='flex flex-col gap-4'>
                    <Image src={settings?.logo?.url} alt={settings?.siteName} className='object-contain' width={150} height={50} />
                    <p>
                        {settings?.description}
                    </p>
                </div>
                <div className="flex flex-col justify-center lg:justify-start">
                    <div className="flex gap-2">
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
                    <Image src="/payments.png" alt="Payment Methods" className='object-contain' width={150} height={50} />
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className='text-xl font-bold'>{t('contactUs')}</h2>
                    <p>{t('address')}: {settings?.contactInfo?.address}</p>
                    <p>{t('phone')}: {settings?.contactInfo?.phone}</p>
                    <p>{t('email')}: {settings?.contactInfo?.email}</p>
                </div>
            </div>
            <div className="copyright mt-4 pt-4 text-center border-t border-black"> © {t('allRightsReserved')} {new Date().getFullYear()} </div>
        </footer>
    );
};

export default Footer;
