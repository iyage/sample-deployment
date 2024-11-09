/* eslint-disable react-hooks/exhaustive-deps */
import { authActions, chatActions, shipmentActions } from "actions";
import Dropdown from "components/common/Dropdown";
import Loader from "components/common/Loader";
import ModalContainer from "components/common/ModalContainer";
import NavTwo from "components/common/NavTwo";
import millify from "millify";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import successImg from "assets/images/externalPages/waitlist-success.svg";
import cargoImg from "assets/images/shipments/cargo.svg";
import _ from "lodash";
import ChatPopup from "components/common/ChatPopup";
import SelectInput from "components/common/SelectInput";
import { firebaseService } from "services/firebaseService";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getFromStorage, isMobile } from "helpers";
import useModal from "components/common/Modals/ModalProvider";

const ShipmentList = () => {
    const { openModal } = useModal();
    const [activeTab, setActiveTab] = useState(0);
    const [openFilter, setOpenFilter] = useState(false);
    const [openMobileFilter, setOpenMobileFilter] = useState(false);
    const [reason, setReason] = useState("");
    const [isTakeShipmentLiveModalOneOpen, setIsTakeShipmentLiveModalOneOpen] = useState(false);
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
    const [openChatPopup, setOpenChatPopup] = useState(false);
    const [isTakeShipmentLiveSucessModalOpen, setIsTakeShipmentLiveSucessModalOpen] =
        useState(false);
    const [isEndShipmenteModalOpen, setEndShipmentModalOpen] = useState(false);
    const [isEndLiveShipmenteSucessModalOpen, setIsEndLiveShipmenteSucessModalOpen] =
        useState(false);
    const [isCancelShipmentModalOpen, setIsCancelShipmentModalOpen] = useState(false);
    const [isCancelShipmentSuccessModalOpen, setIsCancelShipmentSuccessModalOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState({});
    const [openFilterChild, setOpenFilterChild] = useState(false);
    const [activeFilterOption, setActiveFilterOption] = useState(null);
    const [activeFilterChildOption, setActiveFilterChildOption] = useState(null);
    const [activeShipmentsData, setActiveShipmentsData] = useState([]);
    const [pendingShipmentsData, setPendingShipmentsData] = useState([]);
    const [completedShipmentsData, setCompletedShipmentsData] = useState([]);
    const [cancelledShipmentsData, setCancelledShipmentsData] = useState([]);
    const [activeShipmentsInfo, setActiveShipmentsInfo] = useState([]);
    const [pendingShipmentsInfo, setPendingShipmentsInfo] = useState([]);
    const [completedShipmentsInfo, setCompletedShipmentsInfo] = useState([]);
    const [cancelledShipmentsInfo, setCancelledShipmentsInfo] = useState([]);
    const [currentPage, setCurrentPage] = useState({
        activeShipmentPage: 1,
        pendingShipmentPage: 1,
        completedShipmentPage: 1,
        cancelledShipmentPage: 1,
    });
    const [completedTab, setCompletedTab] = useState({
        activeTabCompleted: false,
        pendingTabCompleted: false,
        completedTabCompleted: false,
        cancelledTabCompleted: false,
    });
    const [analytics, setAnalytics] = useState([]);
    const tabs = ["active", "pending", "completed", "cancelled"];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const filterRef = useRef(null);
    const mobileFilterRef = useRef(null);
    const user = getFromStorage("tradeAlly-user");
    const {
        isActiveShipmentsLoading,
        activeShipments,
        customerAndEarningsAnalytics,
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
        shipmentCount,
    } = useSelector((state) => state.shipment);
    const { teamMembersLoading, teamMembers } = useSelector((state) => state.auth);

    const selectedAssignedMemberName = teamMembers?.data?.find(
        (member) => member._id === memberAssigned
    )?.fullName;

    const uniqueTeamMembersIds = [...new Set(selectedShipment?.admins?.slice(0, 2) ?? [])];
    const uniqueTeamMembers = teamMembers?.data?.filter(
        (member) => !uniqueTeamMembersIds.includes(member._id)
    );

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
            case "cancelled":
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
            label: "Mode",
            value: "mode",
            children: [
                {
                    label: "Land",
                    value: "land",
                    icon: <span className="material-icons text-base">local_shipping</span>,
                },
                {
                    label: "Air",
                    value: "air",
                    icon: <span className="material-icons text-base">flight_takeoff</span>,
                },
                {
                    label: "Ocean",
                    value: "ocean",
                    icon: <span className="material-icons text-base">directions_boat</span>,
                },
            ],
        },
        {
            label: "Type",
            value: "type",
            children: [
                {
                    label: "Import",
                    value: "import",
                    icon: <span className="material-icons text-base">south_east</span>,
                },
                {
                    label: "Export",
                    value: "export",
                    icon: <span className="material-icons text-base">north_east</span>,
                },
            ],
        },
        {
            label: "Shipment ID",
            value: "shipmentId",
            customChild: (
                <div className="flex items-center max-sm:w-[75%]">
                    <div className="flex items-center px-4 bg-mvx-light-blue h-[40px] border-y border-l font-rocGroteskMedium text-sm uppercase text-mvx-neutral">
                        ta
                    </div>
                    <input
                        type="text"
                        placeholder="000119"
                        className="border border-gray-200 py-3 px-4 outline-0 w-full h-[40px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                        onInput={_.debounce((evt) => {
                            setActiveFilterChildOption(evt.target.value);
                        }, 800)}
                    />
                </div>
            ),
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
                        label: "Complete Shipment",
                        value: "Complete Shipment",
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
                        action: () => generatePaymentLink,
                    },
                    {
                        label: "Chat with Customer",
                        value: "Chat with Customer",
                        action: () => setOpenChatPopup(true),
                    },
                ];
            default:
                return [];
        }
    }, [
        activeTab,
        selectedShipment?.ended,
        selectedShipment?._id,
        navigate,
        selectedShipment?.freightForwarderId,
    ]);

    const displayShipments = () => {
        return tableData && tableData.length > 0 ? (
            tableData?.map((shipment) => {
                return (
                    <div
                        key={shipment.mvxid}
                        onClick={() => {
                            return (
                                activeTab !== 3 && navigate(`/dashboard/shipment/${shipment?._id}`)
                            );
                        }}
                        className={`${activeTab !== 3 && "hover:bg-[#FAFBFC] cursor-pointer"}`}
                    >
                        <hr />
                        <div className="w-full grid grid-cols-[1fr_200px_1fr_2.5fr_1fr_1fr_0.2fr] py-3 px-4 max-sm:hidden">
                            <div className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                FL {shipment?.mvxid}
                            </div>
                            <h3 className="flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                {shipment?.reference || "--"}
                            </h3>

                            <div className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                {_.truncate(shipment?.shipperDetails?.fullName, {
                                    length: 20,
                                })}
                            </div>
                            <div className="pr-16">
                                <div>
                                    <div className="flex items-center">
                                        <span className="basis-[7px] h-1.5 bg-mvx-black mr-2"></span>
                                        <span className="flex-1 h-1 bg-mvx-black"></span>
                                        <span className="material-icons mx-2 text-lg">
                                            {shipment?.serviceMode?.toLowerCase() === "land"
                                                ? "local_shipping"
                                                : shipment?.serviceMode?.toLowerCase() === "air"
                                                ? "flight_takeoff"
                                                : "directions_boat"}
                                        </span>
                                        <span className="flex-1 h-1 bg-[#DFE1E6]"></span>
                                        <span className="basis-[7px] h-1.5 bg-[#DFE1E6] ml-2"></span>
                                    </div>
                                    <div className="flex items-start justify-between gap-4">
                                        <p className="text-sm text-gun-metal font-rocGroteskMedium w-1/2">
                                            {shipment?.origin?.address}
                                            <span className="text-mvx-neutral text-xs block font-rocGroteskMedium mt-[1px] text-left">
                                                {_.truncate(
                                                    shipment?.freightForwarder?.profile
                                                        ?.businessName ??
                                                        shipment?.freightForwarder?.fullName,
                                                    {
                                                        length: 20,
                                                    }
                                                )}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gun-metal font-rocGroteskMedium text-right w-1/2">
                                            {shipment?.destination?.address}
                                            <span className="text-mvx-neutral text-xs block font-rocGroteskMedium mt-[1px]">
                                                {_.truncate(
                                                    shipment?.shipperDetails?.fullName ??
                                                        "Customer",
                                                    {
                                                        length: 20,
                                                    }
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                {shipment?.serviceMode}
                            </div>
                            <div className="flex justify-start gap-2 items-center text-sm font-rocGroteskMedium text-gun-metal">
                                {displayStatus(shipment?.currentStatus?.toLowerCase())}
                                <span className="capitalize">
                                    {shipment?.ended ? "Delivered" : shipment?.currentStatus}
                                </span>
                            </div>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal"
                            >
                                {displayOptions()?.length > 0 ? (
                                    <div
                                        className={`flex justify-center items-center w-8 h-8 rounded-full hover:bg-mvx-light-blue ${
                                            shipment?._id === selectedShipment?.id &&
                                            "bg-mvx-light-blue"
                                        }`}
                                    >
                                        <Dropdown
                                            value={""}
                                            dropdown={
                                                <span
                                                    onClick={() => setSelectedShipment(shipment)}
                                                    className="material-icons text-base"
                                                >
                                                    more_vert
                                                </span>
                                            }
                                            dropdownContainerClasses={`${
                                                activeTab === 1 ? "left-[-150px]" : "left-[-170px]"
                                            } shadow-dropdownShadow rounded border-0 max-h-fit`}
                                            dropdownItemsClasses={`${
                                                activeTab === 2
                                                    ? ""
                                                    : "last:text-[#FF0000] last:hover:bg-[#FFF4F4]"
                                            }`}
                                            name={shipment.freightForwarderId}
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
                                            TA {shipment?.mvxid}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="text-sm text-gun-metal">
                                                {_.truncate(shipment?.origin?.address, {
                                                    length: 20,
                                                })}
                                            </span>
                                            <span className="material-icons text-sm font-normal">
                                                arrow_forward
                                            </span>
                                            <span className="text-sm text-gun-metal">
                                                {_.truncate(shipment?.destination?.address, {
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
                                                    shipment?._id === selectedShipment?.id &&
                                                    "bg-mvx-light-blue"
                                                }`}
                                            >
                                                <Dropdown
                                                    value={""}
                                                    dropdown={
                                                        <span
                                                            onClick={() =>
                                                                setSelectedShipment(shipment)
                                                            }
                                                            className="material-icons text-base"
                                                        >
                                                            more_vert
                                                        </span>
                                                    }
                                                    dropdownContainerClasses={`${
                                                        activeTab === 1
                                                            ? "left-[-150px]"
                                                            : "left-[-170px]"
                                                    } shadow-dropdownShadow rounded border-0`}
                                                    dropdownItemsClasses={`${
                                                        activeTab === 2
                                                            ? ""
                                                            : "last:text-[#FF0000] last:hover:bg-[#FFF4F4]"
                                                    }`}
                                                    name={shipment.freightForwarderId}
                                                    dropdownOptions={displayOptions()}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center bg-mvx-light-blue rounded px-2 py-1 w-fit">
                                        <span className="text-xs text-mvx-neutral">
                                            {shipment?.serviceMode}
                                        </span>
                                        <span className="material-icons mx-2 text-sm text-mvx-neutral">
                                            {shipment?.serviceMode?.toLowerCase() === "land"
                                                ? "local_shipping"
                                                : shipment?.serviceMode?.toLowerCase() === "air"
                                                ? "flight_takeoff"
                                                : "directions_boat"}
                                        </span>
                                    </div>
                                    <div className="flex justify-start gap-2 items-center text-xs font-rocGroteskMedium text-gun-metal">
                                        {displayStatus(shipment?.currentStatus?.toLowerCase())}
                                        <span className="capitalize">
                                            {shipment?.ended
                                                ? "Delivered"
                                                : shipment?.currentStatus}
                                        </span>
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
                <div className="flex flex-col items-center p-16">
                    <img width={42} className="mb-4" src={cargoImg} alt="cargo" />
                    <p className="text-center mb-1 text-lg text-gun-metal font-rocGroteskMedium">
                        No shipments yet
                    </p>
                    <p className="text-center text-gun-metal text-sm">
                        You don't have any shipments yet.
                    </p>
                    {activeTab === 1 && (
                        <div className="mt-2">
                            <button
                                className="bg-pacific-cyan text-white font-rocGroteskMedium w-full py-2 text-sm rounded px-7"
                                type={"button"}
                            >
                                Create a shipment
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const onScroll = () => {
        let lastScrollTop = 0;
        let scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        let st = window.pageYOffset || document.documentElement.scrollTop;
        const condition = isMobile
            ? scrollTop + clientHeight >= scrollHeight - 65
            : scrollTop + clientHeight >= scrollHeight;

        if (condition && st > lastScrollTop) {
            switch (activeTab) {
                case 0: {
                    if (
                        activeShipmentsData?.pagination?.current <
                        activeShipmentsData?.pagination?.number_of_pages
                    ) {
                        setCurrentPage((prev) => {
                            return {
                                ...prev,
                                activeShipmentPage: activeShipmentsData?.pagination?.current + 1,
                            };
                        });
                    }
                    break;
                }
                case 1: {
                    if (
                        pendingShipmentsData?.pagination?.current <
                        pendingShipmentsData?.pagination?.number_of_pages
                    ) {
                        setCurrentPage((prev) => {
                            return {
                                ...prev,
                                pendingShipmentPage: pendingShipmentsData?.pagination?.current + 1,
                            };
                        });
                    }

                    break;
                }
                case 2: {
                    if (
                        completedShipmentsData?.pagination?.current <
                        completedShipmentsData.pagination.number_of_pages
                    ) {
                        setCurrentPage((prev) => {
                            return {
                                ...prev,
                                completedShipmentPage:
                                    completedShipmentsData?.pagination?.current + 1,
                            };
                        });
                    }

                    break;
                }
                case 3: {
                    if (
                        cancelledShipmentsData?.pagination?.current <
                        cancelledShipmentsData.pagination.number_of_pages
                    ) {
                        setCurrentPage((prev) => {
                            return {
                                ...prev,
                                cancelledShipmentPage:
                                    cancelledShipmentsData?.pagination?.current + 1,
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

    useEffect(() => {
        if (Boolean(memberAssigned) && selectedShipment?._id) {
            dispatch(
                shipmentActions.assignShipmentToMember({
                    shipmentId: selectedShipment?._id,
                    memberId: memberAssigned,
                })
            );
            setMemberAssigned("");
        }
    }, [dispatch, memberAssigned, selectedShipment?._id]);

    useEffect(() => {
        dispatch(shipmentActions.fetchShipmentCount(null, 1));
    }, [dispatch]);

    useEffect(() => {
        dispatch(
            shipmentActions.fetchActiveShipments(
                "active",
                Boolean(activeFilterChildOption) ? 1 : currentPage.activeShipmentPage,
                typeof activeFilterChildOption !== "number" ? activeFilterChildOption : "",
                typeof activeFilterChildOption === "number"
                    ? moment().subtract(activeFilterChildOption, "days").format("DD-MM-YYYY")
                    : "",
                ""
            )
        );
    }, [dispatch, currentPage.activeShipmentPage, activeFilterChildOption]);

    useEffect(() => {
        dispatch(
            shipmentActions.fetchPendingShipments(
                "pending",
                Boolean(activeFilterChildOption) ? 1 : currentPage.pendingShipmentPage,
                typeof activeFilterChildOption !== "number" ? activeFilterChildOption : "",
                typeof activeFilterChildOption === "number"
                    ? moment().subtract(activeFilterChildOption, "days").format("DD-MM-YYYY")
                    : "",
                ""
            )
        );
    }, [dispatch, currentPage.pendingShipmentPage, activeFilterChildOption]);

    useEffect(() => {
        dispatch(
            shipmentActions.fetchCompletedShipments(
                "completed",
                Boolean(activeFilterChildOption) ? 1 : currentPage.completedShipmentPage,
                typeof activeFilterChildOption !== "number" ? activeFilterChildOption : "",
                typeof activeFilterChildOption === "number"
                    ? moment().subtract(activeFilterChildOption, "days").format("DD-MM-YYYY")
                    : "",
                ""
            )
        );
    }, [dispatch, currentPage.completedShipmentPage, activeFilterChildOption]);

    useEffect(() => {
        dispatch(
            shipmentActions.fetchCancelledShipments(
                "cancelled",
                Boolean(activeFilterChildOption) ? 1 : currentPage.cancelledShipmentPage,
                typeof activeFilterChildOption !== "number" ? activeFilterChildOption : "",
                typeof activeFilterChildOption === "number"
                    ? moment().subtract(activeFilterChildOption, "days").format("DD-MM-YYYY")
                    : "",
                ""
            )
        );
    }, [dispatch, currentPage.cancelledShipmentPage, activeFilterChildOption]);

    useEffect(() => {
        dispatch(authActions.fetchTeamMembers());
    }, [dispatch]);

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
    }, [takeShipmentLiveSuccess, pendingShipmentsInfo]);

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
        }
    }, [cancelPendingShipmentSuccess, pendingShipmentsInfo]);

    useEffect(() => {
        if (Boolean(endLiveShipmentSuccess)) {
            const activeShipmentsCopy = [...activeShipmentsInfo];
            const itemIndex = _.findIndex(activeShipmentsCopy, [
                "_id",
                endLiveShipmentSuccess.data._id,
            ]);

            if (itemIndex !== -1) {
                activeShipmentsCopy[itemIndex].ended = true;
                setActiveShipmentsInfo(activeShipmentsCopy);
            }
        }
    }, [endLiveShipmentSuccess, activeShipmentsInfo]);

    useEffect(() => {
        dispatch(shipmentActions.fetchCustomerAndEarningsAnalytics());
    }, [dispatch]);

    useEffect(() => {
        if (Boolean(activeShipments)) {
            setActiveShipmentsData(activeShipments);
            if (Boolean(activeFilterChildOption) || activeFilterChildOption === 0) {
                setActiveShipmentsInfo(activeShipments.data);
            } else {
                setActiveShipmentsInfo((prevState) =>
                    _.uniqWith([...prevState, ...activeShipments.data], _.isEqual)
                );
            }
        }
    }, [activeShipments, activeFilterChildOption]);

    useEffect(() => {
        if (Boolean(pendingShipments)) {
            setPendingShipmentsData(pendingShipments);
            if (Boolean(activeFilterChildOption) || activeFilterChildOption === 1) {
                setPendingShipmentsInfo(pendingShipments.data);
            } else {
                setPendingShipmentsInfo((prevState) =>
                    _.uniqWith([...prevState, ...pendingShipments.data], _.isEqual)
                );
            }
        }
    }, [pendingShipments, activeFilterChildOption]);

    useEffect(() => {
        if (Boolean(completedShipments)) {
            setCompletedShipmentsData(completedShipments);
            if (Boolean(activeFilterChildOption) || activeFilterChildOption === 2) {
                setCompletedShipmentsInfo(completedShipments.data);
            } else {
                setCompletedShipmentsInfo((prevState) =>
                    _.uniqWith([...prevState, ...completedShipments.data], _.isEqual)
                );
            }
        }
    }, [completedShipments, activeFilterChildOption]);

    useEffect(() => {
        if (Boolean(cancelledShipments)) {
            setCancelledShipmentsData(cancelledShipments);
            if (Boolean(activeFilterChildOption) || activeFilterChildOption === 3) {
                setCancelledShipmentsInfo(cancelledShipments.data);
            } else {
                setCancelledShipmentsInfo((prevState) =>
                    _.uniqWith([...prevState, ...cancelledShipments.data], _.isEqual)
                );
            }
        }
    }, [cancelledShipments, activeFilterChildOption]);

    useEffect(() => {
        setAnalytics(customerAndEarningsAnalytics);
    }, [customerAndEarningsAnalytics]);

    useEffect(() => {
        if (Boolean(takeShipmentLiveSuccess)) {
            // setIsTakeShipmentLiveModalTwoOpen(false);
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
        if (Boolean(endLiveShipmentSuccess)) {
            setEndShipmentModalOpen(false);
            setIsEndLiveShipmenteSucessModalOpen(true);
        }
    }, [endLiveShipmentLoading, endLiveShipmentSuccess]);

    useEffect(() => {
        if (Boolean(cancelPendingShipmentSuccess)) {
            setIsCancelShipmentModalOpen(false);
            setReason("");
            setIsCancelShipmentSuccessModalOpen(true);
        }
    }, [cancelPendingShipmentLoading, cancelPendingShipmentSuccess]);

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
        if (currentPage.activeShipmentPage === activeShipmentsData?.pagination?.number_of_pages) {
            setCompletedTab((prev) => {
                return {
                    ...prev,
                    activeTabCompleted: true,
                };
            });
        }
        if (currentPage.pendingShipmentPage === pendingShipmentsData?.pagination?.number_of_pages) {
            setCompletedTab((prev) => {
                return {
                    ...prev,
                    pendingTabCompleted: true,
                };
            });
        }
        if (
            currentPage.completedShipmentPage ===
            completedShipmentsData?.pagination?.number_of_pages
        ) {
            setCompletedTab((prev) => {
                return {
                    ...prev,
                    completedTabCompleted: true,
                };
            });
        }
        if (
            currentPage.cancelledShipmentPage ===
            cancelledShipmentsData?.pagination?.number_of_pages
        ) {
            setCompletedTab((prev) => {
                return {
                    ...prev,
                    cancelledTabCompleted: true,
                };
            });
        }
    }, [
        activeShipmentsData?.pagination,
        activeShipmentsData?.pagination?.number_of_pages,
        currentPage?.pendingShipmentPage,
        currentPage.cancelledShipmentPage,
        currentPage.completedShipmentPage,
        currentPage.activeShipmentPage,
        completedShipmentsData?.pagination?.number_of_pages,
        cancelledShipmentsData?.pagination?.number_of_pages,
        pendingShipmentsData?.pagination?.number_of_pages,
        completedTab.activeTabCompleted,
        completedTab.pendingTabCompleted,
        completedTab.completedTabCompleted,
        completedTab.cancelledTabCompleted,
    ]);

    if (shipmentCount === null) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div className={`${openChatPopup ? "overflow-hidden fixed w-full" : ""}`}>
            <NavTwo />
            <div className={`mb-16 mt-24 px-[104px] max-lg:my-4 max-lg:px-4`}>
                <div className="flex items-center justify-between w-full mb-6 max-sm:mb-8">
                    <p className="font-rocGroteskBold text-[22px] text-gun-metal ">
                        Shipment Management
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
                                <span className="material-icons text-xl">filter_list</span>{" "}
                                {Boolean(activeFilterChildOption) && (
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenFilter(false);
                                            setOpenFilterChild(false);
                                            setActiveFilterOption(null);
                                            setActiveFilterChildOption(null);
                                            setCurrentPage(() => ({
                                                activeShipmentPage: 1,
                                                pendingShipmentPage: 1,
                                                completedShipmentPage: 1,
                                                cancelledShipmentPage: 1,
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
                                    className="absolute top-[28px] left-[-150px]"
                                >
                                    <div
                                        className={`shadow-dropdownShadow rounded min-w-max py-2 max-sm:py-0 bg-white relative w-full h-auto max-h-64 z-20 overflow-auto border `}
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
                                                        className={`flex gap-8 items-center px-6 max-sm:px-3 justify-between hover:bg-mvx-light-blue ${
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
                                                className={`shadow-dropdownShadow rounded min-w-max absolute py-2 max-sm:py-0 bg-white absolute top-[30%] left-[-100%] w-full h-auto max-h-64 z-20 overflow-auto border `}
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
                                                                className={`flex gap-8 items-center pl-4 max-sm:pl-3 pr-1 justify-between hover:bg-mvx-light-blue ${
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
                                                className={`shadow-dropdownShadow rounded min-w-max absolute py-2 bg-white absolute top-[47%] left-[-155%] w-full h-auto max-h-64 z-20 overflow-auto border `}
                                            >
                                                <div
                                                    className={`flex gap-8 items-center px-1 justify-between max-sm:justify-end cursor-pointer `}
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
                            onClick={() => navigate(`/dashboard/shipment-creation/${user?._id}`)}
                        ></i>
                    </div>
                </div>

                <div className="flex max-sm:flex-col gap-6 mb-12">
                    <div className="border max-sm:border-none max-sm:p-0 max-sm:w-full pl-6 pb-6 pt-[45px] w-[275px]">
                        <p className="mb-1 font-rocGroteskBold text-[32px] max-sm:text-2xl text-gun-metal">
                            {Boolean(shipmentCount) ? shipmentCount : "0"}
                        </p>
                        <p className="font-rocGroteskMedium text-sm text-gun-metal">
                            Total Shipments
                        </p>
                    </div>
                    <div className="border max-sm:border-none max-sm:p-0 max-sm:w-full pl-6 pb-6 pt-[45px] w-[275px]">
                        <p className="mb-1 font-rocGroteskBold text-[32px] max-sm:text-2xl text-gun-metal">
                            {Boolean(analytics?.earningsData?.totalEarningsInUSD)
                                ? "$" +
                                  millify(analytics?.earningsData?.totalEarningsInUSD, {
                                      precision: 2,
                                      lowercase: true,
                                  })
                                : "$0"}
                        </p>

                        <p className="font-rocGroteskMedium text-sm text-gun-metal">
                            Total Earnings
                        </p>
                    </div>
                </div>
                <div>
                    <div className="mb-6">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex gap-8 max-sm:gap-0 max-sm:justify-between max-sm:w-full">
                                {tabs.map((tab, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveTab(idx)}
                                            className={`flex gap-1 items-center ${
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
                                                {tab}
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
                                    onClick={() =>
                                        navigate(`/dashboard/shipment-creation/${user?._id}`)
                                    }
                                >
                                    Create Shipment
                                </button>
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
                                        {(Boolean(activeFilterChildOption) ||
                                            activeFilterChildOption === 0) && (
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenFilter(false);
                                                    setOpenFilterChild(false);
                                                    setActiveFilterOption(null);
                                                    setActiveFilterChildOption(null);
                                                    setCurrentPage(() => ({
                                                        activeShipmentPage: 1,
                                                        pendingShipmentPage: 1,
                                                        completedShipmentPage: 1,
                                                        cancelledShipmentPage: 1,
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
                                            className="absolute top-[38px] left-[-95px] max-lg:left-[-100px] max-lg:top-[40px]"
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
                                                                        setOpenFilterChild(false);
                                                                        setActiveFilterChildOption(
                                                                            null
                                                                        );
                                                                    }
                                                                }}
                                                                onMouseEnter={() => {
                                                                    setActiveFilterOption(
                                                                        option.value
                                                                    );
                                                                    setOpenFilterChild(true);
                                                                    if (
                                                                        !option?.children &&
                                                                        !option?.customChild
                                                                    ) {
                                                                        setOpenFilter(false);
                                                                        setOpenFilterChild(false);
                                                                        setActiveFilterChildOption(
                                                                            null
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
                                            {filterOptions.find(
                                                (item) => item.value === activeFilterOption
                                            )?.children &&
                                                filterOptions.find(
                                                    (item) => item.value === activeFilterOption
                                                )?.children.length > 0 &&
                                                openFilterChild && (
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
                                                                                // setActiveFilterOption(null);
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
                                                        className={`shadow-dropdownShadow rounded min-w-max absolute py-2 bg-white absolute top-[47%] left-[-133%] max-lg:left-[-140%] w-full h-auto max-h-64 z-20 overflow-auto border `}
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
                            </div>
                        </div>

                        {/* <hr className="mb-3" /> */}
                    </div>
                    <div className="border max-sm:border-none rounded">
                        <div className="w-full grid grid-cols-[1fr_200px_1fr_2.5fr_1fr_1fr_0.2fr] my-3 px-4 max-sm:hidden">
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                SHIPMENT ID
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                Reference
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                CLIENT
                            </div>
                            <div className="flex justify-between pr-16">
                                <div className="uppercase text-xs font-rocGroteskMedium text-mvx-neutral">
                                    Origin
                                </div>
                                <div className="uppercase text-xs font-rocGroteskMedium text-mvx-neutral">
                                    Destination
                                </div>
                            </div>

                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                MODE
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                STATUS
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral"></div>
                        </div>
                        <div>{displayShipments()}</div>
                    </div>
                    {completedTab.activeTabCompleted &&
                        activeTab === 0 &&
                        !isActiveShipmentsLoading && (
                            <div className="flex w-full mt-2 justify-center">
                                <p className="text-sm font-rocGroteskMedium">
                                    End of shipment list
                                </p>
                            </div>
                        )}
                    {completedTab.pendingTabCompleted &&
                        activeTab === 1 &&
                        !isPendingShipmentsLoading && (
                            <div className="flex w-full mt-2 justify-center">
                                <p className="text-sm font-rocGroteskMedium">
                                    End of shipment list
                                </p>
                            </div>
                        )}
                    {completedTab.completedTabCompleted &&
                        activeTab === 2 &&
                        !isCompletedShipmentsLoading && (
                            <div className="flex w-full mt-2 justify-center">
                                <p className="text-sm font-rocGroteskMedium">
                                    End of shipment list
                                </p>
                            </div>
                        )}
                    {completedTab.cancelledTabCompleted &&
                        activeTab === 3 &&
                        !isCancelledShipmentsLoading && (
                            <div className="flex w-full mt-2 justify-center">
                                <p className="text-sm font-rocGroteskMedium">
                                    End of shipment list
                                </p>
                            </div>
                        )}
                    {isActiveShipmentsLoading ||
                    isPendingShipmentsLoading ||
                    isCompletedShipmentsLoading ||
                    isCancelledShipmentsLoading ? (
                        <div className="flex w-full mt-2 justify-center">
                            <Loader color={"gun-metal"} />
                        </div>
                    ) : null}
                </div>
            </div>

            {/* MODALS */}

            <ChatPopup
                shipmentData={selectedShipment}
                openChatPopup={openChatPopup}
                closePopUp={() => {
                    setOpenChatPopup(false);
                    setSelectedShipment({});
                    dispatch(chatActions.clearFFChat());
                }}
            />

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
                                        className="appearance-none rounded outline-0 !border-0 w-full text-[13px] font-rocGroteskMedium placeholder:font-rocGroteskMedium p-3 resize-none leading-5"
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
                                className={`uppercase w-full rounded-bl-lg text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
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
                                disabled={documentUploading}
                                className={`uppercase w-full rounded-br-lg text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 border-y px-3`}
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
                                Complete Shipment?
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal px-6">
                                Are you sure you want to complete this shipment?
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
                                    <p className="text-inherit">Yes, Complete Shipment</p>
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

export default ShipmentList;
