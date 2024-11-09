import moment from "moment";
import { useEffect, useState } from "react";

const LapHistory = ({ trackingData, isLast, isFirst, overlay, setOverlay }) => {
    const [dropDown, setDropDown] = useState(false);
    // const trackingData = useMemo(() => first, [second])

    useEffect(() => {
        if (overlay && !dropDown) {
            setDropDown(true);
        }
    }, [overlay, dropDown]);

    // const fixedTitleStyle = ''

    return (
        <div className={`flex mb-3 ${isLast && "pb-10"}`}>
            <div className="mr-3 flex flex-col justify-center items-center">
                <span className={`material-icons text-[13px] text-white p-1 ${"bg-mvx-black"}`}>
                    flight_takeoff
                </span>
                <div className={`w-[2.3px] mt-2 h-full ${"bg-mvx-black"}`}></div>
            </div>
            <div className={`flex-1 ${!dropDown && "pb-6"}`}>
                <div
                    className={`flex cursor-pointer ${overlay && "static"}`}
                    onClick={() => setDropDown((prev) => !prev)}
                >
                    <p className="text-sm font-satoshiBold cursor-pointer">
                        {isFirst ? "Final Destination" : isLast ? "Origin" : "Previous Stop"}
                        <span className="block font-satoshiMedium text-[12px] mt-[2px] capitalize">
                            {trackingData?.port}, {trackingData?.portCode}
                        </span>
                    </p>

                    {!overlay && (
                        <span
                            className={`material-icons text-2xl ml-auto self-center transition duration-300 ${
                                dropDown ? "rotate-[180deg]" : "rotate-0"
                            }`}
                        >
                            expand_more
                        </span>
                    )}
                </div>

                {trackingData?.events.length ? (
                    <>
                        {overlay ? (
                            <>
                                {trackingData?.events
                                    .map((event) => (
                                        <div
                                            className={`${
                                                !dropDown && "hidden"
                                            } border mt-4 mb-6 py-[14px] pb-6 px-3 pr-4 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]`}
                                            key={event._id}
                                        >
                                            <p className="text-xs font-satoshiBold">
                                                Event History
                                            </p>
                                            <LapEvent event={event} />
                                        </div>
                                    ))
                                    .reverse()}
                            </>
                        ) : (
                            <div
                                className={`${
                                    !dropDown && "hidden"
                                } border mt-4 mb-6 py-[14px] pb-6 px-3 pr-4 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]`}
                            >
                                <p className="text-xs font-satoshiBold">Event History</p>
                                <LapEvent
                                    event={trackingData?.events[trackingData?.events.length - 1]}
                                />

                                <span
                                    className={`text-xs underline cursor-pointer font-satoshiBold`}
                                    onClick={setOverlay}
                                >
                                    Show more
                                </span>
                            </div>
                        )}
                    </>
                ) : (
                    <div
                        className={`${
                            !dropDown && "hidden"
                        } border mt-4 mb-6 py-[14px] pb-6 px-3 pr-4 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]`}
                    >
                        <p className="text-xs font-satoshiBold">Event History</p>
                        <span className="text-[13px] font-satoshiMedium text-mvx-gray">
                            No events to show
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const LapEvent = ({ event, overlay }) => {
    return (
        <>
            <span className="flex [&_*]:text-xs [&_*]:text-mvx-gray [&_*]:font-satoshiMedium mt-2">
                <span>
                    Location Code
                    <span className="!font-satoshiBold block mt-1 uppercase">
                        {event?.location?.location_code}
                    </span>
                </span>
                <span className="ml-auto mt-1 text-right">
                    Port Code
                    <span className="!font-satoshiBold block uppercase">
                        {event?.location?.port_code}
                    </span>
                </span>
            </span>
            <span className="flex [&_*]:text-xs [&_*]:text-mvx-gray [&_*]:font-satoshiMedium mt-4">
                <span>
                    Event Type
                    <span className="!font-satoshiBold block mt-1 capitalize">
                        {event?.event_type?.name}
                    </span>
                </span>
                <span className="ml-auto mt-1 text-right">
                    Port Name
                    <span className="!font-satoshiBold block">{event?.location?.port_name} </span>
                </span>
            </span>
            <span className="flex [&_*]:text-xs [&_*]:text-mvx-gray [&_*]:font-satoshiMedium mt-4">
                <span>
                    Event Time
                    <span className="!font-satoshiBold block mt-1 text-sm">
                        {/* April 23, 2021: 04:30 AM WAT <br /> */}
                        {event?.event_time
                            ? moment(event?.event_time).format("LLLL")
                            : "Unavailable"}
                    </span>
                </span>
            </span>
            <span
                className={`flex [&_*]:text-xs [&_*]:text-mvx-gray [&_*]:font-satoshiMedium mt-4 ${
                    overlay && "mb-3"
                }`}
            >
                <span>
                    Estimated Time
                    <span className="!font-satoshiBold block mt-1 text-sm">
                        {event?.event_time_estimated
                            ? moment(event?.event_time_estimated).format("LLLL")
                            : "Unavailable"}
                    </span>
                </span>
            </span>
        </>
    );
};

export default LapHistory;
