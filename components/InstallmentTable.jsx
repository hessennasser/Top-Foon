import React from 'react';
import { useTranslation } from 'react-i18next';

const InstallmentTable = ({ installmentDuration, calculateInstallmentAmountData }) => {
    const { t } = useTranslation();

    if (installmentDuration !== '0' && calculateInstallmentAmountData.installmentDetails) {
        // Initialize the start date
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 30); // Assuming each installment is 30 days apart

        let totalPaidAmount = 0; // Initialize total paid amount

        return (
            <table className="table table-hover table-border">
                <thead id="heading_table" style={{ backgroundColor: '#E9E023', textAlign: 'center' }}>
                    <tr>
                        <td>#</td>
                        <td>{t('paymentDate')}</td>
                        <td>{t('monthlyPayment')}</td>
                        <td>{t('totalPaid')}</td>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '13px', textAlign: 'center', lineheight: 'initial' }}>
                    {/* Table rows for installment payments */}
                    {Array.from({ length: parseInt(installmentDuration) }, (_, index) => {
                        // Calculate the date for each installment
                        const installmentDate = new Date(startDate);
                        installmentDate.setMonth(installmentDate.getMonth() + index);

                        const installmentAmount = calculateInstallmentAmountData.installmentDetails[index]?.amount || 0;
                        totalPaidAmount += installmentAmount; // Add current installment amount to total paid amount

                        return (
                            <tr key={index}>
                                <td>{t('the payment')} {index + 1}</td>
                                <td>{installmentDate.getFullYear()}/{installmentDate.getMonth() + 1}/{installmentDate.getDate()}</td>
                                <td>{installmentAmount}</td>
                                <td>{totalPaidAmount}</td> {/* Display cumulative total paid amount */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
    return null;
};

export default InstallmentTable;
