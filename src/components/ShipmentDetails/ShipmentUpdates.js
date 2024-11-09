// import { MessageCanceledIcon } from "assets/arts";
import moment from "moment";

const ShipmentUpdates = ({ ffShipment, loading }) => {
    // Create loaders for this section

    return (
        <>
            {ffShipment?.shippingStatus?.length ? (
                <div className="flex pt-5 max-800:pb-14 800:overflow-y-auto 800:h-[290px] items-start">
                    <div className="flex flex-col justify-center items-center mr-6">
                        <span
                            className={`material-icons text-xl text-white bg-gun-metal px-1 rounded-sm `}
                        >
                            event_available
                        </span>
                        <div className={`w-[2px] h-14 bg-gun-metal`}></div>
                    </div>
                    <div className="flex-1">
                        {ffShipment?.shippingStatus.map((stats, idx) => (
                            <div
                                className={`pb-4 ${idx ? "border-t pt-4" : ""}`}
                                key={stats._id + idx}
                            >
                                <p className="font-rocGroteskMedium text-sm">
                                    {stats.status}
                                    {stats.reason && ", " + stats.reason}
                                    <span className="block text-[#6B778C] text-sm font-medium mt-[2px]">
                                        {moment(stats.time).format("ddd, Do MMM YYYY LT")}
                                    </span>
                                </p>
                            </div>
                        ))}

                        <div className={`pb-4 relative hidden`}>
                            <div className="flex justify-between">
                                <p className="font-rocGroteskMedium text-sm">
                                    Shipment is currently at an interchange location
                                    <span className="block text-[#6B778C] text-sm font-medium mt-[2px]">
                                        Wed, 3rd May 2022 3:23 PM
                                    </span>
                                </p>
                                {/* <div className="flex items-start">
                                                <span className="material-icons text-mvx-neutral text-lg mr-[14px] cursor-pointer">
                                                    content_copy
                                                </span>
                                                <span className="material-icons text-mvx-neutral text-lg cursor-pointer">
                                                    reply
                                                </span>
                                            </div> */}
                            </div>
                            {/* <p className="underline text-[13px] font-rocGroteskMedium mt-3 cursor-pointer">
                                            Send update
                                        </p> */}

                            <div className="hidden border rounded absolute right-0 top-[45%] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                                <div className="px-3 py-4">
                                    <h4 className="font-rocGroteskBold text-[15px]">
                                        What’s the status of the shipment?
                                    </h4>
                                </div>
                                <div className="p-[10px] "></div>
                            </div>
                        </div>
                        <div className={`py-4 border-t hidden`}>
                            <p className="font-rocGroteskMedium text-sm">
                                Shipment arrived in Arkansas
                                <span className="block text-[#6B778C] text-sm font-medium mt-[2px]">
                                    Wed, 3rd May 2022 3:23 PM
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="pt-12 flex flex-col items-center text-center max-800:pb-14">
                    {/* <MessageCanceledIcon className="h-[29px] w-[29px]" /> */}
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687262463/Web%20App/dashboard/message-cancel_lczuc6.svg"
                        }
                        alt="Message Canceled Icon"
                        className="h-[29px] w-[29px]"
                    />
                    <p className="font-rocGroteskMedium mt-3">No Shipment update</p>
                    <p className="text-[13px] font-rocGroteskMedium mt-1">
                        No update is currently available for your shipment yet.
                    </p>
                </div>
            )}
        </>
    );
};

export default ShipmentUpdates;
