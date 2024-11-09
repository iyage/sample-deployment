import React, { useEffect, useState } from "react";
import RouteDetail from "./RouteDetail";
import CargoDetails from "./CargoDetails";
import MovementType from "./MovementType";
import OriginCharges from "./OriginCharges";
import FreightCharges from "./FreightCharges";
import ImportCharges from "./ImportCharges";
import DestinationCharges from "./DestinationCharges";
import RateDuration from "./RateDuration";
import AdditionalServices from "./AdditionalServices";
import ModalContainer from "components/common/ModalContainer";
import moment from "moment";
import LoadType from "./LoadType";
import { useDispatch, useSelector } from "react-redux";
import { rateActions } from "actions";
import { useNavigate } from "react-router-dom";
import LivePreview from "./LivePreview";

const ManualUpload = ({ setActiveSection }) => {
    const [address, setAddress] = useState({
        originCode: "",
        originName: "",
        destinationCode: "",
        destinationName: "",
    });
    const [country, setCountry] = useState({
        origin: "",
        destination: "",
    });
    const [activeStep, setActiveStep] = useState(0);
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
    const [currency, setCurrency] = useState("USD");
    const [originCharges, setOriginCharges] = useState([
        {
            label: "Pickup charges",
            amount: "",
            currency: currency,
            default: true,
        },
        {
            label: "Terminal handling charges (THC)",
            amount: "",
            currency: currency,
            default: true,
        },
        {
            label: "Export charges",
            amount: "",
            currency: currency,
            default: true,
        },
    ]);
    const [freightCharges, setFreightCharges] = useState([
        {
            label: "Ocean freight",
            amount: "",
            currency: currency,
            default: true,
        },
    ]);
    const [importCharges, setImportCharges] = useState([
        {
            label: "",
            amount: "",
            currency: currency,
            default: false,
        },
    ]);
    const [destinationCharges, setDestinationCharges] = useState([
        {
            label: "Shipping import and detention",
            amount: "",
            currency: currency,
            default: true,
        },
        {
            label: "Terminal handling and storage",
            amount: "",
            currency: currency,
            default: true,
        },
        {
            label: "Customs duty",
            amount: "",
            currency: currency,
            default: true,
        },
        {
            label: "Agency",
            amount: "",
            currency: currency,
            default: true,
        },
        {
            label: "Haulage",
            amount: "",
            currency: currency,
            default: true,
        },
        {
            label: "Others cost (Nafdac, SON)",
            amount: "",
            currency: currency,
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
    const [successModal, setSuccessModal] = useState(false);
    const [createdRateId, setCreatedRateId] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { FFCreateRateLoading, FFCreateRateSuccess } = useSelector((state) => state.rate);

    const handleAddRate = () => {
        const body = {
            originPort: address?.originCode,
            destinationPort: address?.destinationCode,
            serviceType: cargDetails?.serviceType,
            movementMode: cargDetails?.movementMode,
            movementType: movementType,
            loadType: loadType?.type === "container" ? loadType.content.type : loadType.type,
            charges: [
                {
                    name: "Origin-Charges",
                    charges: originCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge) => {
                            return {
                                description: charge?.label,
                                currency: currency,
                                amount: Number(charge.amount),
                                measurement: loadType?.content?.measurement,
                            };
                        }),
                },
                {
                    name: "Freight-Charges",
                    charges: freightCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge) => ({
                            description: charge?.label,
                            currency: currency,
                            amount: Number(charge.amount),
                            measurement: loadType?.content?.measurement,
                        })),
                },
                {
                    name: "Destination-Charges",
                    charges: destinationCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge) => ({
                            description: charge?.label,
                            currency: currency,
                            amount: Number(charge.amount),
                            measurement: loadType?.content?.measurement,
                        })),
                },
                {
                    name: "Documentation-Charges",
                    charges: importCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge) => ({
                            description: charge?.label,
                            currency: currency,
                            amount: Number(charge.amount),
                            measurement: loadType?.content?.measurement,
                        })),
                },
            ],
            product: [
                {
                    code: String(cargDetails?.productCode),
                    name: cargDetails?.product,
                },
            ],
            validity: {
                from: moment(dateRange?.[0])?.format("YYYY-MM-DD"),
                to: moment(dateRange?.[1])?.format("YYYY-MM-DD"),
            },
            departure: moment(dateRange?.[1])?.format("YYYY-MM-DD"),
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

        dispatch(rateActions.FFCreateRate(body));
    };

    const displayStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <RouteDetail
                        address={address}
                        setAddress={setAddress}
                        setCountry={setCountry}
                        setActiveSection={setActiveSection}
                    />
                );

            case 1:
                return (
                    <CargoDetails
                        setActiveStep={setActiveStep}
                        cargDetails={cargDetails}
                        setCargDetails={setCargDetails}
                    />
                );

            case 2:
                return (
                    <MovementType
                        setActiveStep={setActiveStep}
                        movementType={movementType}
                        setMovementType={setMovementType}
                    />
                );

            case 3:
                return (
                    <LoadType
                        setActiveStep={setActiveStep}
                        loadType={loadType}
                        setLoadType={setLoadType}
                    />
                );

            case 4:
                return (
                    <OriginCharges
                        setActiveStep={setActiveStep}
                        originCharges={originCharges}
                        setOriginCharges={setOriginCharges}
                        currency={currency}
                        setCurrency={setCurrency}
                    />
                );

            case 5:
                return (
                    <FreightCharges
                        setActiveStep={setActiveStep}
                        freightCharges={freightCharges}
                        setFreightCharges={setFreightCharges}
                        currency={currency}
                        setCurrency={setCurrency}
                    />
                );

            case 6:
                return (
                    <ImportCharges
                        setActiveStep={setActiveStep}
                        importCharges={importCharges}
                        setImportCharges={setImportCharges}
                        currency={currency}
                        setCurrency={setCurrency}
                    />
                );

            case 7:
                return (
                    <DestinationCharges
                        setActiveStep={setActiveStep}
                        destinationCharges={destinationCharges}
                        setDestinationCharges={setDestinationCharges}
                        currency={currency}
                        setCurrency={setCurrency}
                    />
                );

            case 8:
                return (
                    <RateDuration
                        setActiveStep={setActiveStep}
                        dateRange={dateRange}
                        setDate={setDate}
                        terms={terms}
                        setTerms={setTerms}
                    />
                );

            case 9:
                return (
                    <AdditionalServices
                        setActiveStep={setActiveStep}
                        additionalServices={additionalServices}
                        setAdditionalServices={setAdditionalServices}
                        handleAddRate={handleAddRate}
                        loading={FFCreateRateLoading}
                    />
                );

            default:
                return (
                    <RouteDetail
                        address={address}
                        setAddress={setAddress}
                        setActiveStep={setActiveStep}
                        setActiveSection={setActiveSection}
                    />
                );
        }
    };

    const livePreviewData = () => {
        const data = {
            portOfOrigin: {
                country: country.origin,
            },
            portOfDestination: {
                country: country.destination,
            },
            serviceType: cargDetails?.serviceType,
            movementMode: cargDetails.movementMode,
            movementType: movementType,
            loadType: loadType?.type === "container" ? loadType?.content?.type : loadType?.type,
            remarks: terms,
            additionalServices: {
                customsClearance: additionalServices?.customs,
                insurance: additionalServices?.insurance,
                inspectionService: additionalServices?.inspection,
            },

            validity: {
                from: moment(dateRange?.[0])?.format("YYYY-MM-DD"),
                to: moment(dateRange?.[1])?.format("YYYY-MM-DD"),
            },
            charges: [
                {
                    name: "Origin-Charges",
                    charges: originCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge) => {
                            return {
                                description: charge?.label,
                                currency: currency,
                                amount: Number(charge.amount),
                                measurement: loadType?.content?.measurement,
                            };
                        }),
                },
                {
                    name: "Freight-Charges",
                    charges: freightCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge) => ({
                            description: charge?.label,
                            currency: currency,
                            amount: Number(charge.amount),
                            measurement: loadType?.content?.measurement,
                        })),
                },
                {
                    name: "Destination-Charges",
                    charges: destinationCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge) => ({
                            description: charge?.label,
                            currency: currency,
                            amount: Number(charge.amount),
                            measurement: loadType?.content?.measurement,
                        })),
                },
                {
                    name: "Documentation-Charges",
                    charges: importCharges
                        ?.filter((value) => Boolean(value.label) && Boolean(value.amount))
                        ?.map((charge) => ({
                            description: charge?.label,
                            currency: currency,
                            amount: Number(charge.amount),
                            measurement: loadType?.content?.measurement,
                        })),
                },
            ],
        };

        if (data.loadType === "noncontainers") {
            data.package = {
                packageType: loadType?.content?.type,
                measurement: loadType?.content?.measurement,
            };
        } else {
            data.container = loadType.content?.measurement;
        }

        return data;
    };

    useEffect(() => {
        if (Boolean(FFCreateRateSuccess)) {
            setSuccessModal(Boolean(FFCreateRateSuccess));
            setCreatedRateId(FFCreateRateSuccess?.rate?._id);
            dispatch(rateActions.resetFFCreateRateSuccess());
        }
    }, [dispatch, FFCreateRateSuccess]);

    useEffect(() => {
        const preview = document.getElementById("previewContainer");
        if (activeStep >= 4) {
            preview?.scrollBy({
                top: 450,
                behavior: "smooth",
            });
        } else {
            preview?.scrollBy({
                top: -600,
                behavior: "smooth",
            });
        }
    }, [activeStep]);

    return (
        <>
            <div className="w-full flex h-[calc(100vh-72px)] overflow-hidden">
                <div className="w-[50%] max-lg:w-full max-lg:px-10 max-sm:px-4 pr-[4%] pl-[104px] py-[72px] overflow-y-auto scrollbar-hide">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (activeStep < 9) {
                                setActiveStep((prev) => prev + 1);
                            } else {
                                handleAddRate();
                            }
                        }}
                        className="w-full"
                    >
                        {displayStep()}
                    </form>
                </div>

                <div className="w-[50%] h-full bg-[#FAFBFC] px-6 pt-[72px] max-lg:hidden">
                    {!country?.origin || !country.destination ? (
                        <img
                            src="https://res.cloudinary.com/dwp6wpymz/image/upload/v1707747179/cajtansnr57pfabregde.svg"
                            alt="rate preview"
                            className="object-cover w-full"
                        />
                    ) : (
                        <div
                            id="previewContainer"
                            className="bg-white overflow-y-auto scrollbar-hide shadow-[0px_6.59625244140625px_52.77001953125px_0px_rgba(0,0,0,0.06),0px_0px_6.59625244140625px_0px_rgba(0,0,0,0.04)] h-full px-6 rounded-[8px]"
                        >
                            <LivePreview
                                step={activeStep}
                                date={dateRange}
                                instantQuoteDetail={livePreviewData()}
                            />
                        </div>
                    )}
                </div>
            </div>
            {successModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    // closeModal={() => {
                    //     dispatch(rateActions.resetFFCreateRateSuccess());
                    //     setSuccessModal(false);
                    // }}
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
                                Your rate is live!
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Your rate is now live. Your rates are set to daily and you would be
                                able to edit it in 24 hours
                            </p>
                        </div>
                        <hr />
                        <div className="flex">
                            <button
                                type="button"
                                className={`uppercase w-full rounded-t-none rounded-br-none rounded-bl-lg text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-r px-3`}
                                onClick={() => {
                                    console.log("first");
                                }}
                            >
                                Share rate
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    navigate(`/dashboard/instant-quote/${createdRateId}`);
                                }}
                                className={`uppercase w-full rounded-t-none rounded-bl-none rounded-br-lg text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 px-3`}
                            >
                                View rate
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </>
    );
};

export default ManualUpload;
