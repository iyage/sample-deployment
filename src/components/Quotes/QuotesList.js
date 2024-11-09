/* eslint-disable react-hooks/exhaustive-deps */
import { paymentActions, quoteActions } from "actions";
import Dropdown from "components/common/Dropdown";
import Loader from "components/common/Loader";
import ModalContainer from "components/common/ModalContainer";
import NavTwo from "components/common/NavTwo";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import successImg from "assets/images/externalPages/waitlist-success.svg";
import cargoImg from "assets/images/shipments/cargo.svg";
import _ from "lodash";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isMobile } from "helpers";
import formatCurrency from "helpers/formatCurrency";
import { getTotalForPayment } from "helpers/getTotalForPayment";
import CustomToast from "components/common/CustomToast";
import toast from "react-hot-toast";
import SelectInput from "components/common/SelectInput";
import usFlag from "assets/images/dashboard/round_us_flag.svg";
import ukFlag from "assets/images/dashboard/round_uk_flag.svg";
import ngFlag from "assets/images/dashboard/round_ng_flag.svg";
import eurFlag from "assets/images/dashboard/round_eur_flag.svg";
import NewIncomingQuote from "./components/NewIncomingQuote";
import useModal from "components/common/Modals/ModalProvider";

const QuotesList = () => {
    const { openModal } = useModal();
    const [activeTab, setActiveTab] = useState(0);
    const [openFilter, setOpenFilter] = useState(false);
    const [openMobileFilter, setOpenMobileFilter] = useState(false);
    const [isAcceptRequestModalOpen, setIsAcceptRequestModalOpen] = useState(false);
    const [isRejectRequestModalOpen, setIsRejectRequestModalOpen] = useState(false);
    const [isAcceptRequestSuccessModalOpen, setIsAcceptRequestSuccessModalOpen] = useState(false);
    const [isRejectRequestSuccessModalOpen, setIsRejectRequestSuccessModalOpen] = useState(false);
    const [generatePaymentModal, setGeneratePaymentModal] = useState(false);
    const [generatePaymentSuccessModal, setGeneratePaymentSuccessModal] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState({});
    const [openFilterChild, setOpenFilterChild] = useState(false);
    const [activeFilterOption, setActiveFilterOption] = useState(null);
    const [activeFilterChildOption, setActiveFilterChildOption] = useState(null);
    const [quotesData, setQuotesData] = useState([]);
    const [externalQuotesData, setExternalQuotesData] = useState([]);
    const [outgoingQuoteRequestData, setOutgoingQuoteRequestData] = useState([]);
    const [quotesInfo, setQuotesInfo] = useState([]);
    const [externalQuotesInfo, setExternalQuotesInfo] = useState([]);
    const [outgoingQuoteRequestInfo, setOutgoingQuoteRequestInfo] = useState([]);
    const [currentPage, setCurrentPage] = useState({
        allQuotesPage: 1,
        externalQuotesPage: 1,
        outgoingRequestQuotesPage: 1,
        incomingRequestQuotesPage: 1,
    });
    const [completedTab, setCompletedTab] = useState({
        allQuotesTabCompleted: false,
        externalQuotesTabCompleted: false,
        outgoingRequestsTabCompleted: false,
        incomingRequestsTabCompleted: false,
    });
    const [paymentLinkData, setPaymentLinkData] = useState({
        amount: "",
        note: "",
        currency: "",
        platformFee: "",
    });
    const [analytics, setAnalytics] = useState([]);
    const tabs = [
        "your quotes",
        "external quotes",
        "outgoing requests",
        "incoming requests",
        "approval requests",
    ];
    const dispatch = useDispatch();
    const [param] = useSearchParams();
    const quoteId = param.get("id");
    const navigate = useNavigate();
    const filterRef = useRef(null);
    const mobileFilterRef = useRef(null);
    const {
        isFetchingQuotes,
        quotes,
        externalQuotes,
        isFetchingExternalQuotes,
        quotesAnalytics,
        isFetchingOutgingQuoteRequests,
        outgoingQuoteRequests,
        isFFAcceptingQuote,
        FFAcceptedQuoteSuccess,
        isFFRejectingQuote,
        FFRejectedQuoteSuccess,
        singleQuoteData,
        isFetchingSingleQuote,
    } = useSelector((state) => state.quote);
    const { createPaymentLinkLoading, createPaymentLinkSuccess } = useSelector(
        (state) => state.payment
    );
    const displayActiveTabData = () => {
        switch (activeTab) {
            case 0:
                return quotesInfo.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });
            case 1:
                return externalQuotesInfo.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });
            case 2:
                return outgoingQuoteRequestInfo.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });
            default:
                return quotesInfo.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });
        }
    };

    const tableData = displayActiveTabData();

    const displayStatus = (status) => {
        let color;
        switch (status) {
            case "active":
                color = "#1C56F2";
                break;
            case "pending":
                color = "#FF8A00";
                break;
            case "completed":
                color = "#16C6A4";
                break;
            case "rejected":
                color = "#F90000";
                break;
            default:
                color = "#6C42F5";
                break;
        }
        return (
            <span className={`material-icons text-[8px]`} style={{ color }}>
                fiber_manual_record
            </span>
        );
    };

    const filterOptions = [
        {
            label: "Pending Quotes",
            value: "pending",
        },
        {
            label: "Accepted Quotes",
            value: "accepted",
        },
        {
            label: "Rejected Quotes",
            value: "rejected",
        },
        {
            label: "Date",
            value: "date",
            children: [
                {
                    label: "Today",
                    value: 0,
                },
                {
                    label: "Last 7 days",
                    value: 7,
                },
                {
                    label: "Last 30 days",
                    value: 30,
                },
                {
                    label: "Last 90 days",
                    value: 90,
                },
                {
                    label: "Last year",
                    value: 365,
                },
            ],
        },
    ];

    const displayOptions = useCallback(() => {
        switch (activeTab) {
            case 0:
                return [
                    {
                        label: "View Quote",
                        value: "View Quote",
                        action: () => {
                            const a = document.createElement("a");
                            a.href = selectedQuote?.file?.path;
                            a.target = "_blank";
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        },
                        disabled: !Boolean(selectedQuote?.file?.path),
                    },
                    {
                        label: "Generate Payment Link",
                        value: "Generate Payment Link",
                        action: () => {
                            setGeneratePaymentModal(true);
                        },
                        disabled: selectedQuote?.quoteType?.toLowerCase() !== "customer",
                    },
                    {
                        label: "Save Quote",
                        value: "Save Quote",
                        action: () => {
                            fetch(selectedQuote?.file?.path).then((response) => {
                                response.blob().then((blob) => {
                                    // Creating new object of PDF file
                                    const fileURL = window.URL.createObjectURL(blob);

                                    let alink = document.createElement("a");
                                    alink.href = fileURL;
                                    alink.download =
                                        selectedQuote?.file?.fileName ??
                                        selectedQuote?.file?.filename;
                                    alink.click();
                                });
                            });
                        },
                        disabled: !Boolean(selectedQuote?.file?.path),
                    },
                ];
            case 1:
                return [
                    {
                        label: "View Quote",
                        value: "View Quote",
                        action: () => {
                            const a = document.createElement("a");
                            a.href = selectedQuote?.file?.path;
                            a.target = "_blank";
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        },
                        disabled: !Boolean(selectedQuote?.file?.path),
                    },
                    {
                        label: "Make Payment",
                        value: "Make Payment",
                        action: () => {
                            const total = getTotalForPayment(selectedQuote);
                            setPaymentLinkData((prev) => {
                                return {
                                    ...prev,
                                    amount: total?.amount,
                                    currency: total?.currency,
                                    platformFee: total.platformFee,
                                    note: "Payment for quote",
                                };
                            });
                            setGeneratePaymentModal(true);
                        },
                        disabled: selectedQuote?.status?.toLowerCase() !== "accepted",
                    },
                    {
                        label: "Accept Quote",
                        value: "Accept Quote",
                        action: () => setIsAcceptRequestModalOpen(true),
                        disabled:
                            selectedQuote?.status?.toLowerCase() === "accepted" ||
                            selectedQuote?.status?.toLowerCase() === "rejected",
                    },

                    {
                        label: "Reject Quote",
                        value: "Reject Quote",
                        action: () => setIsRejectRequestModalOpen(true),
                        disabled:
                            selectedQuote?.status?.toLowerCase() === "accepted" ||
                            selectedQuote?.status?.toLowerCase() === "rejected",
                    },
                ];
            case 2:
                return [];
            case 3:
                return [
                    {
                        label: "Create Quote",
                        value: "Create Quote",
                        action: () =>
                            navigate(
                                `/dashboard/create-quote/customer/${selectedQuote?.shipmentId}?requestId=${selectedQuote?._id}`
                            ),
                        disabled: selectedQuote?.status?.toLowerCase() !== "accepted",
                    },
                ];
            default:
                break;
        }
    }, [activeTab, selectedQuote]);

    const displayQuotes = useCallback(() => {
        return tableData && tableData.length > 0 ? (
            tableData?.map((data) => {
                return (
                    <div
                        key={data.mvxid}
                        onClick={() => {
                            if (activeTab < 2 && Boolean(data?.file?.path)) {
                                const a = document.createElement("a");
                                a.href = data?.file?.path;
                                a.target = "_blank";
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            }
                        }}
                        className={`${activeTab < 2 && "hover:bg-[#FAFBFC] cursor-pointer"}`}
                    >
                        <hr />
                        <div className="max-sm:hidden w-full grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_1fr_0.2fr] py-3 px-4 gap-3">
                            <div className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                {data?.mvxid}
                            </div>
                            <div className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                {_.truncate(data?.shipment?.shipperDetails?.fullName, {
                                    length: 20,
                                })}
                            </div>

                            <div className="capitalize flex items-center justify-between text-sm font-rocGroteskMedium text-gun-metal pr-2">
                                <span className="text-inherit text-left w-[42%]">
                                    {data?.shipment?.origin?.address}
                                </span>{" "}
                                <span className="material-icons-outlined text-sm">east</span>
                                <span className="text-inherit text-right w-[42%]">
                                    {data?.shipment?.destination?.address}
                                </span>
                            </div>
                            <div className="flex justify-start gap-2 items-center text-sm font-rocGroteskMedium text-gun-metal">
                                {displayStatus(data?.status?.toLowerCase())}
                                <span className="capitalize">{data?.status}</span>
                            </div>
                            <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                {data?.shipment?.loadType ?? "-"}
                            </div>
                            <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                {data?.shipment?.serviceMode}
                            </div>
                            {/* <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                ${" "}
                                {String(total)?.length > 8
                                    ? millify(total, {
                                          precision: 2,
                                          lowercase: true,
                                      })
                                    : formatMoney().format(total.toFixed(2))}
                            </div> */}
                            <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                {moment(data?.dueDate).format("MMM DD, YYYY")}
                            </div>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal"
                            >
                                {displayOptions()?.length > 0 ? (
                                    <div
                                        className={`flex justify-center items-center w-8 h-8 rounded-full hover:bg-mvx-light-blue ${
                                            data?._id === selectedQuote?.id && "bg-mvx-light-blue"
                                        }`}
                                    >
                                        <Dropdown
                                            value={""}
                                            dropdown={
                                                <span
                                                    onClick={() => setSelectedQuote(data)}
                                                    className="material-icons text-base"
                                                >
                                                    more_vert
                                                </span>
                                            }
                                            dropdownContainerClasses={
                                                "left-[-100px] shadow-dropdownShadow border-0 rounded"
                                            }
                                            name={data.freightForwarderId}
                                            dropdownOptions={displayOptions()}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="hidden max-sm:block">
                            <div className="py-5">
                                <div className="flex justify-between mb-1.5">
                                    <div>
                                        <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                            TA {data?.mvxid} -{" "}
                                            {data?.shipment?.shipperDetails?.fullName}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="text-sm text-gun-metal">
                                                {_.truncate(data?.shipment?.origin?.address, {
                                                    length: 20,
                                                })}
                                            </span>
                                            <span className="material-icons text-sm font-normal">
                                                arrow_forward
                                            </span>
                                            <span className="text-sm text-gun-metal">
                                                {_.truncate(data?.shipment?.destination?.address, {
                                                    length: 20,
                                                })}
                                            </span>
                                        </p>
                                    </div>
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className=" flex items-center justify-start text-xs font-rocGroteskMedium text-gun-metal"
                                    >
                                        {displayOptions()?.length > 0 ? (
                                            <div
                                                className={`flex justify-center items-center w-8 h-8 rounded-full hover:bg-mvx-light-blue ${
                                                    data?._id === selectedQuote?.id &&
                                                    "bg-mvx-light-blue"
                                                }`}
                                            >
                                                <Dropdown
                                                    value={""}
                                                    dropdown={
                                                        <span
                                                            onClick={() => setSelectedQuote(data)}
                                                            className="material-icons text-base"
                                                        >
                                                            more_vert
                                                        </span>
                                                    }
                                                    dropdownContainerClasses={
                                                        "left-[-100px] shadow-dropdownShadow border-0 rounded"
                                                    }
                                                    name={data.freightForwarderId}
                                                    dropdownOptions={displayOptions()}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center bg-mvx-light-blue rounded px-2 py-1 w-fit">
                                        <span className="material-icons mx-2 text-sm text-mvx-neutral">
                                            {data?.shipment?.serviceMode?.toLowerCase() === "land"
                                                ? "local_shipping"
                                                : data?.shipment?.serviceMode?.toLowerCase() ===
                                                  "air"
                                                ? "flight_takeoff"
                                                : "directions_boat"}
                                        </span>
                                        <span className="text-xs text-mvx-neutral">
                                            {data?.shipment?.serviceMode}
                                        </span>
                                    </div>
                                    <div className="flex justify-start gap-2 items-center text-xs font-rocGroteskMedium text-gun-metal">
                                        {displayStatus(data?.status?.toLowerCase())}
                                        <span className="capitalize">{data?.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })
        ) : (
            <div>
                <hr />
                <div className="flex flex-col items-center p-16 ">
                    <img width={42} className="mb-4" src={cargoImg} alt="cargo" />
                    <p className="text-center mb-1 text-lg text-gun-metal font-rocGroteskMedium">
                        No Quotes
                    </p>
                    <p className="text-center text-gun-metal text-sm">You don't have any quotes.</p>
                </div>
            </div>
        );
    }, [
        quotesInfo,
        externalQuotesInfo,
        outgoingQuoteRequestInfo,
        activeTab,
        tableData,
        selectedQuote,
    ]);

    const onScroll = () => {
        let lastScrollTop = 0;
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        let st = window.pageYOffset || document.documentElement.scrollTop;
        const condition = isMobile
            ? scrollTop + clientHeight >= scrollHeight - 65
            : scrollTop + clientHeight >= scrollHeight;

        if (condition && st > lastScrollTop) {
            switch (activeTab) {
                case 0: {
                    if (quotesData?.pagination?.current < quotesData?.pagination?.number_of_pages) {
                        setCurrentPage((prev) => {
                            return {
                                ...prev,
                                allQuotesPage: quotesData?.pagination?.current + 1,
                            };
                        });
                    }

                    break;
                }
                case 1: {
                    if (
                        externalQuotesData?.pagination?.current <
                        externalQuotesData?.pagination?.number_of_pages
                    ) {
                        setCurrentPage((prev) => {
                            return {
                                ...prev,
                                externalQuotesPage: prev.externalQuotesPage + 1,
                            };
                        });
                    }

                    break;
                }
                case 2: {
                    if (
                        outgoingQuoteRequestData?.pagination?.current <
                        outgoingQuoteRequestData?.pagination?.number_of_pages
                    ) {
                        setCurrentPage((prev) => {
                            return {
                                ...prev,
                                outgoingRequestQuotesPage: prev.outgoingRequestQuotesPage + 1,
                            };
                        });
                    }

                    break;
                }
                default:
                    break;
            }
        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    };

    useEffect(() => {
        if (Boolean(quoteId)) {
            dispatch(quoteActions.fetchSingleQuote(quoteId));
        }
    }, [dispatch, quoteId]);

    useEffect(() => {
        if (Boolean(quoteId) && Boolean(singleQuoteData)) {
            if (Boolean(singleQuoteData?.file?.path)) {
                const a = document.createElement("a");
                a.href = singleQuoteData?.file?.path;
                a.target = "_blank";
                document.body.appendChild(a);
                a.click();
                // navigate("/dashboard/quotes", { replace: true });
                document.body.removeChild(a);
            }
        }
    }, [singleQuoteData]);

    useEffect(() => {
        dispatch(
            quoteActions.fetchQuotes(
                Boolean(activeFilterOption) ? 1 : currentPage.allQuotesPage,
                typeof activeFilterOption === "string" && activeFilterOption !== "date"
                    ? activeFilterOption
                    : "",
                typeof activeFilterChildOption === "number"
                    ? moment().subtract(activeFilterChildOption, "days").format("DD-MM-YYYY")
                    : "",
                ""
            )
        );
    }, [dispatch, currentPage.allQuotesPage, activeFilterChildOption, activeFilterOption]);

    useEffect(() => {
        dispatch(quoteActions.fetchExternalQuotes(currentPage.externalQuotesPage));
    }, [dispatch, currentPage.externalQuotesPage]);

    useEffect(() => {
        dispatch(quoteActions.fetchOutgoingQuoteRequests(currentPage.outgoingRequestQuotesPage));
    }, [dispatch, currentPage.outgoingRequestQuotesPage]);

    useEffect(() => {
        dispatch(quoteActions.fetchIncomingQuoteRequests(currentPage.incomingRequestQuotesPage));
    }, [dispatch, currentPage.incomingRequestQuotesPage]);

    useEffect(() => {
        dispatch(quoteActions.fetchQuotesAnalytics());
    }, [dispatch]);

    useEffect(() => {
        if (Boolean(quotes)) {
            setQuotesData(quotes);
            if (Boolean(activeFilterChildOption) || Boolean(activeFilterOption)) {
                setQuotesInfo(quotes.data);
            } else {
                setQuotesInfo((prevState) => _.uniqWith([...prevState, ...quotes.data], _.isEqual));
            }
        }
    }, [quotes, activeFilterChildOption, activeFilterOption]);

    useEffect(() => {
        if (Boolean(externalQuotes)) {
            setExternalQuotesData(externalQuotes);
            if (Boolean(activeFilterChildOption) || Boolean(activeFilterOption)) {
                setExternalQuotesInfo(externalQuotes.data);
            } else {
                setExternalQuotesInfo((prevState) =>
                    _.uniqWith([...prevState, ...externalQuotes.data], _.isEqual)
                );
            }
        }
    }, [externalQuotes]);

    useEffect(() => {
        if (Boolean(outgoingQuoteRequests)) {
            setOutgoingQuoteRequestData(outgoingQuoteRequests);
            if (Boolean(activeFilterChildOption) || Boolean(activeFilterOption)) {
                setOutgoingQuoteRequestInfo(outgoingQuoteRequests.data);
            } else {
                setOutgoingQuoteRequestInfo((prevState) =>
                    _.uniqWith([...prevState, ...outgoingQuoteRequests.data], _.isEqual)
                );
            }
        }
    }, [outgoingQuoteRequests]);

    useEffect(() => {
        setAnalytics(quotesAnalytics?.data?.graphData);
    }, [quotesAnalytics]);

    useEffect(() => {
        if (Boolean(FFAcceptedQuoteSuccess)) {
            const externalQuotesCopy = [...externalQuotesInfo];
            const externalItemIndex = _.findIndex(externalQuotesCopy, [
                "_id",
                FFAcceptedQuoteSuccess.quote._id,
            ]);
            const allQuotesCopy = [...quotesInfo];
            const allItemIndex = _.findIndex(allQuotesCopy, [
                "_id",
                FFAcceptedQuoteSuccess.quote._id,
            ]);

            if (externalItemIndex !== -1) {
                externalQuotesCopy[externalItemIndex].status = "accepted";
                setExternalQuotesInfo(externalQuotesCopy);
            }
            if (allItemIndex !== -1) {
                allQuotesCopy[allItemIndex].status = "accepted";
                setExternalQuotesInfo(allQuotesCopy);
            }
            setIsAcceptRequestModalOpen(false);
            setIsAcceptRequestSuccessModalOpen(true);
            dispatch(quoteActions.resetFFAcceptRejectSuccessData());
        }
    }, [dispatch, FFAcceptedQuoteSuccess]);

    useEffect(() => {
        if (Boolean(FFRejectedQuoteSuccess)) {
            const externalQuotesCopy = [...externalQuotesInfo];
            const externalItemIndex = _.findIndex(externalQuotesCopy, [
                "_id",
                FFRejectedQuoteSuccess.quote._id,
            ]);
            const allQuotesCopy = [...quotesInfo];
            const allItemIndex = _.findIndex(allQuotesCopy, [
                "_id",
                FFRejectedQuoteSuccess.quote._id,
            ]);

            if (externalItemIndex !== -1) {
                externalQuotesCopy[externalItemIndex].status = "rejected";
                setExternalQuotesInfo(externalQuotesCopy);
            }
            if (allItemIndex !== -1) {
                allQuotesCopy[allItemIndex].status = "rejected";
                setExternalQuotesInfo(allQuotesCopy);
            }
            setIsRejectRequestModalOpen(false);
            setIsRejectRequestSuccessModalOpen(true);
            dispatch(quoteActions.resetFFAcceptRejectSuccessData());
        }
    }, [FFRejectedQuoteSuccess]);

    useEffect(() => {
        if (Boolean(createPaymentLinkSuccess)) {
            setGeneratePaymentModal(false);
            setPaymentLinkData({
                amount: "",
                note: "",
                currency: "",
                platformFee: "",
            });

            if (selectedQuote?.quoteType?.toLowerCase() === "customer") {
                setGeneratePaymentSuccessModal(true);
            } else {
                dispatch(paymentActions.resetCreatePaymentLinkData());
                navigate(`/payment/${createPaymentLinkSuccess?.data?._id}`);
            }
        }
    }, [createPaymentLinkSuccess]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target) && openFilter) {
                setOpenFilter(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filterRef, openFilter]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                mobileFilterRef.current &&
                !mobileFilterRef.current.contains(event.target) &&
                openMobileFilter
            ) {
                setOpenMobileFilter(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mobileFilterRef, openMobileFilter]);

    useEffect(() => {
        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [onScroll]);

    useEffect(() => {
        if (currentPage.allQuotesPage === quotesData?.pagination?.number_of_pages) {
            setCompletedTab((prev) => {
                return {
                    ...prev,
                    allQuotesTabCompleted: true,
                };
            });
        }
        if (currentPage.externalQuotesPage === externalQuotesData?.pagination?.number_of_pages) {
            setCompletedTab((prev) => {
                return {
                    ...prev,
                    externalQuotesTabCompleted: true,
                };
            });
        }
        if (
            currentPage.outgoingRequestQuotesPage ===
            outgoingQuoteRequestData?.pagination?.number_of_pages
        ) {
            setCompletedTab((prev) => {
                return {
                    ...prev,
                    outgoingRequestsTabCompleted: true,
                };
            });
        }
    }, [
        quotesData?.pagination,
        quotesData?.pagination?.number_of_pages,
        currentPage.allQuotesPage,
        currentPage.externalQuotesPage,
        currentPage.outgoingRequestQuotesPage,
        currentPage.incomingRequestQuotesPage,
        externalQuotesData?.pagination?.number_of_pages,
        outgoingQuoteRequestData?.pagination?.number_of_pages,
        completedTab.allQuotesTabCompleted,
        completedTab.externalQuotesTabCompleted,
        completedTab.outgoingRequestsTabCompleted,
        completedTab.incomingRequestsTabCompleted,
    ]);

    if (!analytics || analytics?.length === 0 || isFetchingSingleQuote) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <NavTwo />
            <NewIncomingQuote />

            <div className={`mb-16 mt-[140px] px-[104px] max-lg:my-4 max-lg:px-4`}>
                <div className="flex items-center justify-between w-full mb-6 max-sm:mb-8">
                    <p className="font-rocGroteskBold text-2xl text-gun-metal max-sm:text-base">
                        Quote Management
                    </p>
                    <div className="items-center hidden max-sm:flex gap-4">
                        <div className="relative">
                            <div
                                onClick={() => {
                                    setOpenMobileFilter(!openMobileFilter);
                                    setOpenFilterChild(false);
                                }}
                                className="text-sm text-mvx-neutral font-rocGroteskMedium rounded cursor-pointer flex gap-2 items-center justify-center"
                            >
                                <span className="material-icons text-xl">filter_list</span>
                                {Boolean(activeFilterOption) && (
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenFilter(false);
                                            setOpenFilterChild(false);
                                            setActiveFilterOption(null);
                                            setActiveFilterChildOption(null);
                                            setCurrentPage(() => ({
                                                allQuotesPage: 1,
                                                externalQuotesPage: 1,
                                                outgoingRequestQuotesPage: 1,
                                            }));
                                        }}
                                        className="material-icons text-base"
                                    >
                                        cancel
                                    </span>
                                )}
                            </div>
                            {openMobileFilter && (
                                <div
                                    ref={mobileFilterRef}
                                    className="absolute top-[38px] left-[-140px]"
                                >
                                    <div
                                        className={`min-w-max py-2 bg-white relative w-full h-auto max-h-64 z-20 overflow-auto border `}
                                    >
                                        {filterOptions.map((option, idx) => {
                                            return (
                                                <div className="" key={idx}>
                                                    <div
                                                        onClick={() => {
                                                            setActiveFilterOption(option.value);
                                                            setOpenFilterChild(true);
                                                            if (
                                                                !option?.children &&
                                                                !option?.customChild
                                                            ) {
                                                                setOpenFilter(false);
                                                                setOpenFilterChild(false);
                                                                setActiveFilterChildOption(null);
                                                            }
                                                        }}
                                                        className={`flex gap-8 items-center px-6 justify-between hover:bg-mvx-light-blue ${
                                                            option?.value === activeFilterOption &&
                                                            "bg-mvx-light-blue"
                                                        } cursor-pointer `}
                                                    >
                                                        <p
                                                            className={`text-sm flex gap-3 py-3 items-center font-rocGroteskMedium text-inherit`}
                                                        >
                                                            {option?.icon && (
                                                                <span>{option?.icon}</span>
                                                            )}{" "}
                                                            <span className="text-inherit">
                                                                {option?.label}
                                                            </span>
                                                        </p>
                                                        {(option?.children ||
                                                            option?.customChild) && (
                                                            <span className="material-icons text-xl">
                                                                navigate_next
                                                            </span>
                                                        )}
                                                        {option?.value === activeFilterOption &&
                                                            !option?.children &&
                                                            !option?.customChild && (
                                                                <span className="material-icons text-mvx-black text-base">
                                                                    done
                                                                </span>
                                                            )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {filterOptions.find((item) => item.value === activeFilterOption)
                                        ?.children &&
                                        filterOptions.find(
                                            (item) => item.value === activeFilterOption
                                        )?.children.length > 0 &&
                                        openFilterChild && (
                                            <div
                                                className={`min-w-max absolute py-2 bg-white top-[30%] left-[-100%] w-full h-auto max-h-64 z-20 overflow-auto border `}
                                            >
                                                {filterOptions
                                                    .find(
                                                        (item) => item.value === activeFilterOption
                                                    )
                                                    .children.map(({ label, value, icon }) => {
                                                        return (
                                                            <div
                                                                key={value}
                                                                onClick={() => {
                                                                    // setActiveFilterOption(null);
                                                                    setActiveFilterChildOption(
                                                                        value
                                                                    );

                                                                    setOpenFilter(false);
                                                                }}
                                                                className={`flex gap-8 items-center pl-4 pr-1 justify-between hover:bg-mvx-light-blue ${
                                                                    value ===
                                                                        activeFilterChildOption &&
                                                                    "bg-mvx-light-blue"
                                                                } cursor-pointer `}
                                                            >
                                                                <p
                                                                    className={`text-sm flex gap-3 py-3 items-center font-rocGroteskMedium text-inherit`}
                                                                >
                                                                    {icon && <span>{icon}</span>}{" "}
                                                                    <span className="text-inherit">
                                                                        {label}
                                                                    </span>
                                                                </p>

                                                                {value ===
                                                                    activeFilterChildOption && (
                                                                    <span className="material-icons text-mvx-black text-base">
                                                                        done
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        )}
                                    {filterOptions.find((item) => item.value === activeFilterOption)
                                        ?.customChild &&
                                        openFilterChild && (
                                            <div
                                                className={`min-w-max absolute py-2 bg-white top-[47%] left-[-133%] w-full h-auto max-h-64 z-20 overflow-auto border `}
                                            >
                                                <div
                                                    className={`flex gap-8 items-center px-1 justify-between  cursor-pointer `}
                                                >
                                                    {
                                                        filterOptions.find(
                                                            (item) =>
                                                                item.value === activeFilterOption
                                                        ).customChild
                                                    }
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                        <i
                            className="ri-add-circle-fill text-xl"
                            onClick={() => openModal("create_quote")}
                        ></i>
                    </div>
                </div>

                <div className="flex gap-6 mb-20 max-sm:mb-10 max-sm:grid max-sm:grid-cols-2 max-sm:gap-4">
                    <div className="max-sm:pt-4 pt-[45px] w-[275px] max-sm:w-fit">
                        <p className="mb-1 font-rocGroteskBold text-[32px] max-sm:text-xl text-gun-metal">
                            {analytics?.[0]?.quoteDetails?.[0]?.count
                                ? analytics?.[0]?.quoteDetails?.[0]?.count
                                : 0}
                        </p>
                        <p className="font-rocGroteskMedium text-sm text-gun-metal">Total Quotes</p>
                    </div>
                    <div className="max-sm:pt-4 pt-[45px] w-[275px] max-sm:w-fit">
                        <p className="mb-1 font-rocGroteskBold text-[32px] max-sm:text-xl text-gun-metal">
                            {analytics?.[0]?.quoteDetails?.[0]?.accepted
                                ? analytics?.[0]?.quoteDetails?.[0]?.accepted
                                : 0}
                        </p>

                        <p className="font-rocGroteskMedium text-sm text-gun-metal">
                            Accepted Quotes
                        </p>
                    </div>
                    <div className="max-sm:pt-4 pt-[45px] w-[275px] max-sm:w-fit">
                        <p className="mb-1 font-rocGroteskBold text-[32px] max-sm:text-xl text-gun-metal">
                            {analytics?.[0]?.quoteDetails?.[0]?.rejected
                                ? analytics?.[0]?.quoteDetails?.[0]?.rejected
                                : 0}
                        </p>
                        <p className="font-rocGroteskMedium text-sm text-gun-metal">
                            Rejected Quotes
                        </p>
                    </div>
                    <div className="max-sm:pt-4 pt-[45px] w-[275px] max-sm:w-fit">
                        <p className="mb-1 font-rocGroteskBold text-[32px] max-sm:text-xl text-gun-metal">
                            {analytics?.[0]?.quoteDetails?.[0]?.pending
                                ? analytics?.[0]?.quoteDetails?.[0]?.pending
                                : 0}
                        </p>

                        <p className="font-rocGroteskMedium text-sm text-gun-metal">
                            Pending Quotes
                        </p>
                    </div>
                </div>
                <div>
                    <div className="mb-6">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex gap-8 max-sm:gap-6 max-sm:justify-between max-sm:w-full">
                                {tabs.map((tab, idx) => {
                                    const firstWord = tab.split(" ")[0];
                                    return Boolean(activeFilterOption) ? (
                                        idx === 0 ? (
                                            <div
                                                key={idx}
                                                onClick={() => setActiveTab(idx)}
                                                className={`flex gap-1 items-center justify-center ${
                                                    activeTab === idx &&
                                                    "border-b-[3px] border-gun-metal"
                                                } w-fit py-2 cursor-pointer`}
                                            >
                                                <p
                                                    className={`text-sm capitalize font-rocGroteskMedium ${
                                                        activeTab === idx
                                                            ? "text-gun-metal"
                                                            : "text-mvx-neutral"
                                                    }`}
                                                >
                                                    <span className="text-inherit hidden max-lg:block">
                                                        {idx === 0 ? "All" : firstWord}
                                                    </span>
                                                    <span className="text-inherit max-lg:hidden">
                                                        {tab}
                                                    </span>
                                                </p>
                                                {activeTab === idx && (
                                                    <p className="flex justify-center items-center text-xs font-rocGroteskMedium text-mvx-neutral py-[2px] px-2 bg-[#E4E5E7] rounded-[10px]">
                                                        {tableData?.length}
                                                    </p>
                                                )}
                                            </div>
                                        ) : null
                                    ) : (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveTab(idx)}
                                            className={`flex gap-1 items-center justify-center ${
                                                activeTab === idx && "border-b-2 border-gun-metal"
                                            } w-fit py-2 cursor-pointer`}
                                        >
                                            <p
                                                className={`text-sm capitalize font-rocGroteskMedium ${
                                                    activeTab === idx
                                                        ? "text-gun-metal"
                                                        : "text-mvx-neutral"
                                                }`}
                                            >
                                                <span className="text-inherit hidden max-lg:block">
                                                    {idx === 0 ? "All" : firstWord}
                                                </span>
                                                <span className="text-inherit max-lg:hidden">
                                                    {tab}
                                                </span>
                                            </p>
                                            {activeTab === idx && (
                                                <p className="flex justify-center items-center text-xs font-rocGroteskMedium text-mvx-neutral py-[2px] px-2 bg-[#E4E5E7] rounded-[10px]">
                                                    {tableData?.length}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-4 max-sm:hidden">
                                <button
                                    className="bg-pacific-cyan text-white font-rocGroteskMedium w-full py-2 text-sm rounded ml-3"
                                    type={"button"}
                                    onClick={() => openModal("create_quote")}
                                >
                                    Create Quote
                                </button>
                                {activeTab === 0 && (
                                    <div className="relative">
                                        <div
                                            onClick={() => {
                                                setOpenFilter(!openFilter);
                                                setOpenFilterChild(false);
                                            }}
                                            className="py-1.5 px-3 border-[1.5px] border-gun-metal text-sm text-mvx-neutral font-rocGroteskMedium rounded cursor-pointer flex gap-2 items-center justify-center"
                                        >
                                            <span className="material-icons text-[17px]">
                                                filter_list
                                            </span>{" "}
                                            <span>Filter</span>
                                            {(Boolean(activeFilterOption) ||
                                                Boolean(activeFilterChildOption)) && (
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenFilter(false);
                                                        setOpenFilterChild(false);
                                                        setActiveFilterOption(null);
                                                        setActiveFilterChildOption(null);
                                                        setCurrentPage(() => ({
                                                            allQuotesPage: 1,
                                                            externalQuotesPage: 1,
                                                            outgoingRequestQuotesPage: 1,
                                                        }));
                                                    }}
                                                    className="material-icons text-base"
                                                >
                                                    cancel
                                                </span>
                                            )}
                                        </div>
                                        {openFilter && (
                                            <div
                                                ref={filterRef}
                                                className="absolute top-[38px] left-[-80px]"
                                            >
                                                <div
                                                    className={`shadow-dropdownShadow rounded min-w-max py-2 bg-white relative w-full h-auto max-h-64 z-20 overflow-auto border `}
                                                >
                                                    {filterOptions.map((option, idx) => {
                                                        return (
                                                            <div className="" key={idx}>
                                                                <div
                                                                    onClick={() => {
                                                                        setActiveFilterOption(
                                                                            option.value
                                                                        );
                                                                        setOpenFilterChild(true);
                                                                        if (
                                                                            !option?.children &&
                                                                            !option?.customChild
                                                                        ) {
                                                                            setOpenFilter(false);
                                                                            setOpenFilterChild(
                                                                                false
                                                                            );
                                                                            setActiveFilterChildOption(
                                                                                null
                                                                            );
                                                                        }
                                                                    }}
                                                                    onMouseEnter={() => {
                                                                        if (
                                                                            option?.children ||
                                                                            option?.customChild
                                                                        ) {
                                                                            setActiveFilterOption(
                                                                                option.value
                                                                            );
                                                                            setOpenFilterChild(
                                                                                true
                                                                            );
                                                                        }
                                                                    }}
                                                                    className={`flex gap-8 items-center px-6 justify-between hover:bg-mvx-light-blue ${
                                                                        option?.value ===
                                                                            activeFilterOption &&
                                                                        "bg-mvx-light-blue"
                                                                    } cursor-pointer `}
                                                                >
                                                                    <p
                                                                        className={`text-sm flex gap-3 py-3 items-center font-rocGroteskMedium text-inherit`}
                                                                    >
                                                                        {option?.icon && (
                                                                            <span>
                                                                                {option?.icon}
                                                                            </span>
                                                                        )}{" "}
                                                                        <span className="text-inherit">
                                                                            {option?.label}
                                                                        </span>
                                                                    </p>
                                                                    {(option?.children ||
                                                                        option?.customChild) && (
                                                                        <span className="material-icons text-xl">
                                                                            navigate_next
                                                                        </span>
                                                                    )}
                                                                    {option?.value ===
                                                                        activeFilterOption &&
                                                                        !option?.children &&
                                                                        !option?.customChild && (
                                                                            <span className="material-icons text-mvx-black text-base">
                                                                                done
                                                                            </span>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {openFilterChild && (
                                                    <div
                                                        className={`shadow-dropdownShadow rounded min-w-max absolute py-2 bg-white absolute top-[30%] left-[-100%] w-full h-auto max-h-64 z-20 overflow-auto border `}
                                                    >
                                                        {filterOptions
                                                            .find(
                                                                (item) =>
                                                                    item.value ===
                                                                    activeFilterOption
                                                            )
                                                            .children.map(
                                                                ({ label, value, icon }) => {
                                                                    return (
                                                                        <div
                                                                            key={value}
                                                                            onClick={() => {
                                                                                setActiveFilterChildOption(
                                                                                    value
                                                                                );

                                                                                setOpenFilter(
                                                                                    false
                                                                                );
                                                                            }}
                                                                            className={`flex gap-8 items-center pl-4 pr-1 justify-between hover:bg-mvx-light-blue ${
                                                                                value ===
                                                                                    activeFilterChildOption &&
                                                                                "bg-mvx-light-blue"
                                                                            } cursor-pointer `}
                                                                        >
                                                                            <p
                                                                                className={`text-sm flex gap-3 py-3 items-center font-rocGroteskMedium text-inherit`}
                                                                            >
                                                                                {icon && (
                                                                                    <span>
                                                                                        {icon}
                                                                                    </span>
                                                                                )}{" "}
                                                                                <span className="text-inherit">
                                                                                    {label}
                                                                                </span>
                                                                            </p>

                                                                            {value ===
                                                                                activeFilterChildOption && (
                                                                                <span className="material-icons text-mvx-black text-base">
                                                                                    done
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                    </div>
                                                )}
                                                {filterOptions.find(
                                                    (item) => item.value === activeFilterOption
                                                )?.customChild &&
                                                    openFilterChild && (
                                                        <div
                                                            className={`shadow-dropdownShadow rounded min-w-max py-2 bg-white absolute top-[47%] left-[-133%] w-full h-auto max-h-64 z-20 overflow-auto border `}
                                                        >
                                                            <div
                                                                className={`flex gap-8 items-center px-1 justify-between  cursor-pointer `}
                                                            >
                                                                {
                                                                    filterOptions.find(
                                                                        (item) =>
                                                                            item.value ===
                                                                            activeFilterOption
                                                                    ).customChild
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="border max-sm:border-none">
                        <div className="max-sm:hidden w-full grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_1fr_0.2fr] gap-3 my-3 px-4">
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                ID
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                CUSTOMER
                            </div>

                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                route
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                STATUS
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                TYPE
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                MODE
                            </div>

                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                DUE DATE
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral"></div>
                        </div>
                        <div>{displayQuotes()}</div>
                    </div>
                    {completedTab.allQuotesTabCompleted && activeTab === 0 && !isFetchingQuotes && (
                        <div className="flex w-full mt-2 justify-center">
                            <p className="text-sm font-rocGroteskMedium">End of list</p>
                        </div>
                    )}
                    {completedTab.externalQuotesTabCompleted &&
                        activeTab === 1 &&
                        !isFetchingExternalQuotes && (
                            <div className="flex w-full mt-2 justify-center">
                                <p className="text-sm font-rocGroteskMedium">End of list</p>
                            </div>
                        )}
                    {completedTab.outgoingRequestsTabCompleted &&
                        activeTab === 2 &&
                        !isFetchingOutgingQuoteRequests && (
                            <div className="flex w-full mt-2 justify-center">
                                <p className="text-sm font-rocGroteskMedium">End of list</p>
                            </div>
                        )}
                    {completedTab.incomingRequestsTabCompleted && activeTab === 3 && (
                        <div className="flex w-full mt-2 justify-center">
                            <p className="text-sm font-rocGroteskMedium">End of list</p>
                        </div>
                    )}
                    {isFetchingQuotes ||
                    isFetchingExternalQuotes ||
                    isFetchingOutgingQuoteRequests ? (
                        <div className="flex w-full mt-2 justify-center">
                            <Loader color={"gun-metal"} />
                        </div>
                    ) : null}
                </div>
            </div>

            {isAcceptRequestModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        setIsAcceptRequestModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Accept Quote?
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Are you sure you want to accept this quote?
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border px-3`}
                                onClick={() => {
                                    setIsAcceptRequestModalOpen(false);
                                }}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    dispatch(quoteActions.FFAcceptQuote(selectedQuote._id));
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-6 border-y px-3`}
                            >
                                {isFFAcceptingQuote ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">yes, ACCEPT QUOTE</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {isAcceptRequestSuccessModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        dispatch(quoteActions.resetQuotetSuccessData());
                        setIsAcceptRequestSuccessModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Quote Accepted!
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Do you want to add more to this quote before sending it out to your
                                customer?
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border px-3`}
                                onClick={() => {
                                    setIsAcceptRequestSuccessModalOpen(false);
                                }}
                            >
                                No, I don't
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    dispatch(
                                        quoteActions.acceptQuoteRequest(
                                            selectedQuote.quoteRequestId
                                        )
                                    );
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-6 border-y px-3`}
                            >
                                {isFFAcceptingQuote ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">Yes, modify quote</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {isRejectRequestModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        setIsRejectRequestModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Reject Quote?
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Are you sure you want to reject this quote?
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border px-3`}
                                onClick={() => {
                                    setIsRejectRequestModalOpen(false);
                                }}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    dispatch(quoteActions.FFRejectQuote(selectedQuote._id));
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-6 border-y px-3`}
                            >
                                {isFFRejectingQuote ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">yes, reject QUOTE</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {isRejectRequestSuccessModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        dispatch(quoteActions.resetQuotetSuccessData());
                        setIsRejectRequestSuccessModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="bg-white">
                            <div className="px-6 py-8">
                                <img src={successImg} alt="success" className="mb-6 m-auto" />
                                <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                    Quote Rejected!
                                </p>
                                <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                    Quote request TA{selectedQuote.mvxid} has been successfully
                                    rejected
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {generatePaymentModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => setGeneratePaymentModal(false)}
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const body = {
                                invoiceType:
                                    selectedQuote?.quoteType === "customer" ? "shipment" : "quote",
                                shipmentId: selectedQuote?.shipment?._id,
                                amount: {
                                    value: paymentLinkData.amount,
                                    currency: paymentLinkData.currency,
                                },
                                note: paymentLinkData.note,
                            };

                            if (body.invoiceType === "quote") {
                                body.quoteId = selectedQuote?._id;
                                body.platformFee = {
                                    value: paymentLinkData.platformFee,
                                    currency: paymentLinkData.currency,
                                };
                            }

                            dispatch(paymentActions.createPaymentLink(body));
                        }}
                        className="bg-white rounded-lg shadow-modalShadow"
                    >
                        <div className="px-6 pt-8">
                            <p className="text-lg mb-4 font-rocGroteskBold text-gun-metal">
                                {selectedQuote?.quoteType === "customer"
                                    ? "Generate Payment Link"
                                    : "Make Payment"}
                            </p>
                            <div>
                                <div className="mb-6">
                                    <p className="text-sm mb-1 font-rocGroteskMedium">Amount</p>
                                    <div className=" w-full">
                                        {activeTab === 0 && (
                                            <div className="w-full">
                                                <SelectInput
                                                    value={paymentLinkData.currency}
                                                    name="currency"
                                                    placeholder={"USD"}
                                                    handleChange={(_, value) =>
                                                        setPaymentLinkData((prev) => {
                                                            return {
                                                                ...prev,
                                                                currency: value,
                                                            };
                                                        })
                                                    }
                                                    className={
                                                        "rounded-b-none border-b-0 !h-[48px]"
                                                    }
                                                    isRequired={true}
                                                    dropdownOptions={[
                                                        {
                                                            label: "GBP",
                                                            value: "GBP",
                                                            icon: (
                                                                <img
                                                                    src={ukFlag}
                                                                    alt="us flag"
                                                                    className="w-5 h-5 rounded-full bg-gray-400"
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            label: "USD",
                                                            value: "USD",
                                                            icon: (
                                                                <img
                                                                    src={usFlag}
                                                                    alt="us flag"
                                                                    className="w-5 h-5 rounded-full bg-gray-400"
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            label: "EUR",
                                                            value: "EUR",
                                                            icon: (
                                                                <img
                                                                    src={eurFlag}
                                                                    alt="us flag"
                                                                    className="w-5 h-5 rounded-full bg-gray-400"
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            label: "NGN",
                                                            value: "NGN",
                                                            icon: (
                                                                <img
                                                                    src={ngFlag}
                                                                    alt="us flag"
                                                                    className="w-5 h-5 rounded-full bg-gray-400"
                                                                />
                                                            ),
                                                        },
                                                    ]}
                                                />
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            placeholder="$0.00"
                                            className={`${
                                                selectedQuote?.quoteType?.toLowerCase() ===
                                                "customer"
                                                    ? "rounded-b"
                                                    : "rounded"
                                            } border  border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral`}
                                            required
                                            value={formatCurrency(paymentLinkData.amount)}
                                            disabled={
                                                selectedQuote?.quoteType?.toLowerCase() ===
                                                "customer"
                                                    ? false
                                                    : true
                                            }
                                            name="amount"
                                            onChange={(event) =>
                                                setPaymentLinkData((prev) => {
                                                    return {
                                                        ...prev,
                                                        amount: event.target.value.replace(
                                                            /,/g,
                                                            ""
                                                        ),
                                                    };
                                                })
                                            }
                                            pattern={"^[.,0-9]+$"}
                                            title="must be digits"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm mb-1 font-rocGroteskMedium">Notes</p>
                                    <textarea
                                        placeholder="Describe your goods"
                                        rows="4"
                                        className="border rounded border-gray-200 resize-none py-3 px-4 outline-0 w-full text-sm font-rocGroteskMedium placeholder:text-sm placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                        required
                                        value={paymentLinkData?.note}
                                        disabled={
                                            selectedQuote?.quoteType?.toLowerCase() === "customer"
                                                ? false
                                                : true
                                        }
                                        name="note"
                                        onChange={(event) =>
                                            setPaymentLinkData((prev) => {
                                                return {
                                                    ...prev,
                                                    note: event.target.value,
                                                };
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex pt-8">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
                                onClick={() => setGeneratePaymentModal(false)}
                            >
                                cancel
                            </button>
                            <button
                                type="submit"
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-5 border-y px-3`}
                            >
                                {createPaymentLinkLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">Pay now</p>
                                )}
                            </button>
                        </div>
                    </form>
                </ModalContainer>
            )}
            {generatePaymentSuccessModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%] "
                    closeModal={() => {
                        setGeneratePaymentSuccessModal(false);
                        dispatch(paymentActions.resetCreatePaymentLinkData());
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 py-8">
                            <div className="mb-8">
                                <img src={successImg} alt="success" className="mb-6 m-auto" />
                                <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                    Payment link generated!
                                </p>
                                <p className="text-sm text-center text-gun-metal px-6">
                                    Share your payment link with your customer and start receiving
                                    local and international payments.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    className={` rounded w-full text-sm text-white font-rocGroteskMedium flex items-center justify-center bg-pacific-cyan py-3 px-3`}
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            `https:${
                                                process.env.REACT_APP_STAGE === "production"
                                                    ? "fleetplus.io"
                                                    : "dev.mcb.mvxchange.com"
                                            }/payment/${createPaymentLinkSuccess?.data?._id}`
                                        );
                                        toast.custom((t) => (
                                            <CustomToast
                                                t={t}
                                                message={"Payment Link Copied"}
                                                type="success"
                                            />
                                        ));
                                    }}
                                >
                                    Share link with customer
                                </button>
                                <button
                                    type="button"
                                    className={` rounded w-full text-sm text-gun-metal font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-3 px-3`}
                                    onClick={() => {
                                        navigate(`/payment/${createPaymentLinkSuccess?.data?._id}`);
                                        dispatch(paymentActions.resetCreatePaymentLinkData());
                                    }}
                                >
                                    Preview link
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {/* {createQuote && <CreateQuote setCreateQuote={setCreateQuote} />} */}
        </div>
    );
};

export default QuotesList;
