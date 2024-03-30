"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { useTranslation } from '@/src/app/i18n/client';

const SlideCategory = ({ categories }) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="w-full px-4 mx-auto sm:px-6 py-10 overflow-hidden">
            <h2 className='text-2xl text-center mb-10 font-bold w-fit mx-auto border-b-4 border-b-mainColor'>{t("Our Category")}</h2>
            <Swiper
                grabCursor={true}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 5,
                    },
                }}
                modules={[Autoplay, Pagination]}
                className="!pb-10"
            >
                {
                    categories?.map((item, index) => (
                        <SwiperSlide key={index} className=''>
                            <div className="flex flex-col gap-4 items-center">
                                <img className='w-full h-40 object-contain' src={item?.image?.url} />
                                <div className="flex flex-col gap-2 w-full text-center">
                                    <a href={`/#${item?.name[i18n.language]}`} className='main-btn w-full'>
                                        {item?.name[i18n.language]}
                                    </a>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}

export default SlideCategory;
