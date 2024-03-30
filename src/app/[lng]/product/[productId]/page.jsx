"use client"
import { apiUrl } from "@/apiUrl";
import Loading from "@/components/Loading";
import axios from "axios";
import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { MdSystemSecurityUpdateGood } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { useTranslation } from "@/src/app/i18n/client";

const Page = ({ params }) => {
    const { t, i18n } = useTranslation();
    const { productId } = params;

    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/get-product/${productId}`);
            const productData = response.data.product;
            setProduct(productData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [productId]);

    if (loading || !product) {
        return <Loading />
    }

    return (
        <div className="container py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 relative">
                <div className="img-holder lg:sticky top-0 h-fit p-5 col-span-3 md:col-span-2 lg:col-span-1 flex justify-center border p-4 shadow-lg rounded-md max-h-[400px]">
                    {product?.images && product?.images.length > 0 && (
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={30}
                            loop={true}
                            pagination={{
                                clickable: true,
                            }}
                            navigation={true}
                            modules={[Pagination, Navigation]}
                            className="mySwiper"
                            style={{ direction: "ltr" }}
                        >
                            {product?.images.map((image) => (
                                <SwiperSlide key={image.id}>
                                    <img className='w-full h-full max-h-[400px] object-contain' src={image.url} alt={product?.name[i18n.language]} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
                <div className="info-holder flex flex-col gap-4 border p-4 shadow-lg rounded-md">
                    <h2 className="text-xl font-bold text-mainColor">{product?.name[i18n.language]}</h2>
                    <div className="Category my-2">
                        <strong>{t("Category")} : </strong>
                        <span className="text-primaryColor font-bold tracking-widest">{product?.category.name[i18n.language]}</span>
                    </div>
                    <div className="Stock my-2">
                        <strong>{t("Available on stock")} : </strong>
                        <span className="text-primaryColor font-bold tracking-widest">{product?.stock}</span>
                    </div>
                    <div className="prices my-2">
                        <strong>{t("Price")} : </strong>
                        <span className="text-red-500 font-bold tracking-widest">${product?.discount}</span>
                        <span className="text-gray-600 line-through ml-2">${product?.price}</span>
                    </div>
                    <div className="colors my-2">
                        <strong>{t("Colors")} : </strong>
                        {
                            product.colors.map((color, index) => (
                                <span key={index} className="text-gray-600 ml-2">{color}</span>
                            ))
                        }
                    </div>
                    <div className="Storages my-2">
                        <strong>{t("Storages")}</strong>
                        {
                            product.storages.map((storage, index) => (
                                <p key={index} className="text-gray-600">{storage.name} : ${storage.price}</p>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="col-span-3 w-full flex flex-wrap items-center justify-between gap-5 my-5">
                <div className="item flex flex-col gap-2 text-center text-lg justify-center items-center w-48 mx-auto">
                    <MdSystemSecurityUpdateGood className='text-3xl text-secondColor' />
                    <p className='font-bold'>{t("Receipt and delivery")}</p>
                </div>
                <div className="item flex flex-col gap-2 text-center text-lg justify-center items-center w-48 mx-auto">
                    <MdSystemSecurityUpdateGood className='text-3xl text-secondColor' />
                    <p className='font-bold'>{t("Secure payment")}</p>
                </div>
                <div className="item flex flex-col gap-2 text-center text-lg justify-center items-center w-48 mx-auto">
                    <FaShippingFast className='text-3xl text-secondColor' />
                    <p className='font-bold'>{t("Safe delivery")}</p>
                </div>
                <div className="item flex flex-col gap-2 text-center text-lg justify-center items-center w-48 mx-auto">
                    <FaShippingFast className='text-3xl text-secondColor' />
                    <p className='font-bold'>{t("Fast delivery")}</p>
                </div>
            </div>
        </div>
    )
}

export default Page;
