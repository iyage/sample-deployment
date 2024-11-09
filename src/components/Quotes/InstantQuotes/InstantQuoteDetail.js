/* eslint-disable no-unused-vars */
import NavTwo from "components/common/NavTwo";
import { flattenDeep, truncate } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import InstantQuoteSearchBar from "./common/InstantQuoteSearchBar";
import { useDispatch, useSelector } from "react-redux";
import { rateActions } from "actions";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "components/common/Loader";
import countries from "variables/countries";
import { getCurrencyFromCurrencyCode } from "helpers";
import { formatMoney } from "helpers/formatMoney";
import moment from "moment";
import ModalContainer from "components/common/ModalContainer";
import RouteDetail from "components/RateManagement/AddRate/ManualUpload/RouteDetail";
import CargoDetails from "components/RateManagement/AddRate/ManualUpload/CargoDetails";
import MovementType from "components/RateManagement/AddRate/ManualUpload/MovementType";
import LoadType from "components/RateManagement/AddRate/ManualUpload/LoadType";
import OriginCharges from "components/RateManagement/AddRate/ManualUpload/OriginCharges";
import FreightCharges from "components/RateManagement/AddRate/ManualUpload/FreightCharges";
import ImportCharges from "components/RateManagement/AddRate/ManualUpload/ImportCharges";
import DestinationCharges from "components/RateManagement/AddRate/ManualUpload/DestinationCharges";
import RateDuration from "components/RateManagement/AddRate/ManualUpload/RateDuration";
import AdditionalServices from "components/RateManagement/AddRate/ManualUpload/AdditionalServices";
import { toast } from "react-hot-toast";
import CustomToast from "components/common/CustomToast";
import SelectInput from "components/common/SelectInput";
import useModal from "components/common/Modals/ModalProvider";

