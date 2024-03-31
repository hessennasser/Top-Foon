"use client"

import { useTranslation } from "@/src/app/i18n/client"
import Image from "next/image";

const CartISavedItems = ({ cart, calculateTotalPrice, calculateInstallmentAmountData, installmentDuration }) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="order-1 col-span-2 xl:col-span-1 h-full">
            <h2 className="text-xl font-bold mb-4 bg-primaryColor py-4 text-center text-white">{t('cartContent')}</h2>
            <div className='shadow-md p-4 rounded-lg'>
                <div className="grid grid-cols-1 gap-2 relative">
                    {cart.length > 0 && cart.map((item, index) => (
                        <div key={index} className="bg-white py-2 flex gap-4">
                            <Image width={100} height={100} className="border-l pl-2 w-[80px] object-contain" src={item.product.thumbnail.url} alt={item?.product.name[i18n.language]} />
                            <div className="flex flex-col flex-1 gap-2">
                                <h2 className="text-xl font-semibold">{item?.product.name[i18n.language]}</h2>
                                <p className="text-gray-600">{t('price')}: ${item.totalForItem}</p>
                                <p className="text-gray-600">{t('quantity')}: {item.quantity}</p>
                                <p className="text-gray-600">{t('color')}: {item.color}</p>
                                <p className="text-gray-600">{t('storage')}: {item.storage.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <p className="text-xl font-semibold flex items-center justify-between">{t('totalPurchase')}: <span>{calculateTotalPrice()}$</span></p>
                    <p className="text-xl font-semibold flex items-center justify-between">{t('installmentIncrease')}: <span>
                        {
                            calculateInstallmentAmountData.rateAmount
                        }
                    </span>
                    </p>
                    <p className="text-xl font-semibold flex items-center justify-between">{t('shippingCost')}: <span>$25</span></p>
                    <p className="pt-4 mt-4 border-t text-xl font-semibold flex items-center justify-between">
                        {t('totalAmountIncludingTax')}:
                        <span>{
                            installmentDuration == 0 ? calculateTotalPrice() : calculateInstallmentAmountData.totalPrice
                        }$ </span>
                    </p>
                    <div className="mb-4">
                        <p className="pt-4 mt-4 border-t text-xl font-semibold flex items-center justify-between">
                            {installmentDuration == 0 ? t('totalAmountInFull') : t('currentPayment')}
                            <span>
                                {
                                    installmentDuration == 0 ? calculateInstallmentAmountData.totalPrice :
                                        Math.ceil(calculateInstallmentAmountData?.installmentDetails[0]?.amount)
                                }$
                            </span>

                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartISavedItems