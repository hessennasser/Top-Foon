"use client"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
// import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';
import Link from 'next/link';
import { useTranslation } from '@/src/app/i18n/client';
import Image from 'next/image';

const HeroSlider = ({ slides }) => {
    const { i18n } = useTranslation()
        ;
    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return `<span class="${className} pagination-bullet">
                <span class="number">0${index + 1}</span>
            </span>`;
        },
    };


    return (
        <Swiper
            spaceBetween={30}
            pagination={pagination}
            loop
            modules={[Pagination]}
            className="swiper swiper-initialized swiper-horizontal with-number-pagination relative min-h-[calc(100vh - 5rem)] h-full max-h-screen w-full pb-8 lg:pb-0 swiper-backface-hidden"
        >
            {
                slides.map((item) => {
                    return (
                        <SwiperSlide key={item?._id}>
                            <div
                                className={`hero-slide h-full relative overflow-hidden flex flex-col-reverse md:flex-row items-center justify-between md:gap-5 px-8`}
                                style={{
                                    backgroundColor: item?.colors?.background,
                                    color: item?.colors?.text
                                }}
                            >
                                <div className="py-5 md:pl-0 md:p-14">
                                    <div className="data-holder flex flex-col items-center md:items-start justify-center gap-2 md:gap-4 mb-8">
                                        <h2 className="text-2xl  text-center md:text-start md:text-4xl font-bold md:!leading-14">
                                            {item?.title[i18n.language]}
                                        </h2>
                                        <p className="relative mt-2 text-center md:text-start text-base lg:text-lg leading-8">
                                            {item?.description[i18n.language]}
                                        </p>
                                        <Link href={item?.link?.linkUrl} className="link link-arrowed flex gap-4 items-center justify-center">
                                            {item?.link?.text[i18n.language]}
                                            <svg className="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 32 32">
                                                <g fill="none" stroke={item?.colors?.text} strokeWidth="1.5" strokeLinejoin="round" strokeMiterlimit="10">
                                                    <circle className="arrow-icon-circle" cx="16" cy="16" r="15.12"></circle>
                                                    <path className="arrow-icon-arrow" d="M16.14 9.93L22.21 16l-6.07 6.07M8.23 16h13.98"></path>
                                                </g>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <Image
                                        width={100}
                                        height={100}
                                        className="max-h-[220px] md:max-h-[500px] w-full overflow-hidden object-cover"
                                        src={item?.image?.url}
                                        alt={item?.title[i18n.language]}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    )
                })
            }
        </Swiper>
    )
}

export default HeroSlider