const InstantQuoteDetail = () => {
    const { openModal } = useModal();
    const [customSearchData, setCustomSearchData] = useState({
        portOfOrigin: "",
        portOfDestination: "",
        loadType: {
            type: "",
            mode: "",
        },
        date: "",
    });

    const [openSearch, setOpenSearch] = useState(false);
    const [editRateModal, setEditRateModal] = useState(false);
    const [instantQuoteDetail, setInstantQuoteDetail] = useState({});
    const [value, onChange] = useState(new Date());

    const [activeStep, setActiveStep] = useState(0);
    const [activeTab, setActiveTap] = useState(0);
    const [activeSection, setActiveSection] = useState(0);
    const [address, setAddress] = useState({
        originCode: "",
        originName: "",
        destinationCode: "",
        destinationName: "",
    });
    const [cargDetails, setCargDetails] = useState({
        product: "",
        productCode: "",
        serviceType: "",
        movementMode: "",
    });
    const [movementType, setMovementType] = useState("");
    const [loadType, setLoadType] = useState({
        type: "",
        content: {
            type: "",
            measurement: "",
        },
    });
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [originCharges, setOriginCharges] = useState([
        {
            label: "Pickup charges",
            amount: "",
            currency: selectedCurrency,
            default: true,
        },
        {
            label: "Terminal handling charges (THC)",
            amount: "",
            currency: selectedCurrency,
            default: true,
        },
        {
            label: "Export charges",
            amount: "",
            currency: selectedCurrency,
            default: true,
        },
    ]);
    const [freightCharges, setFreightCharges] = useState([
        {
            label: "Ocean freight",
            amount: "",
            currency: selectedCurrency,
            default: true,
        },
    ]);
    const [importCharges, setImportCharges] = useState([
        {
            label: "",
            amount: "",
            currency: selectedCurrency,
            default: false,
        },
    ]);
    const [destinationCharges, setDestinationCharges] = useState([
        {
            label: "Shipping import and detention",
            amount: "",
            currency: selectedCurrency,
            default: true,
        },
        {
            label: "Terminal handling and storage",
            amount: "",
            currency: selectedCurrency,
            default: true,
        },
        {
            label: "Customs duty",
            amount: "",
            currency: selectedCurrency,
            default: true,
        },
    ]);
    const [additionalServices, setAdditionalServices] = useState({
        customs: false,
        insurance: false,
        inspection: false,
    });
    const [dateRange, setDate] = useState(null);
    const [terms, setTerms] = useState("");

    const openSearchBarRef = useRef(null);
    const navRef = useRef(null);
    const dispatch = useDispatch(null);
    const navigate = useNavigate();
    const { instantQuoteId } = useParams();

    const { getSingleRateLoading, getSingleRateSuccess, FFUpdateRateLoading, FFUpdateRateSuccess } =
        useSelector((state) => state.rate);
    const { ffProfile } = useSelector((state) => state.auth);

    const originCountry = countries.find(
        (country) =>
            country.abbreviation?.toLowerCase() ===
            instantQuoteDetail.portOfOrigin?.country?.toLowerCase()
    );
    const destinationCountry = countries.find(
        (country) =>
            country.abbreviation?.toLowerCase() ===
            instantQuoteDetail.portOfDestination?.country?.toLowerCase()
    );

    const currency = flattenDeep(instantQuoteDetail?.charges?.map((value) => value?.charges))?.[0]
        ?.currency;

    const showAdditionalServices = Object.values(instantQuoteDetail?.additionalServices ?? {});
    const timeFrom = moment(instantQuoteDetail?.validity?.from).format("MMM DD, YYYY | hh:mm A");
    const timeto = moment(instantQuoteDetail?.validity?.to).format("MMM DD, YYYY | hh:mm A");
    const getTotalPrice = () => {
        const chargeArr = flattenDeep(instantQuoteDetail?.charges?.map((value) => value?.charges));
        return chargeArr?.reduce((acc, curr) => {
            return acc + Number(curr?.amount);
        }, 0);
    };
    // console.log("instantQuoteDetail", instantQuoteDetail);

    const saveChanges = () => {
        const chargesForOrigin = instantQuoteDetail?.charges?.find((charge) => {
            const name = charge?.name?.toLowerCase()?.split("-")?.[0];
            return name === "origin";
        });
        const chargesForFreight = instantQuoteDetail?.charges?.find((charge) => {
            const name = charge?.name?.toLowerCase()?.split("-")?.[0];
            return name === "freight";
        });
        const chargesForDestination = instantQuoteDetail?.charges?.find((charge) => {
            const name = charge?.name?.toLowerCase()?.split("-")?.[0];
            return name === "destination";
        });
        const chargesForDocumentation = instantQuoteDetail?.charges?.find((charge) => {
            const name = charge?.name?.toLowerCase()?.split("-")?.[0];
            return name === "documentation";
        });
        const body = {
            portOfOrigin: instantQuoteDetail?.portOfOrigin,
            portOfDestination: instantQuoteDetail?.portOfDestination,

            additionalServices: {
                customsClearance: additionalServices?.customs,
                insurance: additionalServices?.insurance,
                inspectionService: additionalServices?.inspection,
            },
            routeSchedule: [],
            dndConditions: [],
            penaltyFees: [],
            ratesBy: [],
            _id: instantQuoteDetail?._id,
            originPort: address?.originCode,
            destinationPort: address?.destinationCode,
            serviceType: cargDetails?.serviceType,
            movementMode: cargDetails?.movementMode,
            movementType: movementType,
            loadType: loadType?.type === "container" ? loadType.content.type : loadType.type,
            charges: [
                {
                    _id: chargesForOrigin?._id,
                    name: "Origin-Charges",
                    charges: originCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge, idx) => {
                            return charge?.default
                                ? {
                                      _id: chargesForOrigin?.charge?.[idx]?._id,
                                      currency: charge?.currency,
                                      amount: Number(charge?.amount),
                                      description: charge?.label,
                                      measurement: loadType?.content?.measurement,
                                  }
                                : {
                                      currency: charge?.currency,
                                      amount: Number(charge?.amount),
                                      description: charge?.label,
                                      measurement: loadType?.content?.measurement,
                                  };
                        }),
                },
                {
                    _id: chargesForFreight?._id,
                    name: "Freight-Charges",
                    charges: freightCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge, idx) => {
                            return charge?.default
                                ? {
                                      _id: chargesForFreight?.charge?.[idx]?._id,
                                      currency: charge?.currency,
                                      amount: Number(charge?.amount),
                                      measurement: loadType?.content?.measurement,
                                      description: charge?.label,
                                  }
                                : {
                                      currency: charge?.currency,
                                      amount: Number(charge?.amount),
                                      description: charge?.label,
                                      measurement: loadType?.content?.measurement,
                                  };
                        }),
                },
                {
                    _id: chargesForDestination?._id,
                    name: "Destination-Charges",
                    charges: destinationCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge, idx) => {
                            return charge?.default
                                ? {
                                      _id: chargesForDestination?.charge?.[idx]?._id,
                                      currency: charge?.currency,
                                      amount: Number(charge?.amount),
                                      description: charge?.label,
                                      measurement: loadType?.content?.measurement,
                                  }
                                : {
                                      currency: charge?.currency,
                                      amount: Number(charge?.amount),
                                      description: charge?.label,
                                      measurement: loadType?.content?.measurement,
                                  };
                        }),
                },
                {
                    _id: chargesForDocumentation?._id,
                    name: "Documentation-Charges",
                    charges: importCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge, idx) => {
                            return charge?.default
                                ? {
                                      _id: chargesForDocumentation?.charge?.[idx]?._id,
                                      currency: charge?.currency,
                                      amount: Number(charge?.amount),
                                      description: charge?.label,
                                      measurement: loadType?.content?.measurement,
                                  }
                                : {
                                      currency: charge?.currency,
                                      amount: Number(charge?.amount),
                                      description: charge?.label,
                                      measurement: loadType?.content?.measurement,
                                  };
                        }),
                },
            ],
            validity: {
                from: moment(dateRange?.[0])?.format("YYYY-MM-DD"),
                to: moment(dateRange?.[1])?.format("YYYY-MM-DD"),
            },
            product: [
                {
                    name: cargDetails?.product,
                    code: String(cargDetails?.productCode),
                },
            ],
        };

        if (Boolean(terms)) {
            body.remarks = terms;
        }

        if (body.loadType === "noncontainers") {
            body.package = {
                packageType: loadType?.content?.type,
                measurement: loadType?.content?.measurement,
            };
        } else {
            body.container = loadType.content?.measurement;
        }

        dispatch(rateActions.FFUpdateRate(body, instantQuoteDetail?._id));
    };

    const editModalContent = [
        {
            title: "Route details",
            component: (
                <RouteDetail
                    address={address}
                    setAddress={setAddress}
                    // setActiveStep={setActiveStep}
                    setActiveSection={setActiveSection}
                    editMode={true}
                />
            ),
        },
        {
            title: "Cargo details",
            component: (
                <CargoDetails
                    setActiveStep={setActiveStep}
                    cargDetails={cargDetails}
                    setCargDetails={setCargDetails}
                    editMode={true}
                />
            ),
        },
        {
            title: "Movement type",
            component: (
                <MovementType
                    setActiveStep={setActiveStep}
                    movementType={movementType}
                    setMovementType={setMovementType}
                    editMode={true}
                />
            ),
        },
        {
            title: "Load type",
            component: (
                <LoadType
                    setActiveStep={setActiveStep}
                    loadType={loadType}
                    setLoadType={setLoadType}
                    editMode={true}
                />
            ),
        },
        {
            title: "Origin charges",
            component: (
                <OriginCharges
                    setActiveStep={setActiveStep}
                    originCharges={originCharges}
                    setOriginCharges={setOriginCharges}
                    currency={selectedCurrency}
                    setCurrency={setSelectedCurrency}
                    editMode={true}
                />
            ),
        },
        {
            title: "Freight charges",
            component: (
                <FreightCharges
                    setActiveStep={setActiveStep}
                    freightCharges={freightCharges}
                    setFreightCharges={setFreightCharges}
                    currency={selectedCurrency}
                    setCurrency={setSelectedCurrency}
                    editMode={true}
                />
            ),
        },
        {
            title: "Import documentation charges",
            component: (
                <ImportCharges
                    setActiveStep={setActiveStep}
                    importCharges={importCharges}
                    setImportCharges={setImportCharges}
                    currency={selectedCurrency}
                    setCurrency={setSelectedCurrency}
                    editMode={true}
                />
            ),
        },
        {
            title: "Destination charges",
            component: (
                <DestinationCharges
                    setActiveStep={setActiveStep}
                    destinationCharges={destinationCharges}
                    setDestinationCharges={setDestinationCharges}
                    currency={selectedCurrency}
                    setCurrency={setSelectedCurrency}
                    editMode={true}
                />
            ),
        },
        {
            title: "Rate validity period",
            component: (
                <RateDuration
                    setActiveStep={setActiveStep}
                    dateRange={dateRange}
                    setDate={setDate}
                    terms={terms}
                    setTerms={setTerms}
                    editMode={true}
                />
            ),
        },
        {
            title: "Additonal services",
            component: (
                <AdditionalServices
                    setActiveStep={setActiveStep}
                    additionalServices={additionalServices}
                    setAdditionalServices={setAdditionalServices}
                    handleAddRate={() => console.log("---")}
                    loading={false}
                    editMode={true}
                />
            ),
        },
    ];

    const getDefaultValues = useCallback(() => {
        setAddress({
            originCode: instantQuoteDetail?.originPort,
            originName: instantQuoteDetail?.portOfOrigin?.address,
            destinationCode: instantQuoteDetail?.destinationPort,
            destinationName: instantQuoteDetail?.portOfDestination?.address,
        });
        setCargDetails({
            product: instantQuoteDetail?.product?.[0]?.name,
            productCode: instantQuoteDetail?.product?.[0]?.code,
            serviceType: instantQuoteDetail?.serviceType,
            movementMode: instantQuoteDetail?.movementMode,
        });
        setMovementType(instantQuoteDetail?.movementType);
        setLoadType({
            type:
                instantQuoteDetail?.loadType === "40" || instantQuoteDetail?.loadType === "20"
                    ? "container"
                    : "noncontainers",
            content: {
                type:
                    instantQuoteDetail?.loadType === "40" || instantQuoteDetail?.loadType === "20"
                        ? instantQuoteDetail?.loadType
                        : instantQuoteDetail?.package?.packageType,
                measurement:
                    instantQuoteDetail?.loadType === "40" || instantQuoteDetail?.loadType === "20"
                        ? instantQuoteDetail?.loadType
                        : instantQuoteDetail?.package?.measurement,
            },
        });
        setOriginCharges(
            instantQuoteDetail?.charges
                ?.find((value) => {
                    const name = value?.name?.toLowerCase()?.split("-")?.[0];
                    return name === "origin";
                })
                ?.charges?.map((charge) => ({
                    label: charge?.description,
                    amount: charge?.amount,
                    currency: charge?.currency,
                    default: true,
                }))
        );
        setFreightCharges(
            instantQuoteDetail?.charges
                ?.find((value) => {
                    const name = value?.name?.toLowerCase()?.split("-")?.[0];
                    return name === "freight";
                })
                ?.charges?.map((charge) => ({
                    label: charge?.description,
                    amount: charge?.amount,
                    currency: charge?.currency,
                    default: true,
                }))
        );
        setImportCharges(
            instantQuoteDetail?.charges
                ?.find((value) => {
                    const name = value?.name?.toLowerCase()?.split("-")?.[0];
                    return name === "documentation";
                })
                ?.charges?.map((charge) => ({
                    label: charge?.description,
                    amount: charge?.amount,
                    currency: charge?.currency,
                    default: true,
                }))
        );
        setDestinationCharges(
            instantQuoteDetail?.charges
                ?.find((value) => {
                    const name = value?.name?.toLowerCase()?.split("-")?.[0];
                    return name === "destination";
                })
                ?.charges?.map((charge) => ({
                    label: charge?.description,
                    amount: charge?.amount,
                    currency: charge?.currency,
                    default: true,
                }))
        );
        setDate([instantQuoteDetail?.validity?.from, instantQuoteDetail?.validity?.to]);
        setTerms(instantQuoteDetail?.remarks);
        setAdditionalServices({
            customs: instantQuoteDetail?.additionalServices?.customsClearance,
            insurance: instantQuoteDetail?.additionalServices?.insurance,
            inspection: instantQuoteDetail?.additionalServices?.inspectionService,
        });
    }, [instantQuoteDetail]);

    useEffect(() => {
        getDefaultValues();
    }, [instantQuoteDetail, getDefaultValues]);

    useEffect(() => {
        dispatch(rateActions.fetchSingleRate(instantQuoteId));
    }, [dispatch, instantQuoteId, FFUpdateRateSuccess]);

    useEffect(() => {
        if (Boolean(FFUpdateRateSuccess)) {
            toast.custom((t) => <CustomToast t={t} message={"Rate updated"} type="success" />);
            getDefaultValues();
            setEditRateModal(false);
            setActiveTap(0);
            dispatch(rateActions.resetFFUpdateRateSuccess());
        }
    }, [dispatch, FFUpdateRateSuccess, getDefaultValues]);

    useEffect(() => {
        if (getSingleRateSuccess) {
            setInstantQuoteDetail(getSingleRateSuccess.rate);
        }
    }, [getSingleRateSuccess]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openSearchBarRef.current &&
                !openSearchBarRef.current.contains(event.target) &&
                !navRef.current.contains(event.target) &&
                openSearch
            ) {
                setOpenSearch(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openSearchBarRef, openSearch]);

    if (getSingleRateLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <div className="relative">
                <div ref={navRef} className="w-full mb-20">
                    <NavTwo />
                </div>

                <div
                    ref={openSearchBarRef}
                    className="w-full flex justify-center relative max-lg:hidden"
                >
                    <div
                        onClick={() => setOpenSearch(true)}
                        className={`flex items-center ${
                            openSearch && "hidden"
                        } absolute top-[-61px] bg-white cursor-pointer min-w-[350px] max-w-[600px] h-[48px] rounded-[120px] pl-6 pr-2 py-2 border shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.03),0px_7px_12px_-4px_rgba(16,24,40,0.08)]`}
                    >
                        <div className="pr-4 border-r">
                            <p className="flex items-center gap-1.5">
                                <span className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {truncate(originCountry?.name, {
                                        length: 12,
                                    })}
                                </span>
                                <span className="material-icons text-xs text-gun-metal">
                                    arrow_forward
                                </span>
                                <span className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {truncate(destinationCountry?.name, {
                                        length: 12,
                                    })}
                                </span>
                            </p>
                        </div>
                        <div className="px-4 border-r">
                            <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                {instantQuoteDetail?.loadType === "20" ||
                                instantQuoteDetail?.loadType === "40"
                                    ? instantQuoteDetail?.loadType + "ft container"
                                    : instantQuoteDetail?.loadType}
                            </p>
                        </div>
                        <div className="pl-4 flex items-center gap-4">
                            <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                {moment(instantQuoteDetail?.validity?.from).format("MMM DD")} -{" "}
                                {moment(instantQuoteDetail?.validity?.to).format("MMM DD, YYYY")}
                            </p>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center bg-pacific-cyan`}
                            >
                                <i className="ri-search-line before:content-['\f0d1'] before:text-white text-sm"></i>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`px-[167px] w-full absolute z-10 pt-5 pb-4 bg-white border-b ${
                            openSearch ? "block" : "hidden"
                        }`}
                    >
                        <InstantQuoteSearchBar
                            customSearchData={customSearchData}
                            setCustomSearchData={setCustomSearchData}
                            showDoubleView={false}
                            value={value}
                            onSetDate={onChange}
                            onSearch={() =>
                                navigate(
                                    `/dashboard/instant-quote/search-result?originPort=${
                                        customSearchData.portOfOrigin
                                    }&destinationPort=${
                                        customSearchData.portOfDestination
                                    }&departure=${moment(value).format("YYYY-MM-DD")}&loadType=${
                                        customSearchData.loadType.type
                                    }&originPortName=${
                                        customSearchData.originPortName
                                    }&destinationPortName=${customSearchData.destinationPortName}`
                                )
                            }
                        />
                    </div>
                </div>
                <div
                    onClick={() => navigate(-1)}
                    className="hidden max-lg:flex items-center gap-1.5 max-sm:px-4 max-lg:px-10 max-lg:pt-4 cursor-pointer w-fit font-bold "
                >
                    <i className="ri-arrow-left-line"></i>
                    <span className="text-sm font-rocGroteskMedium">Back</span>
                </div>
                <div className="w-full px-[104px] max-lg:px-10 max-sm:px-4 max-lg:pt-4 flex max-lg:flex-col-reverse pt-16 gap-[106px] max-lg:gap-[30px]">
                    <div className="w-[60%] max-lg:w-full mb-6 max-lg:mb-20">
                        <div className="flex items-center max-sm:flex-col max-sm:items-start gap-4">
                            <div className="flex items-center gap-1.5">
                                <div>
                                    <ReactCountryFlag
                                        countryCode={instantQuoteDetail?.portOfOrigin?.country}
                                        svg
                                        style={{
                                            borderRadius: "100%",
                                            width: "24px",
                                            height: "24px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                                <p className="text-[22px] font-rocGroteskBold text-gun-metal mt-[2px]">
                                    {truncate(originCountry?.name, {
                                        length: 20,
                                    })}
                                </p>
                            </div>

                            <span className="material-icons text-xs text-gun-metal font-bold max-sm:rotate-90 max-sm:text-lg">
                                arrow_forward
                            </span>
                            <div className="flex items-center gap-1.5">
                                <div>
                                    <ReactCountryFlag
                                        countryCode={instantQuoteDetail?.portOfDestination?.country}
                                        svg
                                        style={{
                                            borderRadius: "100%",
                                            width: "24px",
                                            height: "24px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                                <p className="text-[22px] font-rocGroteskBold text-gun-metal mt-[2px]">
                                    {truncate(destinationCountry?.name, {
                                        length: 20,
                                    })}
                                </p>
                            </div>
                        </div>
                        <hr className="mt-6 mb-8" />
                        <div>
                            <div className="mb-6">
                                <p className="text-base font-rocGroteskBold ">Shipment details</p>
                            </div>
                            <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-y-6">
                                {instantQuoteDetail?.source === "freightify" && (
                                    <div className="flex items-start gap-4">
                                        <div className="mt-[-2px]">
                                            <i className="ri-time-fill before:content-['\f20e'] text-2xl"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-rocGroteskMedium ">
                                                Transit Time
                                            </p>
                                            <p className="text-sm font-rocGroteskMedium ">
                                                {instantQuoteDetail?.transitTime}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {instantQuoteDetail?.loadType && (
                                    <div className="flex items-start gap-4">
                                        <div>
                                            <img
                                                src="https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687507358/Web%20App/dashboard/FCL_lskapk.svg"
                                                alt="FCL icon"
                                                width={28}
                                                height={28}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-rocGroteskMedium ">
                                                Load Type
                                            </p>
                                            <p className="text-sm font-rocGroteskMedium ">
                                                {instantQuoteDetail?.loadType === "20" ||
                                                instantQuoteDetail?.loadType === "40"
                                                    ? instantQuoteDetail?.loadType + " FT"
                                                    : instantQuoteDetail?.loadType}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {/* <div className="flex items-start  gap-4">
                                <div>
                                    <img
                                        src="https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687507307/Web%20App/dashboard/box-1-fill_weowpk.svg"
                                        alt="box icon"
                                        width={28}
                                        height={28}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-rocGroteskMedium ">Commodity</p>
                                    <p className="text-sm font-rocGroteskMedium ">
                                        Freight of all kind
                                    </p>
                                </div>
                            </div> */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-[-2px]">
                                        <i
                                            className={`ri-ship-2-fill ${
                                                instantQuoteDetail?.movementMode?.toLowerCase() ===
                                                "ocean"
                                                    ? "ocean-shipment-icon"
                                                    : instantQuoteDetail?.movementMode?.toLowerCase() ===
                                                      "land"
                                                    ? "land-shipment-icon"
                                                    : "air-shipment-icon"
                                            } text-2xl`}
                                        ></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-rocGroteskMedium ">Mode</p>
                                        <p className="text-sm font-rocGroteskMedium capitalize">
                                            {instantQuoteDetail?.movementMode}
                                        </p>
                                    </div>
                                </div>
                                {instantQuoteDetail?.package && (
                                    <div className="flex items-start  gap-4">
                                        <div className="mt-[-2px]">
                                            <i className="ri-ruler-fill before:content-['\f0a2'] text-2xl"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-rocGroteskMedium ">Unit</p>
                                            <p className="text-sm font-rocGroteskMedium ">
                                                {instantQuoteDetail?.package?.measurement === "kg"
                                                    ? "Kilogram (kg)"
                                                    : "Pound (lbs)"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {instantQuoteDetail?.serviceType && (
                                    <div className="flex items-start  gap-4">
                                        <div className="mt-[-2px]">
                                            <i className="ri-arrow-right-up-line before:content-['\ea70'] text-2xl"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-rocGroteskMedium ">
                                                Service type
                                            </p>
                                            <p className="text-sm font-rocGroteskMedium capitalize">
                                                {instantQuoteDetail?.serviceType}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {instantQuoteDetail?.viaPort && (
                                    <div className="flex items-start gap-4">
                                        <div>
                                            <img
                                                src="https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687507358/Web%20App/dashboard/Frame_eeiedu.svg"
                                                alt="Frame"
                                                width={24}
                                                height={24}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-rocGroteskMedium ">
                                                Via Port
                                            </p>
                                            <p className="text-sm font-rocGroteskMedium ">
                                                {instantQuoteDetail?.viaPort}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {instantQuoteDetail?.movementType && (
                                    <div className="flex items-start gap-4">
                                        <div className="mt-[-2px]">
                                            <i className="ri-flashlight-fill before:content-['\ed3c'] text-2xl"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-rocGroteskMedium ">
                                                Mode of movement
                                            </p>
                                            <p className="text-sm font-rocGroteskMedium capitalize">
                                                {instantQuoteDetail?.movementType}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <hr className="max-lg:block hidden my-8" />
                        <div className="max-lg:block hidden">
                            <div className="mb-6">
                                <p className="text-base font-rocGroteskBold ">Validity period</p>
                            </div>
                            <div className="mb-5">
                                <p className="mb-1 text-sm font-rocGroteskMedium">From</p>
                                <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                    {timeFrom}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-sm font-rocGroteskMedium">To</p>
                                <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                    {timeto}
                                </p>
                            </div>
                        </div>
                        <hr className=" my-8" />
                        <div className="">
                            <div className="mb-8">
                                <p className="text-lg font-rocGroteskBold">Price breakdown</p>
                            </div>
                            <div>
                                {instantQuoteDetail?.charges?.map((priceBreakdown, idx) => {
                                    return priceBreakdown?.charges?.length > 0 ? (
                                        <div key={idx}>
                                            <div>
                                                <p className="text-base font-rocGroteskBold mb-4">
                                                    {priceBreakdown?.name}
                                                </p>
                                                {priceBreakdown?.charges?.map((charge) => {
                                                    return (
                                                        <div
                                                            className="flex justify-between mb-4"
                                                            key={charge?._id}
                                                        >
                                                            <p className="text-sm font-rocGroteskMedium">
                                                                {charge?.description}
                                                            </p>
                                                            <p className="text-sm font-rocGroteskMedium text-right">
                                                                {getCurrencyFromCurrencyCode(
                                                                    charge?.currency
                                                                )}
                                                                {formatMoney().format(
                                                                    charge?.amount?.toFixed(2)
                                                                )}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <hr className=" my-8" />
                                        </div>
                                    ) : null;
                                })}
                                <div className="flex justify-between mb-8">
                                    <p className="text-lg font-rocGroteskBold">Price</p>
                                    <p className="text-lg font-rocGroteskBold text-right">
                                        {getCurrencyFromCurrencyCode(currency)}
                                        {formatMoney().format(getTotalPrice()?.toFixed(2))}{" "}
                                        {currency}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="mb-[120px]" />
                        {showAdditionalServices?.includes(true) && (
                            <div>
                                <p className="text-lg font-rocGroteskBold mb-4">
                                    Additonal services
                                </p>
                                <div>
                                    {instantQuoteDetail?.additionalServices?.customsClearance && (
                                        <div className="py-4 flex gap-4">
                                            <i className="ri-medal-fill before:content-['\ef27'] text-[32px] mt-[-4px]"></i>
                                            <div>
                                                <p className="text-base font-rocGroteskMedium">
                                                    Customs clearance
                                                </p>
                                                <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                                    Do you need customs clearance?
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {instantQuoteDetail?.additionalServices?.insurance && (
                                        <div className="py-4 flex gap-4">
                                            <i className="ri-heart-add-fill before:content-['\ee0c'] text-[32px] mt-[-4px]"></i>
                                            <div>
                                                <p className="text-base font-rocGroteskMedium">
                                                    Insurance
                                                </p>
                                                <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                                    Do you need Insurance?
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {instantQuoteDetail?.additionalServices?.inspectionService && (
                                        <div className="py-4 flex gap-4">
                                            <i className="ri-nurse-fill before:content-['\efab'] text-[32px] mt-[-4px]"></i>
                                            <div>
                                                <p className="text-base font-rocGroteskMedium">
                                                    Inspection service
                                                </p>
                                                <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                                    Do you need Inspection service?
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {showAdditionalServices?.includes(true) && <hr className="my-8" />}
                        {instantQuoteDetail?.remarks && (
                            <div>
                                <p className="text-lg font-rocGroteskBold mb-4">Remarks</p>
                                <div>
                                    <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                        Shipping Quote Terms and Conditions
                                    </p>
                                    <div
                                        className="my-4 text-sm !text-mvx-neutral font-rocGroteskMedium"
                                        dangerouslySetInnerHTML={{
                                            __html: instantQuoteDetail?.remarks,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        {ffProfile?.result?._id !== instantQuoteDetail?.freightForwarderId && (
                            <button
                                className="flex items-center justify-center text-white bg-pacific-cyan font-rocGroteskMedium w-full py-3 px-6 mt-6 text-sm rounded mb-4"
                                type={"button"}
                                onClick={() => {
                                    openModal("create_quote", {
                                        directStepNo: 1,
                                        forCustomer: true,
                                        instantQuoteId: instantQuoteDetail?._id,
                                    });
                                }}
                            >
                                Create quote
                            </button>
                        )}
                    </div>
                    <div className="w-[36%] max-lg:w-full">
                        <div className="p-6 rounded-[8px] bg-white max-lg:py-4 max-lg:px-0 max-lg:bg-transparent max-lg:shadow-none shadow-[0px_4px_32px_0px_rgba(0,0,0,0.06),0px_0px_4px_0px_rgba(0,0,0,0.04)]">
                            <div className="max-lg:flex w-full max-lg:flex-row-reverse max-lg:justify-between max-lg:items-center">
                                <div className="w-16 h-16 max-lg:w-10 max-lg:h-10 flex items-center justify-center bg-mvx-light-blue mb-6 max-lg:mb-0">
                                    <i className="ri-building-4-fill text-[36px] max-lg:text-[20px]"></i>
                                </div>
                                <div>
                                    <p className="text-lg font-rocGroteskBold">
                                        {instantQuoteDetail?.carrierName
                                            ? instantQuoteDetail?.carrierName
                                            : instantQuoteDetail?.freightForwarder?.profile
                                                  ?.businessName}
                                    </p>
                                    <p className="flex gap-1">
                                        <span className="text-sm font-rocGroteskMedium">
                                            Verified freight forwarder
                                        </span>
                                        <span>
                                            <img
                                                src="https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687441433/Web%20App/dashboard/verified_mark_sharp_lkklfw.svg"
                                                alt="verified check mark"
                                                width={16}
                                                height={16}
                                            />
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <hr className="my-6 max-lg:hidden" />
                            <div className="flex max-lg:hidden justify-between mb-4">
                                <p className="text-sm font-rocGroteskMedium">Status</p>
                                <p className="flex gap-2 items-center">
                                    <span
                                        className={`material-icons text-[8px]`}
                                        style={{
                                            color: instantQuoteDetail?.active
                                                ? "#16C6A4"
                                                : "#FF6224",
                                        }}
                                    >
                                        fiber_manual_record
                                    </span>
                                    <span className="text-sm font-rocGroteskMedium">
                                        {instantQuoteDetail?.active ? "Active" : "Pending"}
                                    </span>
                                </p>
                            </div>
                            <div className="flex max-lg:hidden justify-between mb-4">
                                <p className="text-sm font-rocGroteskMedium">From</p>
                                <p className="text-sm font-rocGroteskMedium">{timeFrom}</p>
                            </div>
                            <div className="flex max-lg:hidden justify-between mb-4">
                                <p className="text-sm font-rocGroteskMedium">To</p>
                                <p className="text-sm font-rocGroteskMedium">{timeto}</p>
                            </div>
                            <hr className="my-6 max-lg:hidden" />
                            <div className="flex max-lg:hidden justify-between">
                                <p className="text-base font-rocGroteskBold">Price</p>
                                <p className="text-base font-rocGroteskBold">
                                    {getCurrencyFromCurrencyCode(currency)}
                                    {formatMoney().format(getTotalPrice()?.toFixed(2))} {currency}
                                </p>
                            </div>
                            {ffProfile?.result?._id === instantQuoteDetail?.freightForwarderId && (
                                <div className="mt-6 max-lg:hidden">
                                    <button
                                        className="flex items-center justify-center text-white bg-pacific-cyan font-rocGroteskMedium w-full py-2 px-4 text-sm rounded mb-4"
                                        type={"button"}
                                        onClick={() => {
                                            setEditRateModal(true);
                                        }}
                                    >
                                        Edit rate
                                    </button>
                                    <p className="text-sm font-rocGroteskMedium text-mvx-neutral text-center cursor-pointer">
                                        Share rate
                                    </p>
                                </div>
                            )}
                        </div>
                        <hr className="max-lg:block hidden mt-" />
                    </div>
                </div>
                <div className="fixed bottom-0 w-full hidden max-lg:flex gap-2.5 bg-white border-t-[4px] border-mvx-light-blue py-4 px-6 items-center justify-between">
                    <button
                        className="flex items-center justify-center text-gun-metal bg-mvx-light-blue font-rocGroteskMedium w-full py-3 px-6 text-sm rounded "
                        type={"button"}
                    >
                        Share rate
                    </button>
                    <button
                        className="flex items-center justify-center text-white bg-pacific-cyan font-rocGroteskMedium w-full py-3 px-6 text-sm rounded "
                        type={"button"}
                        onClick={() => {
                            setEditRateModal(true);
                        }}
                    >
                        Edit rate
                    </button>
                </div>
            </div>
            {/* {createQuote && (
                <CreateQuote

                />
            )} */}
            {editRateModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[60%] h-[80%] max-lg:w-[95%] max-sm:w-full"
                    closeModal={() => {
                        dispatch(rateActions.resetFFUpdateRateSuccess());
                        getDefaultValues();
                        setActiveTap(0);
                        setEditRateModal(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow h-full">
                        <div className="flex h-full">
                            <div className="w-[32%] max-sm:hidden border-r">
                                <div className="p-6">
                                    <p className="text-sm font-rocGroteskMedium">Edit rate</p>
                                </div>
                                <div>
                                    {editModalContent?.map((content, idx) => {
                                        return (
                                            <p
                                                key={content?.title + idx}
                                                className={`text-sm font-rocGroteskMedium py-2 px-6 cursor-pointer ${
                                                    activeTab === idx
                                                        ? "bg-mvx-light-blue text-gun-metal"
                                                        : "text-mvx-neutral"
                                                }`}
                                                onClick={() => setActiveTap(idx)}
                                            >
                                                {content?.title}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="w-[68%] max-sm:w-full">
                                <div className="px-6 pt-6 pb-4 border-b w-full flex justify-between gap-2 max-sm:px-4 items-center">
                                    <p className="text-lg font-rocGroteskBold max-sm:hidden block">
                                        {editModalContent?.[activeTab]?.title}
                                    </p>

                                    <div className="flex items-center max-sm:block hidden gap-3 w-full relative">
                                        <div
                                            onClick={() => {
                                                const element = document.getElementById("tabs");
                                                element.scrollLeft -= 150;
                                            }}
                                            className="w-6 h-6 flex items-center justify-center rounded bg-mvx-light-blue absolute left-0 top-0"
                                        >
                                            <i className="ri-arrow-drop-left-line text-lg"></i>
                                        </div>
                                        <div
                                            id="tabs"
                                            className="flex items-center max-w-[80%] mx-8 gap-2 overflow-auto scroll-smooth scrollbar-hide relative"
                                        >
                                            {editModalContent.map((content, idx) => {
                                                return (
                                                    <p
                                                        onClick={() => setActiveTap(idx)}
                                                        className={`text-sm font-rocGroteskMedium px-1.5 pb-1 whitespace-nowrap ${
                                                            activeTab === idx &&
                                                            "border-b-[2px] border-gun-metal"
                                                        }`}
                                                    >
                                                        {content?.title}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                        <div
                                            onClick={() => {
                                                const element = document.getElementById("tabs");
                                                element.scrollLeft += 150;
                                            }}
                                            className="w-6 h-6 flex items-center justify-center rounded bg-mvx-light-blue absolute right-0 top-0"
                                        >
                                            <i className="ri-arrow-drop-right-line text-lg"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative h-[calc(100%-69px)] ">
                                    <div className="p-6 overflow-auto h-[calc(100%-80px)] max-sm:px-4">
                                        {editModalContent?.[activeTab]?.component}
                                    </div>

                                    <div className="absolute bottom-0 w-full">
                                        <hr />
                                        <div className="flex">
                                            <button
                                                type="button"
                                                className={`uppercase w-full rounded-t-none rounded-br-none rounded-bl-lg text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-r px-3`}
                                                onClick={() => {
                                                    setEditRateModal(false);
                                                    getDefaultValues();
                                                    setActiveTap(0);
                                                    dispatch(
                                                        rateActions.resetFFUpdateRateSuccess()
                                                    );
                                                }}
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    saveChanges();
                                                }}
                                                className={`uppercase w-full rounded-t-none rounded-bl-none rounded-br-lg text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 px-3`}
                                            >
                                                {FFUpdateRateLoading ? (
                                                    <Loader size={4} color={"gun-metal"} />
                                                ) : (
                                                    "save changes"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default InstantQuoteDetail;
