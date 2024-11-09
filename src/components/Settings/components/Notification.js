/* eslint-disable react-hooks/exhaustive-deps */
import { appActions } from "actions/appActions";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Notification = ({ ffProfile, setActiveMobileSection }) => {
    const notificationSettingsObj = ffProfile?.result?.notificationSettings;
    const [clicked, setClicked] = useState();

    const [notification, setNotification] = useState({
        all: !Object.values(notificationSettingsObj)?.includes(false),
        inApp: notificationSettingsObj?.inAppNotifications,
        newShipment: notificationSettingsObj?.shipmentRequests,
        shipmentUpdate: notificationSettingsObj?.shipmentUpdates,
        trackingUpdate: notificationSettingsObj?.trackingUpdates,
        announcementAndPromotion:
            notificationSettingsObj?.accouncements && notificationSettingsObj?.promotions,
    });

    const dispatch = useDispatch();

    const updateNotificationSettings = debounce(() => {
        setClicked(false);
        dispatch(
            appActions.updatePersonalProfile({
                notificationSettings: {
                    accouncements: notification.announcementAndPromotion,
                    inAppNotifications: notification.inApp,
                    promotions: notification.announcementAndPromotion,
                    shipmentRequests: notification.newShipment,
                    shipmentUpdates: notification.shipmentUpdate,
                    trackingUpdates: notification.trackingUpdate,
                },
            })
        );
    }, 800);

    const updateNotificationStateNotAll = (key, value) => {
        setNotification((prev) => {
            const notObj = {
                ...prev,
                [key]: value,
            };
            const data = { ...notObj, all: !Object.values(notObj).slice(1).includes(false) };
            return data;
        });
        setClicked(true);
    };

    useEffect(() => {
        clicked && updateNotificationSettings();
    }, [clicked, notification]);

    return (
        <>
            <div className="mb-6 max-sm:px-5">
                <p className="text-[22px] font-rocGroteskBold mb-1 max-sm:flex">
                    <span
                        onClick={() => setActiveMobileSection(false)}
                        className="material-icons-outlined max-sm:block hidden text-lg font-semibold mr-2 sm:hidden"
                    >
                        arrow_back
                    </span>
                    Notification
                </p>
                <p className="text-sm font-rocGroteskMedium max-sm:text-mvx-neutral">
                    Enable Notifications to never miss out on any important updates from us.
                </p>
            </div>
            <hr className="hidden sm:block" />
            <div className="border py-4 mt-6 max-sm:mx-5 max-sm:mb-8">
                <div className="flex justify-between items-center px-5 pb-4">
                    <div>
                        <p className="text-sm font-rocGroteskMedium text-gun-metal">
                            All Notifications
                        </p>
                    </div>
                    <div>
                        <label className="switch relative inline-block w-[38px] h-[25px]">
                            <input
                                type="checkbox"
                                checked={notification.all}
                                onChange={() => {
                                    setNotification((prev) => ({
                                        ...prev,
                                        all: !prev.all,
                                        inApp: !prev.all,
                                        newShipment: !prev.all,
                                        shipmentUpdate: !prev.all,
                                        trackingUpdate: !prev.all,
                                        announcementAndPromotion: !prev.all,
                                    }));
                                    setClicked(true);
                                }}
                                className="opacity-0 w-0 h-0"
                            />
                            <span
                                className={`slider round absolute ${
                                    notification.all && "before:translate-x-[24px]"
                                } ${
                                    notification.all
                                        ? "bg-gun-metal before:border-gun-metal before:bg-white before:content-['✔'] before:flex before:justify-center before:items-center before:text-[13px]"
                                        : "bg-[#DFE1E6] before:border-[#DFE1E6] before:bg-mvx-light-blue"
                                } cursor-pointer top-0 left-0 right-0 bottom-0 duration-[.3s] rounded-[34px] before:absolute before:h-[23.5px] before:w-[23.5px] before:border  ${
                                    notification.all ? "before:left-[-9px]" : "before:left-0"
                                } before:bottom-[1px] before:duration-[.4s]  before:rounded-[50%]`}
                            ></span>
                        </label>
                    </div>
                </div>
                <hr />
                <div className="flex justify-between items-center px-5 py-4">
                    <div>
                        <p className="text-sm font-rocGroteskMedium text-gun-metal">
                            In-App Notifications
                        </p>
                    </div>

                    <div>
                        <label className="switch relative inline-block w-[38px] h-[25px]">
                            <input
                                type="checkbox"
                                checked={notification.inApp}
                                onChange={() =>
                                    updateNotificationStateNotAll("inApp", !notification.inApp)
                                }
                                className="opacity-0 w-0 h-0"
                            />
                            <span
                                className={`slider round absolute ${
                                    notification.inApp && "before:translate-x-[24px]"
                                } ${
                                    notification.inApp
                                        ? "bg-gun-metal before:border-gun-metal before:bg-white before:content-['✔'] before:flex before:justify-center before:items-center before:text-[13px]"
                                        : "bg-[#DFE1E6] before:border-[#DFE1E6] before:bg-mvx-light-blue"
                                } cursor-pointer top-0 left-0 right-0 bottom-0 duration-[.3s] rounded-[34px] before:absolute before:h-[23.5px] before:w-[23.5px] before:border  ${
                                    notification.inApp ? "before:left-[-9px]" : "before:left-0"
                                } before:bottom-[1px] before:duration-[.4s]  before:rounded-[50%]`}
                            ></span>
                        </label>
                    </div>
                </div>
                <hr />
                <div className="flex justify-between items-center px-5 py-4">
                    <div>
                        <p className="text-sm font-rocGroteskMedium text-gun-metal">
                            New Shipment Requests
                        </p>
                    </div>

                    <div>
                        <label className="switch relative inline-block w-[38px] h-[25px]">
                            <input
                                type="checkbox"
                                checked={notification.newShipment}
                                onChange={() =>
                                    updateNotificationStateNotAll(
                                        "newShipment",
                                        !notification.newShipment
                                    )
                                }
                                className="opacity-0 w-0 h-0"
                            />
                            <span
                                className={`slider round absolute ${
                                    notification.newShipment && "before:translate-x-[24px]"
                                } ${
                                    notification.newShipment
                                        ? "bg-gun-metal before:border-gun-metal before:bg-white before:content-['✔'] before:flex before:justify-center before:items-center before:text-[13px]"
                                        : "bg-[#DFE1E6] before:border-[#DFE1E6] before:bg-mvx-light-blue"
                                } cursor-pointer top-0 left-0 right-0 bottom-0 duration-[.3s] rounded-[34px] before:absolute before:h-[23.5px] before:w-[23.5px] before:border  ${
                                    notification.newShipment
                                        ? "before:left-[-9px]"
                                        : "before:left-0"
                                } before:bottom-[1px] before:duration-[.4s]  before:rounded-[50%]`}
                            ></span>
                        </label>
                    </div>
                </div>

                <hr />
                <div className="flex justify-between items-center px-5 py-4">
                    <div>
                        <p className="text-sm font-rocGroteskMedium text-gun-metal">
                            Shipment Updates
                        </p>
                    </div>

                    <div>
                        <label className="switch relative inline-block w-[38px] h-[25px]">
                            <input
                                type="checkbox"
                                checked={notification.shipmentUpdate}
                                onChange={() =>
                                    updateNotificationStateNotAll(
                                        "shipmentUpdate",
                                        !notification.shipmentUpdate
                                    )
                                }
                                className="opacity-0 w-0 h-0"
                            />
                            <span
                                className={`slider round absolute ${
                                    notification.shipmentUpdate && "before:translate-x-[24px]"
                                } ${
                                    notification.shipmentUpdate
                                        ? "bg-gun-metal before:border-gun-metal before:bg-white before:content-['✔'] before:flex before:justify-center before:items-center before:text-[13px]"
                                        : "bg-[#DFE1E6] before:border-[#DFE1E6] before:bg-mvx-light-blue"
                                } cursor-pointer top-0 left-0 right-0 bottom-0 duration-[.3s] rounded-[34px] before:absolute before:h-[23.5px] before:w-[23.5px] before:border  ${
                                    notification.shipmentUpdate
                                        ? "before:left-[-9px]"
                                        : "before:left-0"
                                } before:bottom-[1px] before:duration-[.4s]  before:rounded-[50%]`}
                            ></span>
                        </label>
                    </div>
                </div>
                <hr />
                <div className="flex justify-between items-center px-5 py-4">
                    <div>
                        <p className="text-sm font-rocGroteskMedium text-gun-metal">
                            Tracking Updates
                        </p>
                    </div>

                    <div>
                        <label className="switch relative inline-block w-[38px] h-[25px]">
                            <input
                                type="checkbox"
                                checked={notification.trackingUpdate}
                                onChange={() =>
                                    updateNotificationStateNotAll(
                                        "trackingUpdate",
                                        !notification.trackingUpdate
                                    )
                                }
                                className="opacity-0 w-0 h-0"
                            />
                            <span
                                className={`slider round absolute ${
                                    notification.trackingUpdate && "before:translate-x-[24px]"
                                } ${
                                    notification.trackingUpdate
                                        ? "bg-gun-metal before:border-gun-metal before:bg-white before:content-['✔'] before:flex before:justify-center before:items-center before:text-[13px]"
                                        : "bg-[#DFE1E6] before:border-[#DFE1E6] before:bg-mvx-light-blue"
                                } cursor-pointer top-0 left-0 right-0 bottom-0 duration-[.3s] rounded-[34px] before:absolute before:h-[23.5px] before:w-[23.5px] before:border  ${
                                    notification.trackingUpdate
                                        ? "before:left-[-9px]"
                                        : "before:left-0"
                                } before:bottom-[1px] before:duration-[.4s]  before:rounded-[50%]`}
                            ></span>
                        </label>
                    </div>
                </div>

                <hr />
                <div className="flex justify-between items-center px-5 pt-4">
                    <div>
                        <p className="text-sm font-rocGroteskMedium text-gun-metal">
                            Announcements & Promotions
                        </p>
                    </div>

                    <div>
                        <label className="switch relative inline-block w-[38px] h-[25px]">
                            <input
                                type="checkbox"
                                checked={notification.announcementAndPromotion}
                                onChange={() =>
                                    updateNotificationStateNotAll(
                                        "announcementAndPromotion",
                                        !notification.announcementAndPromotion
                                    )
                                }
                                className="opacity-0 w-0 h-0"
                            />
                            <span
                                className={`slider round absolute ${
                                    notification.announcementAndPromotion &&
                                    "before:translate-x-[24px]"
                                } ${
                                    notification.announcementAndPromotion
                                        ? "bg-gun-metal before:border-gun-metal before:bg-white before:content-['✔'] before:flex before:justify-center before:items-center before:text-[13px]"
                                        : "bg-[#DFE1E6] before:border-[#DFE1E6] before:bg-mvx-light-blue"
                                } cursor-pointer top-0 left-0 right-0 bottom-0 duration-[.3s] rounded-[34px] before:absolute before:h-[23.5px] before:w-[23.5px] before:border  ${
                                    notification.announcementAndPromotion
                                        ? "before:left-[-9px]"
                                        : "before:left-0"
                                } before:bottom-[1px] before:duration-[.4s]  before:rounded-[50%]`}
                            ></span>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notification;
