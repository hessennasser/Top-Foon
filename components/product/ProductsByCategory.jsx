"use client"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import ProductCard from './ProductCard';
import { useTranslation } from '@/src/app/i18n/client';



const ProductsByCategory = ({ categories }) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="w-full px-4 mx-auto sm:px-6 py-10 overflow-hidden">
            {
                categories?.map((item, index) => (
                    <section key={index} id={item?.name[i18n.language]}>
                        <h2 className='text-2xl text-center mb-10 font-bold w-fit mx-auto border-b-4 border-b-mainColor'>{item?.name[i18n.language]}</h2>
                        <Swiper
                            grabCursor={true}
                            // autoplay={{
                            //     delay: 2000,
                            //     disableOnInteraction: false,
                            // }}
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
                                item?.products?.map((item, index) => (
                                    <SwiperSlide key={index} className=''>
                                        <ProductCard item={item} />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </section>
                ))
            }
        </div>
    )
}

export default ProductsByCategory