import _ from "lodash";
import { quoteActions } from "actions";
import SelectInput from "components/common/SelectInput";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LocationSearchInput from "components/common/AutocompleteInput";

const CreateToPartner = ({ searchShipment }) => {
    const { pendingShipments, isPendingShipmentsLoading } = useSelector((state) => state.shipment);
    const [loadType, setLoadType] = useState("");
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [incoterms, setIncoterms] = useState("");
    const [searchInitiated, setSearchInitiated] = useState(false);
    const [address, setAddress] = useState(null);
    const [shipments, setShipments] = useState(() => pendingShipments?.data);
    const dispatch = useDispatch();

    const notAirType = selectedShipment?.serviceMode !== "air";

    const requestQuoteFromPartner = (evt) => {
        evt.preventDefault();
        const reqData = {
            shipmentId: selectedShipment?._id,
            portOfLoading: address?.portOfLoading,
            portOfDestination: address?.portOfDestination,
            portOfSupply: address?.portOfSupply,
            incoterms,
        };
        dispatch(quoteActions.sendQuoteReqFF(notAirType ? { ...reqData, loadType } : reqData));
    };

    const handleSearchShipment = _.debounce((searchValue) => {
        setSearchInitiated(true);
        searchShipment(searchValue);
    }, 800);

    useEffect(() => {
        if (!isPendingShipmentsLoading && searchInitiated) {
            setSearchInitiated(false);

            setShipments((prev) => {
                const mergedShipments = [prev, pendingShipments?.data]
                    .flat()
                    .filter((ship) => ship);
                const uniqueShipments = Array.from(
                    new Set(mergedShipments.map((shipment) => shipment._id))
                ).map((id) => mergedShipments.find((shipment) => shipment._id === id));

                return uniqueShipments;
            });
        }
    }, [pendingShipments, searchInitiated, isPendingShipmentsLoading]);

    return (
        <form onSubmit={requestQuoteFromPartner} className="px-5 pt-1 h-[350px] overflow-y-auto">
            <SelectInput
                searchLoading={isPendingShipmentsLoading}
                name="shipmentId"
                placeholder={"Select or search shipment id"}
                handleChange={(_, value) => {
                    setSelectedShipment(null);
                    const shipmentFound = shipments?.find((ship) => ship._id === value);
                    if (value && shipmentFound) {
                        setSelectedShipment({
                            _id: shipmentFound._id,
                            serviceMode: shipmentFound.serviceMode,
                        });
                    }
                }}
                handleInputChange={(evt) => {
                    const value = evt.target.value?.replace(/\D\s/g, "");
                    const shipmentFound = shipments?.find(
                        (ship) => evt.target.value && ship.mvxid.includes(value)
                    );

                    if (shipmentFound && value) {
                        setSelectedShipment({
                            _id: shipmentFound._id,
                            serviceMode: shipmentFound.serviceMode,
                        });
                        return;
                    }

                    if (!shipmentFound && !isPendingShipmentsLoading && evt.target.value) {
                        // const regexPattern = /^[tT][aA]\s?\d+$/;

                        // if (regexPattern.test()) {
                        //     console.log("The string matches the pattern!");
                        // } else {
                        //     console.log("The string does not match the pattern.");
                        // }
                        handleSearchShipment(value);
                    }
                }}
                isRequired={true}
                dropdownOptions={shipments?.map((ship) => ({
                    label: "TA " + ship.mvxid,
                    value: ship._id,
                }))}
            />

            {/*  onInputChange={(value) => {
                            if (!expertsLoading) {
                                const _value = value.toLowerCase();
                                const selectedExpert = experts?.find(
                                    (expert) =>
                                        expert.firstName.toLowerCase().includes(_value) ||
                                        expert.lastName.toLowerCase().includes(_value)
                                );
                                _value && !selectedExpert && fetchExpert(_value);
                            }
                        }}
                        onChange={({ value }) => {
                            dispatch(
                                setCourseReqData({
                                    ...createCourseData,
                                    expert: experts?.find((expert) => expert.id === value),
                                })
                            );
                        }} */}
            <p className="text-sm mt-6 mb-1 font-rocGrotesk font-medium">Country of Supply</p>
            <LocationSearchInput
                setData={setAddress}
                placeholder="Enter shipment origin"
                name={"portOfSupply"}
            />

            <p className="text-sm mt-6 mb-1 font-rocGrotesk font-medium">Port of loading</p>
            <LocationSearchInput
                setData={setAddress}
                placeholder="Enter port of loading"
                name={"portOfLoading"}
            />

            <p className="text-sm mt-6 mb-1 font-rocGrotesk font-medium">Delivery Address</p>
            <LocationSearchInput
                setData={setAddress}
                placeholder="Enter shipment destination"
                name={"portOfDestination"}
            />

            {notAirType && (
                <>
                    <p className="text-sm mt-6 mb-1 font-rocGrotesk font-medium">Load Type</p>
                    <SelectInput
                        name="loadType"
                        placeholder={"Select load type"}
                        handleChange={(_, value) => setLoadType(value)}
                        isRequired={true}
                        dropdownOptions={[
                            {
                                label: "Full Container Load (FCL)",
                                value: "FCL",
                            },
                            {
                                label: "Low Container Load (LCL)",
                                value: "LCL",
                            },
                        ]}
                    />
                </>
            )}
            <div className="mb-8">
                <p className="text-sm mt-6 mb-1 font-rocGrotesk font-medium">Incoterms Type</p>
                <SelectInput
                    name="incoterms"
                    className={"mb-4"}
                    placeholder={"Select incoterms type"}
                    handleChange={(_, value) => setIncoterms(value)}
                    isRequired={true}
                    dropdownOptions={[
                        {
                            label: "FOB (Free on Board)",
                            value: "FOB",
                        },
                        {
                            label: "FCA (Free Carrier)",
                            value: "FCA",
                        },
                        {
                            label: "EXW (Ex Works)",
                            value: "EXW",
                        },
                        {
                            label: "FAS (Free Alongside Ship)",
                            value: "FAS",
                        },
                        {
                            label: "DAP (Delivered at Place)",
                            value: "DAP",
                        },
                        {
                            label: "DAT (Delivered at Terminal)",
                            value: "DAT",
                        },
                        {
                            label: "CIF (Cost, Insurance and Freight)",
                            value: "CIF",
                        },
                        {
                            label: "CIP (Carriage and Insurance Paid to)",
                            value: "CIP",
                        },
                        {
                            label: "CFR (Cost and Freight)",
                            value: "CFR",
                        },
                        {
                            label: "DDP (Delivery Duty Paid)",
                            value: "DDP",
                        },
                        {
                            label: "CPT (Carriage paid to)",
                            value: "CPT",
                        },
                    ]}
                />
            </div>
            <button className="hidden" id="partner-btn"></button>
        </form>
    );
};

export default CreateToPartner;
