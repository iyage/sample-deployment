import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavTwo from "components/common/NavTwo";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { trackingActions } from "actions";
import { oceanCarriers } from "variables/oceanCarriers";

const oceanCarrierSelectionOptions = oceanCarriers.map((carrier) => ({
    label: carrier["Full Name"]?.toUpperCase() || carrier["Carrier Name"]?.toUpperCase(),
    value: carrier.SCAC,
}));

const selectInputData = [
    {
        label: "Status",
        name: "status",
        options: [
            { label: "pending", value: "pending" },
            { label: "live", value: "live" },
            { label: "active", value: "active" },
            { label: "in-transit", value: "in-transit" },
            { label: "pickup", value: "pickup" },
            { label: "quote-sent", value: "quote-sent" },
            { label: "delivered", value: "delivered" },
            { label: "quoteAccepted", value: "quoteAccepted" },
            { label: "quoteRejected", value: "quoteRejected" },
            { label: "cancelled", value: "cancelled" },
        ],
    },
    {
        label: "Shipping Line",
        name: "carrier",
        options: oceanCarrierSelectionOptions,
    },
    {
        label: "Transit time",
        options: [],
    },
    {
        label: "Mode",
        name: "mode",
        options: [
            { label: "air", value: "air" },
            { label: "ocean", value: "ocean" },
            { label: "land", value: "land" },
        ],
    },
    {
        label: "Service type",
        name: "serviceType",
        options: [
            { label: "import", value: "import" },
            { label: "export", value: "import" },
            { label: "shipment", value: "shipment" },
        ],
    },
    {
        label: "Other services",
        options: [],
    },
];

function ShipmentTracking({ children }) {
    const { id, movementId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(trackingActions.fetchShipmentMovements(id));
    }, []);

    return (
        <>
            <NavTwo />
            <div className={`mt-[144px] px-[104px] max-lg:my-4 max-lg:px-4`}>
                <div className="flex items-center justify-between w-full mb-6 max-sm:mb-8">
                    <p className="font-rocGroteskBold text-[22px] text-gun-metal ">Shipments</p>
                </div>
            </div>

            <div className="flex h-full px-[104px]">
                <div className="h-[calc(100vh-250px)] w-[100%] border-[#DFE1E6] overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
}

export default ShipmentTracking;
