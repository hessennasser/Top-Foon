"use client"
import React from 'react';
import InstallmentTable from '../InstallmentTable';
import { useTranslation } from '@/src/app/i18n/client';

const InstallmentManagement = ({
    calculateInstallmentAmountData,
    installmentDuration,
    setInstallmentDuration,
    cart
}) => {
    const { t } = useTranslation(); // Hook for translation

    // Function to check if any item in the cart has a quantity greater than 1
    const hasMultipleQuantities = () => {
        return cart.some(item => item.quantity > 1);
    };

    return (
        <div className="flex flex-col mb-4">
            <h2 className="text-xl font-bold mb-4 bg-primaryColor py-4 text-center text-white">
                {t('installmentSystem')}
            </h2>
            {hasMultipleQuantities() && <p className='text-center my-2 text-2xl text-red-500'>
                {t('multipleQuantitiesError')}
            </p>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="mb-4">
                    <label htmlFor="installmentDuration" className="block mb-1 opacity-75">
                        {t('installmentDurationLabel')}:
                    </label>
                    <select
                        id="installmentDuration"
                        value={installmentDuration}
                        onChange={(e) => setInstallmentDuration(e.target.value)}
                        className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        required
                        disabled={hasMultipleQuantities()} // Disable if any item has quantity > 1
                    >
                        <option value="0">{t('fullAmount')}</option>
                        <option value="6">6 {t('months')}</option>
                        <option value="12">12 {t('months')}</option>
                        <option value="18">18 {t('months')}</option>
                    </select>
                </div>
                {
                    installmentDuration !== '0' && (
                        <div className="mb-4">
                            <span className="block mb-1 opacity-75">
                                {t('installmentIncrease')}:
                            </span>
                            <p
                                className="text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all"
                                required
                            >
                                {calculateInstallmentAmountData.rateAmount}
                            </p>
                        </div>
                    )
                }
                <div className="mb-4">
                    <span className="block mb-1 opacity-75">
                        {t('totalAmount')} {t('taxIncluded')}:
                    </span>
                    <p
                        className="text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all"
                        required
                    >
                        ${Math.ceil(calculateInstallmentAmountData.totalPrice)}
                    </p>
                </div>
                {
                    installmentDuration !== '0' && (
                        <div className="mb-4">
                            <span className="block mb-1 opacity-75">
                                {t('currentPayment')}
                            </span>
                            <p
                                className="text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all"
                                required
                            >
                                $ {Math.ceil(calculateInstallmentAmountData.installmentDetails[0]?.amount)}
                            </p>
                        </div>
                    )
                }
            </div>
            <InstallmentTable installmentDuration={installmentDuration} calculateInstallmentAmountData={calculateInstallmentAmountData} />
        </div>
    );
};

export default InstallmentManagement;