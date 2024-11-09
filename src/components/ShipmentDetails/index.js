/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Map from "components/common/Map";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions, shipmentActions } from "actions";
import moment from "moment";
import AddMovementForm from "./AddMovementForm";
import SelectInput from "components/common/SelectInput";
import { firebaseService } from "services/firebaseService";
import LapHistory from "components/common/LapHistory";
import Skeleton from "components/common/Skeleton";
import MovementList from "./MovementList";
import Details from "./Details";
import NavTwo from "components/common/NavTwo";
import ShipmentUpdates from "./ShipmentUpdates";
import Documents from "./Documents";
import Dropdown from "components/common/Dropdown";
import ModalContainer from "components/common/ModalContainer";
import successImg from "assets/images/externalPages/waitlist-success.svg";
import Loader from "components/common/Loader";
import ChatPopup from "components/common/ChatPopup";
import useRouteQuery from "hooks/useRouteQuery";
import ShipmentInvoices from "./Invoices";

const tab = [
    { title: "Details", key: "details" },
    { title: "Shipment Updates", key: "updates" },
    { title: "Documents", key: "documents" },
    { title: "Invoices", key: "invoices" },
];

const ShipmentDetails = () => {
    const { searchParams, set } = useRouteQuery();
    const activeTab = searchParams?.get("tab") ?? tab?.at(0)?.key;
    const [movementForm, setMovementForm] = useState(false);
    const [openAssignMember, setOpenAssignMember] = useState(false);
    const [dropdownHeight, setDropdownHeight] = useState(null);
    const [memberAssigned, setMemberAssigned] = useState("");
    const [selectedMovement, setSelectedMovement] = useState(null);
    const [latestLocationData, setLatestLocationData] = useState(null);
    const [mapLoading, setMapLoading] = useState(true);
    const [showLapHistory, setLapHistory] = useState(false);
    const [overlay, setOverlay] = useState(false);
    const [popover, setPopover] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [rejectShipment, setRejectShipment] = useState(false);
    const [takeShipmentLive, setTakeShipmentLive] = useState(false);
    const [endShipment, setEndShipment] = useState(false);
    const [reason, setReason] = useState("");
    const [isEndLiveShipmenteSucessModalOpen, setIsEndLiveShipmenteSucessModalOpen] =
        useState(false);
    const [isTakeShipmentLiveModalOneOpen, setIsTakeShipmentLiveModalOneOpen] = useState(false);
    const [isTakeShipmentLiveSucessModalOpen, setIsTakeShipmentLiveSucessModalOpen] =
        useState(false);

    const {
        ffShipmentLoading,
        ffShipment,
        FFmovements,
        FFmovementsLoading,
        takeShipmentLiveLoading,
        cancelPendingShipmentLoading,
        cancelPendingShipmentSuccess,
        endLiveShipmentLoading,
        endLiveShipmentSuccess,
        takeShipmentLiveSuccess,
    } = useSelector((state) => state.shipment);
    const { teamMembersLoading, teamMembers } = useSelector((state) => state.auth);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedAssignedMemberName = teamMembers?.data?.find(
        (member) => member._id === memberAssigned
    )?.fullName;

    const uniqueTeamMembersIds = [...new Set(ffShipment?.admins?.slice(0, 2) ?? [])];
    const uniqueTeamMembers = teamMembers?.data?.filter(
        (member) => !uniqueTeamMembersIds.includes(member._id)
    );

    const first3AssignedMembers = uniqueTeamMembersIds.map((id) =>
        teamMembers?.data?.find((member) => member._id === id)
    );

    useEffect(() => {
        dispatch(authActions.fetchTeamMembers());
    }, []);

    useEffect(() => {
        dispatch(shipmentActions.fetchFFSingleShipment(params?.shipmentId));
        dispatch(shipmentActions.fetchFFMovements(params.shipmentId));
    }, [params?.shipmentId]);

    useEffect(() => {
        if (memberAssigned && params?.shipmentId) {
            dispatch(
                shipmentActions.assignShipmentToMember({
                    shipmentId: params.shipmentId,
                    memberId: memberAssigned,
                })
            );
        }
    }, [memberAssigned, params, dispatch]);

    useEffect(() => {
        if (FFmovements?.length) {
            setSelectedMovement(FFmovements[0]);
            setPopover(true);
        }
    }, [FFmovements]);

    const getMovementAddress = (routeType) => {
        const routeOptions = ["origin", "destination"];
        if (routeOptions.includes(routeType) && selectedMovement) {
            return (
                selectedMovement[routeType]?.address ??
                selectedMovement[routeType]?.details[0]?.formatted_address
            );
        }
    };

    const updateLocation = useCallback(
        (data) => {
            if (selectedMovement) {
                const defaultLocation = {
                    id: selectedMovement?._id,
                    lat: selectedMovement?.origin?.lat,
                    lng: selectedMovement?.origin?.lng,
                    mode: selectedMovement?.movementType,
                    textAddress: getMovementAddress("origin"),
                    timestamp: selectedMovement?.createdAt,
                };

                if (data) {
                    const modifiedLocations = Object.entries(data).map(([key, entry]) => ({
                        id: key,
                        ...entry,
                    }));

                    if (modifiedLocations.length) {
                        setLatestLocationData(modifiedLocations[modifiedLocations.length - 1]);
                    } else {
                        setLatestLocationData(defaultLocation);
                    }
                } else {
                    setLatestLocationData(defaultLocation);
                }
            }
        },
        [selectedMovement]
    );

    // Refactor to redux
    useEffect(() => {
        let unSubscribe;

        // This call resets to mvm origin
        updateLocation();

        if (selectedMovement?.movementType === "ocean") {
            firebaseService.fetchRealtimeMvmLocations(
                selectedMovement.oceanTrackingId,
                selectedMovement?._id,
                updateLocation,
                (unSubFunc) => {
                    unSubscribe = unSubFunc;
                }
            );
        }

        return () => {
            if (unSubscribe) {
                unSubscribe();
            }
        };
    }, [selectedMovement]);

    const latLngUpdate = useMemo(
        () =>
            latestLocationData
                ? [latestLocationData?.lat, latestLocationData?.lng]
                : [
                      selectedMovement?.origin?.lat ?? 9.05229,
                      selectedMovement?.origin?.lng ?? 7.52617,
                  ],
        [latestLocationData, selectedMovement]
    );

    // SHIPMENT DROPDOWNS
    useEffect(() => {
        if (Boolean(takeShipmentLiveSuccess)) {
            setIsTakeShipmentLiveModalOneOpen(false);
            setIsTakeShipmentLiveSucessModalOpen(Boolean(takeShipmentLiveSuccess));
        }
    }, [takeShipmentLiveSuccess]);

    useEffect(() => {
        if (Boolean(cancelPendingShipmentSuccess)) {
            setRejectShipment(false);
            setReason("");
            // setIsCancelShipmentSuccessModalOpen(true);
        }
    }, [cancelPendingShipmentLoading, cancelPendingShipmentSuccess]);

    useEffect(() => {
        if (Boolean(endLiveShipmentSuccess)) {
            setEndShipment(false);
            setIsEndLiveShipmenteSucessModalOpen(true);
        }
    }, [endLiveShipmentLoading, endLiveShipmentSuccess]);

    useEffect(() => {
        if (mapLoading) {
            const timer = setTimeout(() => {
                setMapLoading(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [mapLoading]);

    const hasLapHistory = selectedMovement?.trackingTimeLine?.length;
    const shouldShowHistory = hasLapHistory && showLapHistory;
    const etdDate = selectedMovement?.trackingTimeLine?.length
        ? selectedMovement?.trackingTimeLine[0]?.timeDeparture
        : "";
    const etaDate = selectedMovement?.trackingTimeLine?.length
        ? selectedMovement?.trackingTimeLine[selectedMovement?.trackingTimeLine?.length - 1]
              ?.timeArrival
        : "";
    const loadingTime = selectedMovement?.trackingTimeLine?.length
        ? selectedMovement?.trackingTimeLine[0]?.timeLoading
        : "";

    const arrivalPort = selectedMovement?.trackingTimeLine?.length
        ? selectedMovement?.trackingTimeLine[0]?.portCode +
          " " +
          selectedMovement?.trackingTimeLine[0]?.port
        : "";
    const movementsHistories = [selectedMovement?.trackingTimeLine]
        .flat()
        .reverse()
        .filter((history) => history);
    const isOverlay = overlay || overlay === 0;
    const shouldShowPopover = selectedMovement?.trackingTimeLine?.length && popover;

    return (
        <>
            <NavTwo />
            <div className="mt-20 flex max-800:flex-col 800:h-[calc(100vh-65px)] relative 800:overflow-hidden">
                {/*LEFT  */}
                <div className="800:basis-[40%] flex-shrink-0 800:bg-mvx-light-blue overflow-y-auto">
                    <div className="px-5 lg:px-12 py-8 border-b">
                        <p className="flex items-center font-rocGroteskMedium text-[15px] max-800:hidden">
                            {ffShipmentLoading ? (
                                <>
                                    <Skeleton className={"h-4 mt-[3px] mb-[3.5px] w-[93px] mr-5"} />
                                    <Skeleton className={"h-4 mt-[3px] mb-[3.5px] w-[105px]"} />
                                </>
                            ) : (
                                <>
                                    <Link to="/dashboard/shipments" className="underline">
                                        Shipment List
                                    </Link>{" "}
                                    <span className="material-icons text-sm font-bold mx-[9px]">
                                        arrow_forward_ios
                                    </span>{" "}
                                    <Link to={"#"} className="underline">
                                        TA {ffShipment?.mvxid}
                                    </Link>
                                </>
                            )}
                        </p>

                        <Skeleton
                            className={"h-[22px] w-[105px] 800:mt-[26px] mb-[9px]"}
                            dataLoaded={!ffShipmentLoading}
                        >
                            <h2 className="text-lg sm:text-[22px] font-rocGroteskMedium 800:mt-5 mb-1">
                                TA {ffShipment?.mvxid}
                            </h2>
                        </Skeleton>

                        <>
                            <div
                                className={`flex items-center ${
                                    ffShipmentLoading && "mt-3 mb-[18px]"
                                }`}
                            >
                                <Skeleton
                                    className={"basis-[7px] h-2 mr-2"}
                                    dataLoaded={!ffShipmentLoading}
                                >
                                    <span className="basis-[7px] h-2 bg-mvx-black mr-2" />
                                </Skeleton>
                                <Skeleton
                                    className={"flex-1 h-[5px]"}
                                    dataLoaded={!ffShipmentLoading}
                                >
                                    <span className="flex-1 h-1 bg-mvx-black" />
                                </Skeleton>
                                <Skeleton
                                    className={"h-[17px] basis-[18px] mx-2"}
                                    dataLoaded={!ffShipmentLoading}
                                >
                                    <span className="material-icons mx-2 text-lg">
                                        local_shipping
                                    </span>
                                </Skeleton>
                                <Skeleton
                                    className={"flex-1 h-[5px]"}
                                    dataLoaded={!ffShipmentLoading}
                                >
                                    <span className="flex-1 h-1 bg-[#DFE1E6]" />
                                </Skeleton>
                                <Skeleton
                                    className={"basis-[7px] h-2 ml-2"}
                                    dataLoaded={!ffShipmentLoading}
                                >
                                    <span className="basis-[7px] h-2 bg-[#DFE1E6] ml-2" />
                                </Skeleton>
                            </div>
                            <div className="flex items-start justify-between mt-2 pb-6">
                                {ffShipmentLoading ? (
                                    <>
                                        <div>
                                            <Skeleton className={"h-[18px] w-[200px]"} />
                                            <Skeleton className={"h-[17px] w-[120px] mt-[10px]"} />
                                        </div>
                                        <div>
                                            <Skeleton className={"h-[18px] w-[170px]"} />
                                            <Skeleton
                                                className={"h-[17px] w-[120px] mt-[10px] ml-auto"}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[15px] font-rocGroteskMedium mr-3 capitalize w-[50%] break-words">
                                            {ffShipment?.origin.address}
                                            <span className="text-mvx-gray block font-rocGroteskMedium mt-[1px] text-left">
                                                {ffShipment?.freightForwarder.profile.businessName}
                                            </span>
                                        </p>
                                        <p className="text-[15px] font-rocGroteskMedium text-right capitalize w-[50%] break-words">
                                            {ffShipment?.destination.address}
                                            <span className="text-mvx-gray block font-rocGroteskMedium mt-[1px]">
                                                {ffShipment?.shipperDetails.fullName}
                                            </span>
                                        </p>
                                    </>
                                )}
                            </div>
                        </>

                        <div className="flex justify-between mb-6">
                            {ffShipmentLoading ? (
                                <>
                                    <div>
                                        <Skeleton className={"h-[15px] w-[130px]"} />
                                        <Skeleton className={"h-[14px] w-[80px] mt-[10px]"} />
                                    </div>
                                    <div>
                                        <Skeleton className={"h-[15px] w-[130px]"} />
                                        <Skeleton
                                            className={"h-[14px] w-[80px] mt-[10px] ml-auto"}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-mvx-gray text-[13px] font-rocGroteskMedium">
                                        Mode
                                        <span className="block text-mvx-black text-sm capitalize">
                                            {ffShipment?.serviceMode}
                                        </span>
                                    </p>
                                    <p className="text-mvx-gray text-[13px] font-rocGroteskMedium max-sm:w-[60%] max-1400:px-4 max-1400:w-[50%]">
                                        Incoterms
                                        <span className="block text-mvx-black text-sm capitalize">
                                            {ffShipment?.incoterms}
                                        </span>
                                    </p>
                                    <p className="text-mvx-gray text-[13px] font-rocGroteskMedium text-right">
                                        Shipment created
                                        <span className="block text-mvx-black text-sm">
                                            {moment(ffShipment?.createdAt).format(
                                                "ddd MMM D, YYYY"
                                            )}
                                        </span>
                                    </p>
                                </>
                            )}
                        </div>

                        <>
                            <Skeleton
                                className={"h-[16.5px] w-[80px] mb-1"}
                                dataLoaded={!teamMembersLoading}
                            >
                                {uniqueTeamMembersIds.length ? (
                                    <p className="text-mvx-gray text-[13px] font-rocGroteskMedium ">
                                        {uniqueTeamMembersIds.length} Member
                                        {uniqueTeamMembersIds.length > 1 && "s"}
                                    </p>
                                ) : (
                                    <></>
                                )}
                            </Skeleton>

                            <div className="flex items-center text-[13px] font-rocGroteskMedium ">
                                {teamMembersLoading ? (
                                    <>
                                        <Skeleton
                                            className={
                                                "w-[30px] h-[30px] !rounded-full border-2 border-white"
                                            }
                                        />
                                        <Skeleton
                                            className={
                                                "w-[30px] h-[30px] !rounded-full border-2 border-white -ml-1"
                                            }
                                        />
                                        <Skeleton
                                            className={
                                                "w-[30px] h-[30px] !rounded-full border-2 border-white -ml-1"
                                            }
                                        />
                                    </>
                                ) : (
                                    <>
                                        {uniqueTeamMembersIds.length ? (
                                            <div className="flex items-center mr-3">
                                                {first3AssignedMembers?.map((member, idx) => (
                                                    <img
                                                        src={member?.profile?.logo}
                                                        alt="member 1"
                                                        className={`rounded-full border-2 border-white object-cover ${
                                                            idx && "-ml-2"
                                                        } ${!idx && "w-[30px] h-[30px]"} ${
                                                            idx === 1 && "w-[29px] h-[29px]"
                                                        }`}
                                                        key={member?._id + idx}
                                                    />
                                                ))}

                                                {ffShipment?.admins?.slice(2).length ? (
                                                    <div className=" rounded-full border-2 border-white text-xs text-white -ml-2 h-[30px] w-[30px] bg-mvx-neutral grid place-items-center self-center">
                                                        {"+" + ffShipment?.admins?.slice(2).length}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                )}

                                <div className="relative">
                                    <Skeleton
                                        className={"h-[15px] w-[166px] ml-[10px] mb-[3px]"}
                                        dataLoaded={!teamMembersLoading}
                                    >
                                        {uniqueTeamMembers?.length ? (
                                            <div
                                                className={`flex items-center cursor-pointer`}
                                                onClick={() => {
                                                    if (!selectedAssignedMemberName) {
                                                        setDropdownHeight(null);
                                                        setOpenAssignMember(true);
                                                    }
                                                }}
                                            >
                                                <span className="material-icons text-lg font-semibold mr-[5px]">
                                                    add
                                                </span>
                                                <span className="underline">
                                                    Assign to team member
                                                </span>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </Skeleton>

                                    {openAssignMember && (
                                        <>
                                            <div
                                                className="fixed top-0 left-0 z-[19] w-[40vw] h-screen"
                                                onClick={() => {
                                                    setOpenAssignMember(false);
                                                    setDropdownHeight(null);
                                                }}
                                            />
                                            <div className="absolute bg-white top-6 left-1 w-[300px] border z-20">
                                                <SelectInput
                                                    className={
                                                        "!bg-white rounded !h-[50px] !border-0"
                                                    }
                                                    dropdownClassName={
                                                        "rounded !bg-white !border-0"
                                                    }
                                                    value={
                                                        selectedAssignedMemberName
                                                            ? selectedAssignedMemberName
                                                            : ""
                                                    }
                                                    name={"member"}
                                                    handleChange={(_, value) =>
                                                        setMemberAssigned(value)
                                                    }
                                                    dropdownOptions={uniqueTeamMembers.map(
                                                        (member) => ({
                                                            label: member.fullName,
                                                            value: member._id,
                                                            icon: (
                                                                <img
                                                                    src={member?.profile?.logo}
                                                                    className="h-[30px] w-[30px] rounded-full border object-cover"
                                                                    alt={"Hey team member"}
                                                                />
                                                            ),
                                                        })
                                                    )}
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
                                                        marginTop: `${dropdownHeight?.offsetHeight}px`,
                                                    }}
                                                >
                                                    Important information goes here, like keyboard
                                                    shortcut{" "}
                                                    <span className="underline cursor-pointer">
                                                        Click here
                                                    </span>
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-stretch h-[38px] mt-5">
                                <Skeleton
                                    dataLoaded={!ffShipmentLoading}
                                    className="h-full w-[70%] 475:w-[181.047px] rounded"
                                >
                                    <Link
                                        to={"#"}
                                        onClick={() => setShowChat(true)}
                                        className="bg-pacific-cyan rounded text-[13px] !h-[36px] font-gilroyMedium text-white grid place-items-center px-8"
                                    >
                                        Chat with customer
                                    </Link>
                                </Skeleton>

                                {/* <Skeleton
                                    dataLoaded={!ffShipmentLoading}
                                    className="h-full w-[177.562px] rounded ml-1"
                                >
                                    <button className="!h-full rounded bg-white text-[13px] font-gilroyMedium text-mvx-black ml-1 border grid place-items-center">
                                        Generate Payment Link
                                    </button>
                                </Skeleton> */}

                                <Skeleton
                                    dataLoaded={!ffShipmentLoading}
                                    className="h-full w-[34px] rounded ml-1"
                                >
                                    {(ffShipment?.currentStatus === "pending" ||
                                        ffShipment?.currentStatus === "live") && (
                                        <Dropdown
                                            value={""}
                                            dropdown={
                                                <span className="h-[38px] material-icons ml-1 py-0 px-[6px] rounded border bg-white text-xl font-normal text-mvx-black/80 grid place-items-center !hidden">
                                                    more_vert
                                                </span>
                                            }
                                            dropdownContainerClasses={
                                                "left-[-20px] !bg-white !hidden"
                                            }
                                            dropdownClassName={"!w-max rounded ml-[18px] !hidden"}
                                            dropdownItemsClasses={"last:text-[#FF0000] !hidden"}
                                            name={ffShipment?.freightForwarderId}
                                            dropdownOptions={
                                                ffShipment?.currentStatus === "pending"
                                                    ? [
                                                          {
                                                              label: "Take Shipment Live",
                                                              value: "Take Shipment Live",
                                                              action: () =>
                                                                  setTakeShipmentLive(true),
                                                          },
                                                          {
                                                              label: "Edit Shipment",
                                                              value: "Edit Shipment",
                                                              action: () =>
                                                                  navigate(
                                                                      `/dashboard/shipment-creation/${ffShipment?.freightForwarderId}?shipmentId=${ffShipment?._id}`
                                                                  ),
                                                          },
                                                          {
                                                              label: "Reject Shipment",
                                                              value: "Reject Shipment",
                                                              action: () => setRejectShipment(true),
                                                          },
                                                      ]
                                                    : ffShipment?.currentStatus === "live"
                                                    ? [
                                                          {
                                                              label: "End Shipment",
                                                              value: "End Shipment",
                                                              action: () => setEndShipment(true),
                                                          },
                                                      ]
                                                    : []
                                            }
                                        />
                                    )}
                                </Skeleton>
                            </div>
                        </>
                    </div>

                    <MovementList
                        loading={FFmovementsLoading}
                        FFmovements={FFmovements}
                        latestLocationData={latestLocationData}
                        selectedMovement={selectedMovement}
                        setMovementForm={setMovementForm}
                        setPopover={setPopover}
                        setSelectedMovement={setSelectedMovement}
                    />
                </div>

                {/* RIGHT */}
                <div className="800:basis-[60%] h-full overflow-y-auto">
                    <Skeleton
                        className={"h-[47%] min-h-[300px] max-h-[600px]"}
                        dataLoaded={!FFmovementsLoading}
                    >
                        <div className="h-[47%] min-h-[300px] max-h-[600px] relative">
                            {mapLoading ? (
                                <p className="text-xl text-center ">Loading Map...</p>
                            ) : (
                                <Map location={latLngUpdate} setMapLoading={setMapLoading} />
                            )}

                            {shouldShowPopover ? (
                                <div className="bg-white max-lg:hidden absolute bottom-[50px] z-20 left-[70px] w-[280px] rounded shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),_0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                                    <div className="p-[14px] pb-2 relative">
                                        <span
                                            className="material-icons absolute right-1 top-1 cursor-pointer text-lg p-[2px] py-[1px]"
                                            onClick={() => setPopover(false)}
                                        >
                                            close
                                        </span>
                                        <p className="text-mvx-gray text-[13px] font-satoshiMedium">
                                            TA {selectedMovement?.mvxid}
                                        </p>
                                        <h4 className="text-sm font-satoshiBold my-1 capitalize">
                                            Current Location: {latestLocationData?.textAddress}
                                        </h4>
                                        <p className="flex items-center text-[13px] font-satoshiMedium text-mvx-gray capitalize">
                                            <span className="material-icons text-base mr-2">
                                                flight_takeoff
                                            </span>{" "}
                                            At arrival port {arrivalPort}
                                        </p>
                                        <p className="mt-3 mb-2 text-mvx-gray text-xs leading-[20px] font-satoshiMedium">
                                            Arrival Time:{" "}
                                            {etaDate
                                                ? moment(etaDate).format("MMM Do, YYYY: LT")
                                                : ""}{" "}
                                            <br />
                                            Loading Time:{" "}
                                            {loadingTime
                                                ? moment(loadingTime).format("MMM Do, YYYY: LT")
                                                : ""}{" "}
                                            <br />
                                            ETD:{" "}
                                            {etdDate
                                                ? moment(etdDate).format("MMM Do, YYYY: LT")
                                                : ""}
                                        </p>

                                        {hasLapHistory ? (
                                            <span
                                                className={`flex items-center cursor-pointer group [&_*]:font-medium w-max group mb-1`}
                                            >
                                                <span
                                                    className="group-hover:underline text-xs font-rocGroteskMedium"
                                                    onClick={() => setLapHistory((prev) => !prev)}
                                                >
                                                    {showLapHistory ? "Hide" : "View"} Route details
                                                </span>
                                                <span className="material-icons w-max h-max pointer-events-none text-lg translate-y-[1px] ml-1 group-hover:translate-x-1 ease-out transition-all duration-300">
                                                    navigate_next
                                                </span>
                                            </span>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </Skeleton>
                    <div className="800:h-[53%] px-5 lg:px-7 pt-4 pb-10">
                        <div className="flex items-center text-sm border-b">
                            {tab?.map((t) => (
                                <p
                                    key={t?.title}
                                    className={`375:px-4 pb-2 transition duration-[400ms] cursor-pointer ${
                                        t?.key === activeTab
                                            ? "font-rocGroteskMedium border-b-2 border-mvx-black"
                                            : "text-mvx-neutral font-rocGroteskMedium"
                                    }`}
                                    onClick={() => set("tab", t?.key)}
                                >
                                    {t?.title}
                                </p>
                            ))}
                        </div>

                        {activeTab === "details" && (
                            <Details loading={ffShipmentLoading} ffShipment={ffShipment} />
                        )}

                        {activeTab === "updates" && (
                            <ShipmentUpdates ffShipment={ffShipment} loading={ffShipmentLoading} />
                        )}

                        {activeTab === "documents" && (
                            <Documents ffShipment={ffShipment} loading={ffShipmentLoading} />
                        )}

                        {activeTab === "invoices" && <ShipmentInvoices />}
                    </div>
                </div>

                <AddMovementForm
                    closeForm={setMovementForm}
                    shipmentId={params?.shipmentId}
                    isActive={movementForm}
                />

                <ChatPopup
                    openChatPopup={showChat}
                    shipmentData={ffShipment}
                    closePopUp={() => {
                        setShowChat(false);
                    }}
                />
                {/* Lap History */}
                <div
                    className={`absolute right-0 top-0 pt-3 overflow-hidden bg-white z-0 transition-transform ease-in-out duration-300 ${
                        shouldShowHistory
                            ? "!z-[19] w-[420px] h-[calc(100vh-65px)] translate-y-0"
                            : "translate-y-[210%] h-0 w-0"
                    }
                    shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]`}
                >
                    <span
                        className={`material-icons w-max absolute text-xl pl-1 right-4 cursor-pointer !ml-auto mb-2 ${
                            shouldShowHistory ? "block" : "hidden"
                        }`}
                        onClick={() => (isOverlay ? setOverlay(false) : setLapHistory(false))}
                    >
                        close
                    </span>

                    <p className="pt-3 pb-5 border-b px-5 font-rocGroteskMedium text-[15px]">
                        TA {selectedMovement?.mvxid} to {selectedMovement?.destination?.address}
                        <span className="block text-base text-mvx-neutral">
                            Current Location: {latestLocationData?.textAddress}
                        </span>
                    </p>

                    <div className={`h-[81%] overflow-y-auto px-5 mt-6`}>
                        {isOverlay ? (
                            <LapHistory
                                trackingData={movementsHistories[overlay]}
                                isLast={movementsHistories.length - 1 === overlay}
                                isFirst={overlay === 0}
                                overlay={isOverlay}
                            />
                        ) : (
                            movementsHistories?.map((timeline, idx) => (
                                <LapHistory
                                    key={timeline.timeLoading + idx}
                                    trackingData={timeline}
                                    isLast={movementsHistories.length - 1 === idx}
                                    isFirst={!idx}
                                    overlay={isOverlay}
                                    setOverlay={() => setOverlay(idx)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* SHIPMENT DROPDOWNS */}

            {takeShipmentLive && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        setTakeShipmentLive(false);
                    }}
                >
                    <div className="bg-white">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-gilroyBold text-gun-metal">
                                Take shipment live?
                            </p>
                            <p className="text-sm text-center font-gilroyMedium text-gun-metal px-6">
                                Are you sure you want to take this shipment live?
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase w-full text-mvx-neutral text-sm font-gilroySemibold flex items-center justify-center bg-white py-6 border px-3`}
                                onClick={() => {
                                    setTakeShipmentLive(false);
                                }}
                            >
                                NO, I DONT
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    dispatch(shipmentActions.takeShipmentLive(ffShipment._id));
                                }}
                                className={`uppercase w-full text-gun-metal text-sm font-gilroySemibold flex items-center justify-center bg-[#FAFBFC] py-6 border-y px-3`}
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
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        dispatch(shipmentActions.resetShipmentSuccessData());
                        setIsTakeShipmentLiveSucessModalOpen(false);
                        dispatch(shipmentActions.setFFProfile(takeShipmentLiveSuccess?.data));
                    }}
                >
                    <div className="bg-white">
                        <div
                            className={`px-6 pt-8 ${
                                takeShipmentLiveSuccess?.data &&
                                !takeShipmentLiveSuccess?.data?.hasQuote
                                    ? ""
                                    : "pb-4"
                            }`}
                        >
                            <img src={successImg} alt="success" className="mb-6 m-auto" />
                            <p className="text-[22px] text-center mb-3 font-gilroyBold text-gun-metal">
                                Shipment is Live!
                            </p>
                            <p className="text-sm text-center font-gilroyMedium text-gun-metal px-6">
                                Your Shipment no. TA{ffShipment.mvxid} has been taken live
                                successfully. You can track and give status updates using the Fleet+
                                application.{" "}
                                {
                                    takeShipmentLiveSuccess?.data &&
                                        !takeShipmentLiveSuccess?.data?.hasQuote &&
                                        // <span className="text-sm text-center font-gilroyMedium text-gun-metal px-6">
                                        "This shipment does not have a quote yet, would you like to create a quote"
                                    //  </span>
                                }
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
                                        className={`uppercase w-full text-mvx-neutral text-sm font-gilroySemibold flex items-center justify-center bg-white py-6 border px-3`}
                                    >
                                        NO
                                    </button>
                                    <button
                                        type="button"
                                        className={`uppercase w-full text-gun-metal text-sm font-gilroySemibold flex items-center justify-center bg-[#FAFBFC] py-6 border-y px-3`}
                                    >
                                        Yes, CREATE A QUOTE
                                    </button>
                                </div>
                            )}
                    </div>
                </ModalContainer>
            )}

            {rejectShipment && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => setRejectShipment(false)}
                >
                    <div className="bg-white">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-gilroyBold text-gun-metal">
                                Reject Shipment Request
                            </p>
                            <p className="text-sm text-center font-gilroyMedium text-gun-metal px-6">
                                Are you sure you want to reject this shipment request? this cannot
                                be undone.
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase w-full text-mvx-neutral text-sm font-gilroySemibold flex items-center justify-center bg-white py-6 border px-3`}
                                onClick={() => setRejectShipment(false)}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    dispatch(
                                        shipmentActions.cancelLiveShipment(ffShipment._id, reason)
                                    )
                                }
                                className={`uppercase w-full text-gun-metal text-sm font-gilroySemibold flex items-center justify-center bg-[#FAFBFC] py-6 border-y px-3`}
                            >
                                {cancelPendingShipmentLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">YES, reject</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {endShipment && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => setEndShipment(false)}
                >
                    <div className="bg-white">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-gilroyBold text-gun-metal">
                                End Shipment?
                            </p>
                            <p className="text-sm text-center font-gilroyMedium text-gun-metal px-6">
                                Are you sure you want to end this shipment?
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase w-full text-mvx-neutral text-sm font-gilroySemibold flex items-center justify-center bg-white py-6 border px-3`}
                                onClick={() => setEndShipment(false)}
                            >
                                NO, Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    dispatch(shipmentActions.endLiveShipment(ffShipment._id))
                                }
                                className={`uppercase w-full text-gun-metal text-sm font-gilroySemibold flex items-center justify-center bg-[#FAFBFC] py-6 border-y px-3`}
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
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        dispatch(shipmentActions.resetShipmentSuccessData());
                        setIsEndLiveShipmenteSucessModalOpen(false);
                        dispatch(shipmentActions.fetchFFSingleShipment(params?.shipmentId));
                    }}
                >
                    <div className="bg-white">
                        <div className="px-6 py-8">
                            <img src={successImg} alt="success" className="mb-6 m-auto" />
                            <p className="text-[22px] text-center mb-3 font-gilroyBold text-gun-metal">
                                Shipment has ended!
                            </p>
                            <p className="text-sm text-center font-gilroyMedium text-gun-metal px-6">
                                Your Shipment no. TA{ffShipment.mvxid} has ended
                            </p>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </>
    );
};

export default ShipmentDetails;
