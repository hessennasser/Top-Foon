"use client"
import { useContext, useState, useEffect } from "react";
import { MainContext } from "@/mainContext";
import { MdDelete } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";
import Link from "next/link";
import Loading from "@/components/Loading";
import { FaRegSave } from "react-icons/fa";
import { useTranslation } from "../../i18n/client";
import Image from "next/image";

const Page = () => {
    const { cart, loadingCart, updateCartItemQuantity, removeFromCart, updateCartItemMetaData, calculateTotalPrice } = useContext(MainContext);
    const { t } = useTranslation();

    const [quantityInputs, setQuantityInputs] = useState({});
    const [metaData, setMetaData] = useState({});

    useEffect(() => {
        if (cart) {
            const initialMetaData = {};
            const initialQuantityInputs = {};
            cart.forEach(cartItem => {
                const productId = cartItem.product._id;
                const initialColor = cartItem.color ? cartItem.color : cartItem.product.colors[0]; // Select first color by default
                const initialStorage = cartItem.storage ? cartItem.storage : cartItem.product.storages[0]; // Select first storage name by default
                initialMetaData[productId] = {
                    color: initialColor,
                    storage: initialStorage
                };
                initialQuantityInputs[productId] = cartItem.quantity;
            });
            setMetaData(initialMetaData);
            setQuantityInputs(initialQuantityInputs);
        }
    }, [cart]);

    const handleInputChange = (productId, value) => {
        setQuantityInputs({ ...quantityInputs, [productId]: value });
    };

    const handleRemoveItem = (itemId) => {
        removeFromCart(itemId);
    };

    const handleItemChange = (productId) => {
        const quantity = quantityInputs[productId] || cart.find(item => item.product._id === productId)?.quantity;
        updateCartItemQuantity(productId, quantity);
    };

    const handleIncrement = (item) => {
        updateCartItemQuantity(item.product._id, item.quantity + 1);
    };

    const handleDecrement = (item) => {
        if (item.quantity > 1) {
            updateCartItemQuantity(item.product._id, item.quantity - 1);
        }
    };

    const handleColorChange = (productId, e) => {
        const selectedColor = e.target.value;
        setMetaData({
            ...metaData,
            [productId]: {
                ...metaData[productId],
                color: selectedColor
            }
        });
    };

    const handleStorageChange = (productId, storage) => {
        setMetaData({
            ...metaData,
            [productId]: {
                ...metaData[productId],
                storage: storage
            }
        });
    };

    const handleSaveOptions = (productId) => {
        const data = metaData[productId];
        updateCartItemMetaData(productId, data);
    };

    if (loadingCart) {
        return <Loading />
    }

    if (!loadingCart && !cart) {
        return <div className="container mx-auto my-8 text-start" >
            <h1 className="text-3xl font-bold mb-4">{t('cart page')}</h1>
            <p className="text-gray-600">{t('emptyCart')}</p>
        </div>
    }
    console.log(cart);
    return (
        <div className="container mx-auto my-8 text-start" >
            <h1 className="text-3xl font-bold mb-4">{t('cart page')}</h1>
            {(cart?.length === 0) ? (
                <p className="text-gray-600">{t('emptyCart')}</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                        <div className="col-span-1 md:col-span-2">
                            <h2 className="text-xl font-bold mb-4 bg-primaryColor py-4 text-center text-white">{t('purchaseList')}</h2>
                            {
                                cart?.map((cartItem) => {
                                    const { product: item } = cartItem;
                                    const productId = item._id;
                                    const itemMetaData = metaData[productId];

                                    return (
                                        <div key={productId} className="bg-white py-4 flex gap-4" dir="rtl">
                                            <Image height={100} width={100} className="border-l pl-2 w-[80px] object-contain" src={item?.thumbnail?.url} alt={item?.name[t.language]} />

                                            <div className="flex flex-col flex-1 gap-2">
                                                <h2 className="text-xl font-semibold">{item?.name[t.language]}</h2>
                                                <p className="text-gray-600">{t('price')}: ${item?.discount}</p>
                                                <div className="flex items-center gap-2">
                                                    <p>{t('color')}: </p>
                                                    {
                                                        item.colors.map((color, index) => (
                                                            <div key={index} className="mr-2 flex items-center gap-1">
                                                                <label className="flex items-center gap-1">
                                                                    <input
                                                                        checked={itemMetaData?.color === color}
                                                                        type="radio"
                                                                        name={`color-${productId}`}
                                                                        value={color}
                                                                        onChange={(e) => handleColorChange(productId, e)}
                                                                    />
                                                                    <span>{color}</span>
                                                                </label>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p>{t('storage')}: </p>
                                                    {
                                                        item.storages.map((storage, index) => (
                                                            <div key={index} className="mr-2 flex items-center gap-1">
                                                                <label className="flex items-center gap-1">
                                                                    <input
                                                                        checked={itemMetaData?.storage.name === storage.name}
                                                                        type="radio"
                                                                        name={`storage-${productId}`}
                                                                        value={storage.name}
                                                                        onChange={(e) => handleStorageChange(productId, storage)}
                                                                    />
                                                                    <span>{storage.name}</span>
                                                                </label>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <button onClick={() => handleSaveOptions(productId)} className="main-btn w-fit h-full !bg-mainColor flex items-center justify-center gap-2">
                                                    <FaRegSave /> {t('saveOptions')}
                                                </button>
                                                <div className="flex items-center">
                                                    <button onClick={() => handleDecrement(cartItem)} className="w-10 h-full flex items-center justify-center bg-mainColor text-white">-</button>
                                                    <input
                                                        type="number"
                                                        value={quantityInputs[productId] || cartItem.quantity}
                                                        onChange={(e) => handleInputChange(productId, parseInt(e.target.value))}
                                                        className="w-20 h-full border border-gray-300 focus:outline-none px-2 py-1 text-center"
                                                    />
                                                    <button onClick={() => handleIncrement(cartItem)} className="w-10 h-full flex items-center justify-center bg-mainColor text-white">+</button>

                                                    <button onClick={() => handleItemChange(productId)} className="main-btn h-full !bg-mainColor flex items-center justify-between gap-4 mr-2">
                                                        <FiRefreshCcw />
                                                    </button>
                                                    <button onClick={() => handleRemoveItem(item._id)} className="main-btn !bg-red-500 flex items-center justify-between gap-4 mr-2">
                                                        {t('remove')}<MdDelete />
                                                    </button>

                                                </div>
                                                <p className="text-gray-600 mt-2">{t('total')}: ${cartItem.totalForItem}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="col-span-1">
                            <h2 className="text-xl font-bold mb-4 bg-primaryColor py-4 text-center text-white">{t('summary')}</h2>
                            <p className="text-xl font-semibold flex items-center justify-between">{t('totalPurchase')}: <span>${calculateTotalPrice()}</span></p>
                            <p className="text-xl font-semibold flex items-center justify-between">{t('shippingCost')}: <span>$25</span></p>
                            <p className="pt-4 mt-4 border-t text-xl font-semibold flex items-center justify-between">
                                {t('totalAmount')} ({t('inclusiveTax')}): <span>${calculateTotalPrice() + 25}</span>
                            </p>
                            <Link href="/payment" className="mt-4 btn main-btn flex-1 flex items-center justify-center gap-2 text-lg md:!text-xs xl:!text-lg">
                                <span className="hidden sm:inline-flex">{t('payment')}</span>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Page;
