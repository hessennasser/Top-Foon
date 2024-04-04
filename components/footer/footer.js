"use client"
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import { MainContext } from '@/mainContext';
import Image from 'next/image';
import React, { useContext } from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import PaymentImage from "../../public/payments.png";
import logo from "../../public/logo.png";

const Footer = () => {
    const { t, i18n } = useTranslation(); // Use useTranslation hook to get the t function
    const { settings } = useContext(MainContext);

    return (
        <footer dir='rtl' className='bg-primaryColor text-white w-full px-4 pt-16 pb-6 mx-auto sm:px-6 lg:px-8 lg:pt-24'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                <div className='flex flex-col gap-4'>
                    <Image src={settings?.logo?.url ? settings?.logo?.url : logo} alt={settings?.siteName} className='object-contain' width={150} height={50} />
                    {
                        i18n.language == "en" ?
                            `
                        TOP FOON
                        As the authorized exclusive agent of Apple and Samsung companies in the United Arab Emirates, it is an electronic store that provides its customers with exclusive features that you can only find here.
                        You can find the latest phones with exceptional performance and features available for you in our store. The store allows you to purchase your chosen phone with installment or cash price.
                        TOP FOON store offers continuous price discounts and promotions so that its prices are lower than market prices.
                        You can replace your phone with us if there is any problem, with a warranty when you purchase a new phone from us.

                        With TOP FOON, get a new phone with full guarantee and at a competitive price, earning your trust.
                        `
                            :
                            i18n.language == "ar" ?
                                `
                            الوكيل الحصري المعتمد من شركتي آبل وسامسونج في الإمارات، فهو المتجر الإلكتروني الذي يوفّر لعملائه ميزات حصرية لا تجدها إلا هنا. أفضل الهواتف ذات الأداء الخرافي والميزات الاستثنائية تجدها متاحةً لك في متجرنا. ويوفّر المتجر لك شراء هاتفك المُختار بالتقسيط وبسعر الكاش. يتيح متجر TOP FOON عروضًا وتخفيضات أسعار مستمرة بحيث تكون أسعاره أقل من أسعار السوق. تستطيع معنا استبدال هاتفك في حال فيه أي خلل، مع وجود ضمان عند شرائك لهاتف جديد لدينا. مع TOP FOON هاتف جديد بضمان تام، وبسعرٍ تنافسي نكسب به ثقتك.
                        `
                                :
                                `
                        TOP FOON
                        Apple ve Samsung şirketlerinin Birleşik Arap Emirlikleri'ndeki resmi yetkili distribütörü olarak, müşterilerine sadece burada bulabilecekleri özel özellikler sunan bir elektronik mağazadır.
                        Yeni nesil telefonların olağanüstü performansı ve özellikleri mağazamızda sizin için mevcuttur. Mağazamız size seçtiğiniz telefonu nakit fiyatına veya taksitle satın alma imkanı sunar.
                        TOP FOON mağazası sürekli olarak indirimler ve promosyonlar sunar, böylece fiyatları pazardaki fiyatlardan daha uygun olur.
                        Telefonunuzda herhangi bir sorun olması durumunda bizimle değiştirebilirsiniz ve yeni bir telefon satın alırken garanti sunuyoruz.

                        TOP FOON ile güvence altında yeni bir telefon alın ve rekabetçi bir fiyata güven kazanın.
                        `
                    }
                    <p>
                    </p>
                </div>
                <div className="flex flex-col justify-center lg:justify-start">
                    <div className="flex gap-2">
                        <a href={settings?.socialLinks?.filter(item => item?.platform == "Facebook")[0].url} target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={24} />
                        </a>
                        <a href={settings?.socialLinks?.filter(item => item?.platform == "Instagram")[0].url} target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={24} />
                        </a>
                    </div>
                    <Image src={PaymentImage} alt="Payment Methods" className='object-contain' width={150} height={50} />
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className='text-xl font-bold'>{t('contactUs')}</h2>
                    <p>{t('address')}:
                        {i18n.language == "ar" ? "الامارات العربيه المتحده - دبي - الجميره" : i18n.language == "en" ? "United Arab Emirates - Dubai - Jumeirah" : "Birleşik Arap Emirlikleri - Dubai - Jumeirah"}
                    </p>
                    <p>{t('email')}: {settings?.contactInfo?.email}</p>
                </div>
            </div>
            <div className="copyright mt-4 pt-4 text-center border-t border-black"> © {t('allRightsReserved')} {new Date().getFullYear()} </div>
        </footer>
    );
};

export default Footer;
