import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavTwo from "components/common/NavTwo";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { SearchIcon } from "../common/icons";
import SelectInput from "components/common/SelectInput";
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
            { label: "export", value: "export" },
            { label: "shipment", value: "shipment" },
        ],
    },
];

function TrackingLayout({ children }) {
    const { id, movementId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const { fetchedShipmentMovementsSuccess: movements } = useSelector((state) => state.tracking);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDataActions = async (data) => {
        const pathName = location.pathname.split("/");
        const newPath = pathName.filter((val, index) => index !== pathName.length - 1).join("/");

        if (!movementId && data.movements && data.movements.length > 1) {
            if (data.movements.length > 1) {
                dispatch(trackingActions.fetchShipmentMovements(data._id));

                while (!movements.length) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }

                if (movements[0]._id) navigate(newPath + "/" + data._id + "/" + movements[0]._id);
            }
        } else if (!data.movements || data.movements.length <= 1)
            navigate(newPath + "/" + data?._id);

        if (movementId) navigate(newPath + "/" + data._id);
    };

    const [filters, setFilters] = useState({
        status: "",
        shippingLine: "",
        transitTime: "",
        mode: "",
        serviceType: "",
        otherServices: "",
    });

    useEffect(() => {
        dispatch(trackingActions.fetchShipmentMovements(id));
    }, [dispatch, id]);

    return (
        <>
            <NavTwo />
            <div className={`mt-[140px] px-[104px] max-lg:my-4 max-lg:px-4`}>
                <div className="flex items-center justify-between w-full mb-6 max-sm:mb-8">
                    <p className="font-rocGroteskBold text-[22px] text-gun-metal ">Shipments</p>
                </div>
            </div>

            <div
                className={`pb-4 w-full h-full lg:flex max-lg:px-4 px-[104px] items-center ${
                    movementId ? "justify-end" : "justify-between"
                }  relative hidden`}
            >
                {!movementId && (
                    <div className="relative  min-w-[340px] border-[#DFE1E6] border-[1px] h-[fit-content] flex justify-center items-center px-4 pt-[4px] py-[3px] rounded ">
                        <SearchIcon fill={"#142837"} height="18" width="18" />
                        <input
                            type="text"
                            className="w-full py-[10px]  outline-none text-[14px] focus-ring-0 border-0 focus:border-0  font-rocGroteskMedium px-5"
                            placeholder="Search"
                            onChange={handleInputChange}
                        />
                    </div>
                )}

                <div className="flex w-full justify-between">
                    {!movementId &&
                        selectInputData.map(({ label, options, name }, index) => (
                            <div className="ml-[8px]" key={index}>
                                <SelectInput
                                    value={""}
                                    name={name}
                                    placeholder={label}
                                    isRequired={true}
                                    inputClassName="focus:ring-0 focus:border-transparent"
                                    className=" block w-full border outline-none border-solid border-gray-300 text-[14px] rounded text-inherit pt[12px] pb[10px]"
                                    dropdownOptions={options}
                                    handleChange={(data, value) => {
                                        setFilters((prev) => ({ ...prev, [data]: value }));
                                    }}
                                />
                            </div>
                        ))}
                </div>
            </div>

            <div className="flex h-full px-[104px]">
                <Sidebar
                    data={{
                        actions: handleDataActions,
                    }}
                    searchTerm={searchTerm}
                    filters={filters}
                    shipment={!movementId ? true : false}
                />

                <div className="h-[calc(100vh-250px)] w-[100%] border-[#DFE1E6] border-[1px] border-b-0 border-l-0 overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
}

export default TrackingLayout;
