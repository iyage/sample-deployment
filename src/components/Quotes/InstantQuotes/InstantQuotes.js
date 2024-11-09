import { rateActions } from "actions";
import Loader from "components/common/Loader";
import NavTwo from "components/common/NavTwo";
import { getCurrencyFromCurrencyCode } from "helpers";
import { formatMoney } from "helpers/formatMoney";
import { flattenDeep, truncate } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import countries from "variables/countries";
import InstantQuoteSearchBar from "./common/InstantQuoteSearchBar";

const InstantQuotes = () => {
    const [customSearchData, setCustomSearchData] = useState({
        portOfOrigin: "",
        originPortName: "",
        destinationPortName: "",
        portOfDestination: "",
        loadType: {
            type: "",
            mode: "",
        },
        date: "",
    });
    const [value, onChange] = useState(new Date());
    const [hotDeals, setHotDeals] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { getHotDealsLoading, getHotDealsSuccess } = useSelector((state) => state.rate);

    const getHotDeals = (deals) => {
        const hotDeals = deals?.map((deal) => {
            return deal?.deal;
        });
        return flattenDeep(hotDeals);
    };

    const displayDealsTable = () => {
        return getHotDeals(hotDeals)
            ?.slice(0, 3)
            ?.map((deal) => {
                const originCountry = countries.find(
                    (value) =>
                        value.abbreviation?.toLowerCase() === deal?.originCountry?.toLowerCase()
                );
                const destinationCountry = countries.find(
                    (value) =>
                        value.abbreviation?.toLowerCase() ===
                        deal?.destinationCountry?.toLowerCase()
                );

                return (
                    <div
                        key={deal._id?.id}
                        className="hover:bg-mvx-light-blue cursor-pointer"
                        onClick={() => navigate(`/dashboard/instant-quote/${deal._id?.id}`)}
                    >
                        <hr />
                        <div className="w-full grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-x-4 py-3 px-4 max-sm:hidden">
                            <div className="flex justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                <div className="flex items-center gap-2">
                                    <div>
                                        <ReactCountryFlag
                                            countryCode={deal.originCountry}
                                            svg
                                            style={{
                                                borderRadius: "100%",
                                                width: "16px",
                                                height: "16px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>
                                    <p className="text-sm font-rocGroteskMedium">
                                        {originCountry?.name}
                                    </p>
                                </div>
                            </div>
                            <div className=" flex justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                <i className="ri-arrow-right-line text-lg"></i>
                            </div>
                            <div className=" flex justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                <div className="flex items-center gap-2">
                                    <div>
                                        <ReactCountryFlag
                                            countryCode={deal.destinationCountry}
                                            svg
                                            style={{
                                                borderRadius: "100%",
                                                width: "16px",
                                                height: "16px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>
                                    <p className="text-sm font-rocGroteskMedium">
                                        {destinationCountry?.name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-start items-center text-sm font-rocGroteskMedium text-gun-metal">
                                {deal._id?.loadType === "40" || deal._id?.loadType === "20"
                                    ? "FCL"
                                    : "LCL"}
                            </div>
                            <div className="capitalize flex justify-start items-center text-sm font-rocGroteskMedium text-gun-metal">
                                {deal?.mode}
                            </div>
                            <div className="flex justify-end items-center text-sm font-rocGroteskMedium text-gun-metal">
                                <p className="text-sm">
                                    <span className="text-mvx-neutral text-inherit">
                                        Starting from
                                    </span>{" "}
                                    <span className="text-inherit">
                                        {getCurrencyFromCurrencyCode(deal.currecny)}
                                        {formatMoney().format(deal.totalCharges)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                );
            });
    };

    useEffect(() => {
        dispatch(rateActions.fetchHotDeals());
    }, [dispatch]);

    useEffect(() => {
        if (getHotDealsSuccess) {
            setHotDeals(getHotDealsSuccess);
        }
    }, [getHotDealsSuccess]);

    if (getHotDealsLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <NavTwo />
            <div className="px-[167px] mb-10 mt-24">
                <div className="flex flex-col items-center mt-16">
                    <h3 className="text-2xl font-rocGroteskBold mb-8">
                        Find the best freight quote
                    </h3>
                    <div className="w-full">
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
                <div>
                    <div className="flex flex-col items-center mt-[86px] mb-6">
                        <h3 className="text-2xl font-rocGroteskBold">Today's hot deals</h3>
                        <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                            Special offers, all deals doesn't include extra services
                        </p>
                    </div>
                    {getHotDeals(hotDeals) && getHotDeals(hotDeals)?.length > 0 ? (
                        <>
                            <div>
                                <div className="border max-sm:border-none rounded">
                                    <div className="w-full grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-x-4 my-3 px-4 max-sm:hidden">
                                        <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                            Origin
                                        </div>
                                        <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral"></div>
                                        <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                            Destination
                                        </div>

                                        <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                            Load type
                                        </div>
                                        <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                            Mode
                                        </div>
                                        <div className="uppercase flex justify-end text-xs font-rocGroteskMedium text-mvx-neutral">
                                            Amount
                                        </div>
                                    </div>
                                    <div>{displayDealsTable()}</div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="grid grid-cols-[1fr_1fr_1fr_1fr] max-lg:grid-cols-[1fr_1fr_1fr] gap-4 max-sm:flex max-sm:overflow-x-auto">
                                    {getHotDeals(hotDeals)
                                        ?.slice(3)
                                        ?.map((deal) => {
                                            return (
                                                <div
                                                    key={deal._id?.id}
                                                    className="pl-4 pr-2 py-4 border rounded cursor-pointer"
                                                    onClick={() =>
                                                        navigate(
                                                            `/dashboard/instant-quote/${deal._id?.id}`
                                                        )
                                                    }
                                                >
                                                    <div className="mb-4 flex">
                                                        <div>
                                                            <ReactCountryFlag
                                                                countryCode={deal.originCountry}
                                                                svg
                                                                style={{
                                                                    borderRadius: "100%",
                                                                    width: "32px",
                                                                    height: "30px",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ml-[-8px] border-[2px] border-white mt-[-2px] rounded-full">
                                                            <ReactCountryFlag
                                                                countryCode={
                                                                    deal.destinationCountry
                                                                }
                                                                svg
                                                                style={{
                                                                    borderRadius: "100%",
                                                                    width: "32px",
                                                                    height: "30px",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="flex items-center gap-1 mb-2">
                                                        <span className="text-sm font-rocGroteskMedium text-gun-metal">
                                                            {truncate(deal.originCountry, {
                                                                length: 20,
                                                            })}
                                                        </span>
                                                        <span className="material-icons text-xs text-gun-metal">
                                                            arrow_forward
                                                        </span>
                                                        <span className="text-sm font-rocGroteskMedium text-gun-metal">
                                                            {truncate(deal.destinationCountry, {
                                                                length: 20,
                                                            })}
                                                        </span>
                                                    </p>
                                                    <div className="flex justify-between items-end gap-1">
                                                        <div className="font-rocGroteskMedium text-mvx-neutral">
                                                            <p className="text-xs text-inherit leading-[17px]">
                                                                Starting from
                                                            </p>
                                                            <p className="text-sm text-inherit leading-[20px]">
                                                                {getCurrencyFromCurrencyCode(
                                                                    deal.currency
                                                                )}
                                                                {formatMoney().format(
                                                                    deal.totalCharges
                                                                )}
                                                            </p>
                                                        </div>

                                                        <p className="font-rocGroteskMedium text-xs px-2 py-1 bg-mvx-light-blue text-gun-metal w-fit rounded-[2px] flex items-center justify-center gap-2">
                                                            <i
                                                                className={`ri-ship-2-fill ${
                                                                    deal?.mode?.toLowerCase() ===
                                                                    "ocean"
                                                                        ? "ocean-shipment-icon"
                                                                        : deal?.mode?.toLowerCase() ===
                                                                          "land"
                                                                        ? "land-shipment-icon"
                                                                        : "air-shipment-icon"
                                                                } before:text-mvx-neutral`}
                                                            ></i>
                                                            <span className="text-inherit">
                                                                {deal._id?.loadType === "40" ||
                                                                deal._id?.loadType === "20"
                                                                    ? "FCL"
                                                                    : "LCL"}{" "}
                                                                •{" "}
                                                                {truncate(deal._id?.loadType, {
                                                                    length: 10,
                                                                })}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="mt-10 w-full flex justify-center">
                            <p className="text-xl font-rocGroteskMedium text-center">
                                No Deals Available
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstantQuotes;
