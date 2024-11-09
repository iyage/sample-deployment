/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { quoteActions, shipmentActions } from "actions";
import Loader from "components/common/Loader";
import NavOne from "components/common/NavOne";
import { getFromStorage, regionNames } from "helpers";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PackageContainerList from "./PackageContainerList";

const ShipmentRequest = () => {
    const [showTriptDetails, setShowTripDetails] = useState(true);
    const [globalFFUser, setGlobalFFUser] = useState(getFromStorage("tradeAlly-user"));
    const dispatch = useDispatch();
    const { ffShipmentLoading, ffShipment } = useSelector((state) => state.shipment);
    const { user } = useSelector((state) => state.auth);
    const { singleQuoteReq, singleQuoteReqLoading } = useSelector((state) => state.quote);
    const navigate = useNavigate();
    const resolvedUser = globalFFUser ?? user;

    useEffect(() => {
        if (!globalFFUser && !user) {
            return navigate("/");
        }
        if (resolvedUser && !ffShipment) {
            dispatch(shipmentActions.fetchFFSingleShipment(resolvedUser.shipmentId));
        }

        if (resolvedUser && !singleQuoteReq) {
            dispatch(quoteActions.fetchSingleQuoteRequest(resolvedUser.quoteRequestId));
        }
    }, [user, globalFFUser, ffShipment, singleQuoteReq]);

    if (ffShipmentLoading || singleQuoteReqLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <>
            {ffShipment && singleQuoteReq && (
                <>
                    <NavOne />

                    <div className="grid place-items-center h-[calc(100vh-65px)] max-580:mx-5">
                        <div className="w-full 580:w-[500px]">
                            <p className="text-mvx-black font-rocGroteskBold text-xl">
                                Shipment Request
                                <span className="font-rocGroteskMedium block mt-1 text-sm text-mvx-neutral">
                                    You have a new quote request from a customer
                                </span>
                            </p>

                            <div className="flex bg-mvx-light-blue mt-5 mb-3 text-[13px] h-12 items-center">
                                <button
                                    className={`basis-[49%] bg-mvx-light-blue text-gun-metal ml-1 h-[80%] text-xs 330:text-sm rounded-[2px] font-rocGroteskMedium transition-all duration-[400ms] ${
                                        showTriptDetails &&
                                        "!bg-white shadow-[0px_2.7486px_7.32961px_rgba(0,0,0,0.12),0px_2.7486px_0.916201px_rgba(0,0,0,0.04)]"
                                    }`}
                                    onClick={() => setShowTripDetails(true)}
                                >
                                    Trip Details
                                </button>
                                <button
                                    className={`basis-[49%] bg-mvx-light-blue text-gun-metal mr-1 h-[80%] rounded-[2px] text-xs 330:text-sm  font-rocGroteskMedium transition-all duration-[400ms] ${
                                        !showTriptDetails &&
                                        "!bg-white shadow-[0px_2.7486px_7.32961px_rgba(0,0,0,0.12),0px_2.7486px_0.916201px_rgba(0,0,0,0.04)]"
                                    }`}
                                    onClick={() => setShowTripDetails(false)}
                                >
                                    Shipment Details
                                </button>
                            </div>

                            <>
                                {showTriptDetails ? (
                                    <>
                                        {/* Trip Details */}
                                        {[
                                            [
                                                "Country of Supply",
                                                regionNames.of(ffShipment.origin.country),
                                            ],
                                            [
                                                "Pickup Address",
                                                singleQuoteReq.pickupAddress.address,
                                            ],
                                            [
                                                "Port of Loading",
                                                singleQuoteReq.portOfLoading.address,
                                            ],
                                            [
                                                "Port of Destination",
                                                singleQuoteReq.portOfDestination.address,
                                            ],
                                            ["Load Type", singleQuoteReq.loadType],
                                            ["Incoterms Type", ffShipment.incoterms],
                                        ].map(([title, value], idx) => (
                                            <div
                                                key={idx}
                                                className={`flex justify-between items-center py-4 ${
                                                    idx && "border-t"
                                                }`}
                                            >
                                                <span className="font-rocGroteskMedium text-[13px] 330:text-[14.6px] self-start">
                                                    {title}
                                                </span>
                                                <span className="text-[13px] 330:text-[14.6px] font-rocGroteskMedium text-mvx-gray text-right basis-[50%]">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="border mt-7 p-5 pt-2">
                                        <PackageContainerList
                                            list={
                                                ffShipment.packageType === "containers"
                                                    ? ffShipment.containers
                                                    : ffShipment.packages
                                            }
                                            goodsDetails={ffShipment.goodsDetails}
                                            isContainers={ffShipment.packageType === "containers"}
                                        />
                                    </div>
                                )}
                            </>

                            <Link
                                to={"/create-quote"}
                                className={`bg-pacific-cyan block text-center text-mvx-black w-full py-4 ${
                                    showTriptDetails ? "mt-4" : "mt-6 mb-12"
                                } text-sm font-rocGroteskMedium`}
                            >
                                Create Quote
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ShipmentRequest;
