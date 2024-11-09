import LocationSearchInput from "components/common/AutocompleteInput";
import Loader from "components/common/Loader";
import React, { useEffect, useState } from "react";
import config from "config/config";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "actions/appActions";
import { toast } from "react-hot-toast";
import CustomToast from "components/common/CustomToast";

const BusinessInformation = ({ businessInfoData, setBusinessInfoData, address, setAddress }) => {
    const [postion, setPosition] = useState({
        lat: null,
        lng: null,
    });
    const [positionLoader, setPositionLooader] = useState(false);
    const [FFMode, setFFMode] = useState([]);
    const dispatch = useDispatch();
    const { reverseLocateLoading, reverseLocateSuccess } = useSelector((state) => state.app);

    const handleTextInputChange = (event) => {
        const { name, value } = event.target;

        setBusinessInfoData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleCustomFieldChange = (name, value) => {
        setBusinessInfoData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const successCallback = (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        setPositionLooader(false);
        setPosition({
            lat,
            lng: long,
        });
        dispatch(appActions.reverseLocate(lat, long, config.GOOGLE_API_KEY));
    };

    const errorCallback = (error) => {
        setPositionLooader(false);
        toast.custom((t) => <CustomToast t={t} message={error?.message} type="error" />);
    };

    const getCurrentLocation = () => {
        setPositionLooader(true);
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
            enableHighAccuracy: true,
        });
    };

    useEffect(() => {
        if (reverseLocateSuccess) {
            setAddress({
                businessAddress: {
                    address: reverseLocateSuccess?.results[0]?.formatted_address,
                    details: [],
                    lat: postion.lat,
                    lng: postion.lng,
                },
            });
        }
    }, [reverseLocateSuccess, postion.lat, postion.lng, setAddress]);

    return (
        <div>
            <div className="mb-8">
                <h3 className="font-rocGroteskBold text-[22px] text-[#142837] mb-2">
                    Welcome to Fleet+!
                </h3>
                <p className="text-[#142837] font-rocGroteskMedium text-sm">
                    Provide your business details Tell us a little about your business.
                </p>
            </div>
            <div>
                <div>
                    <div className="w-full mb-6">
                        <p className="text-sm mb-1 font-rocGroteskMedium">Legal Business Name*</p>
                        <input
                            type="text"
                            placeholder="The name of your business"
                            className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                            required
                            name="businessName"
                            value={businessInfoData.businessName}
                            onChange={handleTextInputChange}
                            // {...register("businessName")}
                        />
                    </div>
                    <div className="w-full mb-6">
                        <p className="text-sm mb-1 font-rocGroteskMedium">Business Address*</p>
                        <div className="w-full flex items-center gap-2">
                            <LocationSearchInput
                                setData={setAddress}
                                savedAddress={
                                    address?.businessAddress
                                        ? address?.businessAddress?.address
                                        : ""
                                }
                                placeholder="Enter business address"
                                classNames={"rounded"}
                                name={"businessAddress"}
                            />
                            {(reverseLocateLoading || positionLoader) && (
                                <Loader color={"gun-metal"} />
                            )}
                        </div>

                        <p
                            className="text-sm mt-2 text-gun-metal flex gap-1 cursor-pointer w-fit"
                            onClick={getCurrentLocation}
                        >
                            <span className="material-icons text-sm">fmd_good</span>{" "}
                            <span className="underline gilroyMedium">Use current location</span>
                        </p>
                    </div>
                    <div className="w-full mb-6">
                        <p className="text-sm mb-1 font-rocGroteskMedium">
                            Freight Forwarding Mode*
                        </p>
                        <div className="flex">
                            <button
                                type="button"
                                className={`border hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                    businessInfoData.freightForwardingMode?.includes("air")
                                        ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                        : "text-mvx-neutral bg-white"
                                }  w-full rounded-tr-none rounded-br-none px-4 py-3 flex h-[50px] items-center justify-center`}
                                onClick={() => {
                                    const ffModeCopy = [...FFMode];
                                    const itemIndex = ffModeCopy?.findIndex(
                                        (value) => value === "air"
                                    );

                                    if (itemIndex !== -1) {
                                        ffModeCopy?.splice(itemIndex, 1);
                                        setFFMode(ffModeCopy);
                                        handleCustomFieldChange(
                                            "freightForwardingMode",
                                            ffModeCopy
                                        );
                                    } else {
                                        const update = [...ffModeCopy, "air"];
                                        setFFMode(update);
                                        handleCustomFieldChange("freightForwardingMode", update);
                                    }
                                }}
                            >
                                <p className="text-sm font-rocGroteskMedium whitespace-nowrap flex items-center gap-2">
                                    <span className={`material-icons text-xl text-inherit`}>
                                        flight_takeoff
                                    </span>{" "}
                                    <span>Air</span>
                                </p>
                            </button>
                            <button
                                type="button"
                                className={`border hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                    businessInfoData.freightForwardingMode?.includes("ocean")
                                        ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                        : "text-mvx-neutral bg-white"
                                }  w-full rounded-none px-4 py-3 flex h-[50px] items-center justify-center`}
                                onClick={() => {
                                    const ffModeCopy = [...FFMode];
                                    const itemIndex = ffModeCopy?.findIndex(
                                        (value) => value === "ocean"
                                    );

                                    if (itemIndex !== -1) {
                                        ffModeCopy?.splice(itemIndex, 1);
                                        setFFMode(ffModeCopy);
                                        handleCustomFieldChange(
                                            "freightForwardingMode",
                                            ffModeCopy
                                        );
                                    } else {
                                        const update = [...ffModeCopy, "ocean"];
                                        setFFMode(update);
                                        handleCustomFieldChange("freightForwardingMode", update);
                                    }
                                }}
                            >
                                <p className="text-sm font-rocGroteskMedium whitespace-nowrap flex items-center gap-2">
                                    <span className={`material-icons text-xl text-inherit`}>
                                        directions_boat
                                    </span>{" "}
                                    <span>Ocean</span>
                                </p>
                            </button>
                            <button
                                type="button"
                                className={`border hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                    businessInfoData.freightForwardingMode?.includes("haulage")
                                        ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                        : "text-mvx-neutral bg-white"
                                }  w-full rounded-tl-none rounded-bl-none px-4 py-3 flex h-[50px] items-center justify-center`}
                                onClick={() => {
                                    const ffModeCopy = [...FFMode];
                                    const itemIndex = ffModeCopy?.findIndex(
                                        (value) => value === "haulage"
                                    );

                                    if (itemIndex !== -1) {
                                        ffModeCopy?.splice(itemIndex, 1);
                                        setFFMode(ffModeCopy);
                                        handleCustomFieldChange(
                                            "freightForwardingMode",
                                            ffModeCopy
                                        );
                                    } else {
                                        const update = [...ffModeCopy, "haulage"];
                                        setFFMode(update);
                                        handleCustomFieldChange("freightForwardingMode", update);
                                    }
                                }}
                            >
                                <p className="text-sm font-rocGroteskMedium whitespace-nowrap flex items-center gap-2">
                                    <span className={`material-icons text-xl text-inherit`}>
                                        local_shipping
                                    </span>{" "}
                                    <span>Land</span>
                                </p>
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-6">
                        <p className="text-sm mb-1 font-rocGroteskMedium">Business Type*</p>
                        <div className="w-full grid grid-cols-[1fr_1fr] gap-2">
                            <button
                                type="button"
                                className={`border hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                    businessInfoData.businessType.toLowerCase() ===
                                    "limited liability company"
                                        ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                        : "text-mvx-neutral bg-white"
                                }  w-full px-4 py-3 flex h-[50px] items-center justify-center`}
                                onClick={() =>
                                    handleCustomFieldChange(
                                        "businessType",
                                        "Limited Liability Company"
                                    )
                                }
                            >
                                <p className="text-sm font-rocGroteskMedium whitespace-nowrap flex items-center gap-2">
                                    Limited Liability Company
                                </p>
                            </button>
                            <button
                                type="button"
                                className={`border hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                    businessInfoData.businessType.toLowerCase() === "business name"
                                        ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                        : "text-mvx-neutral bg-white"
                                }  w-full px-4 py-3 flex h-[50px] items-center justify-center`}
                                onClick={() =>
                                    handleCustomFieldChange("businessType", "Business Name")
                                }
                            >
                                <p className="text-sm font-rocGroteskMedium whitespace-nowrap flex items-center gap-2">
                                    Business Name
                                </p>
                            </button>
                            <button
                                type="button"
                                className={`border hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                    businessInfoData.businessType.toLowerCase() ===
                                    "sole proprietorship"
                                        ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                        : "text-mvx-neutral bg-white"
                                }  w-full px-4 py-3 flex h-[50px] items-center justify-center`}
                                onClick={() =>
                                    handleCustomFieldChange("businessType", "Sole Proprietorship")
                                }
                            >
                                <p className="text-sm font-rocGroteskMedium whitespace-nowrap flex items-center gap-2">
                                    Sole Proprietorship
                                </p>
                            </button>
                            <button
                                type="button"
                                className={`border hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                    businessInfoData.businessType.toLowerCase() === "partnership"
                                        ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                        : "text-mvx-neutral bg-white"
                                }  w-full px-4 py-3 flex h-[50px] items-center justify-center`}
                                onClick={() =>
                                    handleCustomFieldChange("businessType", "Partnership")
                                }
                            >
                                <p className="text-sm font-rocGroteskMedium whitespace-nowrap flex items-center gap-2">
                                    Partnership
                                </p>
                            </button>
                        </div>
                    </div>
                    <div className="w-full mb-6">
                        <p className="text-sm mb-1 font-rocGroteskMedium">Registration Number*</p>
                        <div className="flex h-full">
                            <input
                                type="text"
                                placeholder="00000000"
                                className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                required
                                name="registrationNo"
                                value={businessInfoData.registrationNo}
                                onChange={handleTextInputChange}
                                pattern={"^[0-9]+$"}
                                title="must be valid registration number"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessInformation;
