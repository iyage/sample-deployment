import { rateActions } from "actions";
import Dropdown from "components/common/Dropdown";
import Loader from "components/common/Loader";
import NavTwo from "components/common/NavTwo";
import { getCurrencyFromCurrencyCode } from "helpers";
import { formatMoney } from "helpers/formatMoney";
import { findIndex, isEqual, truncate, uniqWith } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import countries from "variables/countries";

const RateManagement = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [FFRates, setFFRates] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [actionType, setActionType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [selectedRateId, setSelectedRateId] = useState(null);

    const { getFFRatesLoading, getFFRatesSuccess, FFToggleRateActivenessSuccess } = useSelector(
        (state) => state.rate
    );

    useEffect(() => {
        dispatch(
            rateActions.fetchFFRates(selectedFilter === "all" ? "" : selectedFilter, currentPage)
        );
    }, [dispatch, selectedFilter, currentPage]);

    useEffect(() => {
        if (Boolean(getFFRatesSuccess?.rates)) {
            if (selectedFilter !== "all") {
                setFFRates(getFFRatesSuccess.rates);
            } else {
                setFFRates((prevState) =>
                    uniqWith([...prevState, ...getFFRatesSuccess.rates], isEqual)
                );
            }
            setPagination(getFFRatesSuccess?.pagination);
            dispatch(rateActions.resetFetchFFRatesSuccess());
        }
    }, [dispatch, getFFRatesSuccess, selectedFilter]);

    useEffect(() => {
        if (Boolean(FFToggleRateActivenessSuccess)) {
            const FFRateCopy = JSON.parse(JSON.stringify([...FFRates]));

            const selectedRateIndex = findIndex(FFRateCopy, ["_id", selectedRateId]);
            if (selectedRateIndex !== -1) {
                FFRateCopy[selectedRateIndex].active = !FFRateCopy[selectedRateIndex].active;
                setFFRates(FFRateCopy);
            }
            dispatch(rateActions.resetFFToggleRateActivenessSuccess());
        }
    }, [dispatch, FFToggleRateActivenessSuccess, selectedRateId, FFRates]);

    return (
        <div className="relative">
            <NavTwo />
            <div className="px-[104px] max-lg:px-10 max-sm:px-4 py-[75px] max-sm:py-6 mt-16">
                <div className="flex items-center justify-between mb-[22px]">
                    <p className="text-2xl max-sm:text-base font-rocGroteskBold">
                        Rate Management System (RMS)
                    </p>
                    <div className="flex items-center gap-3 ">
                        <button
                            className="flex items-center justify-center max-sm:hidden text-white bg-pacific-cyan font-rocGroteskMedium w-fit py-2.5 px-8 text-sm rounded"
                            type={"button"}
                            disabled={getFFRatesLoading}
                            onClick={() => navigate("/dashboard/rate-management/add-rate")}
                        >
                            Add rate
                        </button>
                        <div className="relative">
                            <Dropdown
                                value={""}
                                disabled={getFFRatesLoading}
                                dropdown={
                                    <button
                                        className="flex items-center justify-center gap-2 text-gun-metal bg-mvx-light-blue font-rocGroteskMedium w-fit py-2.5 px-8 max-sm:bg-transparent max-sm:p-0 text-sm rounded"
                                        type={"button"}
                                    >
                                        <i className="ri-filter-3-fill max-sm:text-xl"></i>
                                        <span className="text-inherit max-sm:hidden">Filter</span>
                                    </button>
                                }
                                dropdownClassname={"!w-full"}
                                dropdownContainerClasses={
                                    "shadow-dropdownShadow border-0 rounded right-[0px] top-[50px] !w-[220px]"
                                }
                                name={"dropdown"}
                                dropdownOptions={[
                                    {
                                        customChild: (
                                            <div className="flex flex-col bg-white">
                                                <div
                                                    onClick={() => {
                                                        setSelectedFilter("all");
                                                        setActionType("filter");
                                                        setCurrentPage(1);
                                                    }}
                                                    className="flex items-center gap-2 text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2 cursor-pointer"
                                                >
                                                    {selectedFilter === "all" ? (
                                                        <i className="ri-checkbox-fill before:content-['\eb82'] text-xl mt-[-2px]"></i>
                                                    ) : (
                                                        <i className="ri-checkbox-blank-line before:content-['\eb7f'] text-xl mt-[-2px]"></i>
                                                    )}
                                                    <span className="text-inherit">All</span>
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        setSelectedFilter("air");
                                                        setActionType("filter");
                                                        setCurrentPage(1);
                                                    }}
                                                    className="flex items-center gap-2 text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2 cursor-pointer"
                                                >
                                                    {selectedFilter === "air" ? (
                                                        <i className="ri-checkbox-fill before:content-['\eb82'] text-xl mt-[-2px]"></i>
                                                    ) : (
                                                        <i className="ri-checkbox-blank-line before:content-['\eb7f'] text-xl mt-[-2px]"></i>
                                                    )}
                                                    <span className="text-inherit">Air</span>
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        setSelectedFilter("ocean");
                                                        setActionType("filter");
                                                        setCurrentPage(1);
                                                    }}
                                                    className="flex items-center gap-2 text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2 cursor-pointer"
                                                >
                                                    {selectedFilter === "ocean" ? (
                                                        <i className="ri-checkbox-fill before:content-['\eb82'] text-xl mt-[-2px]"></i>
                                                    ) : (
                                                        <i className="ri-checkbox-blank-line before:content-['\eb7f'] text-xl mt-[-2px]"></i>
                                                    )}
                                                    <span className="text-inherit">Ocean</span>
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        setSelectedFilter("land");
                                                        setActionType("filter");
                                                        setCurrentPage(1);
                                                    }}
                                                    className="flex items-center gap-2 text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2 cursor-pointer"
                                                >
                                                    {selectedFilter === "land" ? (
                                                        <i className="ri-checkbox-fill before:content-['\eb82'] text-xl mt-[-2px]"></i>
                                                    ) : (
                                                        <i className="ri-checkbox-blank-line before:content-['\eb7f'] text-xl mt-[-2px]"></i>
                                                    )}
                                                    <span className="text-inherit">Land</span>
                                                </div>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
                {getFFRatesLoading && actionType !== "page" ? (
                    <div className="h-[30vh] flex items-center justify-center">
                        <Loader color="mvx-black" size={10} />
                    </div>
                ) : (
                    <div>
                        {FFRates?.length > 0 ? (
                            <div>
                                <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-[14px]">
                                    {FFRates?.map((value) => {
                                        const originCountry = countries.find(
                                            (country) =>
                                                country.abbreviation?.toLowerCase() ===
                                                value.portOfOrigin?.country?.toLowerCase()
                                        );
                                        const destinationCountry = countries.find(
                                            (country) =>
                                                country.abbreviation?.toLowerCase() ===
                                                value.portOfDestination?.country?.toLowerCase()
                                        );
                                        const price = formatMoney()
                                            .format(value?.price?.amount)
                                            ?.split(".");
                                        const amountPrefix = price?.[0];
                                        const amountSuffix = price?.[1];
                                        return (
                                            <div
                                                key={value?._id}
                                                onClick={() =>
                                                    navigate(
                                                        `/dashboard/instant-quote/${value?._id}`
                                                    )
                                                }
                                                className="border rounded-[6px] shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.03)] cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between py-2 px-4">
                                                    <div className="flex items-start ">
                                                        <p className="text-xl font-rocGroteskBold text-gun-metal">
                                                            {getCurrencyFromCurrencyCode(
                                                                value?.price?.currency
                                                            )}
                                                            {amountPrefix}.
                                                        </p>
                                                        <p className="text-xs font-rocGroteskBold text-gun-metal">
                                                            {amountSuffix ? amountSuffix : "00"}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedRateId(value?._id);
                                                                dispatch(
                                                                    rateActions.FFToggleRateActiveness(
                                                                        value?._id
                                                                    )
                                                                );
                                                            }}
                                                            className="switch relative inline-block w-[25px] h-[17px]"
                                                        >
                                                            <span
                                                                className={`slider round absolute h-[17px] w-[25px] before:h-[16px] before:w-[16px] ${
                                                                    value.active &&
                                                                    "before:translate-x-[24px]"
                                                                } ${
                                                                    value.active
                                                                        ? "bg-pacific-cyan before:border-pacific-cyan before:bg-white before:content-['✔'] before:text-pacific-cyan before:flex before:justify-center before:items-center before:text-[10px]"
                                                                        : "bg-[#DFE1E6] before:border-[#DFE1E6] before:bg-mvx-light-blue"
                                                                } cursor-pointer top-0 left-0 right-0 bottom-0 duration-[.3s] rounded-[34px] before:absolute before:border  ${
                                                                    value.active
                                                                        ? "before:left-[-15px] before:top-[0.5px]"
                                                                        : "before:left-0 before:top-[0.5px]"
                                                                } before:bottom-[1px] before:duration-[.4s]  before:rounded-[50%]`}
                                                            ></span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="py-3 px-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <i className="ri-map-pin-fill before:content-['\ef13'] before:text-mvx-neutral mt-[-2px]"></i>
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-sm text-mvx-neutral font-rocGroteskMedium">
                                                                {truncate(originCountry?.name, {
                                                                    length: 20,
                                                                })}
                                                            </p>
                                                            <span className="material-icons text-xs text-mvx-neutral font-medium">
                                                                arrow_forward
                                                            </span>
                                                            <p className="text-sm text-mvx-neutral font-rocGroteskMedium">
                                                                {truncate(
                                                                    destinationCountry?.name,
                                                                    {
                                                                        length: 20,
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-2">
                                                        <i
                                                            className={`ri-ship-2-fill ${
                                                                value.movementMode.toLowerCase() ===
                                                                "ocean"
                                                                    ? "ocean-shipment-icon"
                                                                    : value.movementMode.toLowerCase() ===
                                                                      "land"
                                                                    ? "land-shipment-icon"
                                                                    : "air-shipment-icon"
                                                            } before:text-mvx-neutral`}
                                                        ></i>
                                                        <p className="text-sm font-rocGroteskMedium text-mvx-neutral capitalize">
                                                            {value.movementMode} freight
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-2">
                                                        <i className="ri-time-fill before:content-['\f20e'] before:text-mvx-neutral"></i>
                                                        <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                                            Expires:{" "}
                                                            {moment(value.validity.to).format(
                                                                "MMM DD, YYYY • hh:mm a"
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`material-icons text-sm ${
                                                                    value.active
                                                                        ? "text-pacific-cyan"
                                                                        : "text-mvx-neutral"
                                                                } `}
                                                            >
                                                                fiber_manual_record
                                                            </span>

                                                            <p className="text-sm text-mvx-neutral font-rocGroteskMedium">
                                                                {value.active
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div>
                                                                <ReactCountryFlag
                                                                    countryCode={
                                                                        originCountry?.abbreviation
                                                                    }
                                                                    svg
                                                                    style={{
                                                                        borderRadius: "100%",
                                                                        width: "20px",
                                                                        height: "20px",
                                                                        objectFit: "cover",
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <ReactCountryFlag
                                                                    countryCode={
                                                                        destinationCountry?.abbreviation
                                                                    }
                                                                    svg
                                                                    style={{
                                                                        borderRadius: "100%",
                                                                        width: "20px",
                                                                        height: "20px",
                                                                        objectFit: "cover",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-center my-6">
                                    {getFFRatesLoading ? (
                                        <Loader color="mvx-black" size={4} />
                                    ) : (
                                        <div>
                                            {currentPage === pagination?.number_of_pages ? (
                                                <p className="text-sm font-rocGroteskMedium">
                                                    End of list
                                                </p>
                                            ) : (
                                                <div
                                                    onClick={() => {
                                                        setActionType("page");
                                                        setCurrentPage((prev) => prev + 1);
                                                    }}
                                                    className="flex items-center justify-center py-2 px-4 border cursor-pointer rounded-[30px]"
                                                >
                                                    <p className="text-xs font-rocGroteskMedium">
                                                        Show more
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full flex justify-center ">
                                <div className="flex flex-col w-[22%] max-lg:w-[60%] max-sm:w-[65%] items-center justify-center mt-16">
                                    <i class="ri-file-list-3-fill text-4xl mb-3"></i>
                                    <p className="text-base font-rocGroteskBold mb-3">
                                        No rate yet!
                                    </p>
                                    <p className="text-[13px] text-center text-mvx-neutral font-rocGroteskMedium mb-6">
                                        Supercharge your business! Upload your rates today and
                                        attract more customers.
                                    </p>
                                    <button
                                        className="flex items-center justify-center text-white bg-pacific-cyan font-rocGroteskMedium w-full py-2 px-8 text-sm rounded"
                                        type={"button"}
                                        onClick={() =>
                                            navigate("/dashboard/rate-management/add-rate")
                                        }
                                    >
                                        Upload your rate
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="fixed bottom-20 right-6 hidden max-sm:block">
                <button
                    disabled={getFFRatesLoading}
                    type="button"
                    onClick={() => navigate("/dashboard/rate-management/add-rate")}
                    className="flex items-center justify-center rounded-full w-12 h-12 bg-pacific-cyan shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]"
                >
                    <span className="material-icons text-white">add</span>
                </button>
            </div>
        </div>
    );
};

export default RateManagement;
