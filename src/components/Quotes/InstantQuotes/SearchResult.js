import { rateActions } from "actions";
// import Dropdown from "components/common/Dropdown";
import Loader from "components/common/Loader";
import NavTwo from "components/common/NavTwo";
import { getCurrencyFromCurrencyCode, isMobile } from "helpers";
import { formatMoney } from "helpers/formatMoney";
import { truncate } from "lodash";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import countries from "variables/countries";
import InstantQuoteSearchBar from "./common/InstantQuoteSearchBar";

const InstantQuoteSearchResult = () => {
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
    const [value, onChange] = useState(new Date());
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchResults, setSearchResults] = useState([]);

    const openSearchBarRef = useRef(null);
    const navRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [param] = useSearchParams();
    const originPort = param.get("originPort");
    const destinationPort = param.get("destinationPort");
    const departure = param.get("departure");
    const loadType = param.get("loadType");
    const originPortName = param.get("originPortName");
    const destinationPortName = param.get("destinationPortName");

    const { getRatesLoading, getRatesSuccess } = useSelector((state) => state.rate);

    const onScroll = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const condition = isMobile
            ? scrollTop + clientHeight >= scrollHeight - 65
            : scrollTop + clientHeight >= scrollHeight;

        if (condition) {
            if (currentPage < pagination?.number_of_pages) {
                setCurrentPage((prev) => prev + 1);
            }
        }
    }, [pagination?.number_of_pages, currentPage]);

    useEffect(() => {
        const body = {
            originPort,
            destinationPort,
            departure,
            loadType,
        };
        dispatch(rateActions.fetchRates(body));
    }, [dispatch, originPort, destinationPort, departure, loadType]);

    useEffect(() => {
        if (getRatesSuccess) {
            setSearchResults(getRatesSuccess.data);
            setPagination(getRatesSuccess.pagination);
        }
    }, [getRatesSuccess]);

    useEffect(() => {
        let lastScrollTop = 0;
        window.addEventListener("scroll", function () {
            let st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop) {
                // downscroll code
                onScroll();
            }
            lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
        });

        return () => {
            window.removeEventListener("scroll", function () {
                let st = window.pageYOffset || document.documentElement.scrollTop;
                if (st > lastScrollTop) {
                    // downscroll code
                    onScroll();
                }
                lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
            });
        };
    }, [onScroll]);

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

    if (getRatesLoading && currentPage === 1) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div className="relative ">
            <div ref={navRef} className="w-full mb-24">
                <NavTwo />
            </div>

            <div className="mb-10">
                <div className="w-full flex justify-center relative">
                    <div
                        onClick={() => setOpenSearch(true)}
                        className={`flex items-center ${
                            openSearch && "hidden"
                        } absolute top-[-61px] bg-white cursor-pointer min-w-[350px] max-w-[600px] h-[48px] rounded-[120px] pl-6 pr-2 py-2 border shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.03),0px_7px_12px_-4px_rgba(16,24,40,0.08)]`}
                    >
                        <div className="pr-4 border-r">
                            <p className="flex items-center gap-1.5">
                                <span className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {truncate(originPortName, {
                                        length: 12,
                                    })}
                                </span>
                                <span className="material-icons text-xs text-gun-metal">
                                    arrow_forward
                                </span>
                                <span className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {truncate(destinationPortName, {
                                        length: 12,
                                    })}
                                </span>
                            </p>
                        </div>
                        <div className="px-4 border-r">
                            <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                {loadType === "20" || loadType === "40"
                                    ? loadType + "ft container"
                                    : loadType}
                            </p>
                        </div>
                        <div className="pl-4 flex items-center gap-4">
                            <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                {moment(departure).format("MMM Do, YYYY")}
                            </p>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center bg-pacific-cyan`}
                            >
                                <i className="ri-search-line before:content-['\f0d1'] before:text-white text-sm"></i>
                            </div>
                        </div>
                    </div>
                    <div
                        ref={openSearchBarRef}
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

                {/* <div className="py-4 flex justify-center gap-2">
                    <div>
                        <Dropdown
                            value={""}
                            dropdown={
                                <div className="flex gap-1 items-center py-1.5 pl-4 pr-3 border rounded-[120px]">
                                    <p className="text-[13px] font-rocGroteskMedium text-gun-metal">
                                        Modes of movement
                                    </p>
                                    <i className="ri-arrow-down-s-line"></i>
                                </div>
                            }
                            dropdownContainerClasses={
                                " top-[51px] shadow-dropdownShadow rounded !border-0"
                            }
                            dropdownClassName={"!max-h-fit !w-fit"}
                            name={"modesMovement"}
                            dropdownOptions={[
                                {
                                    label: "All updates",
                                    value: "",
                                    action: () => console.log("first"),
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <Dropdown
                            value={""}
                            dropdown={
                                <div className="flex gap-1 items-center py-1.5 pl-4 pr-3 border rounded-[120px]">
                                    <p className="text-[13px] font-rocGroteskMedium text-gun-metal">
                                        Shipping Line
                                    </p>
                                    <i className="ri-arrow-down-s-line"></i>
                                </div>
                            }
                            dropdownContainerClasses={
                                "  top-[51px] shadow-dropdownShadow rounded !border-0"
                            }
                            dropdownClassName={"!max-h-fit !w-fit"}
                            name={"modesMovement"}
                            dropdownOptions={[
                                {
                                    label: "All updates",
                                    value: "",
                                    action: () => console.log("first"),
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <Dropdown
                            value={""}
                            dropdown={
                                <div className="flex gap-1 items-center py-1.5 pl-4 pr-3 border rounded-[120px]">
                                    <p className="text-[13px] font-rocGroteskMedium text-gun-metal">
                                        Service type
                                    </p>
                                    <i className="ri-arrow-down-s-line"></i>
                                </div>
                            }
                            dropdownContainerClasses={
                                " top-[51px] shadow-dropdownShadow rounded !border-0"
                            }
                            dropdownClassName={"!max-h-fit !w-fit"}
                            name={"modesMovement"}
                            dropdownOptions={[
                                {
                                    label: "All updates",
                                    value: "",
                                    action: () => console.log("first"),
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <Dropdown
                            value={""}
                            dropdown={
                                <div className="flex gap-1 items-center py-1.5 pl-4 pr-3 border rounded-[120px]">
                                    <p className="text-[13px] font-rocGroteskMedium text-gun-metal">
                                        Price range
                                    </p>
                                    <i className="ri-arrow-down-s-line"></i>
                                </div>
                            }
                            dropdownContainerClasses={
                                " top-[51px] shadow-dropdownShadow rounded !border-0"
                            }
                            dropdownClassName={"!max-h-fit !w-fit"}
                            name={"modesMovement"}
                            dropdownOptions={[
                                {
                                    label: "All updates",
                                    value: "",
                                    action: () => console.log("first"),
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <Dropdown
                            value={""}
                            dropdown={
                                <div className="flex gap-1 items-center py-1.5 pl-4 pr-3 border rounded-[120px]">
                                    <p className="text-[13px] font-rocGroteskMedium text-gun-metal">
                                        Expiration date
                                    </p>
                                    <i className="ri-arrow-down-s-line"></i>
                                </div>
                            }
                            dropdownContainerClasses={
                                " top-[51px] shadow-dropdownShadow rounded !border-0"
                            }
                            dropdownClassName={"!max-h-fit !w-fit"}
                            name={"modesMovement"}
                            dropdownOptions={[
                                {
                                    label: "All updates",
                                    value: "",
                                    action: () => console.log("first"),
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <Dropdown
                            value={""}
                            dropdown={
                                <div className="flex gap-1 items-center py-1.5 pl-4 pr-3 border rounded-[120px]">
                                    <p className="text-[13px] font-rocGroteskMedium text-gun-metal">
                                        Additional services
                                    </p>
                                    <i className="ri-arrow-down-s-line"></i>
                                </div>
                            }
                            dropdownContainerClasses={
                                " top-[51px] shadow-dropdownShadow rounded !border-0"
                            }
                            dropdownClassName={"!max-h-fit !w-fit"}
                            name={"modesMovement"}
                            dropdownOptions={[
                                {
                                    label: "All updates",
                                    value: "",
                                    action: () => console.log("first"),
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <Dropdown
                            value={""}
                            dropdown={
                                <div className="flex gap-1 items-center py-1.5 pl-4 pr-3 border rounded-[120px]">
                                    <p className="text-[13px] font-rocGroteskMedium text-gun-metal">
                                        More filters
                                    </p>
                                    <i className="ri-arrow-down-s-line"></i>
                                </div>
                            }
                            dropdownContainerClasses={
                                " top-[51px] shadow-dropdownShadow rounded !border-0"
                            }
                            dropdownClassName={"!max-h-fit !w-fit"}
                            name={"modesMovement"}
                            dropdownOptions={[
                                {
                                    label: "All updates",
                                    value: "",
                                    action: () => console.log("first"),
                                },
                            ]}
                        />
                    </div>
                </div> */}
            </div>

            <div className="px-[104px] relative">
                <p className="text-sm font-rocGroteskBold text-gun-metal relative top-[4px]">
                    {searchResults.length} instant Quotes
                </p>
                {/* <div className="flex gap-1 items-center py-1.5 px-3 rounded-[100px] bg-pacific-cyan w-fit m-auto sticky top-10 left-[45.5%]">
                    <i className="ri-arrow-up-line before:content-['\ea76'] before:text-white mt-[-3px]"></i>
                    <p className="text-sm font-rocGroteskMedium text-white">2 new results</p>
                </div> */}
                <div className="mt-6">
                    {searchResults && searchResults.length > 0 ? (
                        <>
                            {searchResults.map((value) => {
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
                                const price = formatMoney().format(value.price.amount)?.split(".");
                                const amountPrefix = price?.[0];
                                const amountSuffix = price?.[1];

                                return (
                                    <div
                                        key={value._id}
                                        className="w-full border rounded-[4px] p-6 flex items-center justify-between mb-4"
                                    >
                                        <div>
                                            <div>
                                                <div className="flex items-center gap-1 mb-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <div>
                                                            <ReactCountryFlag
                                                                countryCode={
                                                                    value.portOfOrigin.country
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
                                                            {truncate(originCountry?.name, {
                                                                length: 20,
                                                            })}
                                                        </p>
                                                    </div>

                                                    <span className="material-icons text-xs text-gun-metal font-bold">
                                                        arrow_forward
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <div>
                                                            <ReactCountryFlag
                                                                countryCode={
                                                                    value.portOfDestination.country
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
                                                            {truncate(destinationCountry?.name, {
                                                                length: 20,
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <i className="ri-building-4-fill"></i>
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-sm font-rocGroteskBold text-gun-metal">
                                                            {value.source?.toLowerCase() ===
                                                            "freightforwarder"
                                                                ? value?.freightForwarder?.profile
                                                                      ?.businessName
                                                                : value?.carrierName}
                                                        </p>
                                                        <img
                                                            src="https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687441433/Web%20App/dashboard/verified_mark_sharp_lkklfw.svg"
                                                            alt="verified check mark"
                                                            width={14}
                                                            height={14}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
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
                                                        {value.movementMode} freight{" "}
                                                        {value.source?.toLowerCase() ===
                                                        "freightforwarder"
                                                            ? ""
                                                            : "• " + value?.transitTime}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <i className="ri-time-fill before:content-['\f20e'] before:text-mvx-neutral"></i>
                                                    <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                                        Quote expires:{" "}
                                                        {moment(value.validity.to).format(
                                                            "MMM DD, YYYY"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex items-start">
                                                <p className="text-xl font-rocGroteskBold text-gun-metal">
                                                    {getCurrencyFromCurrencyCode(
                                                        value.price.currency
                                                    )}
                                                    {amountPrefix}.
                                                </p>
                                                <p className="text-xs font-rocGroteskBold text-gun-metal">
                                                    {amountSuffix ? amountSuffix : "00"}
                                                </p>
                                            </div>
                                            <div>
                                                <button
                                                    className="flex items-center justify-center text-white  bg-pacific-cyan font-rocGroteskMedium w-full py-2 px-4 text-sm rounded"
                                                    type={"button"}
                                                    onClick={() => {
                                                        navigate(
                                                            `/dashboard/instant-quote/${value._id}`
                                                        );
                                                    }}
                                                >
                                                    View Quote
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {currentPage === pagination?.number_of_pages && !getRatesLoading && (
                                <div className="flex w-full mt-2 justify-center">
                                    <p className="text-sm font-rocGroteskMedium">End of list</p>
                                </div>
                            )}
                            {getRatesLoading ? (
                                <div className="flex w-full mt-2 justify-center">
                                    <Loader color={"gun-metal"} />
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <div className="w-full flex justify-center mt-20">
                            <p className="text-xl font-rocGroteskMedium">No Quotes Found</p>
                        </div>
                    )}
                </div>
            </div>
            <a
                href="/dashboard/home"
                className="flex gap-2 items-center py-3 pl-4 px-5 rounded-[200px] bg-gun-metal w-fit m-auto fixed bottom-[100px] left-[43.5%]"
            >
                <i className="ri-arrow-left-line before:content-['\ea60'] before:text-white"></i>
                <p className="text-sm font-rocGroteskMedium text-white">Back to dashbooard</p>
            </a>
        </div>
    );
};

export default InstantQuoteSearchResult;
