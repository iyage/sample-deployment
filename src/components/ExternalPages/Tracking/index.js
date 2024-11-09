/* eslint-disable react-hooks/exhaustive-deps */
import { shipmentActions } from "actions";
import Navbar from "components/common/Navbar";
import Skeleton from "components/common/Skeleton";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DetailsSection from "./DetailsSection";

const Tracking = () => {
    const params = useParams();
    const dispatch = useDispatch();

    const { ffCustomerShipmentLoading, ffCustomerShipment } = useSelector(
        (state) => state.shipment
    );

    useEffect(() => {
        if (params?.shipmentId) {
            dispatch(shipmentActions.fetchFFSingleShipmentForCustomer(params.shipmentId));
        }
    }, [params]);

    return (
        <>
            <Navbar />

            <div className="h-[calc(100vh-65px)] flex">
                <div className="flex-1 lg:border-r">
                    <div className="px-5 sm:px-8 lg:pl-20 pt-7 pb-9 lg:pr-5 border-b mb-4">
                        <div className="flex justify-between items-center">
                            <Skeleton
                                dataLoaded={!ffCustomerShipmentLoading}
                                className={"h-6 w-32 !bg-[#F4F5F7] !rounded-none"}
                            >
                                <p className="text-xl font-rocGroteskBold capitalize">
                                    {
                                        ffCustomerShipment?.shippingStatus[
                                            ffCustomerShipment?.shippingStatus.length - 1
                                        ]?.status
                                    }
                                    <span className="block text-sm font-rocGroteskMedium mt-[6px]">
                                        Tracking Number:TA{ffCustomerShipment?.mvxid}
                                    </span>
                                </p>
                            </Skeleton>

                            <Buttons
                                loading={ffCustomerShipmentLoading}
                                shipment={ffCustomerShipment}
                                className={"hidden sm:flex"}
                            />
                        </div>

                        {ffCustomerShipmentLoading && (
                            <Skeleton
                                className={"h-[14px] w-[200px] mt-2 !bg-[#F4F5F7] !rounded-none"}
                            />
                        )}

                        {ffCustomerShipmentLoading ? (
                            <Skeleton
                                className={"h-2 w-full !bg-[#F4F5F7] !rounded-none mt-5 mb-3"}
                            />
                        ) : (
                            <div className="flex justify-between items-center mt-6 mb-2">
                                <span className="basis-[7px] h-[8px] bg-mvx-black"></span>
                                <span className="flex-1 mx-2 h-1 bg-mvx-black"></span>
                                <span className="basis-[7px] h-[8px] bg-[#d2d2d2]"></span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            {ffCustomerShipmentLoading ? (
                                <RouteLoader />
                            ) : (
                                <>
                                    {" "}
                                    <p className="text-[#6B778C] text-xs font-rocGroteskMedium max-375:mr-10">
                                        Origin
                                        <span className="block text-mvx-black capitalize">
                                            {ffCustomerShipment?.origin.address}
                                        </span>
                                    </p>
                                    <p className="text-[#6B778C] text-xs font-rocGroteskMedium text-right">
                                        Destination{" "}
                                        <span className="block text-mvx-black capitalize">
                                            {ffCustomerShipment?.destination.address}
                                        </span>
                                    </p>
                                </>
                            )}
                        </div>
                        <Buttons
                            loading={ffCustomerShipmentLoading}
                            shipment={ffCustomerShipment}
                            className={"flex mt-6 sm:hidden"}
                        />
                    </div>

                    <DetailsSection
                        loading={ffCustomerShipmentLoading}
                        movements={ffCustomerShipment?.movements}
                        className={"block pt-4 pb-0 px-5 sm:px-6 lg:hidden"}
                    />

                    <div className="pl-5 sm:pl-6 lg:pl-20 pt-3 sm:pt-6 pb-14 lg:pb-6 pr-5 lg:h-[calc(100vh-293px)] overflow-y-auto">
                        {ffCustomerShipmentLoading ? (
                            <StatusLoader />
                        ) : (
                            <>
                                {ffCustomerShipment?.shippingStatus.map((status, idx) => (
                                    <div className={`flex ${idx && "mt-3"}`} key={status._id}>
                                        <div className="mr-4 flex flex-col justify-center items-center">
                                            <span
                                                className={`material-icons text-base text-white px-1 rounded-sm ${
                                                    idx ? "bg-mvx-black" : "bg-mvx-black/30"
                                                }`}
                                            >
                                                directions_boat
                                            </span>
                                            <div
                                                className={`w-[2.5px] mt-2 h-14 ${
                                                    idx ? "bg-mvx-black" : "bg-mvx-black/30"
                                                }`}
                                            ></div>
                                        </div>
                                        <p
                                            className={`font-rocGroteskMedium ${
                                                idx ? "text-mvx-black" : "text-mvx-black/50"
                                            } text-sm capitalize`}
                                        >
                                            {status.status}

                                            {status.reason && (
                                                <span
                                                    className={`block font-rocGroteskMedium ${
                                                        idx ? "text-[#6B778C]" : "text-[#6B778C]/70"
                                                    } !text-light text-xs mt-[2px]`}
                                                >
                                                    Carrier note: {status.reason}
                                                </span>
                                            )}
                                            <span
                                                className={`block font-rocGroteskMedium ${
                                                    idx ? "text-[#6B778C]" : "text-[#6B778C]/70"
                                                } !text-light text-xs mt-[2px]`}
                                            >
                                                {moment(status.createdAt).format("MMMM D, LT")}
                                            </span>
                                        </p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                <DetailsSection
                    loading={ffCustomerShipmentLoading}
                    movements={ffCustomerShipment?.movements}
                    className={"hidden lg:block"}
                />
            </div>
        </>
    );
};

const RouteLoader = () => {
    return (
        <>
            <div>
                <Skeleton className={"h-[10px] w-[80px] !bg-[#F4F5F7] !rounded-none"} />
                <Skeleton className={"h-3 w-[160px] mt-[10px] !bg-[#F4F5F7] !rounded-none"} />
            </div>
            <div>
                <Skeleton className={"h-[10px] w-[80px] !bg-[#F4F5F7] !rounded-none ml-auto"} />
                <Skeleton className={"h-3 w-[160px] mt-[10px] !bg-[#F4F5F7] !rounded-none"} />
            </div>
        </>
    );
};

const StatusLoader = () => {
    return (
        <>
            {[3, 34, 42].map((load, idx) => (
                <div className={`flex mt-3 ${idx ? "mt-3" : "-mt-[2px]"}`} key={load}>
                    <div className="mr-4 flex flex-col justify-center items-center">
                        <Skeleton className={"!bg-[#F4F5F7] w-[24px] h-[24px]"} />
                        <Skeleton className={"!bg-[#F4F5F7] !rounded-none w-[3px] mt-2 h-14"} />
                    </div>

                    <div>
                        <Skeleton
                            className={"!bg-[#F4F5F7] w-[220px] h-[12px] mt-1 !rounded-none"}
                        />
                        <Skeleton
                            className={"!bg-[#F4F5F7] w-[190px] h-[8px] mt-2 !rounded-none"}
                        />
                        <Skeleton
                            className={"!bg-[#F4F5F7] w-[170px] h-[8px] mt-2 !rounded-none"}
                        />
                    </div>
                </div>
            ))}
        </>
    );
};

const Buttons = ({ loading, shipment, className }) => {
    const navigate = useNavigate();
    const [copy, setCopy] = useState(false);

    return (
        <div className={`flex items-center ${className}`}>
            <Skeleton
                dataLoaded={!loading}
                className={"!bg-[#F4F5F7] !rounded-none w-[84px] h-[32px] mr-[10px] translate-y-3"}
            >
                <button
                    className="bg-[#F4F5F7] text-mvx-black font-rocGroteskMedium mr-[10px] text-[12.4px]"
                    onClick={() => navigate(0)}
                >
                    Refresh
                </button>
            </Skeleton>
            <Skeleton
                dataLoaded={!loading}
                className={"!bg-[#F4F5F7] !rounded-none w-[200px] h-[32px] translate-y-3"}
            >
                <button
                    className="bg-[#F4F5F7] text-mvx-black font-rocGroteskMedium text-[12.4px] w-[200px]"
                    onClick={() => {
                        navigator.clipboard.writeText("TA" + shipment?.mvxid);
                        setCopy(true);
                    }}
                    onMouseEnter={() => setCopy(false)}
                >
                    {copy ? "Tracking Number Copied!" : "Copy Tracking Number"}
                </button>
            </Skeleton>
        </div>
    );
};

export default Tracking;
