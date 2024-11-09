/* eslint-disable react-hooks/exhaustive-deps */
import NavTwo from "components/common/NavTwo";
import organization from "assets/images/dashboard/organization.svg";
import React, { useEffect, useState } from "react";
import General from "./components/General";
import Notification from "./components/Notification";
import Documents from "./components/Documents";
import Teams from "./components/Teams";
import BillingAndSubscription from "./components/BillingAndSubscription";
import BankAccount from "./components/BankAccount";
import ShipmentPreferences from "./components/ShipmentPreferences";
import LoginAndSecurity from "./components/LoginAndSecurity";
import { useDispatch, useSelector } from "react-redux";
import { getFromStorage, saveToStorage } from "helpers";
import { authActions } from "actions";
import { appActions } from "actions/appActions";
import { subscriptionActions } from "actions";
import Loader from "components/common/Loader";
import _ from "lodash";
import ModalContainer from "components/common/ModalContainer";
import { productGuideData } from "variables/productGuide";
import ProductGuideComp from "components/common/ProductGuideComp";
import useRouteQuery from "hooks/useRouteQuery";
import RolesAndPermissions from "./components/RolesAndPermissions";

const Settings = () => {
    const { searchParams, set } = useRouteQuery();
    const activeSection = searchParams.get("tab") ?? "general";
    const [activeMobileSection, setActiveMobileSection] = useState(false);
    const [teamMemberGuide, setTeamMemberGuide] = useState(false);
    const [tradelaneGuide, setTradelaneGuide] = useState(false);
    const { ffProfile, ffProfileLoading } = useSelector((state) => state.auth);
    const { updateBusinessProfile, updatePersonalProfile } = useSelector((state) => state.app);
    const { getSubscriptionLoading, getSubscriptionSuccess, endSubscriptionSuccess } = useSelector(
        (state) => state.subscription
    );
    const dispatch = useDispatch();

    console.log(activeSection);

    const productGuide = getFromStorage("productGuide");
    const productGuideObj = productGuide
        ? JSON.parse(productGuide)
        : saveToStorage("productGuide", JSON.stringify(productGuideData));
    const settingSections = [
        {
            title: "General",
            key: "general",
        },
        {
            title: "Documents",
            key: "documents",
        },
        {
            title: "Team member",
            key: "team",
        },
        {
            title: "Roles and Permissions",
            key: "roles",
        },
        {
            title: "Bank account",
            key: "bank",
        },
        {
            title: "Notifications",
            key: "notifications",
        },
        {
            title: "Shipment Preferences",
            key: "preferences",
        },
        {
            title: "Billing & subscription",
            key: "subscription",
        },
        {
            title: "Login & security",
            key: "login",
        },
    ];

    const displayActiveSettingSection = () => {
        switch (activeSection) {
            case "general":
                return <General setActiveMobileSection={setActiveMobileSection} />;

            case "documents":
                return <Documents setActiveMobileSection={setActiveMobileSection} />;

            case "team":
                return <Teams setActiveMobileSection={setActiveMobileSection} />;

            case "roles":
                return <RolesAndPermissions />;

            case "bank":
                return <BankAccount setActiveMobileSection={setActiveMobileSection} />;

            case "notifications":
                return (
                    <Notification
                        ffProfile={ffProfile}
                        setActiveMobileSection={setActiveMobileSection}
                    />
                );

            case "preferences":
                return (
                    <ShipmentPreferences
                        ffProfile={ffProfile}
                        ffProfileLoading={ffProfileLoading}
                        setActiveMobileSection={setActiveMobileSection}
                    />
                );

            case "subscription":
                return <BillingAndSubscription setActiveMobileSection={setActiveMobileSection} />;

            case "login":
                return (
                    <LoginAndSecurity
                        userEmail={ffProfile?.result?.email}
                        setActiveMobileSection={setActiveMobileSection}
                    />
                );

            default:
                return <General setActiveMobileSection={setActiveMobileSection} />;
        }
    };

    const fetchFF = () =>
        dispatch(authActions.fetchFreightForwarderProfile(getFromStorage("tradeAlly-user")?._id));

    useEffect(() => {
        if (updateBusinessProfile) {
            dispatch(appActions.resetUpdateBizProfile());
            fetchFF();
        }
        if (updatePersonalProfile) {
            dispatch(appActions.resetUpdateProfile());
            fetchFF();
        }
    }, [updateBusinessProfile, updatePersonalProfile]);

    useEffect(() => {
        dispatch(subscriptionActions.fetchSubscription());
    }, [dispatch, endSubscriptionSuccess]);

    if (getSubscriptionLoading && !ffProfile) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <NavTwo />
            <div className="mt-20">
                <div className="flex w-full gap-11 h-[calc(100vh-80px)]">
                    <div className="w-[20%] max-sm:w-full h-full max-sm:hidden pt-11 max-sm:pt-4 bg-[#FAFBFC]">
                        <div className="pl-9 max-lg:pl-4 max-sm:pl-9">
                            <p className="text-lg hidden max-sm:block mb-7 font-rocGroteskBold">
                                Settings
                            </p>
                            <div
                                className={`w-16 h-16 max-sm:w-[88px] max-sm:h-[88px] rounded-full flex ${
                                    Boolean(getSubscriptionSuccess) && "fancy-border"
                                } items-center rounded justify-center mb-6 bg-mvx-light-blue`}
                            >
                                <img
                                    src={
                                        updateBusinessProfile?.ffUpdated?.user?.profile?.logo
                                            ? updateBusinessProfile?.ffUpdated?.user?.profile?.logo
                                            : ffProfile?.result?.profile?.logo
                                            ? ffProfile?.result?.profile?.logo
                                            : organization
                                    }
                                    alt="organisation"
                                    className="w-14 h-14 max-sm:w-20 max-sm:h-20 rounded-full"
                                />
                            </div>
                            <div>
                                <p className="font-rocGroteskBold text-base text-gun-metal">
                                    {updateBusinessProfile?.ffUpdated?.user?.fullName
                                        ? updateBusinessProfile?.ffUpdated?.user?.fullName
                                        : ffProfile?.result?.fullName}
                                </p>
                                <p className="font-rocGroteskMedium max-lg:hidden max-sm:block text-sm text-mvx-neutral">
                                    {updateBusinessProfile?.ffUpdated?.user?.email
                                        ? updateBusinessProfile?.ffUpdated?.user?.email
                                        : ffProfile?.result?.email}
                                </p>
                                <p className="hidden max-lg:block max-sm:hidden font-rocGroteskMedium text-sm text-mvx-neutral">
                                    {_.truncate(
                                        updateBusinessProfile?.ffUpdated?.user?.email
                                            ? updateBusinessProfile?.ffUpdated?.user?.email
                                            : ffProfile?.result?.email,
                                        {
                                            length: 15,
                                        }
                                    )}
                                </p>
                            </div>
                            {!getSubscriptionSuccess && (
                                <>
                                    <p
                                        onClick={() => set("tab", "subscription")}
                                        className="text-sm cursor-pointer max-sm:hidden font-rocGroteskMedium underline mt-4"
                                    >
                                        Upgrade to pro
                                    </p>
                                    <button
                                        onClick={() => set("tab", "subscription")}
                                        className="max-sm:flex text-sm text-white w-[93%] mt-4 py-2 hidden justify-center items-center"
                                    >
                                        Upgrade to pro
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="mt-[30px]">
                            {settingSections?.map((item, idx) => {
                                return (
                                    <p
                                        onClick={() => {
                                            if (idx === 2 && !productGuideObj?.teamMember) {
                                                saveToStorage(
                                                    "productGuide",
                                                    JSON.stringify({
                                                        ...JSON.parse(productGuide),
                                                        teamMember: true,
                                                    })
                                                );
                                                setTeamMemberGuide(true);
                                            } else if (idx === 5 && !productGuideObj?.tradeLane) {
                                                saveToStorage(
                                                    "productGuide",
                                                    JSON.stringify({
                                                        ...JSON.parse(productGuide),
                                                        tradeLane: true,
                                                    })
                                                );
                                                setTradelaneGuide(true);
                                            } else {
                                                set("tab", item?.key);
                                            }
                                        }}
                                        key={idx}
                                        className={`max-sm:mb-0 max-sm:flex max-sm:justify-between max-sm:items-center max-sm:py-3 max-sm:px-9 max-lg:px-4 pl-9 mb-4 text-sm cursor-pointer w-fit max-sm:w-full font-rocGroteskMedium hover:underline hover:text-gun-metal max-sm:hover:no-underline max-sm:hover:bg-mvx-light-blue ${
                                            activeSection === item.key
                                                ? "underline text-gun-metal max-sm:no-underline max-sm:bg-mvx-light-blue"
                                                : "text-mvx-neutral"
                                        }`}
                                    >
                                        {item.title}
                                        <span
                                            className={`material-icons-outlined text-sm hidden max-sm:block ${
                                                activeSection === item.key
                                                    ? "text-gun-metal"
                                                    : "text-mvx-neutral"
                                            }`}
                                        >
                                            navigate_next
                                        </span>
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                    {!activeMobileSection && (
                        <div className="w-[20%] max-sm:w-full h-full hidden max-sm:block pt-11 max-sm:pt-4 bg-[#FAFBFC]">
                            <div className="pl-9 max-lg:pl-4 max-sm:pl-9">
                                <p className="text-lg hidden max-sm:block mb-7 font-rocGroteskBold">
                                    Settings
                                </p>
                                <div
                                    className={`w-16 h-16 max-sm:w-[88px] max-sm:h-[88px] rounded-full flex ${
                                        Boolean(getSubscriptionSuccess) && "fancy-border"
                                    } items-center rounded justify-center mb-6 bg-mvx-light-blue`}
                                >
                                    <img
                                        src={
                                            updateBusinessProfile?.ffUpdated?.user?.profile?.logo
                                                ? updateBusinessProfile?.ffUpdated?.user?.profile
                                                      ?.logo
                                                : ffProfile?.result?.profile?.logo
                                                ? ffProfile?.result?.profile?.logo
                                                : organization
                                        }
                                        alt="organisation"
                                        className="w-14 h-14 max-sm:w-20 max-sm:h-20 rounded-full"
                                    />
                                </div>
                                <div>
                                    <p className="font-rocGroteskBold text-base text-gun-metal">
                                        {updateBusinessProfile?.ffUpdated?.user?.fullName
                                            ? updateBusinessProfile?.ffUpdated?.user?.fullName
                                            : ffProfile?.result?.fullName}
                                    </p>
                                    <p className="font-rocGroteskMedium max-lg:hidden max-sm:block text-sm text-mvx-neutral">
                                        {updateBusinessProfile?.ffUpdated?.user?.email
                                            ? updateBusinessProfile?.ffUpdated?.user?.email
                                            : ffProfile?.result?.email}
                                    </p>
                                    <p className="hidden max-lg:block max-sm:hidden font-rocGroteskMedium text-sm text-mvx-neutral">
                                        {_.truncate(
                                            updateBusinessProfile?.ffUpdated?.user?.email
                                                ? updateBusinessProfile?.ffUpdated?.user?.email
                                                : ffProfile?.result?.email,
                                            {
                                                length: 15,
                                            }
                                        )}
                                    </p>
                                </div>
                                {!getSubscriptionSuccess && (
                                    <>
                                        <p
                                            onClick={() => set("tab", "subscription")}
                                            className="text-sm cursor-pointer max-sm:hidden font-rocGroteskMedium underline mt-4"
                                        >
                                            Upgrade to pro
                                        </p>
                                        <button
                                            onClick={() => set("tab", "subscription")}
                                            className="max-sm:flex text-sm text-white w-[93%] mt-4 py-2 hidden justify-center items-center"
                                        >
                                            Upgrade to pro
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="mt-[30px]">
                                {settingSections?.map((item, idx) => {
                                    return (
                                        <p
                                            onClick={() => {
                                                set("tab", item.key);
                                                setActiveMobileSection(true);
                                            }}
                                            key={idx}
                                            className={`max-sm:mb-0 max-sm:flex max-sm:justify-between max-sm:items-center max-sm:py-3 max-sm:px-9 max-lg:px-4 pl-9 mb-4 text-sm cursor-pointer w-fit max-sm:w-full font-rocGroteskMedium hover:underline hover:text-gun-metal max-sm:hover:no-underline max-sm:hover:bg-mvx-light-blue ${
                                                activeSection === item.key
                                                    ? "underline text-gun-metal max-sm:no-underline max-sm:bg-mvx-light-blue"
                                                    : "text-mvx-neutral"
                                            }`}
                                        >
                                            {item.title}
                                            <span
                                                className={`material-icons-outlined text-sm hidden max-sm:block ${
                                                    activeSection === item.key
                                                        ? "text-gun-metal"
                                                        : "text-mvx-neutral"
                                                }`}
                                            >
                                                navigate_next
                                            </span>
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="w-[70%] h-[calc(100vh-72px)] overflow-y-auto scrollbar-hide pt-11">
                        {displayActiveSettingSection()}
                    </div>
                </div>
            </div>

            {teamMemberGuide && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName={`w-fit max-lg:w-[85%] max-sm:w-[95%] absolute top-[160px] left-[15%]`}
                >
                    <ProductGuideComp
                        title={"Inviting a team member"}
                        text={`Add new members to your team, facilitating collaboration and
                                        granting them access to the platform for enhanced teamwork
                                        and efficiency.`}
                        mediaUrl={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1690295211/Web%20App/product_guide/teamMemberGuide_aqk3h8.gif"
                        }
                        okayFunc={() => {
                            setTeamMemberGuide(false);
                            set("tab", "team");
                        }}
                    />
                </ModalContainer>
            )}

            {tradelaneGuide && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName={`w-fit max-lg:w-[85%] max-sm:w-[95%] absolute top-[300px] left-[15%]`}
                >
                    <ProductGuideComp
                        title={"Setting up your trade lanes"}
                        text={`This feature will allow you to select the countries you want
                        to ship to and also help us to direct the right customers to
                        your business, providing tailored international trade
                        opportunities.`}
                        mediaUrl={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1690295778/Web%20App/product_guide/tradelane_guide_zrvbb6.gif"
                        }
                        okayFunc={() => {
                            setTradelaneGuide(false);
                            set("tab", "preferences");
                        }}
                    />
                </ModalContainer>
            )}
        </div>
    );
};

export default Settings;
