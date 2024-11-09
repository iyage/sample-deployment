/* eslint-disable react-hooks/exhaustive-deps */
import NavTwo from "components/common/NavTwo";
import newTag from "assets/images/new_tag.svg";
import organization from "assets/images/dashboard/organization.svg";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import successImg from "assets/images/externalPages/waitlist-success.svg";
import newRequestNotification from "assets/images/dashboard/new_requests_notification.svg";
import { firebaseService } from "services/firebaseService";
import ModalContainer from "components/common/ModalContainer";
import Loader from "components/common/Loader";
import {
    authActions,
    chatActions,
    paymentActions,
    quoteActions,
    shipmentActions,
    rateActions,
} from "actions";
import SelectInput from "components/common/SelectInput";
import ChatPopup from "components/common/ChatPopup";
import Analytics from "./components/Analytics";
import Home from "./components/Home";
import { appActions } from "actions/appActions";
import { getFromStorage, saveToStorage } from "helpers";
import { productGuideData } from "variables/productGuide";
import ProductGuideComp from "components/common/ProductGuideComp";
import useModal from "components/common/Modals/ModalProvider";

const Dashboard = () => {
    const [dashboardActiveTab, setDashboardActiveTab] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const { openModal } = useModal();
    const [createQuoteGuide, setCreateQuoteGuide] = useState(false);
    const [instantRateGuide, setInstantRateGuide] = useState(false);
    const [rateManagementGuide, setRateManagementGuide] = useState(false);
    const [trackShipmentGuide, setTrackShipmentGuide] = useState(false);
    const [[completeProfilePopup, skippedComplete], setCompleteProfile] = useState([false, false]);
    const [profileStatus, setProfileStatus] = useState({
        businessDetails: false,
        businessDoc: false,
        bankAcct: false,
        tradeLanes: false,
    });
    const [isTakeShipmentLiveModalOneOpen, setIsTakeShipmentLiveModalOneOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [openAssignMember, setOpenAssignMember] = useState(false);
    const [dropdownHeight, setDropdownHeight] = useState(null);
    const [memberAssigned, setMemberAssigned] = useState("");
    const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
    const [isStatusUpdateSuccessModalOpen, setIsStatusUpdateSuccessModalOpen] = useState(false);
    const [status, setStatus] = useState({
        message: "",
        statusOption: "",
    });
    const [documentUploading, setDocumentUploading] = useState(false);
    const [statusAttachments, setStatusAttachments] = useState([]);
    const [shipmentAnalyticsData, setShipmentAnalyticsData] = useState(null);
    const [shipmentGraphData, setShipmentGraphData] = useState(null);
    const [customerAnalyticsData, setCustomerAnalyticsData] = useState(null);
    const [quoteAnalyticsData, setQuoteAnalyticsData] = useState(null);
    const [quoteGraphData, setQuoteGraphData] = useState(null);
    const [paymentLinks, setPaymentLinks] = useState([]);
    const [selectedShipmentDropdown, setSelectedShipmentDropdown] = useState("All Shipments");
    const [selectedQuoteDropdown, setSelectedQuoteDropdown] = useState("All Quotes");
    const [selectedShipmentDate, setSelectedShipmentDate] = useState("one-year");
    const [selectedQuoteDate, setSelectedQuoteDate] = useState("one-year");
    const [selectedCustomerDate, setSelectedCustomerDate] = useState("one-year");
    const [openChatPopup, setOpenChatPopup] = useState(false);
    const [isTakeShipmentLiveSucessModalOpen, setIsTakeShipmentLiveSucessModalOpen] =
        useState(false);
    const [isEndShipmenteModalOpen, setEndShipmentModalOpen] = useState(false);
    const [isEndLiveShipmenteSucessModalOpen, setIsEndLiveShipmenteSucessModalOpen] =
        useState(false);
    const [isCancelShipmentModalOpen, setIsCancelShipmentModalOpen] = useState(false);
    const [isCancelShipmentSuccessModalOpen, setIsCancelShipmentSuccessModalOpen] = useState(false);
    const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState({});
    const [activeShipmentsInfo, setActiveShipmentsInfo] = useState([]);
    const [pendingShipmentsInfo, setPendingShipmentsInfo] = useState([]);
    const [completedShipmentsInfo, setCompletedShipmentsInfo] = useState([]);
    const [cancelledShipmentsInfo, setCancelledShipmentsInfo] = useState([]);
    const [paymentLinkPagination, setPaymentLinkPagination] = useState({});
    const [paymentLinkCurrentPage, setPaymentLinkCurrentPage] = useState(1);
    const [hotDeals, setHotDeals] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dashboardTabs = [{ title: "home" }, { title: "analytics" }];
    const tabs = ["active", "pending", "completed", "cancelled"];

    const {
        isActiveShipmentsLoading,
        activeShipments,
        isPendingShipmentsLoading,
        pendingShipments,
        isCompletedShipmentsLoading,
        completedShipments,
        takeShipmentLiveLoading,
        takeShipmentLiveSuccess,
        endLiveShipmentLoading,
        endLiveShipmentSuccess,
        cancelPendingShipmentLoading,
        cancelPendingShipmentSuccess,
        isCancelledShipmentsLoading,
        cancelledShipments,
        sendShipmentStatusLoading,
        sendShipmentStatusSuccess,
        shipmentAnalytics,
        customerAndEarningsAnalytics,
    } = useSelector((state) => state.shipment);
    const { incomingQuoteRequests, quotesAnalytics } = useSelector((state) => state.quote);
    const { FFPaymentLinksSuccess, FFPaymentLinksLoading } = useSelector((state) => state.payment);
    const { ffProfile, teamMembersLoading, teamMembers } = useSelector((state) => state.auth);
    const { updateBusinessProfile, isQuoteRequestOpened } = useSelector((state) => state.app);
    const { getHotDealsLoading, getHotDealsSuccess } = useSelector((state) => state.rate);
    const { getSubscriptionSuccess } = useSelector((state) => state.subscription);
    const selectedAssignedMemberName = teamMembers?.data?.find(
        (member) => member._id === memberAssigned
    )?.fullName;

    const uniqueTeamMembersIds = [...new Set(selectedShipment?.admins?.slice(0, 2) ?? [])];
    const uniqueTeamMembers = teamMembers?.data?.filter(
        (member) => !uniqueTeamMembersIds.includes(member._id)
    );

    const productGuide = getFromStorage("productGuide");
    const productGuideObj = productGuide
        ? JSON.parse(productGuide)
        : saveToStorage("productGuide", JSON.stringify(productGuideData));

    const getStartedContent = [
        {
            title: "Create quote",
            subText: "Easily create quick quotes for all your customer shipments.",
            icon: <i className="ri-file-list-3-fill text-[22px]"></i>,
            action: () => {
                if (!productGuideObj?.createQuote) {
                    saveToStorage(
                        "productGuide",
                        JSON.stringify({
                            ...JSON.parse(productGuide),
                            createQuote: true,
                        })
                    );

                    setCreateQuoteGuide(true);
                } else {
                    openModal("create_quote", { directStepNo: 1, forCustomer: true });
                }
            },
        },
        {
            title: "Get instant rate",
            subText: "Find the best deals for any of your shipments with ease.",
            icon: <i className="ri-search-eye-fill text-[22px]"></i>,
            action: () => {
                if (!productGuideObj?.instantRate) {
                    saveToStorage(
                        "productGuide",
                        JSON.stringify({
                            ...JSON.parse(productGuide),
                            instantRate: true,
                        })
                    );
                    setInstantRateGuide(true);
                } else {
                    navigate("/dashboard/instant-quote");
                }
            },
        },
        {
            title: "Upload your rate",
            subText: "Start earning money by uploading and selling your rate",
            icon: <i className="ri-upload-cloud-2-line text-[22px]"></i>,
            action: () => {
                if (!productGuideObj?.uploadRate) {
                    saveToStorage(
                        "productGuide",
                        JSON.stringify({
                            ...JSON.parse(productGuide),
                            uploadRate: true,
                        })
                    );

                    setRateManagementGuide(true);
                } else {
                    navigate("/dashboard/rate-management/add-rate");
                }
            },
        },
        {
            title: "Track shipment",
            subText: "Get to know the location of your shipments and containers.",
            icon: <i className="ri-map-pin-fill text-[22px]"></i>,
            action: () => {
                if (!productGuideObj?.trackShipment) {
                    saveToStorage(
                        "productGuide",
                        JSON.stringify({
                            ...JSON.parse(productGuide),
                            trackShipment: true,
                        })
                    );

                    setTrackShipmentGuide(true);
                } else {
                    navigate("/dashboard/shipments");
                }
            },
        },
    ];

    const handleUpload = (fileName, file) => {
        setDocumentUploading(true);

        firebaseService.uploadFile(`relayApp/${fileName}`, file, (url) => {
            setStatusAttachments((prev) => [
                ...prev,
                {
                    name: fileName,
                    file: url !== "error" ? url : "",
                    type: file?.type,
                },
            ]);
            setDocumentUploading(false);
        });
    };

    const displayActiveTabData = useCallback(() => {
        switch (activeTab) {
            case 0:
                return activeShipmentsInfo.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });
            case 1:
                return pendingShipmentsInfo.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });
            case 2:
                return completedShipmentsInfo.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });
            case 3:
                return cancelledShipmentsInfo.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });

            default:
                return activeShipmentsInfo.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });
        }
    }, [
        activeShipmentsInfo,
        pendingShipmentsInfo,
        completedShipmentsInfo,
        cancelledShipmentsInfo,
        activeTab,
    ]);

    const tableData = displayActiveTabData();

    const progressCount = Object.values({ ...profileStatus })?.filter(
        (value) => value === true
    )?.length;

    const generatePaymentLink = () => {
        openModal("generate_payment_link", {
            invoiceType: "shipment",
            shipmentId: selectedShipment?._id,
        });
    };

    const displayOptions = useCallback(() => {
        switch (activeTab) {
            case 0:
                return [
                    {
                        label: "View Shipment Details",
                        value: "View Shipment Details",
                        action: () => navigate(`/dashboard/shipment/${selectedShipment?._id}`),
                    },
                    {
                        label: "Generate payment link",
                        value: "Generate payment link",
                        action: generatePaymentLink,
                    },
                    {
                        label: "Send Status Update",
                        value: "Send Status Update",
                        action: () => setIsStatusUpdateModalOpen(true),
                    },
                    {
                        label: "Chat with Customer",
                        value: "Chat with Customer",
                        action: () => setOpenChatPopup(true),
                    },
                    {
                        label: "Assign Shipment",
                        value: "Assign Shipment",
                        action: () => setOpenAssignMember(true),
                    },
                    {
                        label: "End Shipment",
                        value: "End Shipment",
                        action: () => setEndShipmentModalOpen(true),
                        disabled: selectedShipment?.ended,
                    },
                ];
            case 1:
                return [
                    {
                        label: "Shipment Details",
                        value: "Shipment Details",
                        action: () => navigate(`/dashboard/shipment/${selectedShipment?._id}`),
                    },
                    {
                        label: "Generate payment link",
                        value: "Generate payment link",
                        action: generatePaymentLink,
                    },
                    {
                        label: "Chat with Customer",
                        value: "Chat with Customer",
                        action: () => setOpenChatPopup(true),
                    },
                    {
                        label: "Take Shipment Live",
                        value: "Take Shipment Live",
                        action: () => setIsTakeShipmentLiveModalOneOpen(true),
                    },
                    {
                        label: "Edit Shipment",
                        value: "Edit Shipment",
                        action: () =>
                            navigate(
                                `/dashboard/shipment-creation/${selectedShipment?.freightForwarderId}?shipmentId=${selectedShipment?._id}`
                            ),
                    },
                    {
                        label: "Assign Shipment",
                        value: "Assign Shipment",
                        action: () => setOpenAssignMember(true),
                    },
                    {
                        label: "Cancel Shipment",
                        value: "Cancel Shipment",
                        action: () => setIsCancelShipmentModalOpen(true),
                    },
                ];
            case 2:
                return [
                    {
                        label: "View Shipment Details",
                        value: "Shipment Details",
                        action: () => navigate(`/dashboard/shipment/${selectedShipment?._id}`),
                    },
                    {
                        label: "Generate payment link",
                        value: "Generate payment link",
                        action: generatePaymentLink,
                    },
                    {
                        label: "Chat with Customer",
                        value: "Chat with Customer",
                        action: () => setOpenChatPopup(true),
                    },
                ];
            default:
                break;
        }
    }, [
        activeTab,
        selectedShipment?.ended,
        selectedShipment?._id,
        navigate,
        selectedShipment?.freightForwarderId,
    ]);

    const displayActiveDashboardTab = () => {
        switch (dashboardActiveTab) {
            case 0:
                return (
                    <Home
                        tableData={tableData}
                        setSelectedShipment={setSelectedShipment}
                        getStartedContent={getStartedContent}
                        tabs={tabs}
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                        displayOptions={displayOptions}
                        hotDeals={hotDeals}
                    />
                );

            case 1:
                return (
                    <Analytics
                        shipmentGraphData={shipmentGraphData}
                        shipmentAnalyticsData={shipmentAnalyticsData}
                        selectedShipmentDropdown={selectedShipmentDropdown}
                        setSelectedShipmentDropdown={setSelectedShipmentDropdown}
                        setSelectedShipmentDate={setSelectedShipmentDate}
                        selectedShipmentDate={selectedShipmentDate}
                        selectedQuoteDate={selectedQuoteDate}
                        setSelectedQuoteDate={setSelectedQuoteDate}
                        selectedQuoteDropdown={selectedQuoteDropdown}
                        setSelectedQuoteDropdown={setSelectedQuoteDropdown}
                        quoteAnalyticsData={quoteAnalyticsData}
                        quoteGraphData={quoteGraphData}
                        setSelectedCustomerDate={setSelectedCustomerDate}
                        selectedCustomerDate={selectedCustomerDate}
                        customerAnalyticsData={customerAnalyticsData?.customerData}
                        earningAnalyticsData={customerAnalyticsData?.earningsData}
                        paymentLinks={paymentLinks}
                        paymentLinkCurrentPage={paymentLinkCurrentPage}
                        setPaymentLinkCurrentPage={setPaymentLinkCurrentPage}
                        paymentLinkPagination={paymentLinkPagination}
                        FFPaymentLinksLoading={FFPaymentLinksLoading}
                    />
                );

            case 2:
                return (
                    <Home
                        tableData={tableData}
                        setSelectedShipment={setSelectedShipment}
                        getStartedContent={getStartedContent}
                        tabs={tabs}
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                        displayOptions={displayOptions}
                        hotDeals={hotDeals}
                    />
                );

            default:
                return (
                    <Home
                        tableData={tableData}
                        setSelectedShipment={setSelectedShipment}
                        getStartedContent={getStartedContent}
                        tabs={tabs}
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                        displayOptions={displayOptions}
                        hotDeals={hotDeals}
                    />
                );
        }
    };

    useEffect(() => {
        dispatch(rateActions.fetchHotDeals());
    }, [dispatch]);

    useEffect(() => {
        if (Boolean(getHotDealsSuccess)) {
            setHotDeals(getHotDealsSuccess);
        }
    }, [getHotDealsSuccess]);

    useEffect(() => {
        if (Boolean(memberAssigned) && selectedShipment?._id) {
            dispatch(
                shipmentActions.assignShipmentToMember({
                    shipmentId: selectedShipment?._id,
                    memberId: memberAssigned,
                })
            );
            setMemberAssigned("");

            setOpenAssignMember(false);
            setDropdownHeight(null);
        }
    }, [dispatch, memberAssigned, selectedShipment?._id]);

    useEffect(() => {
        dispatch(shipmentActions.fetchActiveShipments("active", 1, "", "", ""));
        dispatch(shipmentActions.fetchPendingShipments("pending", 1, "", "", ""));
        dispatch(shipmentActions.fetchCompletedShipments("completed", 1, "", "", ""));
        dispatch(shipmentActions.fetchCancelledShipments("cancelled", 1, "", "", ""));
        dispatch(quoteActions.fetchIncomingQuoteRequests());
        dispatch(authActions.fetchTeamMembers());
    }, [dispatch]);

    useEffect(() => {
        dispatch(shipmentActions.fetchShipmentAnalytics(selectedShipmentDate));
    }, [dispatch, selectedShipmentDate]);

    useEffect(() => {
        dispatch(quoteActions.fetchQuotesAnalytics(selectedQuoteDate));
    }, [dispatch, selectedQuoteDate]);

    useEffect(() => {
        dispatch(shipmentActions.fetchCustomerAndEarningsAnalytics(selectedCustomerDate));
    }, [dispatch, selectedCustomerDate]);

    useEffect(() => {
        dispatch(paymentActions.fetchFFPaymentLinks(paymentLinkCurrentPage));
    }, [dispatch, paymentLinkCurrentPage]);

    useEffect(() => {
        if (Boolean(shipmentAnalytics)) {
            const analyticsCopy = _.cloneDeep(shipmentAnalytics);
            const data = analyticsCopy?.shipGraph?.[0]?.graphData?.sort((a, b) => {
                return a?._id?.month - b?._id?.month;
            });

            setShipmentGraphData(data);
            setShipmentAnalyticsData(shipmentAnalytics);
        }
    }, [shipmentAnalytics]);

    useEffect(() => {
        if (Boolean(quotesAnalytics)) {
            const analyticsCopy = _.cloneDeep(quotesAnalytics);
            const data = analyticsCopy?.data?.graphData?.[0]?.graphData?.sort((a, b) => {
                return a?._id?.month - b?._id?.month;
            });

            setQuoteGraphData(data);
            setQuoteAnalyticsData(quotesAnalytics?.data?.graphData?.[0]);
        }
    }, [quotesAnalytics]);

    useEffect(() => {
        if (Boolean(customerAndEarningsAnalytics)) {
            setCustomerAnalyticsData(customerAndEarningsAnalytics);
        }
    }, [customerAndEarningsAnalytics]);

    useEffect(() => {
        if (Boolean(FFPaymentLinksSuccess)) {
            setPaymentLinks((prev) =>
                _.uniqWith([...prev, ...FFPaymentLinksSuccess?.data], _.isEqual)
            );
            setPaymentLinkPagination(FFPaymentLinksSuccess?.pagination);
        }
    }, [FFPaymentLinksSuccess]);

    useEffect(() => {
        if (Boolean(takeShipmentLiveSuccess)) {
            const pendingShipmentsCopy = [...pendingShipmentsInfo];
            const itemIndex = _.findIndex(pendingShipmentsCopy, [
                "_id",
                takeShipmentLiveSuccess.data._id,
            ]);

            if (itemIndex !== -1) {
                const shipmentData = {
                    ...pendingShipmentsInfo[itemIndex],
                    currentStatus: "Active",
                };

                setActiveShipmentsInfo((prev) => [shipmentData, ...prev]);
                pendingShipmentsCopy.splice(itemIndex, 1);
                setPendingShipmentsInfo(pendingShipmentsCopy);
            }
        }
    }, [takeShipmentLiveSuccess]);

    useEffect(() => {
        if (Boolean(cancelPendingShipmentSuccess)) {
            const pendingShipmentsCopy = [...pendingShipmentsInfo];
            const itemIndex = _.findIndex(pendingShipmentsCopy, [
                "_id",
                cancelPendingShipmentSuccess.data._id,
            ]);

            if (itemIndex !== -1) {
                const shipmentData = {
                    ...pendingShipmentsInfo[itemIndex],
                    currentStatus: "Cancelled",
                };

                setCancelledShipmentsInfo((prev) => [shipmentData, ...prev]);
                pendingShipmentsCopy.splice(itemIndex, 1);
                setPendingShipmentsInfo(pendingShipmentsCopy);
            }
            setIsCancelShipmentModalOpen(false);
            setReason("");
            setIsCancelShipmentSuccessModalOpen(true);
        }
    }, [cancelPendingShipmentSuccess]);

    useEffect(() => {
        if (Boolean(endLiveShipmentSuccess)) {
            const activeShipmentsCopy = _.cloneDeep(activeShipmentsInfo);
            const itemIndex = _.findIndex(activeShipmentsCopy, [
                "_id",
                endLiveShipmentSuccess?.data?._id,
            ]);

            if (itemIndex !== -1) {
                activeShipmentsCopy[itemIndex].ended = true;
                setActiveShipmentsInfo(activeShipmentsCopy);
            }
            setEndShipmentModalOpen(false);
            setIsEndLiveShipmenteSucessModalOpen(true);
        }
    }, [endLiveShipmentSuccess]);

    useEffect(() => {
        if (Boolean(activeShipments)) {
            setActiveShipmentsInfo(activeShipments.data);
        }
    }, [activeShipments]);

    useEffect(() => {
        if (Boolean(pendingShipments)) {
            setPendingShipmentsInfo(pendingShipments.data);
        }
    }, [pendingShipments]);

    useEffect(() => {
        if (Boolean(completedShipments)) {
            setCompletedShipmentsInfo(completedShipments.data);
        }
    }, [completedShipments]);

    useEffect(() => {
        if (Boolean(cancelledShipments)) {
            setCancelledShipmentsInfo(cancelledShipments.data);
        }
    }, [cancelledShipments]);

    useEffect(() => {
        if (Boolean(takeShipmentLiveSuccess)) {
            setIsTakeShipmentLiveModalOneOpen(false);
            setIsTakeShipmentLiveSucessModalOpen(Boolean(takeShipmentLiveSuccess));
        }
    }, [takeShipmentLiveSuccess]);

    useEffect(() => {
        if (Boolean(sendShipmentStatusSuccess)) {
            setIsStatusUpdateModalOpen(false);
            setStatus({
                message: "",
                statusOption: "",
            });
            setStatusAttachments([]);
            setIsStatusUpdateSuccessModalOpen(true);
        }
    }, [sendShipmentStatusSuccess]);

    useEffect(() => {
        if (incomingQuoteRequests?.total > 0) {
            setIsNewRequestModalOpen(true);
        }
    }, [incomingQuoteRequests]);

    useEffect(() => {
        const isProfileComplete =
            Boolean(ffProfile?.result?.profile?.businessName) &&
            ffProfile?.result?.profile?.businessDocs?.length >= 4 &&
            ffProfile?.result?.profile?.banks?.length > 0 &&
            ffProfile?.result?.profile?.tradeLanes?.length > 0;

        setCompleteProfile([!isProfileComplete, false]);
        setProfileStatus({
            businessDetails: Boolean(ffProfile?.result?.profile?.businessName),
            businessDoc: ffProfile?.result?.profile?.businessDocs?.length >= 4,
            bankAcct: ffProfile?.result?.profile?.banks?.length > 0,
            tradeLanes: ffProfile?.result?.profile?.tradeLanes?.length > 0,
        });
    }, [ffProfile]);

    if (
        isActiveShipmentsLoading ||
        isPendingShipmentsLoading ||
        isCompletedShipmentsLoading ||
        isCancelledShipmentsLoading ||
        getHotDealsLoading
    ) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div
            onClick={(e) => {
                if (
                    completeProfilePopup ||
                    !profileStatus.bankAcct ||
                    !profileStatus.businessDetails ||
                    !profileStatus.businessDoc ||
                    !profileStatus.tradeLanes
                ) {
                    e.stopPropagation();
                    setCompleteProfile([true, skippedComplete]);
                }
            }}
            className={`${openChatPopup ? "overflow-hidden fixed w-full" : ""}`}
        >
            <div>
                <div className="mb-[120px]">
                    <NavTwo />
                </div>

                {incomingQuoteRequests?.total > 0 && (
                    <div className="py-2 flex justify-center gap-2 items-center bg-tradeally-light-green">
                        <img src={newTag} alt="new tag" />
                        <p className="text-xs flex items-center gap-1 max-sm:hidden font-rocGroteskBold">
                            You have {incomingQuoteRequests?.total} quote requests waiting for you
                            on Fleet+
                            <span
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => navigate("/dashboard/quote-requests")}
                            >
                                <span className="font-rocGroteskBold text-xs ml-2 underline">
                                    View requests
                                </span>{" "}
                                <span className="material-icons-outlined text-sm">east</span>
                            </span>
                        </p>
                        <p className="text-xs hidden items-center gap-1 max-sm:flex">
                            New Quote Response
                            <span
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => navigate("/dashboard/quote-requests")}
                            >
                                <span className="font-rocGroteskMedium ml-2 underline">View</span>{" "}
                                <span className="material-icons-outlined text-sm">east</span>
                            </span>
                        </p>
                    </div>
                )}
                <div className="mt-[45px] px-[104px] max-lg:px-10 max-sm:px-4">
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex items-center justify-center w-[72px] h-[72px] ${
                                getSubscriptionSuccess
                                    ? "fancy-border"
                                    : "rounded-full border-[3px] border-black"
                            }`}
                        >
                            <img
                                src={
                                    updateBusinessProfile?.ffUpdated?.user?.profile?.logo
                                        ? updateBusinessProfile?.ffUpdated?.user?.profile?.logo
                                        : ffProfile?.result?.profile?.logo
                                        ? ffProfile?.result?.profile?.logo
                                        : organization
                                }
                                alt="business logo"
                                className="w-[62px] h-[62px] rounded-full"
                            />
                        </div>
                        <div>
                            <p className="font-rocGroteskBold text-base">
                                {updateBusinessProfile?.ffUpdated?.user?.fullName ??
                                    ffProfile?.result?.fullName}
                            </p>
                            <p className="font-rocGroteskMedium text-sm mb-1">
                                {updateBusinessProfile?.ffUpdated?.user?.email ??
                                    ffProfile?.result?.email}
                            </p>
                            <p className="capitalize font-rocGroteskMedium text-[10px] px-2 py-1 bg-mvx-light-blue text-mvx-neutral w-fit rounded-[2px] flex items-center justify-center">
                                {ffProfile?.result?.accountType}
                            </p>
                        </div>
                    </div>
                    <div className="mt-[43px]">
                        <div className="flex gap-6 max-sm:gap-6 max-sm:w-full">
                            {dashboardTabs.map((tab, idx) => {
                                return (
                                    <div
                                        key={tab.title + idx}
                                        onClick={() => {
                                            setDashboardActiveTab(idx);
                                        }}
                                        className={`flex gap-1 items-center ${
                                            dashboardActiveTab === idx &&
                                            "border-b-[2px] border-gun-metal"
                                        } w-fit py-2 cursor-pointer px-1`}
                                    >
                                        <p
                                            className={`text-sm gap-1.5 flex items-center capitalize font-rocGroteskMedium ${
                                                dashboardActiveTab === idx
                                                    ? "text-gun-metal"
                                                    : "text-mvx-neutral"
                                            }`}
                                        >
                                            {dashboardActiveTab === idx && tab.icon && (
                                                <span>{tab.icon}</span>
                                            )}
                                            <span className="text-inherit">{tab.title}</span>
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <hr className="mb-6" />
                        {displayActiveDashboardTab()}
                    </div>
                </div>
            </div>

            <ChatPopup
                openChatPopup={openChatPopup}
                shipmentData={selectedShipment}
                closePopUp={() => {
                    setOpenChatPopup(false);
                    setSelectedShipment({});
                    dispatch(chatActions.clearFFChat());
                }}
            />

            {createQuoteGuide && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName={`w-fit max-lg:w-[85%] max-sm:w-[95%] absolute top-[160px] left-[28%]`}
                >
                    <ProductGuideComp
                        title={"Create Quote"}
                        text={`The "Create Quote" feature enables you to swiftly generate
                        quotes for your customer shipments. You can easily send
                        these quotes via email or download them as PDF files.`}
                        mediaUrl={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1690291699/Web%20App/product_guide/create_quote_guide_wlqhyy.svg"
                        }
                        okayFunc={() => {
                            setCreateQuoteGuide(false);
                            openModal("create_quote", { directStepNo: 1, forCustomer: true });
                        }}
                    />
                </ModalContainer>
            )}

            {instantRateGuide && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-fit max-lg:w-[85%] max-sm:w-[95%] absolute top-[160px] left-[49%]"
                >
                    <ProductGuideComp
                        title={"Get instant rate"}
                        text={`Get the shipping or service costs you need in real-time.
                        When you use this feature, you can instantly access pricing
                        information, allowing you to make well-informed decisions`}
                        mediaUrl={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1690269490/Web%20App/product_guide/quote_guide_img_hi7owk.svg"
                        }
                        okayFunc={() => {
                            setInstantRateGuide(false);
                            navigate("/dashboard/instant-quote");
                        }}
                    />
                </ModalContainer>
            )}

            {rateManagementGuide && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName={`w-fit max-lg:w-[85%] max-sm:w-[95%] absolute top-[160px] left-[72%]`}
                >
                    <ProductGuideComp
                        title={"Rate management"}
                        text={`Upload your quote to Fleet+ allows you to upload your own
                        shipping quotes to Fleet+. This is helpful if you want to
                        offer your customers a variety of shipping options.`}
                        mediaUrl={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1690270452/Web%20App/product_guide/rate_management_img_d1d5ie.svg"
                        }
                        okayFunc={() => {
                            setRateManagementGuide(false);
                            navigate("/dashboard/rate-management/add-rate");
                        }}
                    />
                </ModalContainer>
            )}

            {trackShipmentGuide && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-fit max-lg:w-[85%] max-sm:w-[95%] absolute top-[160px] left-[48%]"
                >
                    <ProductGuideComp
                        title={"Tracking a shipment"}
                        text={`From the Tracking tab, you can track the status of your
                        shipment. To track a shipment, you will need to enter the
                        following information:`}
                        mediaUrl={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1690291364/Web%20App/product_guide/tracking_guide_aqbq3w.svg"
                        }
                        okayFunc={() => {
                            setTrackShipmentGuide(false);
                            navigate("/dashboard/shipments");
                        }}
                    />
                </ModalContainer>
            )}

            {completeProfilePopup && !skippedComplete && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[38%] max-lg:w-1/2 max-sm:w-[95%]"
                >
                    <div className="bg-white shadow-modalShadow rounded-lg ">
                        <div className="p-6">
                            <p className="text-[22px] font-rocGroteskBold mb-6">
                                Verify your business profile, to <br /> start making money with
                                Fleet+!
                            </p>
                            <div className="mb-4">
                                <div className="h-[5px] w-full bg-[#DFE1E6] rounded-[3px] mb-2">
                                    <div
                                        className={`h-full rounded-[3px] bg-pacific-cyan`}
                                        style={{
                                            width: `${((progressCount / 4) * 100).toFixed()}%`,
                                        }}
                                    ></div>
                                </div>

                                <p className="text-sm font-rocGroteskMedium text-right">
                                    {((progressCount / 4) * 100).toFixed()}% Completed
                                </p>
                            </div>
                            <div className="">
                                <p className="text-sm font-rocGroteskMedium text-mvx-neutral mb-2">
                                    TO DO
                                </p>
                                <div>
                                    <div
                                        onClick={() => navigate("/dashboard/settings")}
                                        className="py-6 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-10 h-10 flex items-center justify-center ${
                                                        profileStatus?.businessDetails
                                                            ? "bg-pacific-cyan"
                                                            : "bg-[#DFE1E6]"
                                                    } rounded-full`}
                                                >
                                                    <span className="material-icons text-white text-xl">
                                                        verified
                                                    </span>
                                                </div>
                                                <div>
                                                    <p>
                                                        <span className="text-base font-rocGroteskBold mr-2">
                                                            Update business details
                                                        </span>
                                                        <span className="text-[8px] text-mvx-neutral font-sm font-rocGroteskMedium px-2 py-[3px] bg-mvx-light-blue">
                                                            STEP 1
                                                        </span>
                                                    </p>
                                                    <p className="text-sm">
                                                        Tell us more about your business
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="material-icons text-2xl">
                                                chevron_right
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div
                                        onClick={() =>
                                            navigate("/dashboard/settings?documents=true")
                                        }
                                        className="py-6 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-10 h-10 flex items-center justify-center ${
                                                        profileStatus?.businessDoc
                                                            ? "bg-pacific-cyan"
                                                            : "bg-[#DFE1E6]"
                                                    } rounded-full`}
                                                >
                                                    <i className="ri-file-list-3-fill before:content-['\ecee'] before:text-white text-xl"></i>
                                                </div>
                                                <div>
                                                    <p>
                                                        <span className="text-base font-rocGroteskBold mr-2">
                                                            Upload business documents
                                                        </span>
                                                        <span className="text-[8px] text-mvx-neutral font-rocGroteskMedium px-2 py-[3px] bg-mvx-light-blue">
                                                            STEP 2
                                                        </span>
                                                    </p>
                                                    <p className="text-sm">
                                                        Upload your legal documents and start
                                                        getting paid
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="material-icons text-2xl">
                                                chevron_right
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div
                                        onClick={() => navigate("/dashboard/settings?tab=bank")}
                                        className="py-6 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-10 h-10 flex items-center justify-center ${
                                                        profileStatus?.bankAcct
                                                            ? "bg-pacific-cyan"
                                                            : "bg-[#DFE1E6]"
                                                    } rounded-full`}
                                                >
                                                    <i className="ri-money-dollar-circle-fill before:content-['\ef64'] before:text-white text-xl"></i>
                                                </div>
                                                <div>
                                                    <p>
                                                        <span className="text-base font-rocGroteskBold mr-2">
                                                            Add your bank account
                                                        </span>
                                                        <span className="text-[8px] text-mvx-neutral font-rocGroteskMedium px-2 py-[3px] bg-mvx-light-blue">
                                                            STEP 3
                                                        </span>
                                                    </p>
                                                    <p className="text-sm">
                                                        Add payment details to receive money
                                                        globally
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="material-icons text-2xl">
                                                chevron_right
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div
                                        onClick={() =>
                                            navigate("/dashboard/settings?tradelanes=true")
                                        }
                                        className="py-6 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-10 h-10 flex items-center justify-center ${
                                                        profileStatus?.tradeLanes
                                                            ? "bg-pacific-cyan"
                                                            : "bg-[#DFE1E6]"
                                                    } rounded-full`}
                                                >
                                                    <i className="ri-map-pin-fill before:content-['\ef13'] before:text-white text-xl"></i>
                                                </div>
                                                <div>
                                                    <p>
                                                        <span className="text-base font-rocGroteskBold mr-2">
                                                            Setup your tradelanes
                                                        </span>
                                                        <span className="text-[8px] text-mvx-neutral font-rocGroteskMedium px-2 py-[3px] bg-mvx-light-blue">
                                                            STEP 4
                                                        </span>
                                                    </p>
                                                    <p className="text-sm">
                                                        Specify shipping route for customization.
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="material-icons text-2xl">
                                                chevron_right
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setCompleteProfile([false, true])}
                            className="flex justify-center rounded-b items-center border-t bg-[#FAFBFC] py-4 px-6 w-full"
                        >
                            <p className="uppercase text-xs font-rocGroteskMedium">Skip for now</p>
                        </button>
                    </div>
                </ModalContainer>
            )}
            {isNewRequestModalOpen && !isQuoteRequestOpened && !completeProfilePopup && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        setIsNewRequestModalOpen(false);
                        dispatch(appActions.quoteRequestModalOpened());
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div
                            className={`px-6 pt-8 ${
                                takeShipmentLiveSuccess?.data &&
                                !takeShipmentLiveSuccess?.data?.hasQuote
                                    ? ""
                                    : "pb-4"
                            }`}
                        >
                            <img
                                src={newRequestNotification}
                                alt="success"
                                className="mb-6 m-auto"
                            />

                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                {incomingQuoteRequests?.total} quote requests available
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                There are {incomingQuoteRequests?.total} quote requests based on
                                your preferred trade-lanes currently waiting for you on Fleet+.
                                Click the button below to view and accept them
                            </p>
                        </div>
                        <div className="flex pt-8">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
                                onClick={() => {
                                    setIsNewRequestModalOpen(false);
                                    dispatch(appActions.quoteRequestModalOpened());
                                }}
                            >
                                not now
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    dispatch(appActions.quoteRequestModalOpened());
                                    navigate("/dashboard/quote-requests");
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 border-y px-3`}
                            >
                                view quote requests
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {openAssignMember && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        setOpenAssignMember(false);
                        setDropdownHeight(null);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-1 pt-2">
                            <div>
                                <SelectInput
                                    className={"!bg-white rounded !h-[50px] !border-0"}
                                    dropdownClassName={"rounded !bg-white !border-0"}
                                    value={
                                        selectedAssignedMemberName ? selectedAssignedMemberName : ""
                                    }
                                    name={"member"}
                                    handleChange={(_, value) => {
                                        // setOpenAssignMember(false);
                                        // setDropdownHeight(null);
                                        setMemberAssigned(value);
                                    }}
                                    dropdownOptions={uniqueTeamMembers?.map((member) => ({
                                        label: `${member.fullName} - ${member.email}`,
                                        value: member._id,
                                        icon: (
                                            <img
                                                src={member?.profile?.logo}
                                                className="h-[30px] w-[30px] rounded-full border object-cover"
                                                alt={"Hey team member"}
                                            />
                                        ),
                                    }))}
                                    placeholder={` ${
                                        teamMembersLoading
                                            ? "Loading..."
                                            : "Search people or teams.."
                                    }`}
                                    setDropdownHeight={setDropdownHeight}
                                />
                                <p
                                    className={`text-xs border-t rounded-b font-rocGroteskMedium bg-white px-5 py-4 text-center`}
                                    style={{
                                        marginTop: `${
                                            dropdownHeight
                                                ? dropdownHeight?.offsetHeight + "px"
                                                : ""
                                        }`,
                                    }}
                                >
                                    Important information goes here, like keyboard shortcut{" "}
                                    <span className="underline cursor-pointer">Click here</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {isStatusUpdateModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        setIsStatusUpdateModalOpen(false);
                        setStatus({
                            message: "",
                            statusOption: "",
                        });
                        setStatusAttachments([]);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                What's the status of the shipment?
                            </p>
                            <div>
                                <SelectInput
                                    value={status.statusOption}
                                    name="statusOption"
                                    placeholder={"Select Status"}
                                    handleChange={(name, value) =>
                                        setStatus((prev) => ({ ...prev, statusOption: value }))
                                    }
                                    dropdownOptions={[
                                        {
                                            label: "Shipment is live",
                                            value: "Shipment is live",
                                        },
                                        {
                                            label: "Shipment is now in transit",
                                            value: "Shipment is now in transit",
                                        },
                                        {
                                            label: "Shipment delivered",
                                            value: "Shipment delivered",
                                        },
                                        {
                                            label: "Shipment ready for pickup",
                                            value: "Shipment ready for pickup",
                                        },
                                        {
                                            label: "Shipment picked up",
                                            value: "Shipment picked up",
                                        },
                                        {
                                            label: "Export clearance",
                                            value: "Export clearance",
                                        },
                                        {
                                            label: "Documentation in progress",
                                            value: "Documentation in progress",
                                        },
                                        {
                                            label: "Shipment department origin",
                                            value: "Shipment department origin",
                                        },
                                        {
                                            label: "Customs Examination in progress",
                                            value: "Customs Examination in progress",
                                        },
                                        {
                                            label: "Customs query",
                                            value: "Customs query",
                                        },
                                        {
                                            label: "Customs query resolved",
                                            value: "Customs query resolved",
                                        },
                                        {
                                            label: "Customs release and exit",
                                            value: "Customs release and exit",
                                        },
                                        {
                                            label: "Shipment released",
                                            value: "Shipment released",
                                        },
                                        {
                                            label: "Truck on queue for loading",
                                            value: "Truck on queue for loading",
                                        },
                                        {
                                            label: "Shipment loaded",
                                            value: "Shipment loaded",
                                        },
                                    ]}
                                />
                                <div className="border rounded mt-4">
                                    <textarea
                                        className="appearance-none rounded outline-0 w-full text-[13px] !border-0 font-rocGroteskMedium placeholder:font-rocGroteskMedium p-3 resize-none leading-5"
                                        rows={"3"}
                                        value={status.message}
                                        onChange={(evt) =>
                                            setStatus((prev) => ({
                                                ...prev,
                                                message: evt.target.value,
                                            }))
                                        }
                                        placeholder={"Type a message"}
                                    />
                                    <div className="p-3">
                                        <div className="mb-3 flex flex-wrap gap-2">
                                            {statusAttachments.map((item, idx) => {
                                                return item?.type?.includes("image") ? (
                                                    <div key={idx} className="relative">
                                                        <img
                                                            src={item.file}
                                                            alt={item.name}
                                                            className="w-[52px] h-[52px] rounded"
                                                        />
                                                        <div
                                                            onClick={() => {
                                                                const attachments = [
                                                                    ...statusAttachments,
                                                                ];
                                                                attachments.splice(idx, 1);
                                                                setStatusAttachments(attachments);
                                                            }}
                                                            className="absolute top-[-6px] right-[-6px] cursor-pointer w-5 h-5 bg-mvx-light-blue border-white border-2 rounded-full flex items-center justify-center"
                                                        >
                                                            <span className="material-icons text-sm text-mvx-neutral">
                                                                close
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : item?.type?.includes("application") ? (
                                                    <div key={idx} className="relative">
                                                        <div className="py-2 px-[10px] border rounded">
                                                            <p className="text-xs text-gun-metal mb-1 font-rocGroteskMedium">
                                                                {_.truncate(item?.name, {
                                                                    length: 20,
                                                                })}
                                                            </p>
                                                            <p className="text-xs text-mvx-neutral uppercase font-rocGroteskMedium">
                                                                Document
                                                            </p>
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                const attachments = [
                                                                    ...statusAttachments,
                                                                ];
                                                                attachments.splice(idx, 1);
                                                                setStatusAttachments(attachments);
                                                            }}
                                                            className="absolute top-[-6px] right-[-6px] cursor-pointer w-5 h-5 bg-mvx-light-blue border-white border-2 rounded-full flex items-center justify-center"
                                                        >
                                                            <span className="material-icons text-sm text-mvx-neutral">
                                                                close
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                        {documentUploading ? (
                                            <div className="flex w-fit justify-start">
                                                <Loader color={"gun-metal"} />
                                            </div>
                                        ) : (
                                            <div className="flex relative">
                                                <div className="w-6 h-6 cursor-pointer rounded-full bg-mvx-light-blue flex items-center justify-center">
                                                    <span className="material-icons text-base text-mvx-neutral">
                                                        add
                                                    </span>
                                                </div>
                                                <input
                                                    className="absolute w-6 h-6 opacity-0 cursor-pointer left-0"
                                                    type={"file"}
                                                    onChange={(evt) => {
                                                        handleUpload(
                                                            evt.target.files[0].name,
                                                            evt.target.files[0]
                                                        );
                                                    }}
                                                    accept={
                                                        "image/*, .pdf, .doc, .docx, .ppt, .xlsx, .xltx, .xlm, .xls, .cts, .xlr, .csv, .mp3, .ogg"
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase w-full rounded-t-none rounded-bl-lg text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
                                onClick={() => {
                                    setIsStatusUpdateModalOpen(false);
                                    setStatus({
                                        message: "",
                                        statusOption: "",
                                    });
                                    setStatusAttachments([]);
                                }}
                            >
                                close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const data = {
                                        shipmentId: selectedShipment?._id,
                                        message: status.statusOption,
                                        media: statusAttachments.map((fileInfo) => ({
                                            filename: fileInfo?.name,
                                            content: fileInfo?.file,
                                        })),
                                        additionalInfo: status.message,
                                    };
                                    dispatch(shipmentActions.sendShipmentStatusUpdate(data));
                                }}
                                className={`uppercase w-full rounded-t-none rounded-br-lg text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 border-y px-3`}
                                disabled={documentUploading}
                            >
                                {sendShipmentStatusLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">Send update</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {isStatusUpdateSuccessModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        dispatch(shipmentActions.resetShipmentSuccessData());
                        setIsStatusUpdateSuccessModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 py-8">
                            <img src={successImg} alt="success" className="mb-6 m-auto" />
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Status Update Successfully Sent
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Status Update for TA{selectedShipment.mvxid} has been sent
                                successfully
                            </p>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {isTakeShipmentLiveModalOneOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        setIsTakeShipmentLiveModalOneOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Take shipment live?
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Are you sure you want to take this shipment live?
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
                                onClick={() => {
                                    setIsTakeShipmentLiveModalOneOpen(false);
                                }}
                            >
                                NO, I DONT
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    dispatch(
                                        shipmentActions.takeShipmentLive(selectedShipment._id)
                                    );
                                }}
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 border-y px-3`}
                            >
                                {takeShipmentLiveLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">Yes, take live</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {isTakeShipmentLiveSucessModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        dispatch(shipmentActions.resetShipmentSuccessData());
                        setIsTakeShipmentLiveSucessModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div
                            className={`px-6 pt-8 ${
                                takeShipmentLiveSuccess?.data &&
                                !takeShipmentLiveSuccess?.data?.hasQuote
                                    ? ""
                                    : "pb-4"
                            }`}
                        >
                            <img src={successImg} alt="success" className="mb-6 m-auto" />
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Shipment is Live!
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Your Shipment no. TA{selectedShipment.mvxid} has been taken live
                                successfully. You can track and give status updates using the Fleet+
                                application.{" "}
                                {takeShipmentLiveSuccess?.data &&
                                    !takeShipmentLiveSuccess?.data?.hasQuote &&
                                    "This shipment does not have a quote yet, would you like to create a quote"}
                            </p>
                        </div>
                        {takeShipmentLiveSuccess?.data &&
                            !takeShipmentLiveSuccess?.data?.hasQuote && (
                                <div className="flex pt-[42px]">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            dispatch(shipmentActions.resetShipmentSuccessData());
                                            setIsTakeShipmentLiveSucessModalOpen(false);
                                        }}
                                        className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
                                    >
                                        NO
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            dispatch(shipmentActions.resetShipmentSuccessData());
                                            navigate(
                                                `/dashboard/create-quote/customer/${selectedShipment?._id}`
                                            );
                                        }}
                                        className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 border-y px-3`}
                                    >
                                        Yes, CREATE A QUOTE
                                    </button>
                                </div>
                            )}
                    </div>
                </ModalContainer>
            )}
            {isEndShipmenteModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => setEndShipmentModalOpen(false)}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                End Shipment?
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Are you sure you want to end this shipment?
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
                                onClick={() => setEndShipmentModalOpen(false)}
                            >
                                NO, Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    dispatch(shipmentActions.endLiveShipment(selectedShipment._id))
                                }
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 border-y px-3`}
                            >
                                {endLiveShipmentLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">Yes, End Shipment</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {isEndLiveShipmenteSucessModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%] "
                    closeModal={() => {
                        dispatch(shipmentActions.resetShipmentSuccessData());
                        setIsEndLiveShipmenteSucessModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 py-8">
                            <img src={successImg} alt="success" className="mb-6 m-auto" />
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Shipment has ended!
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Your Shipment no. TA{selectedShipment.mvxid} has ended
                            </p>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {isCancelShipmentModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => setIsCancelShipmentModalOpen(false)}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Cancel Shipment Request
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Are you sure you want to cancel this shipment request? this cannot
                                be undone.
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
                                onClick={() => setIsCancelShipmentModalOpen(false)}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    dispatch(
                                        shipmentActions.cancelLiveShipment(
                                            selectedShipment._id,
                                            reason
                                        )
                                    )
                                }
                                className={`uppercase rounded-br-lg w-full text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 border-y px-3`}
                            >
                                {cancelPendingShipmentLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">YES</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
            {isCancelShipmentSuccessModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        dispatch(shipmentActions.resetShipmentSuccessData());
                        setIsCancelShipmentSuccessModalOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 py-8">
                            <img src={successImg} alt="success" className="mb-6 m-auto" />
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Shipment Cancelled!
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Your Shipment TA{selectedShipment.mvxid} has been successfully
                                rejected
                            </p>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default Dashboard;
