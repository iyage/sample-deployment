/* eslint-disable react-hooks/exhaustive-deps */
// import { RouteIcon } from "assets/arts";
import ModalContainer from "components/common/ModalContainer";
import Navbar from "components/common/Navbar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { shipmentActions } from "actions";
import { firebaseService } from "services/firebaseService";
import moment from "moment";
import Map from "components/common/Map";
import LapHistory from "components/common/LapHistory";

const MovementDetails = () => {
    const [showLapHistory, setLapHistory] = useState(false);
    const [shareLocation, setShareLocation] = useState(false);
    const [copy, setCopy] = useState(false);
    const [mvmDropDownOpen, setMvmDropDownOpen] = useState(false);
    const [latestLocationData, setLatestLocationData] = useState(null);
    const [overlay, setOverlay] = useState(false);
    const [popover, setPopover] = useState(false);
    const [mapLoading, setMapLoading] = useState(true);

    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { CSmovements: movements, ffCustomerShipment } = useSelector((state) => state.shipment);
    const shareBaseUrl =
        process.env.REACT_APP_STAGE !== "production"
            ? `${process.env.REACT_APP_STAGE}.tradeally.io`
            : "tradeally.io";

    useEffect(() => {
        if ((params?.shipmentId || params?.movementId) && !movements) {
            dispatch(shipmentActions.fetchCustomerMovements(params.shipmentId));
        }

        if (!ffCustomerShipment && params?.shipmentId) {
            dispatch(shipmentActions.fetchFFSingleShipmentForCustomer(params.shipmentId));
        }
    }, [params, movements, ffCustomerShipment]);

    useEffect(() => {
        setPopover(true);
    }, [params?.movementId]);

    const selectedMovement = useMemo(
        () => movements?.find(({ _id }) => _id === params?.movementId),
        [params?.movementId, movements]
    );

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

    useEffect(() => {
        if (mapLoading) {
            const timer = setTimeout(() => {
                setMapLoading(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [mapLoading]);

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

    const hasLapHistory = selectedMovement?.trackingTimeLine.length;
    const shouldShowHistory = hasLapHistory && showLapHistory;
    const shouldTextShow = !showLapHistory && hasLapHistory;
    const etdDate = selectedMovement?.trackingTimeLine[0]?.timeDeparture;
    const etaDate =
        selectedMovement?.trackingTimeLine[selectedMovement?.trackingTimeLine?.length - 1]
            ?.timeArrival;
    const movementsHistories = [selectedMovement?.trackingTimeLine]
        .flat()
        .reverse()
        .filter((history) => history);
    const isOverlay = overlay || overlay === 0;
    const shouldShowPopover = hasLapHistory && popover;

    return (
        <>
            <Navbar />
            <div className="h-[calc(100vh-65px)] overflow-hidden flex flex-col-reverse md:flex-row">
                <div className="basis-[47%] md:basis-[400px] flex flex-col">
                    <p
                        className={`py-4 md:py-3 px-5 font-satoshiBold text-base transition-colors flex-1 ${
                            shouldShowHistory
                                ? "bg-mvx-gray/20 md:bg-mvx-gray/40"
                                : "shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.03)]"
                        }`}
                    >
                        MO{selectedMovement?.mvxid} to {getMovementAddress("destination")}
                        <span className="block font-satoshiMedium text-[13px] capitalize">
                            Current Location: {latestLocationData?.textAddress}
                        </span>
                    </p>

                    <div
                        className={`flex flex-col flex-auto justify-between h-full md:h-[calc(100vh-131px)] transition-colors ${
                            shouldShowHistory && "bg-mvx-gray/20 md:bg-mvx-gray/40"
                        }`}
                    >
                        <div
                            className={`px-5 pt-5 md:pt-8 h-full ${shouldShowHistory && "hidden"}`}
                        >
                            <div className="border-b">
                                <div className="flex items-center">
                                    <span className="basis-[7px] h-2 bg-mvx-black mr-2"></span>
                                    <span className="flex-1 h-1 bg-mvx-black"></span>
                                    <span className="material-icons mx-2 text-lg">
                                        local_shipping
                                    </span>
                                    <span className="flex-1 h-1 bg-[#DFE1E6]"></span>
                                    <span className="basis-[7px] h-2 bg-[#DFE1E6] ml-2"></span>
                                </div>
                                <div className="flex items-center justify-between mt-2 pb-6">
                                    <p className="text-sm font-satoshiBold mr-3">
                                        {getMovementAddress("origin")}
                                        <span className="text-[#6B778C] block font-satoshiMedium mt-[1px] text-left">
                                            {ffCustomerShipment?.freightForwarder?.profile
                                                ?.businessName ||
                                                ffCustomerShipment?.freightForwarder?.fullName}
                                        </span>
                                    </p>
                                    <p className="text-sm font-satoshiBold text-right">
                                        {getMovementAddress("destination")}
                                        <span className="text-[#6B778C] block font-satoshiMedium mt-[1px]">
                                            {ffCustomerShipment?.shipperDetails?.fullName ||
                                                "Customer"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 pb-6 md:pb-9 border-b">
                                <div className="flex justify-between items-center">
                                    <p className="text-[13px] font-medium text-[#6B778C] ">
                                        Mode
                                        <span className="block font-semibold mt-[2px] text-sm capitalize">
                                            {selectedMovement?.movementType}
                                        </span>
                                    </p>
                                    <p className="text-[13px] font-medium text-[#6B778C] ">
                                        ETD
                                        <span className="block font-semibold mt-[2px] text-sm">
                                            {etdDate
                                                ? moment(etdDate).format("MMM DD, YYYY")
                                                : "Unavailable"}
                                        </span>
                                    </p>
                                    <p className="text-[13px] font-medium text-[#6B778C] ">
                                        ETA
                                        <span className="block font-semibold mt-[2px] text-sm">
                                            {etaDate
                                                ? moment(etaDate).format("MMM DD, YYYY")
                                                : "Unavailable"}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex justify-evenly items-center"></div>
                            </div>
                        </div>

                        {/* LAP HISTORY */}
                        <div
                            className={`px-5 pt-3 border-t rounded-t-2xl overflow-hidden h-full bg-white relative z-10 transition-transform duration-300 ${
                                shouldShowHistory
                                    ? "translate-y-0"
                                    : "translate-y-[200%] max-md:hidden"
                            }`}
                        >
                            <span
                                className="material-icons w-max block text-xl pl-1 translate-x-[6px] cursor-pointer !ml-auto mb-2"
                                onClick={() =>
                                    isOverlay ? setOverlay(false) : setLapHistory(false)
                                }
                            >
                                close
                            </span>

                            <div className="h-[508px] md:h-full overflow-y-auto">
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

                        <div className="shadow-[0px_5px_35px_rgba(0,0,0,0.03),_0px_-3px_5px_rgba(0,0,0,0.047)] pt-2 pb-6 px-5 relative z-50 bg-white">
                            {shouldTextShow ? (
                                <p
                                    className={`flex items-center cursor-pointer text-sm font-medium py-2 mb-1 group transition-all duration-300 ${
                                        !hasLapHistory && "hidden"
                                    }`}
                                    onClick={() => setLapHistory(true)}
                                >
                                    {/* <RouteIcon className="mr-3" /> */}
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687259946/Web%20App/external_pages/icons/route_cucauo.svg"
                                        }
                                        alt="Route Icon"
                                        className="mr-3"
                                    />
                                    View lap history
                                    <span className="material-icons ml-auto translate-x-2 group-hover:translate-x-3 transition-transform">
                                        navigate_next
                                    </span>
                                </p>
                            ) : null}
                            <button
                                className={`w-full text-sm py-3 ${
                                    (showLapHistory || !hasLapHistory) && "mt-4"
                                } `}
                                onClick={() => setShareLocation(true)}
                            >
                                Share current location
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-md:basis-[53%] md:flex-1 relative">
                    <span
                        className="material-icons absolute top-[18px] z-20 left-6 bg-white rounded-full px-2 py-1 text-xl shadow-[0px_5px_35px_rgba(0,0,0,0.03),_0px_-5px_5px_rgba(0,0,0,0.05)] font-medium cursor-pointer hover:bg-white/90 transition-all duration-300"
                        onClick={() => navigate(-1)}
                    >
                        arrow_back
                    </span>

                    <div className="absolute z-20 top-[18px] left-[40%] bg-white rounded-3xl overflow-hidden overflow-y-auto max-h-[200px] shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                        <div
                            className={`flex !w-[140px] px-4 py-2 items-center cursor-pointer hover:bg-mvx-black/5 transition-all duration-300`}
                            onClick={() => {
                                setMvmDropDownOpen((prev) => !prev);
                            }}
                        >
                            <span className="material-icons text-base">bolt</span>
                            <span className="font-satoshiBold text-xs -translate-y-[1px] mx-[6px]">
                                MOT{selectedMovement?.mvxid}
                            </span>
                            <span className="material-icons text-base">
                                {mvmDropDownOpen ? "expand_less" : "expand_more"}
                            </span>
                        </div>

                        {mvmDropDownOpen && (
                            <>
                                {[movements]
                                    .flat()
                                    .reverse()
                                    .map((mvm) => (
                                        <div
                                            key={mvm._id}
                                            className="flex !w-[140px] px-4 py-2 items-center cursor-pointer hover:bg-mvx-black/5 transition-all duration-300"
                                            onClick={() => {
                                                navigate(
                                                    `/tracking/${params?.shipmentId}/${mvm._id}`
                                                );
                                                setMvmDropDownOpen(false);
                                            }}
                                        >
                                            <span className="material-icons text-[15px]">bolt</span>
                                            <span className="font-satoshiMedium text-[11px] -translate-y-[1px] mx-[6px]">
                                                MOT{mvm.mvxid}
                                            </span>
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>

                    {mapLoading ? (
                        <p className="text-xl text-center ">Loading Map...</p>
                    ) : (
                        <Map location={latLngUpdate} setMapLoading={setMapLoading} />
                    )}

                    {shouldShowPopover && (
                        <div className="bg-white max-lg:hidden absolute !hidden bottom-[8vh] z-20 left-[34%] w-[290px] rounded shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),_0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                            <div className="p-5 pb-2 relative">
                                <span
                                    className="material-icons absolute right-2 top-2 cursor-pointer text-lg p-1 py-[1px]"
                                    onClick={() => setPopover(false)}
                                >
                                    close
                                </span>
                                <p className="text-mvx-gray text-[13px] font-satoshiMedium">
                                    M0{selectedMovement?.mvxid}
                                </p>
                                <h4 className="text-sm font-satoshiBold my-1 capitalize">
                                    MO{selectedMovement?.mvxid} to{" "}
                                    {getMovementAddress("destination")}
                                </h4>
                                <p className="flex items-center text-[13px] font-satoshiMedium text-mvx-gray capitalize">
                                    <span className="material-icons text-base mr-2">
                                        flight_takeoff
                                    </span>{" "}
                                    At arrival port Ghanzou Port, China
                                </p>
                                <p className="mt-3 mb-2 text-mvx-gray text-xs leading-[20px] font-satoshiMedium">
                                    Arrival Time: Apr 22, 2021 17:30pm <br />
                                    Loading Time: April 22, 2021: 17:30pm <br />
                                    ETD: April 23, 2021: 04:30am
                                </p>

                                {hasLapHistory ? (
                                    <span
                                        className={`flex items-center cursor-pointer group [&_*]:font-medium w-max group mb-1`}
                                    >
                                        <span
                                            className="group-hover:underline text-xs text-mvx-black"
                                            onClick={() => setLapHistory((prev) => !prev)}
                                        >
                                            {showLapHistory ? "Hide" : "View"} Lap history
                                        </span>
                                        <span className="material-icons w-max h-max pointer-events-none text-lg translate-y-[1px] ml-1 group-hover:translate-x-1 ease-out transition-all duration-300">
                                            navigate_next
                                        </span>
                                    </span>
                                ) : (
                                    <></>
                                )}
                            </div>

                            <Link
                                to={`/tracking/${params?.shipmentId}`}
                                className="block border-t py-3 text-center text-xs hover:underline text-[#6B778C] font-satoshiMedium"
                            >
                                Go to Shipment page
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            {shareLocation && (
                <ModalContainer
                    closeModal={() => {
                        setShareLocation(false);
                        setCopy(false);
                    }}
                    showCloseIcon
                >
                    <div className="pt-12 pb-24 580:py-10 px-5 bg-white rounded-lg shadow-modalShadow -translate-y-[10vh] max-580:mt-[104vh]">
                        <h3 className="text-lg font-semibold text-center mb-4">
                            Share link with customer
                        </h3>
                        <div className="flex [&_*]:text-[13px] w-screen 580:w-[300px] max-580:px-7">
                            <input
                                className="border flex-1 px-2 font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                type={"text"}
                                value={`${shareBaseUrl}/tracking/${params?.shipmentId}/${params?.movementId}`}
                            />
                            <span
                                className="py-2 border font-medium cursor-pointer w-[90px] text-center hover:bg-white/60"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        `${shareBaseUrl}/tracking/${params?.shipmentId}/${params?.movementId}`
                                    );
                                    setCopy(true);
                                }}
                                onMouseEnter={() => setCopy(false)}
                            >
                                {copy ? "Copied!" : "Copy"}
                            </span>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </>
    );
};

export default MovementDetails;
