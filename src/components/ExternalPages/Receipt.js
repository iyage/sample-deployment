import { paymentActions } from "actions";
import Loader from "components/common/Loader";
import NavOne from "components/common/NavOne";
import { formatMoney } from "helpers/formatMoney";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReceiptComponent from "./common/ReceiptComponent";

const Receipt = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { fetchingPaymentData, paymentData } = useSelector((state) => state.payment);

    useEffect(() => {
        dispatch(paymentActions.fetchPaymentData(id));
    }, [id, dispatch]);

    if (fetchingPaymentData || !paymentData) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <NavOne />
            <div className="flex flex-col gap-[40px] items-center justify-center py-12 bg-mvx-light-blue min-h-[calc(100vh-65px)]">
                <ReceiptComponent
                    receiptNo={paymentData?.data?.mvxid}
                    dateOfIssue={moment().format("MMM DD, YYYY")}
                    email={paymentData?.data?.freightForwarder?.profile?.email}
                    creatorName={paymentData?.data?.freightForwarder?.profile?.businessName}
                    recipientName={paymentData?.data?.shipment?.shipperDetails?.fullName}
                    pickupAddress={paymentData?.data?.shipment?.origin?.address}
                    destinationAddress={paymentData?.data?.shipment?.destination?.address}
                    amount={formatMoney().format(paymentData?.data?.amount?.value?.toFixed(2))}
                    currency={paymentData?.data?.amount?.currency}
                    shipmentId={"TA" + paymentData?.data?.shipment?.mvxid}
                    logo={paymentData?.data?.freightForwarder?.profile?.logo}
                />
                <p className="font-rocGroteskMedium text-mvx-neutral">
                    Powered by <span className="font-rocGroteskBold">Fleet+</span>
                </p>
            </div>
        </div>
    );
};

export default Receipt;
