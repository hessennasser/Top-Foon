"use client"
import { apiUrl } from '@/apiUrl';
import { mainRequest } from '@/axiosConfig';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ThanksPage = () => {
    // Extract query parameters from window.location.search
    const queryParams = new URLSearchParams(window.location.search);
    const invoice_id = queryParams.get('invoice_id');
    const status = queryParams.get('status');
    const message = queryParams.get('message');

    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataMismatch, setDataMismatch] = useState(false);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await axios.get(`https://api.moyasar.com/v1/invoices/${invoice_id}`, {
                    auth: {
                        username: "sk_test_dbBExQy4X9oY4vLykgdmR2iHZfV8CkGKH67ag6HZ",
                        password: ""
                    }
                });
                setPaymentData(response.data);
                const check = await mainRequest.put(`${apiUrl}/orders/changeInvoiceState/${response.data.id}`);
                console.log(check);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching payment data:', error);
                setLoading(false);
            }
        };

        fetchPayment();
    }, [invoice_id]);

    // Check if the fetched payment data matches the data from the URL parameters
    useEffect(() => {
        if (paymentData) {
            console.log(paymentData.payments[0]?.invoice_id);
            console.log(invoice_id);
            if (
                paymentData.payments[0]?.invoice_id !== invoice_id ||
                paymentData.status !== status
            ) {
                setDataMismatch(true);
            }
        }
    }, [paymentData, invoice_id, status, message]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Thank You!</h1>
            {dataMismatch ? (
                <p>Data mismatch detected!</p>
            ) : (
                <>
                    <p>invoice ID: {invoice_id}</p>
                    <p>Status: {status}</p>
                    <p>Amount: {paymentData?.amount_format}</p>
                    <p>Message: {message}</p>
                </>
            )}
        </div>
    );
};

export default ThanksPage;
