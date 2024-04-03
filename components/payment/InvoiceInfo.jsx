"use client"
import { useTranslation } from "@/src/app/i18n/client"

const InvoiceInfo = (props) => {
    const { userName, setUserName, phone, setPhone, userEmail, setUserEmail,
        shippingAddress, setShippingAddress, city, setCity, country, setCountry,
        paymentMethodId, setPaymentMethodId, total, handleOrderSubmit, installmentDuration } = props;

    const { t } = useTranslation();

    return (
        <div className="order-2 col-span-2">
            <h2 className="text-xl font-bold mb-4 bg-primaryColor py-4 text-center text-white">{t('invoiceInfo')}</h2>
            <form className="shadow-md p-4 rounded-lg" onSubmit={handleOrderSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-1 opacity-75">{t('name')}:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        id="name"
                        className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block mb-1 opacity-75">{t('phone')}:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        id="phone"
                        className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 opacity-75">{t('email')}:</label>
                    <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        id="email"
                        className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="shippingAddress" className="block mb-1 opacity-75">{t('shippingAddress')}:</label>
                    <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        id="shippingAddress"
                        className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="city" className="block mb-1 opacity-75">{t('city')}:</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        id="city"
                        className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="country" className="block mb-1 opacity-75">{t('country')}:</label>
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        id="country"
                        className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="paymentMethod" className="block mb-1 opacity-75">{t('paymentMethod')}:</label>
                    <select
                        disabled
                        id="paymentMethod"
                        value={paymentMethodId}
                        onChange={(e) => setPaymentMethodId(e.target.value)}
                        className="text-sm focus:shadow-soft-primary-outline leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        required
                    >
                        <option value="creditcard" selected>{t('creditCard')}</option>
                    </select>
                </div>
                {/* {
                    installmentDuration != 0 && ( */}
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-semibold text-white uppercase bg-mainColor rounded-lg focus:outline-none focus:shadow-outline"
                >
                    {t('purchaseButton', { total })}
                </button>
                {/* )
                } */}
            </form>
        </div>
    )
}

export default InvoiceInfo
