/* eslint-disable no-unused-vars */
import { flattenDeep, truncate } from "lodash";
import React from "react";
import ReactCountryFlag from "react-country-flag";
import { useSelector } from "react-redux";
import Loader from "components/common/Loader";
import countries from "variables/countries";
import { getCurrencyFromCurrencyCode, getTotalPrice } from "helpers";
import { formatMoney } from "helpers/formatMoney";
import moment from "moment";
import { hasHTMLTag, sanitizeHtml } from "helpers/sanitizeHtml";

const LivePreview = ({ instantQuoteDetail, date }) => {
    const { getSingleRateLoading } = useSelector((state) => state.rate);

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
    const getTotalPrice = () => {
        const chargeArr = flattenDeep(instantQuoteDetail?.charges?.map((value) => value?.charges));
        return chargeArr?.reduce((acc, curr) => {
            return acc + Number(curr?.amount);
        }, 0);
    };

    const showAdditionalServices = Object.values(instantQuoteDetail?.additionalServices ?? {});

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
                <div className="w-full flex justify-center relative">
                    <div
                        // onClick={() => setOpenSearch(true)}
                        className={`flex items-center mt-[30px] bg-white  max-w-[600px] h-[48px] rounded-[120px] pl-6 pr-2 py-2 border shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.03),0px_7px_12px_-4px_rgba(16,24,40,0.08)]`}
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
                            {date && (
                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {moment(instantQuoteDetail?.validity?.from).format("MMM DD")} -{" "}
                                    {moment(instantQuoteDetail?.validity?.to).format(
                                        "MMM DD, YYYY"
                                    )}
                                </p>
                            )}
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center bg-pacific-cyan`}
                            >
                                <i className="ri-search-line before:content-['\f0d1'] before:text-white text-sm"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full overflow-y-auto flex pt-8 gap-[106px]">
                    <div className="w-[100%] mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div>
                                    <ReactCountryFlag
                                        countryCode={instantQuoteDetail?.portOfOrigin?.country}
                                        svg
                                        style={{
                                            borderRadius: "100%",
                                            width: "22px",
                                            height: "22px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                                <p className="text-lg font-rocGroteskBold text-gun-metal mt-[2px]">
                                    {truncate(originCountry?.name, {
                                        length: 20,
                                    })}
                                </p>
                            </div>

                            {instantQuoteDetail?.portOfOrigin?.country && (
                                <span className="material-icons text-xs text-gun-metal font-bold">
                                    arrow_forward
                                </span>
                            )}
                            <div className="flex items-center gap-1.5">
                                <div>
                                    <ReactCountryFlag
                                        countryCode={instantQuoteDetail?.portOfDestination?.country}
                                        svg
                                        style={{
                                            borderRadius: "100%",
                                            width: "22px",
                                            height: "22px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                                <p className="text-lg font-rocGroteskBold text-gun-metal mt-[2px]">
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
                            <div className="grid grid-cols-3 gap-y-6">
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
                                {instantQuoteDetail?.movementMode && (
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
                                )}
                                {instantQuoteDetail?.package && (
                                    <div className="flex items-start  gap-4">
                                        <div className="mt-[-2px]">
                                            <i className="ri-ruler-fill before:content-['\f0a2'] text-2xl"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-rocGroteskMedium ">Unit</p>
                                            <p className="text-sm font-rocGroteskMedium ">
                                                {instantQuoteDetail?.package?.measurement ===
                                                    "kg" && "Kilogram (kg)"}
                                                {instantQuoteDetail?.package?.measurement ===
                                                    "lbs" && "Pound (lbs)"}
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
                                            // __html: instantQuoteDetail?.remarks,
                                            __html: hasHTMLTag(instantQuoteDetail?.remarks)
                                                ? sanitizeHtml(
                                                      instantQuoteDetail?.remarks
                                                  ).sanitizedHTML?.join("")
                                                : instantQuoteDetail?.remarks,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LivePreview;
