/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { apiUrl } from "@/apiUrl";
import Loading from "@/components/Loading";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { MdSystemSecurityUpdateGood } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { useTranslation } from "@/src/app/i18n/client";
import Image from "next/image";
import { MainContext } from "@/mainContext";

const Page = ({ params }) => {
    const { productId } = params;

    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const { addToCart } = useContext(MainContext);

    const [quantityInput, setQuantityInput] = useState(1);
    const [metaData, setMetaData] = useState({
        color: "",
        storage: ""
    });

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


    const handleInputChange = (value) => {
        if (value > 0) {
            setQuantityInput(value);
        }
    };

    const handleIncrement = () => {
        setQuantityInput((prev) => prev + 1);
    };

    const handleDecrement = () => {
        if (quantityInput > 1) {
            setQuantityInput((prev) => prev - 1);
        }
    };

    const handleColorChange = (e) => {
        // Update color in metaData
        const selectedColor = e.target.value;
        setMetaData({
            ...metaData,
            color: selectedColor
        });
    };

    const handleStorageChange = (storage) => {
        // Update storage in metaData
        setMetaData({
            ...metaData,
            storage: storage
        });
    };


    const handleAddToCart = () => {
        // Prepare cart item data
        const cartItem = {
            product: product, // Assuming product data is available
            quantity: quantityInput,
            metaData: metaData
        };

        // Call addToCart function from context to add the item to the cart
        addToCart(cartItem);
    };

    if (loading || !product) {
        return <Loading />
    }

    return (
        <div className="container py-10" key={productId}>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-4 mb-10 relative">
                <div className="img-holder h-full lg:sticky top-0 col-span-3 md:col-span-2 lg:col-span-1 flex justify-center border p-4 shadow-lg rounded-md max-h-[400px]">
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
                                    <Image height={100} width={100} className='w-full h-full max-h-[400px] object-contain' src={image.url} alt={product?.name[i18n.language]} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
                <div className="info-holder col-span-3 md:col-span-2 lg:col-span-1 h-full flex flex-col gap-4 border p-4 shadow-lg rounded-md">
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
                                <p key={index} className="text-gray-600">{storage.name} :
                                    ${parseInt(storage.price) + parseInt(product.discount)}</p>
                            ))
                        }
                    </div>
                </div>
                <div className="cart-holder col-span-3 md:col-span-4 lg:col-span-1 h-full flex flex-col gap-4 border p-4 shadow-lg rounded-md">
                    <div className="flex flex-col flex-1 gap-2">
                        <h2 className="text-xl font-semibold">{product?.name[t.language]}</h2>
                        <p className="text-gray-600">{t('price')}: ${product?.discount}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="w-full">{t('color')}: </p>
                            {
                                product.colors.map((color, index) => (
                                    <div key={index} className="mr-2 flex items-center gap-1 flex-wrap">
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name={`color`}
                                                value={color}
                                                onChange={(e) => handleColorChange(e)}
                                            />
                                            <span>{color}</span>
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                        <div>
                            <p className="mb-2">{t('storage')}: </p>
                            {
                                product.storages.map((storage, index) => (
                                    <div key={index} className="me-2 flex gap-1">
                                        <label className="flex gap-1">
                                            <input
                                                type="radio"
                                                name={`storage`}
                                                value={storage.name}
                                                onChange={(e) => handleStorageChange(storage)}
                                            />
                                            <span key={index} className="text-gray-600 md-2">{storage.name} :
                                                ${parseInt(storage.price) + parseInt(product.discount)}</span>
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex items-center">
                            <button onClick={() => handleDecrement()} className="w-10 h-full flex items-center justify-center bg-mainColor text-white">-</button>
                            <input
                                type="number"
                                value={quantityInput}
                                onChange={(e) => handleInputChange(parseInt(e.target.value))}
                                className="w-20 h-full border border-gray-300 focus:outline-none px-2 py-1 text-center"
                            />
                            <button onClick={() => handleIncrement()} className="w-10 h-full flex items-center justify-center bg-mainColor text-white">+</button>
                        </div>
                        <div className="flex-1 flex  justify-center items-end">
                            <button onClick={handleAddToCart} className="w-full main-btn">
                                {t("Add to Cart")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full border p-4 shadow-lg rounded-md">
                <div className="product-description flex flex-col gap-2" dangerouslySetInnerHTML={{ __html: product.description[i18n.language] }} />
            </div>
            <div className="w-full flex flex-wrap items-center justify-between gap-5 my-5">
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
