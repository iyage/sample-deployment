import { shipmentActions } from "actions";
import Loader from "components/common/Loader";
import ModalContainer from "components/common/ModalContainer";
import NavOne from "components/common/NavOne";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import GoodsDetails from "./common/GoodsDetails";
import LocationDetails from "./common/LocationDetails";
import ShipmentDetails from "./common/ShipmentDetails";
import successImg from "assets/images/externalPages/waitlist-success.svg";
import ShipmentUserDetails from "./common/ShipmentUserDetails";
import { shipmentService } from "services";

const ShipmentCreation = () => {
    const navigate = useNavigate();
    const [modalIsOpen, setIsModalOpen] = useState(false);
    const [savedData, setSavedData] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [address, setAddress] = useState({});
    const [shipperAddress, setShipperAddress] = useState({});
    const [isContainer, setIsContainer] = useState(true);
    const [formOneData, setFormOneData] = useState({
        fullName: "",
        email: "",
        phoneNo: "",
        serviceMode: "",
        region: "",
        reference: "",
    });
    const [formTwoData, setFormTwoData] = useState({
        serviceType: "",
        loadType: "",
        incoterms: "",
        countryOfSupply: "",
    });
    const { id } = useParams();
    const [param] = useSearchParams();
    const shipmentId = param.get("shipmentId");
    const initialFormThreeInputData = useMemo(
        () => ({
            nonContainerData: [
                {
                    packageType: "",
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
    const [formThreeData, setFormThreeData] = useState({
        ...initialFormThreeInputData,
    });
    const [formFourData, setFormFourData] = useState({
        currency: "",
        amount: "",
        description: "",
        areGoodsReady: "",
    });
    const dispatch = useDispatch();
    const {
        isCreatingPendingShipment,
        isCreatingPendingShipmentComplete,
        isCreatingShipment,
        isCreatingShipmentComplete,
        ffShipmentLoading,
        ffShipment,
    } = useSelector((state) => state.shipment);

    const handleFormOneInputChange = (name, value) => {
        setFormOneData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleFormTwoInputChange = (name, value) => {
        setFormTwoData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleFormFourInputChange = (name, value) => {
        setFormFourData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const canUserContinue = (step) => {
        const areFormOneFieldsFilled = [
            ...Object.values(formOneData).map((value) => Boolean(value)),
            Boolean(shipperAddress?.shipperAddress?.address),
        ];
        const areFormTwoFieldsFilled =
            formOneData.serviceMode !== "air"
                ? [...Object.values(formTwoData).map((value) => Boolean(value))]
                : [
                      ...Object.entries(formTwoData)
                          .filter(([key, _]) => key !== "loadType")
                          .map(([_, value]) => Boolean(value)),
                  ];

        const areFormThreeFieldsFilled =
            isContainer && formOneData.serviceMode !== "air"
                ? formThreeData.containerData.map((item) => Boolean(item.containerType))
                : formThreeData.nonContainerData.map(
                      (item) =>
                          Boolean(item.packageType) &&
                          Boolean(item.height) &&
                          Boolean(item.length) &&
                          Boolean(item.weight) &&
                          Boolean(item.width)
                  );
        const areFormFourFieldsFilled = [
            ...Object.values(formFourData).map((value) => Boolean(value)),
        ];

        switch (step) {
            case 0:
                return areFormOneFieldsFilled;
            case 1:
                return [
                    ...areFormOneFieldsFilled,
                    ...areFormTwoFieldsFilled,
                    Boolean(address?.destinationAddress),
                    Boolean(address?.pickupAddress),
                    Boolean(address?.portOfLoading),
                ];
            case 2:
                return [
                    ...areFormOneFieldsFilled,
                    ...areFormTwoFieldsFilled,
                    ...areFormThreeFieldsFilled,
                ];
            case 3:
                return [
                    ...areFormOneFieldsFilled,
                    ...areFormTwoFieldsFilled,
                    ...areFormThreeFieldsFilled,
                    ...areFormFourFieldsFilled,
                ];

            default:
                return areFormOneFieldsFilled;
        }
    };

    const areFieldsFilled = canUserContinue(activeStep);

    const displayActiveStep = (step) => {
        switch (step) {
            case 0:
                return (
                    <ShipmentUserDetails
                        formData={formOneData}
                        handleCustomInputChange={handleFormOneInputChange}
                        address={shipperAddress}
                        setAddress={setShipperAddress}
                    />
                );
            case 1:
                return (
                    <LocationDetails
                        formData={formTwoData}
                        handleInputChange={handleFormTwoInputChange}
                        address={address}
                        setAddress={setAddress}
                        mode={formOneData.serviceMode}
                    />
                );
            case 2:
                return (
                    <ShipmentDetails
                        formData={formThreeData}
                        setFormThreeData={setFormThreeData}
                        isContainer={isContainer}
                        setIsContainer={setIsContainer}
                        mode={formOneData.serviceMode}
                    />
                );
            case 3:
                return (
                    <GoodsDetails
                        formData={formFourData}
                        handleInputChange={handleFormFourInputChange}
                    />
                );

            default:
                return (
                    <ShipmentUserDetails
                        formOneData={formOneData}
                        handleCustomInputChange={handleFormOneInputChange}
                    />
                );
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        if (shipmentId && activeStep < 3) {
            return setActiveStep((prev) => prev + 1);
        }
        const body = Boolean(shipmentId)
            ? {
                  origin: {
                      lat: address?.pickupAddress?.lat,
                      lng: address?.pickupAddress?.lng,
                      address: address?.pickupAddress?.address,
                      details: [address?.pickupAddress?.address],
                      country: formTwoData.countryOfSupply,
                  },
                  packageType:
                      isContainer && formOneData.serviceMode !== "air"
                          ? "containers"
                          : "non-containers",
                  destination: {
                      lat: address?.destinationAddress?.lat,
                      lng: address?.destinationAddress?.lng,
                      address: address?.destinationAddress?.address,
                      details: [address?.destinationAddress?.address],
                  },
                  portOfLoading: {
                      lat: address?.portOfLoading?.lat,
                      lng: address?.portOfLoading?.lng,
                      address: address?.portOfLoading?.address,
                      details: [address?.portOfLoading?.address],
                  },
                  loadType:
                      formOneData.serviceMode === "air"
                          ? "Low Container Load (LCL)"
                          : formTwoData.loadType,
                  incoterms: formTwoData.incoterms,
                  goodsDetails: {
                      value: {
                          currency: formFourData.currency,
                          amount: Number(formFourData.amount),
                      },
                      description: formFourData.description,
                      goodsStatus: formFourData.areGoodsReady,
                  },
                  shipperDetails: {
                      email: formOneData.email,
                      phoneNumber: formOneData.phoneNo,
                      phoneNumberExtention: formOneData.region,
                      fullName: formOneData.fullName,
                      address: {
                          lat: shipperAddress?.shipperAddress?.lat,
                          lng: shipperAddress?.shipperAddress?.lng,
                          address: shipperAddress?.shipperAddress?.address,
                          details: [shipperAddress?.shipperAddress?.address],
                      },
                  },
                  serviceMode: formOneData.serviceMode,
                  serviceType: formTwoData.serviceType,
                  [isContainer && formOneData.serviceMode !== "air" ? "containers" : "packages"]:
                      isContainer && formOneData.serviceMode !== "air"
                          ? formThreeData?.containerData
                          : formThreeData?.nonContainerData?.map((data) => {
                                return {
                                    packageType: data?.packageType,
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
              }
            : {
                  channel: "web",
                  origin: {
                      lat: address?.pickupAddress?.lat,
                      lng: address?.pickupAddress?.lng,
                      address: address?.pickupAddress?.address,
                      details: [address?.pickupAddress?.address],
                      country: formTwoData.countryOfSupply,
                  },
                  packageType:
                      isContainer && formOneData.serviceMode !== "air"
                          ? "containers"
                          : "non-containers",
                  destination: {
                      lat: address?.destinationAddress?.lat,
                      lng: address?.destinationAddress?.lng,
                      address: address?.destinationAddress?.address,
                      details: [address?.destinationAddress?.address],
                  },
                  portOfLoading: {
                      lat: address?.portOfLoading?.lat,
                      lng: address?.portOfLoading?.lng,
                      address: address?.portOfLoading?.address,
                      details: [address?.portOfLoading?.address],
                  },
                  loadType:
                      formOneData.serviceMode === "air"
                          ? "Low Container Load (LCL)"
                          : formTwoData.loadType,
                  incoterms: formTwoData.incoterms,
                  goodsDetails: {
                      value: {
                          currency: formFourData.currency,
                          amount: Number(formFourData.amount),
                      },
                      description: formFourData.description,
                      goodsStatus: formFourData.areGoodsReady,
                  },
                  shipperDetails: {
                      email: formOneData.email,
                      phoneNumber: formOneData.phoneNo,
                      phoneNumberExtention: formOneData.region,
                      fullName: formOneData.fullName,
                      address: {
                          lat: shipperAddress?.shipperAddress?.lat,
                          lng: shipperAddress?.shipperAddress?.lng,
                          address: shipperAddress?.shipperAddress?.address,
                          details: [shipperAddress?.shipperAddress?.address],
                      },
                  },
                  freightForwarderId: id,
                  serviceMode: formOneData.serviceMode,
                  serviceType: formTwoData.serviceType,
                  [isContainer && formOneData.serviceMode !== "air" ? "containers" : "packages"]:
                      isContainer && formOneData.serviceMode !== "air"
                          ? formThreeData?.containerData
                          : formThreeData?.nonContainerData?.map((data) => {
                                return {
                                    packageType: data?.packageType,
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

        if (activeStep < 3) {
            const stepOneData = {
                channel: "web",
                shipperDetails: {
                    email: formOneData.email,
                    phoneNumber: formOneData.phoneNo,
                    phoneNumberExtention: formOneData.region,
                    fullName: formOneData.fullName,
                    address: {
                        lat: shipperAddress?.shipperAddress?.lat,
                        lng: shipperAddress?.shipperAddress?.lng,
                        address: shipperAddress?.shipperAddress?.address,
                        details: [shipperAddress?.shipperAddress?.address],
                    },
                },
                serviceMode: formOneData.serviceMode,
                reference: formOneData?.reference,
            };
            const stepTwoData = {
                ...stepOneData,
                serviceType: formTwoData.serviceType,
                origin: {
                    lat: address?.pickupAddress?.lat,
                    lng: address?.pickupAddress?.lng,
                    address: address?.pickupAddress?.address,
                    details: [address?.pickupAddress?.address],
                    country: formTwoData.countryOfSupply,
                },
                destination: {
                    lat: address?.destinationAddress?.lat,
                    lng: address?.destinationAddress?.lng,
                    address: address?.destinationAddress?.address,
                    details: [address?.destinationAddress?.address],
                },
                portOfLoading: {
                    lat: address?.portOfLoading?.lat,
                    lng: address?.portOfLoading?.lng,
                    address: address?.portOfLoading?.address,
                    details: [address?.portOfLoading?.address],
                },
                loadType:
                    formOneData.serviceMode === "air"
                        ? "Low Container Load (LCL)"
                        : formTwoData.loadType,
                incoterms: formTwoData.incoterms,
            };
            const stepThreeData = {
                ...stepTwoData,
                packageType:
                    isContainer && formOneData.serviceMode !== "air"
                        ? "containers"
                        : "non-containers",
                [isContainer && formOneData.serviceMode !== "air" ? "containers" : "packages"]:
                    isContainer && formOneData.serviceMode !== "air"
                        ? formThreeData?.containerData
                        : formThreeData?.nonContainerData?.map((data) => {
                              return {
                                  packageType: data?.packageType,
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
            let data;

            switch (activeStep) {
                case 0:
                    data = stepOneData;
                    break;
                case 1:
                    data = stepTwoData;
                    break;
                case 2:
                    data = stepThreeData;
                    break;

                default:
                    data = stepOneData;
                    break;
            }

            return dispatch(shipmentActions.createPendingShipment(data));
        }

        return dispatch(
            shipmentActions.createShipment(
                { ...body, reference: formOneData.reference },
                shipmentId
            )
        );
    };

    useEffect(() => {
        if (Boolean(isCreatingPendingShipmentComplete)) {
            setActiveStep((prev) => prev + 1);
        }
    }, [isCreatingPendingShipmentComplete]);

    useEffect(() => {
        if (Boolean(isCreatingShipmentComplete)) {
            setFormOneData({
                fullName: "",
                email: "",
                phoneNo: "",
                serviceMode: "",
                region: "",
            });
            setFormTwoData({
                serviceType: "",
                loadType: "",
                incoterms: "",
                countryOfSupply: "",
            });
            setShipperAddress({});
            setAddress({});
            setFormThreeData({
                ...initialFormThreeInputData,
            });
            setFormFourData({
                currency: "",
                amount: "",
                description: "",
                areGoodsReady: "",
            });
            setActiveStep(0);
            setIsModalOpen(true);
        }
    }, [isCreatingShipmentComplete, initialFormThreeInputData]);

    useEffect(() => {
        if (shipmentId) {
            dispatch(shipmentActions.fetchFFSingleShipment(shipmentId));
        } else {
            shipmentService.fetchPendingShipment().then(
                (res) => {
                    const data = res?.data?.data;

                    setSavedData(data);
                },
                (error) => {
                    if (error.message) {
                        // error alert also here
                        console.log(error.message);
                    }
                }
            );
        }
    }, [shipmentId, dispatch]);

    useEffect(() => {
        if (Boolean(ffShipment)) {
            setSavedData(ffShipment);
        }
    }, [ffShipment]);

    useEffect(() => {
        if (savedData) {
            setFormOneData({
                fullName: savedData.shipperDetails.fullName
                    ? savedData.shipperDetails.fullName
                    : "",
                email: savedData.shipperDetails.email ? savedData.shipperDetails.email : "",
                phoneNo: savedData.shipperDetails.phoneNumber
                    ? savedData.shipperDetails.phoneNumber
                    : "",
                serviceMode: savedData.serviceMode ? savedData.serviceMode : "",
                region: savedData.shipperDetails.phoneNumberExtention
                    ? savedData.shipperDetails.phoneNumberExtention
                    : "",
            });
            setFormTwoData({
                serviceType: savedData.serviceType ? savedData.serviceType : "",
                loadType: savedData?.loadType ? savedData.loadType : "",
                incoterms: savedData?.incoterms ? savedData.incoterms : "",
                countryOfSupply: savedData?.origin?.country ? savedData?.origin?.country : "",
            });
            setShipperAddress({ shipperAddress: savedData?.shipperDetails?.address ?? {} });
            setAddress({
                destinationAddress: savedData?.destination ?? {},
                portOfLoading: savedData?.portOfLoading ?? {},
                pickupAddress: savedData?.origin ?? {},
            });
            setIsContainer(savedData?.packages && savedData.packages.length > 0 ? false : true);
            setFormThreeData({
                nonContainerData:
                    savedData?.packages && savedData.packages.length > 0
                        ? savedData.packages.map((item) => ({
                              packageType: item?.packageType ? item.packageType : "",
                              dimensionUnit: item?.length?.unit ? item.length.unit : "",
                              containerUnitNo: item?.units ? item.units : "",
                              length: item?.length?.value ? item?.length?.value : "",
                              width: item?.width?.value ? item.width.value : "",
                              height: item?.height?.value ? item.height.value : "",
                              weight: item?.weight?.value ? item.weight.value : "",
                              weightUnit: item?.weight?.unit ? item.weight.unit : "",
                          }))
                        : [
                              {
                                  packageType: "",
                                  dimensionUnit: "cm",
                                  containerUnitNo: "1",
                                  length: "",
                                  width: "",
                                  height: "",
                                  weight: "",
                                  weightUnit: "kg",
                              },
                          ],
                containerData:
                    savedData?.containers && savedData.containers.length > 0
                        ? savedData.containers
                        : [
                              {
                                  containerType: "",
                                  unit: "ft",
                                  quantity: "1",
                              },
                          ],
            });
            setFormFourData({
                currency: savedData?.goodsDetails?.value?.currency ?? "",
                amount: savedData?.goodsDetails?.value?.amount ?? "",
                description: savedData?.goodsDetails?.description ?? "",
                areGoodsReady: savedData?.goodsDetails?.goodsStatus ?? "",
            });
        }
    }, [savedData, shipmentId]);

    if (ffShipmentLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <>
                <NavOne />
                <div className="flex justify-center">
                    <form className="w-[35%]  max-lg:w-[90%] my-16" onSubmit={onSubmit}>
                        <div className="mb-6">
                            <p className="mb-3 font-rocGroteskMedium text-mvx-neutral text-sm">
                                Step {activeStep + 1} of 4
                            </p>
                            <div className="w-full h-1 bg-[#DFE1E6]">
                                <div
                                    style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
                                    className={` h-1 bg-[#142837]`}
                                ></div>
                            </div>
                        </div>
                        <div>{displayActiveStep(activeStep)}</div>

                        <div className="mt-4 mb-8 flex justify-between items-center">
                            <div>
                                {activeStep === 0 ? (
                                    <p
                                        onClick={() => {
                                            navigate("/dashboard/shipments");
                                        }}
                                        className="underline cursor-pointer font-rocGroteskMedium text-mvx-neutral text-sm"
                                    >
                                        Close
                                    </p>
                                ) : (
                                    <p
                                        onClick={() => {
                                            setActiveStep((prevState) => {
                                                return prevState > 0 ? prevState - 1 : 0;
                                            });
                                        }}
                                        className="underline cursor-pointer font-rocGroteskMedium text-mvx-neutral text-sm"
                                    >
                                        Back
                                    </p>
                                )}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={areFieldsFilled.includes(false)}
                                    className={`rounded text-white flex items-center justify-center disabled:bg-mvx-light-blue py-3 px-6 bg-pacific-cyan disabled:text-mvx-neutral font-rocGroteskMedium text-sm`}
                                >
                                    {isCreatingShipment || isCreatingPendingShipment ? (
                                        <Loader color={"white"} />
                                    ) : activeStep === 3 ? (
                                        "Submit"
                                    ) : shipmentId ? (
                                        "Next"
                                    ) : (
                                        "Save and continue"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </>

            {modalIsOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        setIsModalOpen(false);
                        dispatch(shipmentActions.resetShipmentSuccessData());
                        navigate(`/dashboard/shipments`);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <img src={successImg} alt="success" className="mb-6 m-auto" />
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                {Boolean(shipmentId)
                                    ? "Shipment Updated Successfully"
                                    : "Shipment Created!"}
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-20">
                                You have successfully{" "}
                                {Boolean(shipmentId) ? "updated your" : "created a new"} shipment.{" "}
                                <span
                                    onClick={() => {
                                        dispatch(shipmentActions.resetShipmentSuccessData());
                                        navigate(
                                            `/dashboard/shipment/${
                                                Boolean(shipmentId)
                                                    ? shipmentId
                                                    : isCreatingShipmentComplete?.data?._id
                                            }`
                                        );
                                    }}
                                    className="underline cursor-pointer"
                                >
                                    View details
                                </span>
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg rounded-tl-none rounded-r-none w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
                                onClick={() => {
                                    dispatch(shipmentActions.resetShipmentSuccessData());
                                    // setCreateQuote(true);
                                    setIsModalOpen(false);
                                }}
                            >
                                Request a quote
                            </button>
                            <button
                                type="button"
                                className={`uppercase rounded-br-lg rounded-tr-none rounded-l-none w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 border-y px-3`}
                                onClick={() => {
                                    dispatch(shipmentActions.resetShipmentSuccessData());
                                    // setCreateQuote(true);
                                    // setIsModalOpen(false);
                                    navigate(
                                        `/dashboard/create-quote/customer/${
                                            Boolean(shipmentId)
                                                ? shipmentId
                                                : isCreatingShipmentComplete?.data?._id
                                        }`
                                    );
                                }}
                            >
                                Create quote
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {/* {createQuote && <CreateQuote setCreateQuote={setCreateQuote} />} */}
        </div>
    );
};

export default ShipmentCreation;
