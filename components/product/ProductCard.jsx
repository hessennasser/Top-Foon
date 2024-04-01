"use client"
import Link from "next/link";
import { RiShoppingCart2Line } from "react-icons/ri";
import { useContext } from "react";
import { MainContext } from "@/mainContext";
import { useTranslation } from "@/src/app/i18n/client";
import Image from "next/image";

const ProductCard = ({ item }) => {
    const { t, i18n } = useTranslation();

    const { addToCart } = useContext(MainContext);

    const handleAddToCart = () => {
        const cartItem = {
            product: item
        }
        addToCart(cartItem);
    };

    return (
        <div className="product-card p-2">
            <Link href={`${i18n.language}/product/${item?._id}`}>
                <div className="image-holder relative">
                    <Image width={100} height={100} className="w-full h-56 md:h-[250px] object-contain md:object-cover" src={item.thumbnail?.url} alt={item?.name[i18n.language]} />
                </div>
                <div className="product-info mt-4">
                    <h2 className="product-title font-medium">{item?.name[i18n.language]}</h2>
                    <div className="prices my-2">
                        <span className="text-red-500 font-bold tracking-widest">${item?.discount}</span>
                        <span className="text-gray-600 line-through ml-2">${item?.price}</span>
                    </div>
                </div>
            </Link>
            <div className="buttons-holder mt-4 flex items-center justify-between gap-2">
                <button onClick={handleAddToCart} className="btn main-btn flex-1 flex items-center justify-center gap-2 text-lg md:!text-xs xl:!text-lg">
                    <span className="hidden sm:inline-flex">{t("AddToCart")}</span>
                    <RiShoppingCart2Line className="text-xl" />
                </button>
            </div>
        </div >
    )
}

export default ProductCard;
