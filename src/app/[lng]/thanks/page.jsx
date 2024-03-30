"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ThanksPage = () => {
    // Extract query parameters from window.location.search
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');
    const status = queryParams.get('status');
    const amount = queryParams.get('amount');
    const message = queryParams.get('message');

    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataMismatch, setDataMismatch] = useState(false);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await axios.get(`https://api.moyasar.com/v1/payments/${id}`, {
                    auth: {
                        username: "sk_test_dbBExQy4X9oY4vLykgdmR2iHZfV8CkGKH67ag6HZ",
                        password: ""
                    }
                });
                setPaymentData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching payment data:', error);
                setLoading(false);
            }
        };

        fetchPayment();
    }, [id]);

    // Check if the fetched payment data matches the data from the URL parameters
    useEffect(() => {
        if (paymentData) {
            if (
                paymentData.id !== id ||
                paymentData.status !== status ||
                parseFloat(paymentData.amount) !== parseFloat(amount)
            ) {
                setDataMismatch(true);
            }
        }
    }, [paymentData, id, status, amount, message]);

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
                    <p>Order ID: {id}</p>
                    <p>Status: {status}</p>
                    <p>Amount: {amount}</p>
                    <p>Message: {message}</p>
                    {/* Render other details from paymentData if needed */}
                </>
            )}
        </div>
    );
};

export default ThanksPage;
