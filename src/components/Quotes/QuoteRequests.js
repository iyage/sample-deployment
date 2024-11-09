import NavTwo from "components/common/NavTwo";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import ModalContainer from "components/common/ModalContainer";
import { useDispatch, useSelector } from "react-redux";
import { quoteActions } from "actions";
import Loader from "components/common/Loader";
import countries from "variables/countries";
import successImg from "assets/images/externalPages/waitlist-success.svg";
import cargoImg from "assets/images/shipments/cargo.svg";
import _ from "lodash";
import { isMobile } from "helpers";
import { useNavigate, useSearchParams } from "react-router-dom";

const QuoteRequests = () => {
    const [quoteDetailsModal, setQuoteDetailsModal] = useState(false);
    const [quoteRequests, setQuoteRequests] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedQuoteRequest, setSelectedQuoteRequests] = useState([]);
    const [isAcceptRequestModalOpen, setIsAcceptRequestModalOpen] = useState(false);
    const [isRejectRequestModalOpen, setIsRejectRequestModalOpen] = useState(false);
    const [isAcceptRequestSuccessModalOpen, setIsAcceptRequestSuccessModalOpen] = useState(false);
    const [isRejectRequestSuccessModalOpen, setIsRejectRequestSuccessModalOpen] = useState(false);
    const {
        isAcceptingQuoteRequest,
        acceptedQuoteRequestSuccess,
        isRejectingQuoteRequest,
        rejectedQuoteRequestSuccess,
        isFetchingIncomingQuoteRequests,
        incomingQuoteRequests,
        singleQuoteReq,
        singleQuoteReqLoading,
    } = useSelector((state) => state.quote);
    const dispatch = useDispatch();
    const [param] = useSearchParams();
    const navigate = useNavigate();
    const quoteRequestId = param.get("id");

    const displayQuoteRequests = () => {
        return quoteRequests && quoteRequests?.length > 0 ? (
            quoteRequests?.map((data, idx) => {
                return (
                    <Fragment key={data._id}>
                        <div
                            className="flex max-sm:flex-col max-sm:gap-5 justify-between p-6 relative cursor-pointer"
                            onClick={() => {
                                setSelectedQuoteRequests(data);
                                setQuoteDetailsModal(true);
                            }}
                        >
                            {/* {idx == 0 && (
                            <img
                                src={newTag}
                                alt="new tag"
                                className="w-[45px] h-[45px] absolute right-[-20px] top-[-20px]"
                            />
                        )} */}
                            <div className="flex flex-col max-sm:flex-row justify-between">
                                <div>
                                    <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                        Freight Forwarder
                                    </p>
                                    <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                        {data?.sender?.profile?.businessName ??
                                            data?.sender?.fullName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                        Quote Request Id
                                    </p>
                                    <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                        TAQ{data?.mvxid}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col max-sm:w-full gap-10 max-sm:gap-5 w-1/2">
                                <div className="w-full">
                                    <div className="flex items-center">
                                        <span className="basis-[7px] h-1.5 bg-mvx-black mr-2"></span>
                                        <span className="flex-1 h-1 bg-mvx-black"></span>
                                        <span className="material-icons mx-2 text-lg">
                                            {data?.shipment?.serviceMode?.toLowerCase() === "land"
                                                ? "local_shipping"
                                                : data?.shipment?.serviceMode?.toLowerCase() ===
                                                  "air"
                                                ? "flight_takeoff"
                                                : "directions_boat"}
                                        </span>
                                        <span className="flex-1 h-1 bg-[#DFE1E6]"></span>
                                        <span className="basis-[7px] h-1.5 bg-[#DFE1E6] ml-2"></span>
                                    </div>
                                    <div className="flex items-start justify-between gap-4">
                                        <p className="text-sm text-gun-metal font-rocGroteskMedium w-1/2">
                                            {data?.portOfLoading?.address}
                                        </p>
                                        <p className="text-sm text-gun-metal font-rocGroteskMedium text-right w-1/2">
                                            {data?.portOfDestination?.address}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                            Country of Supply
                                        </p>
                                        <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                            {
                                                countries?.find(
                                                    (item) =>
                                                        item?.abbreviation ===
                                                        data?.portOfSupply?.country
                                                )?.name
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                            Service Type
                                        </p>
                                        <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                            Import
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                            Incoterms Type
                                        </p>
                                        <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                            {data?.incoterms}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col max-sm:flex-row max-sm:gap-8 justify-between items-center py-3">
                                <button
                                    className="flex items-center justify-center gap-2 bg-pacific-cyan text-white font-rocGroteskMedium w-full py-2 px-6 text-sm rounded"
                                    type={"button"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedQuoteRequests(data);
                                        setIsAcceptRequestModalOpen(true);
                                    }}
                                >
                                    <span className="text-inherit">Accept Request</span>
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 bg-white border text-gun-metal font-rocGroteskMedium w-full py-2 px-6 text-sm rounded"
                                    type={"button"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedQuoteRequests(data);
                                        setIsRejectRequestModalOpen(true);
                                    }}
                                >
                                    <span className="text-inherit">Reject Request</span>
                                </button>
                            </div>
                        </div>
                        {quoteRequests?.length - 1 !== idx && <hr />}
                    </Fragment>
                );
            })
        ) : (
            <div>
                <div className="flex flex-col items-center p-16 ">
                    <img width={42} className="mb-4" src={cargoImg} alt="cargo" />
                    <p className="text-center mb-1 text-lg text-gun-metal font-rocGroteskMedium">
                        No Quotes Requests
                    </p>
                    <p className="text-center text-gun-metal text-sm">
                        You don't have any quote requests.
                    </p>
                </div>
            </div>
        );
    };

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
        if (Boolean(quoteRequestId)) {
            dispatch(quoteActions.fetchSingleQuoteRequest(quoteRequestId));
        }
    }, [dispatch, quoteRequestId]);

    useEffect(() => {
        if (Boolean(quoteRequestId) && Boolean(singleQuoteReq)) {
            setSelectedQuoteRequests(singleQuoteReq);
            setQuoteDetailsModal(true);
            // navigate("/dashboard/quote-requests", { replace: true });
        }
    }, [singleQuoteReq, quoteRequestId, navigate]);

    useEffect(() => {
        dispatch(quoteActions.fetchIncomingQuoteRequests(currentPage));
    }, [dispatch, currentPage]);

    useEffect(() => {
        if (incomingQuoteRequests && incomingQuoteRequests?.data?.length > 0) {
            setQuoteRequests((prevState) =>
                _.uniqWith([...prevState, ...incomingQuoteRequests.data], _.isEqual)
            );
            setPagination(incomingQuoteRequests?.pagination);
        }
    }, [incomingQuoteRequests]);

    useEffect(() => {
        if (Boolean(acceptedQuoteRequestSuccess)) {
            setQuoteDetailsModal(false);
            setIsAcceptRequestModalOpen(false);
            setIsAcceptRequestSuccessModalOpen(true);

            const quoteRequestsCopy = [...quoteRequests];
            const itemIndex = _.findIndex(quoteRequestsCopy, [
                "_id",
                acceptedQuoteRequestSuccess.data._id,
            ]);

            if (itemIndex !== -1) {
                quoteRequestsCopy.splice(itemIndex, 1);
                setQuoteRequests(quoteRequestsCopy);
            }
            dispatch(quoteActions.resetAcceptRejectQuoteRequestSuccessData());
        }
    }, [dispatch, acceptedQuoteRequestSuccess, quoteRequests]);

    useEffect(() => {
        if (Boolean(rejectedQuoteRequestSuccess)) {
            setQuoteDetailsModal(false);
            setIsRejectRequestModalOpen(false);
            setIsRejectRequestSuccessModalOpen(true);
            const quoteRequestsCopy = [...quoteRequests];
            const itemIndex = _.findIndex(quoteRequestsCopy, [
                "_id",
                rejectedQuoteRequestSuccess.data._id,
            ]);

            if (itemIndex !== -1) {
                quoteRequestsCopy.splice(itemIndex, 1);
                setQuoteRequests(quoteRequestsCopy);
            }
            dispatch(quoteActions.resetAcceptRejectQuoteRequestSuccessData());
        }
    }, [dispatch, rejectedQuoteRequestSuccess, quoteRequests]);

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

    if ((isFetchingIncomingQuoteRequests || singleQuoteReqLoading) && currentPage === 1) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <NavTwo />
            <div className={`mb-16 mt-[140px] px-[104px] max-sm:px-5`}>
                <p className="font-rocGroteskBold text-2xl text-gun-metal mb-6">Quote Requests</p>
                <div className="rounded border">{displayQuoteRequests()}</div>
                {currentPage === pagination?.number_of_pages &&
                    !isFetchingIncomingQuoteRequests && (
                        <div className="flex w-full mt-2 justify-center">
                            <p className="text-sm font-rocGroteskMedium">End of list</p>
                        </div>
                    )}
                {isFetchingIncomingQuoteRequests ? (
                    <div className="flex w-full mt-2 justify-center">
                        <Loader color={"gun-metal"} />
                    </div>
                ) : null}
            </div>
            {quoteDetailsModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[60%] max-lg:w-[65%] max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        setQuoteDetailsModal(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="">
                            <div className="flex justify-between items-center py-6 px-8">
                                <p className="text-xl font-rocGroteskBold">Request Details</p>
                                <i
                                    className="ri-close-line text-2xl cursor-pointer"
                                    onClick={() => setQuoteDetailsModal(false)}
                                ></i>
                            </div>
                            <div className="max-h-[500px] overflow-auto">
                                <div
                                    className={`grid ${
                                        selectedQuoteRequest?.loadType
                                            ? "grid-cols-3"
                                            : "grid-cols-2"
                                    } px-8 max-sm:grid-cols-1 max-sm:gap-5`}
                                >
                                    <div>
                                        <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                            Freight Forwarder
                                        </p>
                                        <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                            {selectedQuoteRequest?.sender?.profile?.businessName ??
                                                selectedQuoteRequest?.sender?.fullName}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex ${
                                            selectedQuoteRequest?.loadType
                                                ? "justify-center"
                                                : "justify-end"
                                        } max-sm:block`}
                                    >
                                        <div>
                                            <p
                                                className={`text-mvx-neutral text-sm font-rocGroteskMedium`}
                                            >
                                                Incoterms
                                            </p>
                                            <p
                                                className={`text-gun-metal text-sm ${
                                                    selectedQuoteRequest?.loadType
                                                        ? ""
                                                        : "text-right"
                                                } font-rocGroteskMedium`}
                                            >
                                                {selectedQuoteRequest?.incoterms}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedQuoteRequest?.loadType && (
                                        <div className="flex justify-end max-sm:block">
                                            <div>
                                                <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                                    Load Type
                                                </p>
                                                <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                                    {selectedQuoteRequest?.loadType}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full my-8 px-8">
                                    <div className="flex items-center">
                                        <span className="basis-[7px] h-1.5 bg-mvx-black mr-2"></span>
                                        <span className="flex-1 h-1 bg-mvx-black"></span>
                                        <span className="material-icons mx-2 text-lg">
                                            {selectedQuoteRequest?.shipment?.serviceMode?.toLowerCase() ===
                                            "land"
                                                ? "local_shipping"
                                                : selectedQuoteRequest?.shipment?.serviceMode?.toLowerCase() ===
                                                  "air"
                                                ? "flight_takeoff"
                                                : "directions_boat"}
                                        </span>
                                        <span className="flex-1 h-1 bg-[#DFE1E6]"></span>
                                        <span className="basis-[7px] h-1.5 bg-[#DFE1E6] ml-2"></span>
                                    </div>
                                    <div className="flex items-start justify-between gap-4">
                                        <p className="text-sm text-gun-metal font-rocGroteskMedium w-1/2">
                                            {selectedQuoteRequest?.portOfLoading?.address}
                                        </p>
                                        <p className="text-sm text-gun-metal font-rocGroteskMedium text-right w-1/2">
                                            {selectedQuoteRequest?.portOfDestination?.address}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    {selectedQuoteRequest?.shipment?.containers &&
                                        selectedQuoteRequest?.shipment?.containers?.length > 0 &&
                                        selectedQuoteRequest?.shipment?.containers?.map(
                                            (container, idx) => {
                                                return (
                                                    <Fragment key={idx}>
                                                        <div className="px-8 py-3 bg-mvx-light-blue">
                                                            <p className="font-rocGroteskMedium text-sm">
                                                                Package {idx + 1}
                                                            </p>
                                                        </div>
                                                        <div className="mt-3 px-8 mb-12">
                                                            <div className="grid grid-cols-3 gap-x-12 gap-y-6">
                                                                <div>
                                                                    <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                                                        Cargo Type
                                                                    </p>
                                                                    <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                                                        {container?.containerType}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                                                        Quantity
                                                                    </p>
                                                                    <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                                                        {container?.quantity}
                                                                    </p>
                                                                </div>

                                                                {/* <div className="mt-[-8px]">
                                                                    <p className="text-mvx-neutral text-xs font-rocGroteskMedium">
                                                                        <i className="ri-layout-column-line text-base "></i>
                                                                    </p>
                                                                    <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                                                        43 × 40' Standard
                                                                    </p>
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                );
                                            }
                                        )}

                                    {selectedQuoteRequest?.shipment?.packages &&
                                        selectedQuoteRequest?.shipment?.packages?.length > 0 &&
                                        selectedQuoteRequest?.shipment?.packages?.map(
                                            (container, idx) => {
                                                return (
                                                    <Fragment key={idx}>
                                                        <div className="px-8 py-3 bg-mvx-light-blue">
                                                            <p className="font-rocGroteskMedium text-sm">
                                                                Package {idx + 1}
                                                            </p>
                                                        </div>
                                                        <div className="mt-3 px-8 mb-12">
                                                            <div className="grid grid-cols-5 gap-x-12 max-sm:grid-cols-3 max-sm:gap-y-4">
                                                                <div>
                                                                    <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                                                        Cargo Type
                                                                    </p>
                                                                    <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                                                        {container?.packageType}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                                                        Length
                                                                    </p>
                                                                    <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                                                        {container?.length?.value}{" "}
                                                                        {container?.length?.unit}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                                                        Width
                                                                    </p>
                                                                    <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                                                        {container?.width?.value}{" "}
                                                                        {container?.width?.unit}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                                                        Height
                                                                    </p>
                                                                    <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                                                        {container?.height?.value}{" "}
                                                                        {container?.height?.unit}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-mvx-neutral text-sm font-rocGroteskMedium">
                                                                        Weight
                                                                    </p>
                                                                    <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                                                        {container?.weight?.value}{" "}
                                                                        {container?.weight?.unit}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                );
                                            }
                                        )}
                                    <div className="px-8">
                                        <p className="text-mvx-neutral text-sm font-rocGroteskMedium mb-2">
                                            Description
                                        </p>
                                        <p className="text-gun-metal text-sm font-rocGroteskMedium">
                                            {
                                                selectedQuoteRequest?.shipment?.goodsDetails
                                                    ?.description
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end max-sm:justify-center mt-[27px] px-8 shadow-[0_-5px_24px_-4px_rgba(16,24,40,0.08),0_8px_8px_-4px_rgba(16,24,40,0.03)]">
                            <div className="flex items-center py-4">
                                <button
                                    className="flex mr-2 items-center justify-center bg-pacific-cyan text-white font-rocGroteskMedium w-full py-2 px-6 text-sm rounded"
                                    type={"button"}
                                    onClick={() => setIsAcceptRequestModalOpen(true)}
                                >
                                    <span className="text-inherit whitespace-nowrap">
                                        Accept Request
                                    </span>
                                </button>
                                <button
                                    className="flex items-center justify-center bg-white border text-gun-metal font-rocGroteskMedium w-full py-2 px-6 text-sm rounded"
                                    type={"button"}
                                    onClick={() => {
                                        setIsRejectRequestModalOpen(true);
                                    }}
                                >
                                    <span className="text-inherit whitespace-nowrap">
                                        Reject Request
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {isAcceptRequestModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        dispatch(quoteActions.resetQuotetSuccessData());
                        setIsAcceptRequestModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Accept Quote Request?
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Are you sure you want to accept this quote request?
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border px-3`}
                                onClick={() => {
                                    dispatch(quoteActions.resetQuotetSuccessData());
                                    setIsAcceptRequestModalOpen(false);
                                }}
                            >
                                no, Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    dispatch(
                                        quoteActions.acceptQuoteRequest(selectedQuoteRequest?._id)
                                    );
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-6 border-y px-3`}
                            >
                                {isAcceptingQuoteRequest ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">yes, Accept</p>
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
                        <div>
                            <div className="px-6 pt-8">
                                <img src={successImg} alt="success" className="mb-6 m-auto" />
                                <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                    Quote Request Accepted!
                                </p>
                                <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                    You have accepted the quote request from Kingsman Enterprises
                                    for Shipment no. {selectedQuoteRequest?.mvxid}. You can go ahead
                                    and create a quote for the shipment.
                                </p>
                            </div>
                            <div className="flex pt-6">
                                <button
                                    type="button"
                                    className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border px-3`}
                                    onClick={() => {
                                        dispatch(quoteActions.resetQuotetSuccessData());
                                        setIsAcceptRequestSuccessModalOpen(false);
                                    }}
                                >
                                    Not now
                                </button>
                                <button
                                    type="button"
                                    className={`uppercase rounded-br-lg w-full text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-6 border-y px-3`}
                                    onClick={() => {
                                        dispatch(quoteActions.resetQuotetSuccessData());
                                        navigate(
                                            `/dashboard/create-quote/customer/${selectedQuoteRequest?.shipmentId}?requestId=${selectedQuoteRequest?._id}`
                                        );
                                        setIsAcceptRequestSuccessModalOpen(false);
                                    }}
                                >
                                    <p className="text-inherit">create quote</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {isRejectRequestModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        dispatch(quoteActions.resetQuotetSuccessData());
                        setIsRejectRequestModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Reject Quote Request?
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Are you sure you want to reject this quote request? you wouldn’t be
                                able to see this request again rejected.
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border px-3`}
                                onClick={() => {
                                    dispatch(quoteActions.resetQuotetSuccessData());
                                    setIsRejectRequestModalOpen(false);
                                }}
                            >
                                no, Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    dispatch(
                                        quoteActions.rejectQuoteRequest(selectedQuoteRequest?._id)
                                    );
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-6 border-y px-3`}
                            >
                                {isRejectingQuoteRequest ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">yes, REJECT</p>
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
                        <div>
                            <div className="px-6 pt-8">
                                <img src={successImg} alt="success" className="mb-6 m-auto" />
                                <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                    Quote Requested Rejected!
                                </p>
                                <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                    You have reject the quote request from Kingsman Enterprises for
                                    Shipment no. {selectedQuoteRequest?.mvxid}.
                                </p>
                            </div>
                            <div className="flex pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        dispatch(quoteActions.resetQuotetSuccessData());
                                        setIsRejectRequestSuccessModalOpen(false);
                                    }}
                                    className={`uppercase rounded-b-lg w-full text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-6 border-y px-3`}
                                >
                                    <p className="text-inherit">close</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default QuoteRequests;
