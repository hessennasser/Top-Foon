"use client"
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MoyasarForm = ({ handleOrderSubmit, total }) => {
    const { t } = useTranslation();
    const [cardInfo, setCardInfo] = useState({
        "source[number]": '',
        "source[name]": '',
        "source[month]": '',
        "source[year]": '',
        "source[cvc]": '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardInfo({ ...cardInfo, [name]: value });
        validateInput(name, value);
    };

    const validateInput = (name, value) => {
        let error = '';
        switch (name) {
            case 'source[number]':
                if (!(/^\d{16}$/.test(value))) {
                    error = t('cardNumberValidation');
                }
                break;
            case 'source[name]':
                if (value.trim() === '') {
                    error = t('cardholderNameValidation');
                }
                break;
            case 'source[month]':
                if (!(/^\d{2}$/.test(value)) || parseInt(value) > 12 || parseInt(value) < 1) {
                    error = t('expirationMonthValidation');
                }
                break;
            case 'source[year]':
                if (!(/^\d{2}$/.test(value)) || parseInt(value) < 21) {
                    error = t('expirationYearValidation');
                }
                break;
            case 'source[cvc]':
                if (!(/^\d{3,4}$/.test(value))) {
                    error = t('cvcValidation');
                }
                break;
            default:
                break;
        }
        setErrors({ ...errors, [name]: error });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formIsValid = Object.values(errors).every(error => error === '');
        if (formIsValid) {
            handleOrderSubmit(cardInfo);
        }
    };

    return (
        <div className="order-3 col-span-2 md:col-span-1">
            <h2 className="text-xl font-bold mb-4 bg-primaryColor py-4 text-center text-white">{t('paymentData')}</h2>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto shadow-md p-4 rounded-lg">
                <div className="mb-4">
                    <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">{t('cardholderName')}:</label>
                    <input
                        type="text"
                        name="source[name]"
                        id="cardholderName"
                        value={cardInfo["source[name]"]}
                        onChange={handleInputChange}
                        placeholder={t('cardholderNamePlaceholder')}
                        className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${errors["source[name]"] && 'border-red-500'}`}
                    />
                    {/* Display errors */}
                    {errors["source[name]"] && <div className="text-red-500 text-sm mt-1">{errors["source[name]"]}</div>}
                </div>
                <div className="mb-4">
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700">{t('cardNumber')}:</label>
                    <input
                        type="text"
                        name="source[number]"
                        id="number"
                        value={cardInfo["source[number]"]}
                        onChange={handleInputChange}
                        placeholder={t('cardNumberPlaceholder')}
                        className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${errors["source[number]"] && 'border-red-500'}`}
                    />
                    {/* Display errors */}
                    {errors["source[number]"] && <div className="text-red-500 text-sm mt-1">{errors["source[number]"]}</div>}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="">
                        <label htmlFor="expirationMonth" className="block text-sm font-medium text-gray-700">{t('expirationMonth')}:</label>
                        <input
                            type="text"
                            name="source[month]"
                            id="expirationMonth"
                            value={cardInfo["source[month]"]}
                            onChange={handleInputChange}
                            placeholder="MM"
                            className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${errors["source[month]"] && 'border-red-500'}`}
                        />
                        {/* Display errors */}
                        {errors["source[month]"] && <div className="text-red-500 text-sm mt-1">{errors["source[month]"]}</div>}
                    </div>
                    <div className="">
                        <label htmlFor="expirationYear" className="block text-sm font-medium text-gray-700">{t('expirationYear')}:</label>
                        <input
                            type="text"
                            name="source[year]"
                            id="expirationYear"
                            value={cardInfo["source[year]"]}
                            onChange={handleInputChange}
                            placeholder="YY"
                            className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${errors["source[year]"] && 'border-red-500'}`}
                        />
                        {/* Display errors */}
                        {errors["source[year]"] && <div className="text-red-500 text-sm mt-1">{errors["source[year]"]}</div>}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">{t('cvc')}:</label>
                    <input
                        type="text"
                        name="source[cvc]"
                        id="cvc"
                        value={cardInfo["source[cvc]"]}
                        onChange={handleInputChange}
                        placeholder={t('cvcPlaceholder')}
                        className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${errors["source[cvc]"] && 'border-red-500'}`}
                    />
                    {/* Display errors */}
                    {errors["source[cvc]"] && <div className="text-red-500 text-sm mt-1">{errors["source[cvc]"]}</div>}
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-semibold text-white uppercase bg-mainColor rounded-lg focus:outline-none focus:shadow-outline"
                >
                    {t('purchaseButton', { total })}
                </button>
            </form>
        </div>
    );
};

export default MoyasarForm;