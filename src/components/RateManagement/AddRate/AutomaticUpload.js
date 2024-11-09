/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import moment from "moment";
import ModalContainer from "components/common/ModalContainer";
import { useNavigate } from "react-router-dom";
import Loader from "components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { rateActions } from "actions";
import ReactCountryFlag from "react-country-flag";
import { flattenDeep, reduce, truncate } from "lodash";
import { getCurrencyFromCurrencyCode } from "helpers";
import countries from "variables/countries";
import { formatMoney } from "helpers/formatMoney";
import RouteDetail from "./ManualUpload/RouteDetail";
import CargoDetails from "./ManualUpload/CargoDetails";
import MovementType from "./ManualUpload/MovementType";
import LoadType from "./ManualUpload/LoadType";
import OriginCharges from "./ManualUpload/OriginCharges";
import FreightCharges from "./ManualUpload/FreightCharges";
import ImportCharges from "./ManualUpload/ImportCharges";
import DestinationCharges from "./ManualUpload/DestinationCharges";
import RateDuration from "./ManualUpload/RateDuration";
import AdditionalServices from "./ManualUpload/AdditionalServices";
import { toast } from "react-hot-toast";
import CustomToast from "components/common/CustomToast";
import SelectInput from "components/common/SelectInput";

const AutomaticUpload = ({ setActiveSection }) => {
    const [editRateModal, setEditRateModal] = useState(false);
    const [deleteRateModal, setDeleteRateModal] = useState(false);
    const [selectedRate, setSelectedRate] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [docProcessed, setDocProcessed] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [formattedRates, setFormattedRates] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeStep, setActiveStep] = useState(0);
    const [activeTab, setActiveTap] = useState(0);
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

    const {
        FFAddMultipleRatesLoading,
        FFAddMultipleRatesSuccess,
        getPortsForRateTemplateSuccess,
        getProductsForRateTemplateSuccess,
    } = useSelector((state) => state.rate);

    const { ffProfile } = useSelector((state) => state.auth);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        setOpenModal(true);

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const rateWorksheet = workbook.Sheets[workbook.SheetNames[1]];
            const chargesWorksheet = workbook.Sheets[workbook.SheetNames[2]];

            const ratesJsonData = XLSX.utils.sheet_to_json(rateWorksheet, { header: 1 });
            const chargesJsonData = XLSX.utils.sheet_to_json(chargesWorksheet, { header: 1 });

            // Do something with the parsed data
            const getFilledRatesRows = ratesJsonData?.filter(
                (rate) => rate?.length > 10 && rate?.length < 20
            );
            const getFilledChargesRows = chargesJsonData?.filter(
                (charge, idx) => idx !== 0 && charge?.length > 5
            );

            const allProducts = getFilledRatesRows?.map((rate) => rate?.[11]);
            const allPorts = getFilledRatesRows
                ?.map((rate) => ({
                    origin: rate?.[2],
                    destination: rate?.[3],
                }))
                ?.filter((value) => value.origin && value.destination);

            dispatch(rateActions.getProductsForRateTemplate({ products: allProducts }));
            dispatch(rateActions.getPortsForRateTemplate({ ports: allPorts }));

            if (getFilledRatesRows && getFilledRatesRows?.length > 0) {
                const formatRates = getFilledRatesRows?.map((rate, index) => {
                    const rateCharges = getFilledChargesRows?.filter(
                        (charge) => charge?.slice(-1)?.[0] === rate?.[0]
                    );

                    const formatMovementType = rate?.[6]?.toLowerCase()?.split("-");
                    formatMovementType.splice(1, 0, "to");

                    const obj = {
                        originPort: rate?.[2],
                        destinationPort: rate?.[3],
                        serviceType: rate?.[4],
                        movementMode: rate?.[5],
                        movementType: formatMovementType?.join("-"),
                        loadType:
                            rate?.[1]?.toLowerCase() === "20ft"
                                ? "20"
                                : rate?.[1]?.toLowerCase() === "40ft"
                                ? "40"
                                : rate?.[1]?.toLowerCase() === "non-container"
                                ? "noncontainers"
                                : rate?.[1],
                        departure: rate?.[7] ? moment(rate?.[7])?.format("YYYY-MM-DD") : "",

                        product: [
                            {
                                name: rate?.[10],
                                code: "",
                            },
                        ],
                        validity: {
                            from:
                                rate?.[7] && typeof rate?.[7] !== "number"
                                    ? moment(rate?.[7])?.format("YYYY-MM-DD")
                                    : "",
                            to:
                                rate?.[8] && typeof rate?.[8] !== "number"
                                    ? moment(rate?.[8])?.format("YYYY-MM-DD")
                                    : "",
                        },

                        additionalServices: {
                            customsClearance: rate?.[14] ?? false,
                            insurance: rate?.[15] ?? false,
                            inspectionService: rate?.[16] ?? false,
                        },
                        remarks: rate?.[13],
                    };

                    if (obj.loadType === "noncontainers") {
                        obj.package = {
                            packageType: rate?.[9],
                            measurement: rate?.[12]?.toLowerCase(),
                        };
                    } else {
                        obj.container = rate?.[1]?.toLowerCase()[0] + rate?.[1]?.toLowerCase()[1];
                    }

                    if (rateCharges?.length > 0) {
                        const chargeArray = [];
                        const originCharges = rateCharges?.filter(
                            (charge) => charge?.[0]?.toLowerCase() === "origin"
                        );
                        const destinationCharges = rateCharges?.filter(
                            (charge) => charge?.[0]?.toLowerCase() === "destination"
                        );
                        const freightCharges = rateCharges?.filter(
                            (charge) => charge?.[0]?.toLowerCase() === "freight"
                        );
                        const documentationCharges = rateCharges?.filter(
                            (charge) => charge?.[0]?.toLowerCase() === "documentation"
                        );

                        const origin = {
                            name: "Origin-Charges",
                            charges: originCharges?.map((value) => ({
                                description: value?.[1],
                                currency: value?.[2],
                                amount: value?.[3],
                                measurement:
                                    obj.loadType === "noncontainers"
                                        ? rate?.[12]?.toLowerCase()
                                        : obj.loadType,
                            })),
                        };
                        const destination = {
                            name: "Destination-Charges",
                            charges: destinationCharges?.map((value) => ({
                                description: value?.[1],
                                currency: value?.[2],
                                amount: value?.[3],
                                measurement:
                                    obj.loadType === "noncontainers"
                                        ? rate?.[12]?.toLowerCase()
                                        : obj.loadType,
                            })),
                        };
                        const freight = {
                            name: "Freight-Charges",
                            charges: freightCharges?.map((value) => ({
                                description: value?.[1],
                                currency: value?.[2],
                                amount: value?.[3],
                                measurement:
                                    obj.loadType === "noncontainers"
                                        ? rate?.[12]?.toLowerCase()
                                        : obj.loadType,
                            })),
                        };
                        const documentation = {
                            name: "Documentation-Charges",
                            charges: documentationCharges?.map((value) => ({
                                description: value?.[1],
                                currency: value?.[2],
                                amount: value?.[3],
                                measurement:
                                    obj.loadType === "noncontainers"
                                        ? rate?.[12]?.toLowerCase()
                                        : obj.loadType,
                            })),
                        };

                        chargeArray.push(origin, destination, freight, documentation);
                        obj.charges = chargeArray;
                    }

                    return obj;
                });

                setFormattedRates(formatRates);
            } else {
                setFormattedRates([]);
                setOpenModal(false);
                setDocProcessed(true);
            }
        };

        reader?.readAsArrayBuffer?.(file);
    };

    const getDefaultValues = (uploadedSheetData) => {
        setAddress({
            originCode: uploadedSheetData?.originPort,
            originName: uploadedSheetData?.originPortName,
            destinationCode: uploadedSheetData?.destinationPort,
            destinationName: uploadedSheetData?.destinationPortName,
        });
        setCargDetails({
            product: uploadedSheetData?.product?.[0]?.name,
            productCode: uploadedSheetData?.product?.[0]?.code,
            serviceType: uploadedSheetData?.serviceType,
            movementMode: uploadedSheetData?.movementMode,
        });
        setMovementType(uploadedSheetData?.movementType);
        setLoadType({
            type:
                uploadedSheetData?.loadType === "40" || uploadedSheetData?.loadType === "20"
                    ? "container"
                    : "noncontainers",
            content: {
                type:
                    uploadedSheetData?.loadType === "40" || uploadedSheetData?.loadType === "20"
                        ? uploadedSheetData?.loadType
                        : uploadedSheetData?.package?.packageType,
                measurement:
                    uploadedSheetData?.loadType === "40" || uploadedSheetData?.loadType === "20"
                        ? uploadedSheetData?.loadType
                        : uploadedSheetData?.package?.measurement,
            },
        });
        setSelectedCurrency(
            uploadedSheetData?.charges?.find((value) => {
                const name = value?.name?.toLowerCase()?.split("-")?.[0];
                return name === "origin";
            })?.charges?.[0]?.currency ?? "USD"
        );
        setOriginCharges(
            uploadedSheetData?.charges
                ?.find((value) => {
                    const name = value?.name?.toLowerCase()?.split("-")?.[0];
                    return name === "origin";
                })
                ?.charges?.map((charge) => ({
                    label: charge?.description,
                    amount: charge?.amount ?? 0,
                    currency: charge?.currency,
                    default: true,
                })) ?? []
        );
        setFreightCharges(
            uploadedSheetData?.charges
                ?.find((value) => {
                    const name = value?.name?.toLowerCase()?.split("-")?.[0];
                    return name === "freight";
                })
                ?.charges?.map((charge) => ({
                    label: charge?.description,
                    amount: charge?.amount ?? 0,
                    currency: charge?.currency,
                    default: true,
                })) ?? []
        );
        setImportCharges(
            uploadedSheetData?.charges
                ?.find((value) => {
                    const name = value?.name?.toLowerCase()?.split("-")?.[0];
                    return name === "documentation";
                })
                ?.charges?.map((charge) => ({
                    label: charge?.description,
                    amount: charge?.amount ?? 0,
                    currency: charge?.currency,
                    default: true,
                })) ?? []
        );
        setDestinationCharges(
            uploadedSheetData?.charges
                ?.find((value) => {
                    const name = value?.name?.toLowerCase()?.split("-")?.[0];
                    return name === "destination";
                })
                ?.charges?.map((charge) => ({
                    label: charge?.description,
                    amount: charge?.amount ?? 0,
                    currency: charge?.currency,
                    default: true,
                })) ?? []
        );
        setDate([uploadedSheetData?.validity?.from, uploadedSheetData?.validity?.to]);
        setTerms(uploadedSheetData?.remarks);
        setAdditionalServices({
            customs: uploadedSheetData?.additionalServices?.customsClearance,
            insurance: uploadedSheetData?.additionalServices?.insurance,
            inspection: uploadedSheetData?.additionalServices?.inspectionService,
        });
    };

    const handlePublish = () => {
        const rates = formattedRates.map((value) => {
            const {
                portOfOrigin,
                portOfDestination,
                originPortName,
                destinationPortName,

                ...rest
            } = value;
            return {
                ...rest,
            };
        });

        dispatch(
            rateActions.FFAddMultipleRates({
                rates: rates,
            })
        );
    };

    const saveChanges = () => {
        const body = {
            originPort: address?.originCode,
            destinationPort: address?.destinationCode,
            originPortName: address?.originName,
            destinationPortName: address?.destinationName,
            serviceType: cargDetails?.serviceType,
            movementMode: cargDetails?.movementMode,
            movementType: movementType,
            loadType: loadType?.type === "container" ? loadType.content.type : loadType.type,
            charges: [
                {
                    name: "Origin-Charges",
                    charges: originCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge, idx) => {
                            return {
                                currency: charge?.currency,
                                amount: Number(charge?.amount),
                                description: charge?.label,
                                measurement: loadType?.content?.measurement,
                            };
                        }),
                },
                {
                    name: "Freight-Charges",
                    charges: freightCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge, idx) => {
                            return {
                                currency: charge?.currency,
                                amount: Number(charge?.amount),
                                description: charge?.label,
                                measurement: loadType?.content?.measurement,
                            };
                        }),
                },
                {
                    name: "Destination-Charges",
                    charges: destinationCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge, idx) => {
                            return {
                                currency: charge?.currency,
                                amount: Number(charge?.amount),
                                description: charge?.label,
                                measurement: loadType?.content?.measurement,
                            };
                        }),
                },
                {
                    name: "Documentation-Charges",
                    charges: importCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge, idx) => {
                            return {
                                currency: charge?.currency,
                                amount: Number(charge?.amount),
                                description: charge?.label,
                                measurement: loadType?.content?.measurement,
                            };
                        }),
                },
            ],
            validity: {
                from: Boolean(dateRange?.[0]) ? moment(dateRange?.[0])?.format("YYYY-MM-DD") : "",
                to: Boolean(dateRange?.[0]) ? moment(dateRange?.[1])?.format("YYYY-MM-DD") : "",
            },
            product: [
                {
                    name: cargDetails?.product,
                    code: String(cargDetails?.productCode),
                },
            ],
            additionalServices: {
                customsClearance: additionalServices?.customs,
                insurance: additionalServices?.insurance,
                inspectionService: additionalServices?.inspection,
            },
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

        const formattedRateCopy = [...formattedRates];

        formattedRateCopy[selectedRate] = body;
        setFormattedRates(formattedRateCopy);
        setEditRateModal(false);
        setActiveTap(0);
    };

    const isPublishable = () => {
        const emptyFields = formattedRates?.map((value) => {
            const compulsoryFields = {
                destinationPort: value?.destinationPort,
                loadType: value?.loadType,
                movementMode: value?.movementMode,
                movementType: value?.movementType,
                originPort: value?.originPort,
                serviceType: value?.serviceType,
                durationFrom: value?.validity?.from,
                durationTo: value?.validity?.to,
                productName: value?.product?.[0]?.name,
                productCode: value?.product?.[0]?.code,
            };

            const getGetFieldsValue = Object.entries(compulsoryFields)?.map(([field, value]) => {
                if (!Boolean(value)) {
                    return field?.toLowerCase();
                } else {
                    return "";
                }
            });

            const requiredMissingFields = getGetFieldsValue?.filter((str) => str !== "");

            return requiredMissingFields;
        });

        return emptyFields;
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

    useEffect(() => {
        let ratesCopy = [...formattedRates];
        if (getProductsForRateTemplateSuccess) {
            ratesCopy.forEach((rate, index) => {
                rate.product = [
                    {
                        code: String(
                            getProductsForRateTemplateSuccess?.products?.[index]?.[0]?.productCode
                        ),
                        name: getProductsForRateTemplateSuccess?.products?.[index]?.[0]
                            ?.Description,
                    },
                ];
            });
            setFormattedRates(ratesCopy);
            dispatch(rateActions.resetGetProductsForRateTemplateSuccess());
        }

        if (getPortsForRateTemplateSuccess) {
            ratesCopy.forEach((rate, index) => {
                rate.portOfOrigin = {
                    country: getPortsForRateTemplateSuccess?.ports?.[index]?.origin?.[0]?.country,
                };
                rate.portOfDestination = {
                    country:
                        getPortsForRateTemplateSuccess?.ports?.[index]?.destination?.[0]?.country,
                };
                rate.originPortName =
                    getPortsForRateTemplateSuccess?.ports?.[index]?.origin?.[0]?.portName;
                rate.destinationPortName =
                    getPortsForRateTemplateSuccess?.ports?.[index]?.destination?.[0]?.portName;
                setFormattedRates(ratesCopy);
            });
            // setEditRateModal(false);
            // setActiveTap(0);
            dispatch(rateActions.resetGetPortsForRateTemplateSuccess());
        }

        if (getProductsForRateTemplateSuccess && getPortsForRateTemplateSuccess) {
            // setProcessingSheet(false);
            setOpenModal(false);
            setDocProcessed(true);
        }
    }, [
        dispatch,
        formattedRates,
        getPortsForRateTemplateSuccess,
        getProductsForRateTemplateSuccess,
    ]);

    useEffect(() => {
        if (Boolean(FFAddMultipleRatesSuccess)) {
            setOpenModal(false);
            setOpenSuccessModal(true);
            dispatch(rateActions.resetFFAddMultipleRatesSuccess());
        }
    }, [dispatch, FFAddMultipleRatesSuccess]);

    return (
        <>
            <div className="px-[104px] py-[72px] max-lg:px-10 max-sm:px-4">
                <div className="w-1/2 pr-[40px] max-sm:pr-0 max-lg:w-[78%] max-sm:w-full">
                    <div
                        className="flex items-center gap-1.5 mb-6 cursor-pointer"
                        onClick={() => setActiveSection(0)}
                    >
                        <i className="ri-arrow-left-line mt-[-2px]"></i>
                        <span className="text-sm font-rocGroteskMedium">Back</span>
                    </div>
                    <div className="mb-8">
                        <i className="ri-file-list-3-fill text-5xl"></i>
                        <p className="text-2xl font-rocGroteskBold mt-4">
                            Go digital completely! Add your offline <br /> rates to Fleet+ start
                            making money
                        </p>
                    </div>
                    <div className="mb-8">
                        <p className="text-sm font-rocGroteskBold mb-1">
                            1. Download the Excel template
                        </p>
                        <p className="text-sm font-rocGroteskMedium text-mvx-neutral mb-4 w-[75%]">
                            This template includes the columns necessary to import your other rate
                            into your Fleet+.
                        </p>
                        <button
                            className="flex items-center justify-center text-gun-metal bg-mvx-light-blue font-rocGroteskMedium w-fit py-2.5 gap-2 px-4 text-sm rounded mb-4"
                            type={"button"}
                            onClick={() => {
                                fetch(
                                    "https://res.cloudinary.com/dvxi7qcmd/raw/upload/v1689525193/Web%20App/rate_template_sheet/Rate_Templates_jocjgo.xlsx"
                                ).then((response) => {
                                    response.blob().then((blob) => {
                                        // Creating new object of PDF file
                                        const fileURL = window.URL.createObjectURL(blob);

                                        let alink = document.createElement("a");
                                        alink.href = fileURL;
                                        alink.download = "Fleet+ Rate Template";
                                        alink.click();
                                    });
                                });
                            }}
                        >
                            <i className="ri-download-cloud-2-line"></i>
                            <span className="text-inherit">
                                Download Fleet+ Rate Excel Sheet Template
                            </span>
                        </button>
                    </div>
                    <div className="mb-8">
                        <p className="text-sm font-rocGroteskBold mb-1">
                            2. Add your rate and upload.
                        </p>
                        <p className="text-sm font-rocGroteskMedium text-mvx-neutral mb-4 w-[75%]">
                            Fill out the downloaded template without changing any of the existing
                            details inside. Then upload it here
                        </p>
                        <input
                            type="file"
                            name="uploadSheet"
                            id="uploadSheet"
                            onChange={(event) => {
                                if (event && event?.target?.files?.[0]) {
                                    handleFileUpload(event);
                                }
                            }}
                            hidden
                            accept=".numbers, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        />
                        <button
                            className="flex items-center justify-center text-gun-metal bg-mvx-light-blue font-rocGroteskMedium w-fit py-2.5 gap-2 px-4 text-sm rounded mb-4"
                            type={"button"}
                            onClick={() => {
                                document.getElementById("uploadSheet").click();
                            }}
                        >
                            <i className="ri-upload-2-line"></i>
                            <span className="text-inherit">Select Excel Sheet to Upload</span>
                        </button>
                    </div>
                </div>
            </div>

            {openModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="flex flex-col p-5 justify-center items-center">
                            <div className="mb-2">
                                <Loader size={6} color={"gun-metal"} />
                            </div>
                            <p className="text-sm font-rocGroteskMedium">
                                Processing Uploaded Document...
                            </p>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {docProcessed && (
                <ModalContainer showCloseIcon={false} tailwindClassName="w-[55%] max-lg:w-[95%] ">
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div>
                            <div className="flex items-start px-6 pt-8 justify-between mb-6">
                                <div>
                                    <p className="text-[22px] font-rocGroteskBold">
                                        {formattedRates?.length > 1
                                            ? `${formattedRates?.length} rates found`
                                            : `${formattedRates?.length} rate found`}
                                    </p>
                                    {formattedRates && formattedRates?.length > 0 && (
                                        <p className="text-sm font-rocGroteskBold">
                                            Select rate to publish
                                        </p>
                                    )}
                                </div>

                                <i
                                    className="ri-close-fill text-2xl cursor-pointer"
                                    onClick={() => {
                                        const uploadElem = document.getElementById("uploadSheet");
                                        uploadElem.value = "";
                                        setDocProcessed(false);
                                    }}
                                ></i>
                            </div>
                            <div className="px-6 max-sm:px-2 max-h-[520px] overflow-auto">
                                {formattedRates.map((value, idx) => {
                                    const originCountry = countries.find(
                                        (country) =>
                                            country.abbreviation?.toLowerCase() ===
                                            value?.portOfOrigin?.country?.toLowerCase()
                                    );
                                    const destinationCountry = countries.find(
                                        (country) =>
                                            country.abbreviation?.toLowerCase() ===
                                            value?.portOfDestination?.country?.toLowerCase()
                                    );

                                    const compulsoryFields = {
                                        destinationPort: value?.destinationPort,
                                        loadType: value?.loadType,
                                        movementMode: value?.movementMode,
                                        movementType: value?.movementType,
                                        originPort: value?.originPort,
                                        serviceType: value?.serviceType,
                                        durationFrom: value?.validity?.from,
                                        durationTo: value?.validity?.to,
                                        productName: value?.product?.[0]?.name,
                                        productCode: value?.product?.[0]?.code,
                                    };

                                    const getGetFieldsValue = Object.entries(compulsoryFields)?.map(
                                        ([field, value]) => {
                                            if (!Boolean(value)) {
                                                return field?.toLowerCase();
                                            } else {
                                                return "";
                                            }
                                        }
                                    );

                                    const requiredMissingFields = getGetFieldsValue?.filter(
                                        (str) => str !== ""
                                    );

                                    const total = reduce(
                                        flattenDeep(
                                            value?.charges?.map(
                                                (charge) =>
                                                    charge?.charges?.map((cost) => cost?.amount) ??
                                                    0
                                            )
                                        ),
                                        function (sum, n) {
                                            return sum + n;
                                        },
                                        0
                                    );

                                    const currencies = flattenDeep(
                                        value?.charges?.map((charge) =>
                                            charge?.charges?.map((cost) => cost?.currency)
                                        )
                                    );

                                    const price = formatMoney()
                                        .format(total ?? 0)
                                        ?.split(".");
                                    const amountPrefix = price?.[0] ?? 0;
                                    const amountSuffix = price?.[1];
                                    return (
                                        <div
                                            className="border rounded-[4px] w-full p-6  mb-4"
                                            key={value._id}
                                        >
                                            <div className=" w-full flex items-center justify-between">
                                                <div>
                                                    <div>
                                                        <div className="max-sm:flex hidden mb-2 items-start">
                                                            <p className="text-xl font-rocGroteskBold text-gun-metal">
                                                                {getCurrencyFromCurrencyCode(
                                                                    currencies?.[0]
                                                                )}
                                                                {amountPrefix ?? 0}.
                                                            </p>
                                                            <p className="text-xs font-rocGroteskBold text-gun-metal">
                                                                {amountSuffix ? amountSuffix : "00"}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1 mb-1">
                                                            {(!originCountry?.name ||
                                                                !destinationCountry?.name) && (
                                                                <i className="ri-home-6-fill"></i>
                                                            )}
                                                            <div className="flex items-center gap-1.5">
                                                                <div>
                                                                    <ReactCountryFlag
                                                                        countryCode={
                                                                            value?.portOfOrigin
                                                                                ?.country
                                                                        }
                                                                        svg
                                                                        style={{
                                                                            borderRadius: "100%",
                                                                            width: "16px",
                                                                            height: "16px",
                                                                            objectFit: "cover",
                                                                        }}
                                                                    />
                                                                </div>
                                                                <p className="text-sm font-rocGroteskBold text-gun-metal mt-[2px]">
                                                                    {originCountry?.name
                                                                        ? truncate(
                                                                              originCountry?.name,
                                                                              {
                                                                                  length: 20,
                                                                              }
                                                                          )
                                                                        : truncate(
                                                                              value?.originPort,
                                                                              {
                                                                                  length: 20,
                                                                              }
                                                                          )}
                                                                </p>
                                                            </div>

                                                            <span className="material-icons text-xs text-gun-metal font-bold">
                                                                arrow_forward
                                                            </span>
                                                            <div className="flex items-center gap-1.5">
                                                                <div>
                                                                    <ReactCountryFlag
                                                                        countryCode={
                                                                            value?.portOfDestination
                                                                                ?.country
                                                                        }
                                                                        svg
                                                                        style={{
                                                                            borderRadius: "100%",
                                                                            width: "16px",
                                                                            height: "16px",
                                                                            objectFit: "cover",
                                                                        }}
                                                                    />
                                                                </div>
                                                                <p className="text-sm font-rocGroteskBold text-gun-metal mt-[2px]">
                                                                    {destinationCountry?.name
                                                                        ? truncate(
                                                                              destinationCountry?.name,
                                                                              {
                                                                                  length: 20,
                                                                              }
                                                                          )
                                                                        : truncate(
                                                                              value?.destinationPort,
                                                                              {
                                                                                  length: 20,
                                                                              }
                                                                          )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <i className="ri-building-4-fill"></i>
                                                            <div className="flex items-center gap-1">
                                                                <p className="text-sm font-rocGroteskBold text-gun-metal">
                                                                    {
                                                                        ffProfile?.result?.profile
                                                                            ?.businessName
                                                                    }
                                                                </p>
                                                                <img
                                                                    src="https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687441433/Web%20App/dashboard/verified_mark_sharp_lkklfw.svg"
                                                                    alt="verified check mark"
                                                                    width={14}
                                                                    height={14}
                                                                />
                                                            </div>
                                                        </div>
                                                        {value?.movementMode && (
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <i
                                                                    className={`ri-ship-2-fill ${
                                                                        value?.movementMode?.toLowerCase() ===
                                                                        "ocean"
                                                                            ? "ocean-shipment-icon"
                                                                            : value?.movementMode?.toLowerCase() ===
                                                                              "land"
                                                                            ? "land-shipment-icon"
                                                                            : "air-shipment-icon"
                                                                    } before:text-mvx-neutral`}
                                                                ></i>
                                                                <p className="text-sm font-rocGroteskMedium text-mvx-neutral capitalize">
                                                                    {value?.movementMode} freight
                                                                </p>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <i className="ri-time-fill before:content-['\f20e'] before:text-mvx-neutral"></i>
                                                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                                                Quote expires:{" "}
                                                                {moment(value?.validity?.to).format(
                                                                    "MMM DD, YYYY"
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="max-sm:flex gap-2 hidden">
                                                            <div>
                                                                <button
                                                                    className="flex items-center justify-center text-white  bg-pacific-cyan font-rocGroteskMedium w-fit py-2.5 px-4 text-sm rounded"
                                                                    type={"button"}
                                                                    onClick={() => {
                                                                        setSelectedRate(idx);
                                                                        getDefaultValues(value);
                                                                        setEditRateModal(true);
                                                                    }}
                                                                >
                                                                    Edit rate
                                                                </button>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    className="flex items-center justify-center text-gun-metal  bg-mvx-light-blue font-rocGroteskMedium w-fit py-2.5 px-4 text-sm rounded"
                                                                    type={"button"}
                                                                    onClick={() => {
                                                                        setSelectedRate(idx);
                                                                        setDeleteRateModal(true);
                                                                    }}
                                                                >
                                                                    Delete rate
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 max-sm:hidden">
                                                    <div className="flex items-start">
                                                        <p className="text-xl font-rocGroteskBold text-gun-metal">
                                                            {getCurrencyFromCurrencyCode(
                                                                currencies?.[0]
                                                            )}
                                                            {amountPrefix ?? 0}.
                                                        </p>
                                                        <p className="text-xs font-rocGroteskBold text-gun-metal">
                                                            {amountSuffix ? amountSuffix : "00"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="flex items-center justify-center text-white  bg-pacific-cyan font-rocGroteskMedium w-[99px] py-1.5 px-3 text-sm rounded"
                                                            type={"button"}
                                                            onClick={() => {
                                                                setSelectedRate(idx);
                                                                getDefaultValues(value);
                                                                setEditRateModal(true);
                                                            }}
                                                        >
                                                            Edit rate
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="flex items-center justify-center text-gun-metal  bg-mvx-light-blue font-rocGroteskMedium w-[99px] py-1.5 px-3 text-sm rounded"
                                                            type={"button"}
                                                            onClick={() => {
                                                                setSelectedRate(idx);
                                                                setDeleteRateModal(true);
                                                            }}
                                                        >
                                                            Delete rate
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {requiredMissingFields &&
                                                requiredMissingFields?.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="text-xs font-rocGroteskMedium text-red-400">
                                                            *Click on edit rate to fill missing
                                                            field(s) -{" "}
                                                            {requiredMissingFields?.join(", ")}
                                                            {"..."}
                                                        </p>
                                                    </div>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                            {formattedRates && formattedRates?.length > 0 && (
                                <div className="py-4 rounded-b-lg bg-white px-6 shadow-[0px_4px_32px_0px_rgba(0,0,0,0.06),0px_0px_4px_0px_rgba(0,0,0,0.04)]">
                                    <button
                                        className="flex items-center justify-center text-white disabled:bg-pacific-cyan/40 bg-pacific-cyan font-rocGroteskMedium w-full py-2 px-4 text-sm rounded"
                                        type={"button"}
                                        disabled={flattenDeep(isPublishable())?.length > 0}
                                        onClick={() => {
                                            handlePublish();
                                        }}
                                    >
                                        {FFAddMultipleRatesLoading ? (
                                            <Loader size={5} color="white" />
                                        ) : formattedRates?.length > 1 ? (
                                            "Publish all rates"
                                        ) : (
                                            "Publish all rate"
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </ModalContainer>
            )}

            {editRateModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[60%] h-[80%] max-lg:w-[95%] max-sm:w-full"
                    closeModal={() => {
                        dispatch(rateActions.resetFFUpdateRateSuccess());
                        // getDefaultValues(selectedRate);
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
                                <div className="relative h-[calc(100%-69px)]">
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
                                                    // getDefaultValues(selectedRate);
                                                    setActiveTap(0);
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
                                                save changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {openSuccessModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        dispatch(rateActions.resetFFAddMultipleRatesSuccess());
                        setOpenSuccessModal(false);
                        navigate(`/dashboard/rate-management`);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 py-8">
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687187488/Web%20App/external_pages/success_q1oaal.svg"
                                }
                                alt="success"
                                className="mb-6 m-auto"
                            />
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Your rates are live!
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Your rates are now live. Your rates are set to daily and you would
                                be able to edit it in 24 hours
                            </p>
                        </div>
                        <hr />
                        <div className="flex">
                            <button
                                type="button"
                                className={`uppercase w-full rounded-t-none rounded-br-none rounded-bl-lg text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-r px-3`}
                                onClick={() => {
                                    console.log("first");
                                    setOpenSuccessModal(false);
                                    navigate(`/dashboard/rate-management`);
                                }}
                            >
                                close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    navigate(`/dashboard/rate-management`);
                                }}
                                className={`uppercase w-full rounded-t-none rounded-bl-none rounded-br-lg text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 px-3`}
                            >
                                View rate
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {deleteRateModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        setDeleteRateModal(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 py-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Are You sure You want to delete this rate?
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                If you click on yes, the selected rate will be removed from the list
                                of rates to be publish from the uploaded sheet
                            </p>
                        </div>
                        <hr />
                        <div className="flex">
                            <button
                                type="button"
                                className={`uppercase w-full rounded-t-none rounded-br-none rounded-bl-lg text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-r px-3`}
                                onClick={() => {
                                    setDeleteRateModal(false);
                                }}
                            >
                                no
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const ratesCopy = [...formattedRates];
                                    ratesCopy.splice(selectedRate, 1);
                                    setFormattedRates(ratesCopy);
                                    toast.custom((t) => (
                                        <CustomToast
                                            t={t}
                                            message={"Rate deleted"}
                                            type="success"
                                        />
                                    ));
                                    setDeleteRateModal(false);
                                }}
                                className={`uppercase w-full rounded-t-none rounded-bl-none rounded-br-lg text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 px-3`}
                            >
                                yes, delete
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </>
    );
};

export default AutomaticUpload;
