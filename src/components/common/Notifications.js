/* eslint-disable react-hooks/exhaustive-deps */
import { notificationActions } from "actions";
// import { EmptyNotificationsIcon } from "assets/arts";
import Dropdown from "components/common/Dropdown";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { upperFirst } from "lodash";
import { useNavigate } from "react-router-dom";

const Notifications = ({ isActive, closeNotification }) => {
    const [updateType, setUpdateType] = useState("all");
    const {
        notifications: allNots,
        notificationsLoading,
        markAllAsReadLoading,
    } = useSelector((state) => state.notification);

    const dispatch = useDispatch();
    const notifications = allNots?.data;
    const numberOfPages = allNots?.pagination?.number_of_pages;
    const currentPage = allNots?.pagination?.current;
    const firstLoading = notificationsLoading && !notifications;

    const handleListScroll = (evt) => {
        const element = evt.target;
        const scrollHeight = element.scrollHeight;
        const scrollTop = element.scrollTop;
        const clientHeight = element.clientHeight;
        const scrollDistanceFromBottom = scrollHeight - (scrollTop + clientHeight);
        const scrollPercentageFromBottom = (scrollDistanceFromBottom / scrollHeight) * 100;

        // We're within 20% of the bottom of the element
        if (
            scrollPercentageFromBottom <= 20 &&
            !notificationsLoading &&
            currentPage < numberOfPages
        ) {
            dispatch(notificationActions.filterNotifications(updateType, allNots.pagination.next));
        }
    };

    const renderNotifications = (notifications) =>
        notifications.map(
            ({ _id, notificationType, read, message, createdAt, title, notificationUrl }, idx) => (
                <Notification
                    key={_id}
                    createdAt={createdAt}
                    isFirst={!idx}
                    type={notificationType}
                    read={read}
                    message={message}
                    title={title}
                    url={notificationUrl}
                    id={_id}
                    closeNotification={closeNotification}
                />
            )
        );

    useEffect(() => {
        if (isActive) {
            setUpdateType("all");
            dispatch(notificationActions.filterNotifications("all"));
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "unset";
        }
    }, [isActive]);

    const hasUnreads = !notificationsLoading && allNots?.data?.some((not) => !not.read);

    return (
        <div
            className={`bg-gun-metal/20 fixed top-0 left-0 w-screen h-screen ${
                isActive ? "z-[5000]" : "invisible z-[-5000]"
            }`}
        >
            <div
                className={`h-screen w-screen 475:w-[420px] bg-white absolute right-0 top-0 transition-transform ease-out ${
                    isActive ? "translate-x-0" : "translate-x-[200%]"
                }`}
                onClick={(evt) => evt.stopPropagation()}
            >
                <div className="flex pl-[18px] pr-5 h-[74px] items-center shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                    <Dropdown
                        value={updateType}
                        dropdown={
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-rocGroteskBold">
                                    {updateType === "all"
                                        ? "All updates"
                                        : updateType === "read"
                                        ? "Read"
                                        : "Unread"}
                                </p>
                                <i className="ri-arrow-drop-down-line text-[25px]" />
                            </div>
                        }
                        dropdownContainerClasses={
                            "!w-[158px] !border-0 shadow-dropdownShadow rounded"
                        }
                        name={"quickAction"}
                        handleChange={(_, value) =>
                            notifications?.length && !notificationsLoading && setUpdateType(value)
                        }
                        dropdownOptions={[
                            {
                                label: "All updates",
                                value: "all",
                                action: () =>
                                    dispatch(notificationActions.filterNotifications("all")),
                            },
                            {
                                label: "Read updates",
                                value: "read",
                                action: () =>
                                    dispatch(notificationActions.filterNotifications("read")),
                            },
                            {
                                label: "Unread updates",
                                value: "unread",
                                action: () =>
                                    dispatch(notificationActions.filterNotifications("unread")),
                            },
                        ]}
                    />
                    <i
                        className={`ri-check-double-line mr-4 ml-auto text-2xl cursor-pointer ${
                            !hasUnreads && "pointer-events-none"
                        }`}
                        onClick={() =>
                            !notificationsLoading && dispatch(notificationActions.markAllAsRead())
                        }
                    />
                    <i
                        className="ri-close-line transition-colors hover:bg-mvx-light-blue rounded-full text-2xl px-1 cursor-pointer"
                        onClick={closeNotification}
                    />
                </div>

                <div
                    className={`overflow-y-auto px-5 h-[calc(100%-150px)] 475:h-[calc(100%-83px)] 475:pb-3 ${
                        (!notifications?.length || firstLoading || markAllAsReadLoading) &&
                        "grid place-items-center"
                    }`}
                    id="nots"
                    onScroll={handleListScroll}
                >
                    {firstLoading || markAllAsReadLoading ? (
                        <Loader size={8} />
                    ) : (
                        <>
                            {!notifications?.length ? (
                                <>
                                    <div className="text-center">
                                        {/* <EmptyNotificationsIcon className="mx-auto mb-1.5" /> */}
                                        <img
                                            src={
                                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687263892/Web%20App/dashboard/empty-notifications_hbx8gc.svg"
                                            }
                                            alt="Empty Notifications Icon"
                                            className="mx-auto mb-1.5"
                                        />
                                        <p className="font-rocGroteskBold text-base">
                                            Awesome job!
                                        </p>
                                        <p className="text-mvx-neutral text-sm mt-1">
                                            No notifications yet. You are all cleared.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {renderNotifications(notifications)}
                                    {!firstLoading && currentPage < numberOfPages && (
                                        <Loader className={"mt-7 mb-4"} />
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const Notification = ({
    type,
    isFirst,
    read,
    message,
    title,
    createdAt,
    url,
    id,
    closeNotification,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { markAsReadLoading } = useSelector((state) => state.notification);
    const [markAsReadClicked, setMarkAsReadClicked] = useState(false);

    const isNavigable = () => {
        if (url) {
            const splitUrl = url.split("/");
            const id = splitUrl[splitUrl.length - 1];

            if (splitUrl.includes("quotes")) {
                return `/dashboard/quotes?id=${id}`;
            } else if (splitUrl.includes("quoteRequest")) {
                return `/dashboard/quote-requests?id=${id}`;
            } else if (splitUrl.includes("billing") || splitUrl.includes("subscription")) {
                return `/dashboard/settings?subscription=true`;
            } else if (splitUrl.includes("shipment")) {
                return `/dashboard/shipment/${id}`;
            } else if (splitUrl.includes("folder") || splitUrl.includes("file")) {
                return `/dashboard/folders`;
            }
        }
    };

    return (
        <>
            {true ? (
                <div
                    className={`flex items-center group w-full overflow-x-hidden ${
                        isNavigable() && "cursor-pointer"
                    } ${markAsReadLoading && "pointer-events-none"}`}
                    onClick={() => {
                        if (isNavigable()) {
                            closeNotification();
                            !read && dispatch(notificationActions.markAsRead(id));
                            navigate(isNavigable());
                        }
                    }}
                >
                    <div
                        className={`group-hover:mr-2 w-full ${
                            markAsReadLoading && markAsReadClicked && "!w-[calc(100%-100px)] !mr-2"
                        }`}
                    >
                        <p
                            className={`flex items-center text-[15px] font-rocGroteskMedium leading-5 ${
                                isFirst ? "mt-5" : "mt-7"
                            }`}
                        >
                            <i
                                className={`h-[6px] w-[6px] mr-2 rounded-full self-start bg-[#FF3347] translate-y-1 ${
                                    read && "hidden"
                                }`}
                            />
                            {upperFirst(title)}
                        </p>
                        <p className="text-mvx-gray text-[13px] font-rocGroteskMedium">
                            {upperFirst(message)}
                        </p>
                        <p className="mt-1.5 text-mvx-gray text-[13px] font-rocGroteskMedium">
                            {moment(createdAt).format("YYYY-MM-DD | hh:mm A")}
                        </p>
                    </div>

                    {!read && (
                        <p
                            className={`rounded-l transition-all duration-300 ease-in-out cursor-pointer group-hover:-translate-x-[1px] group-hover:w-[100px] w-0 translate-x-[150%] ${
                                markAsReadLoading &&
                                markAsReadClicked &&
                                "!w-[100px] !-translate-x-[1px]"
                            } bg-gun-metal font-rocGroteskMedium text-center grid place-items-center text-white h-[100px] text-sm`}
                            onClick={(evt) => {
                                evt.stopPropagation();
                                setMarkAsReadClicked(true);
                                dispatch(notificationActions.markAsRead(id));
                            }}
                        >
                            {markAsReadLoading ? <Loader color={"white"} /> : "Mark as read"}
                        </p>
                    )}
                </div>
            ) : (
                <>
                    <p
                        className={`flex items-center text-[15px] font-rocGroteskMedium leading-5 ${
                            isFirst ? "mt-5" : "mt-8"
                        }`}
                    >
                        <i
                            className={`h-[6px] w-[6px] mr-2 rounded-full bg-[#FF3347] -translate-y-[1px] ${
                                read && "hidden"
                            }`}
                        />
                        {title}
                        <span className="text-mvx-neutral text-[13px] ml-2">
                            {moment(createdAt).fromNow()}
                        </span>
                    </p>
                    <div className="grid grid-cols-2 gap-x-3 mb-8 mt-2">
                        <button className="text-sm h-[42px] bg-mvx-light-blue text-gun-metal !font-rocGroteskMedium">
                            Accept request
                        </button>
                        <button className="text-sm h-[42px] !font-rocGroteskMedium">
                            View request
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default Notifications;
