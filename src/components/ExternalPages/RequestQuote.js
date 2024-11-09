import Dropdown from "components/common/Dropdown";
import SelectInput from "components/common/SelectInput";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import LocationSearchInput from "components/common/AutocompleteInput";
import countries from "variables/countries";
import NavOne from "components/common/NavOne";
import { useDispatch, useSelector } from "react-redux";
import { quoteActions } from "actions";
import Loader from "components/common/Loader";
import ReactCountryFlag from "react-country-flag";
import { incoterms } from "variables/incoterms";

const RequestQuote = () => {
    const [value, setValue] = useState("");
    // const [serviceValue, setServiceValue] = useState("");
    const [isContainer, setIsContainer] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [address, setAddress] = useState({});
    const { ffid } = useParams();
    const dispatch = useDispatch();
    const { isSubmittedSuccessfully, isSubmitting } = useSelector((state) => state.quote);
    const initialCustomoInputData = useMemo(
        () => ({
            serviceType: "",
            freightMode: "",
            typeOfOrigin: "",
            typeOfDestination: "",
            pickupCountry: "",
            destinationType: "",
            destinationCountry: "",
            currency: "",
            pickupAddress: "",
            destinationAddress: "",
            areGoodsReady: "",
            phoneExt: "+1",
            loadType: "",
            incoterms: "",
            nonContainerData: [
                {
                    packageType: "",
                    palletType: "",
                    dimensionUnit: "cm",
                    containerUnitNo: "1",
                    length: "",
                    width: "",
                    height: "",
                    weight: "",
                    weightUnit: "kg",
                },
            ],
            containerData: [
                {
                    containerType: "",
                    unit: "ft",
                    quantity: "1",
                },
            ],
        }),
        []
    );
    const [customInputData, setCustomInputData] = useState({
        ...initialCustomoInputData,
    });
    const [activeContainerAccordionId, setActiveContainerAccordionId] = useState(0);
    const [activeNonContainerAccordionId, setActiveNonContainerAccordionId] = useState(0);
    const { register, handleSubmit, reset } = useForm();

    const handleSelectInputChange = (name, value) => {
        setCustomInputData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const addNonContainerAccordion = () => {
        setCustomInputData((prev) => {
            return {
                ...prev,
                nonContainerData: [
                    ...prev.nonContainerData,
                    {
                        packageType: "",
                        palletType: "",
                        dimensionUnit: "cm",
                        containerUnitNo: "1",
                        length: "",
                        width: "",
                        height: "",
                        weight: "",
                        weightUnit: "kg",
                    },
                ],
            };
        });
    };

    const addContainerAccordion = () => {
        setCustomInputData((prev) => {
            return {
                ...prev,
                containerData: [
                    ...prev.containerData,
                    {
                        containerType: "",
                        unit: "ft",
                        quantity: "1",
                    },
                ],
            };
        });
    };

    const removeNonContainerAccordion = (index) => {
        setCustomInputData((prev) => {
            const item = [...prev.nonContainerData];
            item.splice(index, 1);
            return {
                ...prev,
                nonContainerData: item,
            };
        });
    };

    const removeContainerAccordion = (index) => {
        setCustomInputData((prev) => {
            const item = [...prev.containerData];
            item.splice(index, 1);
            return {
                ...prev,
                containerData: item,
            };
        });
    };

    const handleNonContainerItemChange = (event, index, name, value) => {
        setCustomInputData((prev) => {
            const container = [...prev.nonContainerData];
            container[index] = {
                ...prev.nonContainerData[index],
                [name && value ? name : event.target.name]:
                    name && value ? value : event.target.value,
            };
            return {
                ...prev,
                nonContainerData: container,
            };
        });
    };

    const handleContainerItemChange = (event, index, name, value) => {
        setCustomInputData((prev) => {
            const nonContainer = [...prev.containerData];
            nonContainer[index] = {
                ...prev.containerData[index],
                [name && value ? name : event.target.name]:
                    name && value ? value : event.target.value,
            };
            return {
                ...prev,
                containerData: nonContainer,
            };
        });
    };

    const onSubmit = async (data) => {
        const body = {
            channel: "web",
            origin: {
                lat: address?.pickupAddress?.lat,
                lng: address?.pickupAddress?.lng,
                address: address?.pickupAddress?.address,
                details: [address?.pickupAddress?.address],
                country: customInputData.pickupCountry,
                // addressType: customInputData.typeOfOrigin,
            },
            packageType: isContainer ? "containers" : "non-containers",
            destination: {
                lat: address?.destinationAddress?.lat,
                lng: address?.destinationAddress?.lng,
                address: address?.destinationAddress?.address,
                details: [address?.destinationAddress?.address],
                // country: customInputData.destinationCountry,
                // addressType: customInputData.typeOfDestination,
            },
            portOfLoading: {
                lat: address?.portOfLoading?.lat,
                lng: address?.portOfLoading?.lng,
                address: address?.portOfLoading?.address,
                details: [address?.portOfLoading?.address],
            },
            loadType:
                customInputData?.freightMode === "air"
                    ? "Low Container Load (LCL)"
                    : customInputData.loadType,
            incoterms: customInputData.incoterms,

            goodsDetails: {
                value: {
                    currency: customInputData.currency,
                    amount: Number(data.amount),
                },
                description: data.description,
                goodsStatus: customInputData.areGoodsReady,
            },
            shipperDetails: {
                email: data.email,
                phoneNumber: data.phoneNo,
                phoneNumberExtention: customInputData.phoneExt,
                fullName: data.firstname + " " + data.lastname,
            },
            freightForwarderId: ffid,
            serviceMode: customInputData.freightMode,
            serviceType: customInputData.serviceType,
            [isContainer ? "containers" : "packages"]: isContainer
                ? customInputData?.containerData
                : customInputData?.nonContainerData?.map((data) => {
                      return {
                          packageType: data?.packageType,
                          palletType: data?.palletType,
                          length: {
                              unit: data?.dimensionUnit,
                              value: Number(data?.length),
                          },
                          width: {
                              unit: data?.dimensionUnit,
                              value: Number(data?.width),
                          },
                          height: {
                              unit: data?.dimensionUnit,
                              value: Number(data?.height),
                          },
                          weight: {
                              unit: data?.weightUnit,
                              value: Number(data?.weight),
                          },
                          units: Number(data?.containerUnitNo),
                      };
                  }),
        };

        dispatch(quoteActions.requestQuote(body));
    };

    useEffect(() => {
        if (customInputData?.freightMode === "air") {
            setIsContainer(false);
        }
    }, [customInputData?.freightMode]);

    useEffect(() => {
        if (isSubmittedSuccessfully) {
            reset();
            setCustomInputData(initialCustomoInputData);
            setAddress({});
            setValue("");
        }
    }, [isSubmittedSuccessfully, initialCustomoInputData, reset]);

    return (
        <div className="bg-mvx-light-blue overflow-auto">
            <NavOne />
            <div className="bg-mvx-light-blue w-full h-full flex justify-center">
                <div className="w-[67%] max-sm:w-full max-sm:p-4 max-lg:p-6 max-lg:w-[85%] bg-white text-mvx-black p-[52px]">
                    {/* start heading */}
                    <div className="pb-6 ">
                        <p className="text-mvx-black font-rocGroteskBold text-[32px]">
                            Request a quote
                        </p>
                    </div>
                    {/* end heading */}

                    {/* start form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <div className="pt-12 border-t">
                                <div className="flex w-full justify-between mb-6 pb-4">
                                    <p className="text-xl font-rocGroteskBold text-mvx-black">
                                        Contact details
                                    </p>
                                </div>

                                <div className={`h-full`}>
                                    <div className="mb-6 flex max-sm:flex-col gap-6">
                                        <div className="w-1/2 max-sm:w-full">
                                            <p className="text-sm mb-1 font-rocGroteskMedium">
                                                First name*
                                            </p>
                                            <input
                                                type="text"
                                                placeholder="Sonia"
                                                className="border border-gray-200 py-3 rounded px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                {...register("firstname")}
                                            />
                                        </div>
                                        <div className="w-1/2 max-sm:w-full">
                                            <p className="text-sm mb-1 font-rocGroteskMedium">
                                                Last name*
                                            </p>
                                            <input
                                                type="text"
                                                placeholder="Matthew"
                                                className="border border-gray-200 py-3 rounded px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                {...register("lastname")}
                                            />
                                        </div>
                                    </div>
                                    <div className=" flex max-sm:flex-col gap-6">
                                        <div className="w-1/2 max-sm:w-full">
                                            <p className="text-sm mb-1 font-rocGroteskMedium">
                                                Email Address*
                                            </p>
                                            <input
                                                type="email"
                                                placeholder="example@mail.com"
                                                className="border border-gray-200 py-3 px-4 outline-0 w-full h-[48px] rounded text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                title="must be a valid email address"
                                                {...register("email")}
                                            />
                                        </div>
                                        <div className="w-1/2 max-sm:w-full">
                                            <p className="text-sm mb-1 font-rocGroteskMedium">
                                                Phone number*
                                            </p>
                                            <div className="flex">
                                                <div className="w-[45%]">
                                                    <SelectInput
                                                        value={customInputData.phoneExt}
                                                        name="phoneExt"
                                                        className="bg-mvx-light-blue rounded-tr-none rounded-br-none"
                                                        handleChange={(name, value) =>
                                                            handleSelectInputChange(name, value)
                                                        }
                                                        dropdownOptions={countries
                                                            .filter((data) =>
                                                                Boolean(data?.codes[0])
                                                            )
                                                            .map((item) => ({
                                                                label: item?.codes[0]?.replace(
                                                                    " ",
                                                                    ""
                                                                ),
                                                                value: item?.codes[0]?.replace(
                                                                    " ",
                                                                    ""
                                                                ),
                                                                icon: (
                                                                    <ReactCountryFlag
                                                                        countryCode={
                                                                            item?.abbreviation
                                                                        }
                                                                    />
                                                                ),
                                                            }))}
                                                    />
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder="(000) 000-0000"
                                                    className="border-y border-r border-gray-200 rounded-tr rounded-br py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                    required
                                                    minLength={10}
                                                    pattern={"^[0-9]+$"}
                                                    title="must be a valid phone number"
                                                    {...register("phoneNo")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12">
                                <div className="flex w-full justify-between mb-6 pb-4">
                                    <p className="text-xl font-rocGroteskBold text-mvx-black">
                                        Freight mode
                                    </p>
                                </div>

                                <div className={`h-full`}>
                                    <div className="">
                                        <div className="flex gap-4 max-sm:flex-col">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`border-[1.5px] ${
                                                        customInputData.freightMode === "air"
                                                            ? "bg-[#FAFBFC] border-gun-metal"
                                                            : "bg-white"
                                                    } hover:border-gun-metal cursor-pointer p-4 w-[180px] max-sm:w-full flex flex-col items-start gap-1 rounded flex justify-center`}
                                                    onClick={() => {
                                                        setCustomInputData((prev) => {
                                                            return {
                                                                ...prev,
                                                                freightMode: "air",
                                                            };
                                                        });
                                                        setValue("filled");
                                                    }}
                                                >
                                                    <span className={`material-icons text-2xl`}>
                                                        flight_takeoff
                                                    </span>
                                                    <p className="text-mvx-black text-sm font-rocGroteskMedium">
                                                        Air Freight
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`border-[1.5px] ${
                                                        customInputData.freightMode === "ocean"
                                                            ? "bg-[#FAFBFC] border-gun-metal"
                                                            : "bg-white"
                                                    } hover:border-gun-metal cursor-pointer p-4 w-[180px] max-sm:w-full flex flex-col items-start gap-1 rounded flex justify-center`}
                                                    onClick={() => {
                                                        setCustomInputData((prev) => {
                                                            return {
                                                                ...prev,
                                                                freightMode: "ocean",
                                                            };
                                                        });
                                                        setValue("filled");
                                                    }}
                                                >
                                                    <span className={`material-icons text-2xl`}>
                                                        directions_boat
                                                    </span>
                                                    <p className="text-mvx-black text-sm font-rocGroteskMedium">
                                                        Sea Freight
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`border-[1.5px] ${
                                                        customInputData.freightMode === "land"
                                                            ? "bg-[#FAFBFC] border-gun-metal"
                                                            : "bg-white"
                                                    } hover:border-gun-metal cursor-pointer p-4 w-[180px] max-sm:w-full flex flex-col items-start gap-1 rounded flex justify-center`}
                                                    onClick={() => {
                                                        setCustomInputData((prev) => {
                                                            return {
                                                                ...prev,
                                                                freightMode: "land",
                                                            };
                                                        });
                                                        setValue("filled");
                                                    }}
                                                >
                                                    <span className={`material-icons text-2xl`}>
                                                        local_shipping
                                                    </span>
                                                    <p className="text-mvx-black text-sm font-rocGroteskMedium">
                                                        Haulage
                                                    </p>
                                                </div>
                                            </div>

                                            <input
                                                required
                                                value={value}
                                                className="absolute z-[-10] "
                                                onChange={() => console.log("sample")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12">
                                <div className="flex w-full justify-between mb-6 cursor-pointer pb-4">
                                    <p className="text-xl font-rocGroteskBold text-mvx-black">
                                        Origin and destination details
                                    </p>
                                </div>

                                <div className={`h-full`}>
                                    <div className="mb-6 flex gap-6 max-sm:flex-col">
                                        <div className="w-1/2 max-sm:w-full">
                                            <div>
                                                <p className="text-sm mb-1 font-rocGroteskMedium">
                                                    Pick-up address
                                                </p>
                                                <LocationSearchInput
                                                    setData={setAddress}
                                                    savedAddress={
                                                        address?.pickupAddress
                                                            ? address?.pickupAddress?.address
                                                            : ""
                                                    }
                                                    placeholder="Enter pickup address"
                                                    name={"pickupAddress"}
                                                    resetLocation={
                                                        !Boolean(address?.pickupAddress?.address)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="w-1/2 max-sm:w-full">
                                            <SelectInput
                                                value={customInputData.pickupCountry}
                                                name="pickupCountry"
                                                handleChange={handleSelectInputChange}
                                                isRequired={true}
                                                label="Pickup Country*"
                                                placeholder={"Country"}
                                                dropdownOptions={countries.map((country) => {
                                                    return {
                                                        label: country.name,
                                                        value: country.name,
                                                    };
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-6 flex gap-6 max-sm:flex-col">
                                        <div className="w-1/2 max-sm:w-full">
                                            <div>
                                                <p className="text-sm mb-1 font-rocGroteskMedium">
                                                    Port of loading
                                                </p>
                                                <LocationSearchInput
                                                    setData={setAddress}
                                                    savedAddress={
                                                        address?.portOfLoading
                                                            ? address?.portOfLoading?.address
                                                            : ""
                                                    }
                                                    placeholder="Enter port of loading"
                                                    name={"portOfLoading"}
                                                    resetLocation={
                                                        !Boolean(address?.portOfLoading?.address)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="w-1/2 max-sm:w-full">
                                            <div>
                                                <p className="text-sm mb-1 font-rocGroteskMedium">
                                                    Destination Address
                                                </p>
                                                <LocationSearchInput
                                                    setData={setAddress}
                                                    savedAddress={
                                                        address?.destinationAddress
                                                            ? address?.destinationAddress?.address
                                                            : ""
                                                    }
                                                    placeholder="Enter destination address"
                                                    name={"destinationAddress"}
                                                    resetLocation={
                                                        !Boolean(
                                                            address?.destinationAddress?.address
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-6 flex gap-6 max-sm:flex-col">
                                        <div className="w-1/2 max-sm:w-full">
                                            <SelectInput
                                                value={customInputData.incoterms}
                                                name="incoterms"
                                                placeholder={"Select incoterm"}
                                                handleChange={handleSelectInputChange}
                                                label="Incoterms"
                                                className={"!h-[48px]"}
                                                isRequired={true}
                                                dropdownOptions={incoterms.map((item) => ({
                                                    label: item.label,
                                                    value: item.value,
                                                }))}
                                            />
                                        </div>
                                        <div className="w-1/2 max-sm:w-full">
                                            <SelectInput
                                                value={customInputData.serviceType}
                                                name="serviceType"
                                                placeholder={"Select type"}
                                                handleChange={handleSelectInputChange}
                                                label="Service type"
                                                isRequired={true}
                                                className="!h-[48px]"
                                                dropdownOptions={[
                                                    {
                                                        label: "Import",
                                                        value: "import",
                                                    },
                                                    {
                                                        label: "Export",
                                                        value: "export",
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                    {customInputData?.freightMode !== "air" && (
                                        <div className="mb-6 flex gap-6 max-sm:flex-col">
                                            <div className="w-1/2 max-sm:w-full">
                                                <SelectInput
                                                    value={customInputData.loadType}
                                                    name="loadType"
                                                    placeholder={"Select load type"}
                                                    handleChange={handleSelectInputChange}
                                                    label="Load type"
                                                    className={"!h-[48px]"}
                                                    isRequired={true}
                                                    dropdownOptions={[
                                                        {
                                                            label: "Full Container Load (FCL)",
                                                            value: "Full Container Load (FCL)",
                                                        },
                                                        {
                                                            label: "Low Container Load (LCL)",
                                                            value: "Low Container Load (LCL)",
                                                        },
                                                    ]}
                                                />
                                            </div>
                                            <div className="w-1/2 max-sm:w-full"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-12">
                                <div className="flex w-full justify-between mb-6 cursor-pointer pb-4">
                                    <p className="text-xl font-rocGroteskBold text-mvx-black">
                                        Shipment details
                                    </p>
                                </div>
                                <div className={`h-full`}>
                                    <div className="mb-9">
                                        <div
                                            className={`flex bg-[#F4F5F7] my-4 text-[13px] ${
                                                customInputData?.freightMode === "air"
                                                    ? "w-fit"
                                                    : "w-2/5"
                                            } max-sm:w-full h-10 text-[#6B778C] items-center`}
                                        >
                                            {customInputData?.freightMode !== "air" && (
                                                <button
                                                    type="button"
                                                    className={`basis-[49%] ml-1 h-[83%] text-mvx-black rounded-[2px] transition-all duration-[400ms] ${
                                                        isContainer &&
                                                        customInputData?.freightMode !== "air" &&
                                                        "bg-white shadow-md text-mvx-black"
                                                    }`}
                                                    onClick={() => setIsContainer(true)}
                                                >
                                                    Container
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className={`${
                                                    customInputData?.freightMode === "air"
                                                        ? "w-fit max-sm:w-full"
                                                        : "basis-[49%]"
                                                } mr-1 h-[83%] rounded-[2px] text-mvx-black transition-all duration-[400ms] ${
                                                    (!isContainer ||
                                                        customInputData?.freightMode === "air") &&
                                                    "bg-white shadow-md"
                                                }`}
                                                onClick={() => setIsContainer(false)}
                                            >
                                                Non-Container
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-6 flex flex-col gap-4">
                                        {(isContainer && customInputData?.freightMode !== "air"
                                            ? customInputData.containerData
                                            : customInputData.nonContainerData
                                        ).map((_, idx) => {
                                            return isContainer &&
                                                customInputData?.freightMode !== "air" ? (
                                                <div
                                                    key={idx}
                                                    className="py-4 px-8 max-sm:p-4 border"
                                                >
                                                    <div
                                                        className={`flex ${
                                                            isExpanded &&
                                                            activeContainerAccordionId === idx &&
                                                            "mb-6"
                                                        } justify-between font-rocGroteskMedium text-sm items-center cursor-pointer`}
                                                        onClick={() => {
                                                            setActiveContainerAccordionId(idx);
                                                            setIsExpanded(
                                                                activeContainerAccordionId === idx
                                                                    ? !isExpanded
                                                                    : true
                                                            );
                                                        }}
                                                    >
                                                        <p>Item {idx + 1}</p>

                                                        <p className="flex gap-8 max-sm:gap-4">
                                                            {idx > 0 && (
                                                                <span
                                                                    className="material-icons cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        return (
                                                                            idx !== 0 &&
                                                                            removeContainerAccordion(
                                                                                idx
                                                                            )
                                                                        );
                                                                    }}
                                                                >
                                                                    delete
                                                                </span>
                                                            )}

                                                            <span
                                                                className={`material-icons ${
                                                                    isExpanded &&
                                                                    activeContainerAccordionId ===
                                                                        idx &&
                                                                    "rotate-180"
                                                                }`}
                                                            >
                                                                keyboard_arrow_down
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={`${
                                                            isExpanded &&
                                                            activeContainerAccordionId === idx
                                                                ? "h-full"
                                                                : "h-0 overflow-hidden"
                                                        }`}
                                                    >
                                                        <div className="flex max-sm:flex-col gap-6 mb-6">
                                                            <div className="w-1/2 max-sm:w-full">
                                                                <div className="w-full">
                                                                    <p className="text-sm mb-1 font-rocGroteskMedium">
                                                                        Container Type (per unit)*
                                                                    </p>
                                                                    <div className="flex  items-center">
                                                                        <button
                                                                            type="button"
                                                                            className={`border rounded-r-none hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                                                                customInputData
                                                                                    .containerData[
                                                                                    idx
                                                                                ].containerType ===
                                                                                "40ft"
                                                                                    ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                                                                    : "text-mvx-neutral bg-white"
                                                                            }  w-full px-4 py-3 flex h-[48px] items-center justify-center`}
                                                                            onClick={() =>
                                                                                handleContainerItemChange(
                                                                                    null,
                                                                                    idx,
                                                                                    "containerType",
                                                                                    "40ft"
                                                                                )
                                                                            }
                                                                        >
                                                                            <p className="text-sm font-rocGroteskMedium whitespace-nowrap">
                                                                                40ft
                                                                            </p>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className={`border rounded-l-none hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                                                                customInputData
                                                                                    .containerData[
                                                                                    idx
                                                                                ].containerType ===
                                                                                "20ft"
                                                                                    ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                                                                    : "text-mvx-neutral bg-white"
                                                                            }  w-full px-4 py-3 flex h-[48px] items-center justify-center`}
                                                                            onClick={() =>
                                                                                handleContainerItemChange(
                                                                                    null,
                                                                                    idx,
                                                                                    "containerType",
                                                                                    "20ft"
                                                                                )
                                                                            }
                                                                        >
                                                                            <p className="text-sm font-rocGroteskMedium whitespace-nowrap">
                                                                                20ft
                                                                            </p>
                                                                        </button>

                                                                        <input
                                                                            required
                                                                            value={
                                                                                customInputData
                                                                                    ?.containerData?.[
                                                                                    idx
                                                                                ]?.containerType
                                                                            }
                                                                            className="absolute z-[-10] "
                                                                            onChange={() =>
                                                                                console.log(
                                                                                    "sample"
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="w-1/2 max-sm:w-full">
                                                                <div className="w-full">
                                                                    <p className="text-sm mb-1 font-rocGroteskMedium">
                                                                        Number of Units*
                                                                    </p>
                                                                    <div className="flex gap-3 items-center">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="1"
                                                                            className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                                            name="quantity"
                                                                            value={
                                                                                customInputData
                                                                                    .containerData[
                                                                                    idx
                                                                                ].quantity
                                                                            }
                                                                            onChange={(event) =>
                                                                                handleContainerItemChange(
                                                                                    event,
                                                                                    idx
                                                                                )
                                                                            }
                                                                            required
                                                                        />
                                                                        <button
                                                                            onClick={() => {
                                                                                setCustomInputData(
                                                                                    (prev) => {
                                                                                        const container =
                                                                                            [
                                                                                                ...prev.containerData,
                                                                                            ];
                                                                                        container[
                                                                                            idx
                                                                                        ] = {
                                                                                            ...prev
                                                                                                .containerData[
                                                                                                idx
                                                                                            ],
                                                                                            quantity:
                                                                                                Number(
                                                                                                    prev
                                                                                                        .containerData[
                                                                                                        idx
                                                                                                    ]
                                                                                                        .quantity
                                                                                                ) >
                                                                                                1
                                                                                                    ? String(
                                                                                                          Number(
                                                                                                              prev
                                                                                                                  .containerData[
                                                                                                                  idx
                                                                                                              ]
                                                                                                                  .quantity
                                                                                                          ) -
                                                                                                              1
                                                                                                      )
                                                                                                    : "1",
                                                                                        };
                                                                                        return {
                                                                                            ...prev,
                                                                                            containerData:
                                                                                                container,
                                                                                        };
                                                                                    }
                                                                                );
                                                                            }}
                                                                            type="button"
                                                                            className="border bg-white px-4 py-3 flex h-[48px] items-center justify-center "
                                                                        >
                                                                            <span className="material-icons text-base">
                                                                                remove
                                                                            </span>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setCustomInputData(
                                                                                    (prev) => {
                                                                                        const container =
                                                                                            [
                                                                                                ...prev.containerData,
                                                                                            ];
                                                                                        container[
                                                                                            idx
                                                                                        ] = {
                                                                                            ...prev
                                                                                                .containerData[
                                                                                                idx
                                                                                            ],
                                                                                            quantity:
                                                                                                String(
                                                                                                    Number(
                                                                                                        prev
                                                                                                            .containerData[
                                                                                                            idx
                                                                                                        ]
                                                                                                            .quantity
                                                                                                    ) +
                                                                                                        1
                                                                                                ),
                                                                                        };
                                                                                        return {
                                                                                            ...prev,
                                                                                            containerData:
                                                                                                container,
                                                                                        };
                                                                                    }
                                                                                );
                                                                            }}
                                                                            type="button"
                                                                            className="border bg-white px-4 py-3 flex h-[48px] items-center justify-center "
                                                                        >
                                                                            <span className="material-icons text-base">
                                                                                add
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    key={idx}
                                                    className="py-4 px-8 max-sm:p-4 border"
                                                >
                                                    <div
                                                        className={`flex ${
                                                            isExpanded &&
                                                            activeNonContainerAccordionId === idx &&
                                                            "mb-6"
                                                        } justify-between font-rocGroteskMedium text-sm items-center cursor-pointer`}
                                                        onClick={() => {
                                                            setIsExpanded(
                                                                activeNonContainerAccordionId ===
                                                                    idx
                                                                    ? !isExpanded
                                                                    : true
                                                            );
                                                            setActiveNonContainerAccordionId(idx);
                                                        }}
                                                    >
                                                        <p>Item {idx + 1}</p>
                                                        <p
                                                            className={`${
                                                                idx === 0 && "ml-[-52px]"
                                                            } max-sm:hidden`}
                                                        >
                                                            {
                                                                customInputData?.nonContainerData?.[
                                                                    idx
                                                                ]?.containerUnitNo
                                                            }{" "}
                                                            {
                                                                customInputData?.nonContainerData?.[
                                                                    idx
                                                                ]?.packageType
                                                            }{" "}
                                                            {customInputData?.nonContainerData?.[
                                                                idx
                                                            ]?.length ||
                                                            customInputData?.nonContainerData?.[idx]
                                                                ?.height ||
                                                            customInputData?.nonContainerData?.[idx]
                                                                ?.width ||
                                                            customInputData?.nonContainerData?.[idx]
                                                                ?.weight
                                                                ? `• Unit dimensions ${customInputData?.nonContainerData?.[idx]?.length}×${customInputData?.nonContainerData?.[idx]?.width}×${customInputData?.nonContainerData?.[idx]?.height} ${customInputData?.nonContainerData?.[idx]?.dimensionUnit} ${customInputData?.nonContainerData?.[idx]?.weight} ${customInputData?.nonContainerData?.[idx]?.weightUnit}`
                                                                : ""}
                                                        </p>
                                                        <p className="flex gap-8 max-sm:gap-4">
                                                            {idx > 0 && (
                                                                <span
                                                                    className="material-icons cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        return (
                                                                            idx !== 0 &&
                                                                            removeNonContainerAccordion(
                                                                                idx
                                                                            )
                                                                        );
                                                                    }}
                                                                >
                                                                    delete
                                                                </span>
                                                            )}

                                                            <span
                                                                className={`material-icons ${
                                                                    isExpanded &&
                                                                    activeNonContainerAccordionId ===
                                                                        idx &&
                                                                    "rotate-180"
                                                                }`}
                                                            >
                                                                keyboard_arrow_down
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={`${
                                                            isExpanded &&
                                                            activeNonContainerAccordionId === idx
                                                                ? "h-full"
                                                                : "h-0 overflow-hidden"
                                                        }`}
                                                    >
                                                        <div className="flex max-sm:flex-col gap-6 mb-6">
                                                            <SelectInput
                                                                value={
                                                                    customInputData
                                                                        .nonContainerData[idx]
                                                                        .packageType
                                                                }
                                                                name="packageType"
                                                                isRequired={true}
                                                                placeholder={"Select package type"}
                                                                handleChange={(name, value) =>
                                                                    handleNonContainerItemChange(
                                                                        null,
                                                                        idx,
                                                                        name,
                                                                        value
                                                                    )
                                                                }
                                                                label="Select package type"
                                                                dropdownOptions={[
                                                                    {
                                                                        label: "Pallets",
                                                                        value: "Pallets",
                                                                        icon: (
                                                                            <span className="material-icons">
                                                                                pallet
                                                                            </span>
                                                                        ),
                                                                    },
                                                                    {
                                                                        label: "Crates/Boxes",
                                                                        value: "Crates/Boxes",
                                                                        icon: (
                                                                            <span className="material-icons">
                                                                                takeout_dining
                                                                            </span>
                                                                        ),
                                                                    },
                                                                ]}
                                                            />
                                                            <SelectInput
                                                                value={
                                                                    customInputData
                                                                        .nonContainerData[idx]
                                                                        .palletType
                                                                }
                                                                name="palletType"
                                                                isRequired={true}
                                                                placeholder={"Select pallet type"}
                                                                handleChange={(name, value) =>
                                                                    handleNonContainerItemChange(
                                                                        null,
                                                                        idx,
                                                                        name,
                                                                        value
                                                                    )
                                                                }
                                                                label="Pallet Type*"
                                                                dropdownOptions={[
                                                                    {
                                                                        label: "Pallets (non-specified)",
                                                                        value: "Pallets (non-specified)",
                                                                    },
                                                                    {
                                                                        label: "48”x40”",
                                                                        value: "48”x40”",
                                                                    },
                                                                    {
                                                                        label: "120 x 80CM (EUR 1)",
                                                                        value: "120 x 80CM (EUR 1)",
                                                                    },
                                                                    {
                                                                        label: "120 x 100CM (EUR 1)",
                                                                        value: "120 x 100CM (EUR 1)",
                                                                    },
                                                                ]}
                                                            />
                                                            <div className="w-full">
                                                                <p className="text-sm mb-1 font-rocGroteskMedium">
                                                                    Number of Units*
                                                                </p>
                                                                <div className="flex items-center">
                                                                    <button
                                                                        type="button"
                                                                        className="border-l border-y bg-white px-4 py-3 flex h-[48px] items-center justify-center "
                                                                        onClick={() => {
                                                                            setCustomInputData(
                                                                                (prev) => {
                                                                                    const container =
                                                                                        [
                                                                                            ...prev.nonContainerData,
                                                                                        ];
                                                                                    container[idx] =
                                                                                        {
                                                                                            ...prev
                                                                                                .nonContainerData[
                                                                                                idx
                                                                                            ],
                                                                                            containerUnitNo:
                                                                                                Number(
                                                                                                    prev
                                                                                                        .nonContainerData[
                                                                                                        idx
                                                                                                    ]
                                                                                                        .containerUnitNo
                                                                                                ) >
                                                                                                1
                                                                                                    ? String(
                                                                                                          Number(
                                                                                                              prev
                                                                                                                  .nonContainerData[
                                                                                                                  idx
                                                                                                              ]
                                                                                                                  .containerUnitNo
                                                                                                          ) -
                                                                                                              1
                                                                                                      )
                                                                                                    : "1",
                                                                                        };
                                                                                    return {
                                                                                        ...prev,
                                                                                        nonContainerData:
                                                                                            container,
                                                                                    };
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        <span className="material-icons text-base">
                                                                            remove
                                                                        </span>
                                                                    </button>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="1"
                                                                        name="containerUnitNo"
                                                                        value={
                                                                            customInputData
                                                                                .nonContainerData[
                                                                                idx
                                                                            ].containerUnitNo
                                                                        }
                                                                        onChange={(event) => {
                                                                            handleNonContainerItemChange(
                                                                                event,
                                                                                idx
                                                                            );
                                                                        }}
                                                                        required
                                                                        className="border border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="border-r border-y bg-white px-4 py-3 flex h-[48px] items-center justify-center "
                                                                        onClick={() => {
                                                                            setCustomInputData(
                                                                                (prev) => {
                                                                                    const container =
                                                                                        [
                                                                                            ...prev.nonContainerData,
                                                                                        ];
                                                                                    container[idx] =
                                                                                        {
                                                                                            ...prev
                                                                                                .nonContainerData[
                                                                                                idx
                                                                                            ],
                                                                                            containerUnitNo:
                                                                                                String(
                                                                                                    Number(
                                                                                                        prev
                                                                                                            .nonContainerData[
                                                                                                            idx
                                                                                                        ]
                                                                                                            .containerUnitNo
                                                                                                    ) +
                                                                                                        1
                                                                                                ),
                                                                                        };
                                                                                    return {
                                                                                        ...prev,
                                                                                        nonContainerData:
                                                                                            container,
                                                                                    };
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        <span className="material-icons text-base">
                                                                            add
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-6 flex max-sm:flex-col items-center gap-6">
                                                            <div className="w-1/2 max-sm:w-full">
                                                                <div className="w-full">
                                                                    <p className="text-sm mb-1 font-rocGroteskMedium">
                                                                        Dimensions (per unit)
                                                                    </p>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="L"
                                                                            className="border border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                                            name="length"
                                                                            pattern={
                                                                                "^\\d+(\\.\\d+)?\\d*$"
                                                                            }
                                                                            title="must be valid digits"
                                                                            value={
                                                                                customInputData
                                                                                    .nonContainerData[
                                                                                    idx
                                                                                ].length
                                                                            }
                                                                            onChange={(event) =>
                                                                                handleNonContainerItemChange(
                                                                                    event,
                                                                                    idx
                                                                                )
                                                                            }
                                                                            required
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="W"
                                                                            className="border border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                                            name="width"
                                                                            pattern={
                                                                                "^\\d+(\\.\\d+)?\\d*$"
                                                                            }
                                                                            title="must be valid digits"
                                                                            value={
                                                                                customInputData
                                                                                    .nonContainerData[
                                                                                    idx
                                                                                ].width
                                                                            }
                                                                            onChange={(event) =>
                                                                                handleNonContainerItemChange(
                                                                                    event,
                                                                                    idx
                                                                                )
                                                                            }
                                                                            required
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            required
                                                                            placeholder="H"
                                                                            className="border border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                                            name="height"
                                                                            pattern={
                                                                                "^\\d+(\\.\\d+)?\\d*$"
                                                                            }
                                                                            title="must be valid digits"
                                                                            value={
                                                                                customInputData
                                                                                    .nonContainerData[
                                                                                    idx
                                                                                ].height
                                                                            }
                                                                            onChange={(event) =>
                                                                                handleNonContainerItemChange(
                                                                                    event,
                                                                                    idx
                                                                                )
                                                                            }
                                                                        />
                                                                        <Dropdown
                                                                            value={
                                                                                customInputData
                                                                                    .nonContainerData[
                                                                                    idx
                                                                                ].dimensionUnit
                                                                            }
                                                                            name="dimensionUnit"
                                                                            className={"!h-[48px]"}
                                                                            handleChange={(
                                                                                name,
                                                                                value
                                                                            ) =>
                                                                                handleNonContainerItemChange(
                                                                                    null,
                                                                                    idx,
                                                                                    name,
                                                                                    value
                                                                                )
                                                                            }
                                                                            dropdownOptions={[
                                                                                {
                                                                                    label: "Centimeter",
                                                                                    value: "cm",
                                                                                },
                                                                                {
                                                                                    label: "Inches",
                                                                                    value: "in",
                                                                                },
                                                                            ]}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="w-1/2 max-sm:w-full">
                                                                <div className="w-full">
                                                                    <p className="text-sm mb-1 font-rocGroteskMedium">
                                                                        Weight (per unit)*
                                                                    </p>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="1"
                                                                            className="border border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                                            name="weight"
                                                                            required
                                                                            pattern={
                                                                                "^\\d+(\\.\\d+)?\\d*$"
                                                                            }
                                                                            title="must be valid digits"
                                                                            value={
                                                                                customInputData
                                                                                    .nonContainerData[
                                                                                    idx
                                                                                ].weight
                                                                            }
                                                                            onChange={(event) =>
                                                                                handleNonContainerItemChange(
                                                                                    event,
                                                                                    idx
                                                                                )
                                                                            }
                                                                        />
                                                                        <Dropdown
                                                                            value={
                                                                                customInputData
                                                                                    .nonContainerData[
                                                                                    idx
                                                                                ].weightUnit
                                                                            }
                                                                            name="weightUnit"
                                                                            className={"!h-[48px]"}
                                                                            handleChange={(
                                                                                name,
                                                                                value
                                                                            ) =>
                                                                                handleNonContainerItemChange(
                                                                                    null,
                                                                                    idx,
                                                                                    name,
                                                                                    value
                                                                                )
                                                                            }
                                                                            dropdownOptions={[
                                                                                {
                                                                                    label: "Kilogram",
                                                                                    value: "kg",
                                                                                },
                                                                                {
                                                                                    label: "Pounds",
                                                                                    value: "lb",
                                                                                },
                                                                            ]}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <p
                                        onClick={() => {
                                            return isContainer &&
                                                customInputData?.freightMode !== "air"
                                                ? addContainerAccordion()
                                                : addNonContainerAccordion();
                                        }}
                                        className="text-sm w-fit font-rocGroteskMedium cursor-pointer flex items-center gap-2"
                                    >
                                        <span className="material-icons text-lg">add</span>
                                        <span>Add another package</span>
                                    </p>
                                </div>
                            </div>
                            <div className="pt-12 ">
                                <div className="w-full mb-6 cursor-pointer">
                                    <p className="text-xl font-rocGroteskBold text-mvx-black">
                                        Goods details
                                    </p>
                                    <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                        Tell us a bit about the goods
                                    </p>
                                </div>
                                <div className={`h-full`}>
                                    <div className="mb-6">
                                        <SelectInput
                                            value={customInputData.currency}
                                            name="currency"
                                            placeholder={"Preferred currency*"}
                                            handleChange={handleSelectInputChange}
                                            label="Commercial invoice value"
                                            isRequired={true}
                                            className={"border-b-0 rounded-b-none"}
                                            dropdownOptions={[
                                                {
                                                    label: "Great Britain Pounds (GBP)",
                                                    value: "GBP",
                                                },
                                                {
                                                    label: "United States Dollar (USD)",
                                                    value: "USD",
                                                },
                                                {
                                                    label: "European Euro (EUR)",
                                                    value: "EUR",
                                                },
                                                {
                                                    label: "Naira (NGN)",
                                                    value: "NGN",
                                                },
                                            ]}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Amount"
                                            className="border border-gray-200 rounded-b py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                            required
                                            pattern={"^[0-9]+$"}
                                            title="must be digits"
                                            {...register("amount")}
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-sm mb-1 font-rocGroteskMedium">
                                            What are you Shipping?
                                        </p>
                                        <textarea
                                            placeholder="Describe your goods"
                                            rows="5"
                                            className="border border-gray-200 resize-none rounded py-3 px-4 outline-0 w-full text-sm font-rocGroteskMedium placeholder:text-sm placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                            {...register("description", {
                                                required: true,
                                            })}
                                        />
                                    </div>
                                    <div className="">
                                        <SelectInput
                                            label="Are your goods ready?"
                                            value={customInputData.areGoodsReady}
                                            name="areGoodsReady"
                                            isRequired={true}
                                            placeholder={"Are your goods ready"}
                                            handleChange={handleSelectInputChange}
                                            dropdownOptions={[
                                                {
                                                    label: "Yes, they are ready now",
                                                    value: "Yes, they are ready now",
                                                },
                                                {
                                                    label: "They will be ready by next week",
                                                    value: "They will be ready by next week",
                                                },
                                                {
                                                    label: "They will be ready in two weeks",
                                                    value: "They will be ready in two weeks",
                                                },
                                            ]}
                                        />
                                        <p className="text-sm font-rocGroteskMedium text-mvx-neutral mt-2">
                                            Please note that rates are subject to change if your
                                            goods are not gated-in before that date. This means that
                                            today's rate might not be valid when your goods are
                                            ready.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12">
                                <p className="text-xs mb-6 font-rocGroteskMedium text-mvx-black">
                                    By clicking request a quote, you agree with our{" "}
                                    <Link className="underline" to={"#"}>
                                        Terms & conditions.
                                    </Link>
                                </p>
                                <button
                                    type="submit"
                                    className={`${
                                        isSubmitting && "w-[155px]"
                                    } text-white text-sm font-rocGroteskMedium flex items-center justify-center bg-pacific-cyan py-3 px-6`}
                                >
                                    {isSubmitting ? (
                                        <Loader color="white" />
                                    ) : (
                                        <p className="text-white">Request a quote</p>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                    {/* end form */}
                </div>
            </div>
        </div>
    );
};

export default RequestQuote;
