import React from "react";
import { getCurrencyFromCurrencyCode } from "helpers/getCurrency";

const ReceiptComponent = ({
    receiptNo,
    dateOfIssue,
    email,
    creatorName,
    recipientName,
    pickupAddress,
    destinationAddress,
    amount,
    currency,
    shipmentId,
    logo,
}) => {
    return (
        <div className="w-4/5 max-sm:w-full max-lg:w-[90%] relative bg-white max-xl:shadow-none shadow-[0px_33.5596px_40.2716px_-6.71193px_rgba(16,24,40,0.08),0px_13.4239px_13.4239px_-6.71193px_rgba(16,24,40,0.03)]">
            <div className="px-16 max-sm:px-4 pt-12 max-lg:px-8 pb-[35px] bg-[#FAFBFC] flex justify-between">
                <div className="text-mvx-black">
                    <p className="mb-4 text-4xl font-rocGroteskBold">Receipt</p>
                    <div className="font-rocGroteskMedium text-base max-lg:text-sm">
                        <p>Receipt number: {receiptNo}</p>
                        <p>Date of issue: {dateOfIssue}</p>
                        <p>{email}</p>
                    </div>
                </div>
                <div>
                    <img src={logo} width={83} alt="logo" />
                </div>
            </div>
            <div className="px-16 max-sm:px-4 max-lg:px-8 pt-12 max-lg:px-8 flex">
                <div className="text-mvx-black w-1/2">
                    <p className="font-rocGroteskBold text-base max-lg:text-sm">Bill-From</p>
                    <div className="text-base max-lg:text-sm w-3/5 font-rocGroteskMedium">
                        <p>{creatorName}</p>
                        <p>{pickupAddress}</p>
                    </div>
                </div>
                <div className="text-mvx-black w-1/2">
                    <p className="font-rocGroteskBold text-base max-lg:text-sm">Bill-To</p>
                    <div className="text-base max-lg:text-sm w-3/5 font-rocGroteskMedium">
                        <p>{recipientName}</p>
                        <p>{destinationAddress}</p>
                    </div>
                </div>
            </div>
            <div className="px-16 max-sm:px-4 max-lg:px-8 my-[58px]">
                <p className="text-2xl font-rocGroteskBold">
                    Amount Paid ({currency}): {getCurrencyFromCurrencyCode(currency)}
                    {amount}
                </p>
            </div>
            <table className="mb-2.5 text-sm w-full">
                <thead className="bg-mvx-light-blue font-rocGroteskMedium text-mvx-neutral">
                    <tr>
                        <th>
                            <p className="flex uppercase py-2 pl-16 max-lg:pl-8 max-sm:pl-4">
                                dESCRIPTION
                            </p>
                        </th>
                        <th className="">
                            <p className="flex py-2 mr-8"></p>
                        </th>
                        <th className="">
                            <p className="flex py-2"></p>
                        </th>
                        <th className="">
                            <p className=" pr-16 max-lg:pr-8 max-sm:pr-4 uppercase flex justify-end py-2">
                                AMOUNT
                            </p>
                        </th>
                    </tr>
                </thead>
                <tbody className="">
                    <tr>
                        <td className="pl-16 max-lg:pl-8 max-sm:pl-4 py-4 text-base max-lg:text-sm font-rocGroteskMedium">
                            Shipment ID: {shipmentId}
                        </td>
                        <td className="font-rocGroteskMedium mr-8"></td>
                        <td className="font-rocGroteskMedium"></td>
                        <td className="font-rocGroteskMedium text-base max-lg:text-sm text-right max-sm:pr-4 max-lg:pr-8 pr-16">
                            {getCurrencyFromCurrencyCode(currency)}
                            {amount}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="text-mvx-black px-16 max-lg:px-8 max-sm:px-4 mt-24">
                <p className="font-rocGroteskMedium text-base max-lg:text-sm mb-2">Note</p>
                <p className="font-rocGroteskMedium">Thanks for your business!</p>
                <p className="font-rocGroteskMedium">
                    If you have any questions, contact us at {email}
                </p>
            </div>
            <div className="px-16 max-lg:px-8 max-sm:px-4 py-[34px] mt-24 max-lg:text-sm max-sm:text-xs text-base text-mvx-black font-rocGroteskMedium border-t flex justify-between items-center">
                <p>
                    Receipt number: {receiptNo} for {getCurrencyFromCurrencyCode(currency)}
                    {amount} • {dateOfIssue}
                </p>
                <p className="max-sm:hidden">Page 1 of 1</p>
            </div>
        </div>
    );
};

export default ReceiptComponent;
