/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "assets/images/tradeally_logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { getFromStorage, saveToStorage } from "helpers";
import { authActions, notificationActions, subscriptionActions } from "actions";
import Dropdown from "./Dropdown";
import organization from "assets/images/dashboard/organization.svg";
import newTag from "assets/images/new_tag.svg";
import Notifications from "./Notifications";
import _ from "lodash";
import ModalContainer from "./ModalContainer";
import { getOperatingSystem } from "helpers/getOS";
import { productGuideData } from "variables/productGuide";
import useModal from "./Modals/ModalProvider";

const NavTwo = ({ className }) => {
    const { openModal } = useModal();
    const [folderGuide, setFolderGuide] = useState(false);
    const [shipmentGuide, setShipmentGuide] = useState(false);
    const [downloadAppGuide, setDownloadAppGuide] = useState(false);
    const [requestQuote, setRequestQuote] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const [getTradeAllyApp, setGetTradeAllyApp] = useState(false);
    const [user, setUser] = useState(getFromStorage("tradeAlly-user"));
    const { ffProfile } = useSelector((state) => state.auth);
    const { updateBusinessProfile } = useSelector((state) => state.app);
    const { getSubscriptionLoading, getSubscriptionSuccess } = useSelector(
        (state) => state.subscription
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { notifications: allNots } = useSelector((state) => state.notification);
    const [notifications, setNotifications] = useState(() => allNots?.data);
    const [activeLink, setActiveLink] = useState(0);
    const [previousLink, setPreviousLink] = useState(0);
    const [hoverItemId, setHoverItemId] = useState(null);
    const productGuide = getFromStorage("productGuide");
    const productGuideObj = productGuide
        ? JSON.parse(productGuide)
        : saveToStorage("productGuide", JSON.stringify(productGuideData));

    const navLinks = [
        {
            title: "Home",
            path: "/dashboard/home",
        },
        {
            title: "Shipments",
            path: "/dashboard/shipments",
            children: [
                {
                    title: "Shipment Creation",
                    subText: "Create a quote for your customer shipment",
                    icon: <i className="ri-add-circle-fill text-2xl"></i>,
                    action: () =>
                        navigate(`/dashboard/shipment-creation/${ffProfile?.result?._id}`),
                },
                {
                    title: "All Shipment",
                    subText: "Create a quote for your customer shipment",
                    icon: <i className="ri-file-list-3-fill text-2xl"></i>,
                    action: () => navigate("/dashboard/shipments"),
                },
            ],
        },
        {
            title: "Quotes",
            path: "/dashboard/quotes",
            children: [
                {
                    title: "Quote creation",
                    subText: "Create a quote for your customer shipment",
                    icon: <i className="ri-add-circle-fill text-2xl"></i>,
                    action: () => openModal("create_quote"),
                },
                {
                    title: "Find an instant quote",
                    subText: "Get instant, competitive rates for shipments.",
                    icon: <i className="ri-search-eye-fill text-2xl"></i>,
                    action: () => navigate("/dashboard/instant-quote"),
                },
                {
                    title: "Request Quote from Global Partners",
                    subText: "Create a quote for your customer shipment",
                    icon: <i className="ri-survey-fill text-2xl"></i>,
                    action: () =>
                        openModal("create_quote", {
                            directStepNo: 1,
                            forCustomer: false,
                        }),
                },
                {
                    title: "All Quotes",
                    subText: "Create a quote for your customer shipment",
                    icon: <i className="ri-file-list-3-fill text-2xl"></i>,
                    action: () => navigate("/dashboard/quotes"),
                },
            ],
        },
        {
            title: "Documents",
            path: "/dashboard/folders",
        },

        {
            title: "Rates",
            path: "/dashboard/rate-management",
        },
    ];

    const logOut = () => {
        dispatch(authActions.logOut());
    };

    useEffect(() => {
        dispatch(notificationActions.filterNotifications("unread"));
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch(notificationActions.filterNotifications("unread"));
        }, 120000);

        if (openNotifications) clearInterval(intervalId);

        return () => clearInterval(intervalId);
    }, [openNotifications]);

    useEffect(() => {
        if (allNots?.data) {
            setNotifications(allNots?.data);
        }
    }, [allNots?.data]);

    useEffect(() => {
        if (user && !user?.result?.profile?.businessName && !ffProfile) {
            dispatch(authActions.fetchFreightForwarderProfile(user._id));
        }
    }, [user, ffProfile]);

    useEffect(() => {
        dispatch(subscriptionActions.fetchSubscription());
    }, []);

    useEffect(() => {
        switch (location.pathname) {
            case "/dashboard/home":
                setActiveLink(0);
                break;
            case "/dashboard/shipments":
                setActiveLink(1);
                break;
            case "/dashboard/quotes":
                setActiveLink(2);
                break;
            case "/dashboard/instant-quote":
                setActiveLink(2);
                break;
            case "/dashboard/folders":
                setActiveLink(3);
                break;
            case "/dashboard/rate-management":
                setActiveLink(4);
                break;
            default:
                setActiveLink(-1);
                break;
        }
    }, []);

    return (
        <div className="w-full fixed top-0 left-0 right-0 bottom-0 h-[72px] z-40">
            <nav
                className={`flex bg-white justify-between items-center shadow relative text-mvx-black px-[104px] max-lg:px-10 max-sm:px-4 h-full ${className}`}
            >
                <div className=" h-full flex gap-2 items-center">
                    <Link to={"/dashboard/home"}>
                        <img src={logo} alt="Fleet+" className="w-[120px] h-[28px]" />
                    </Link>
                </div>

                <div className="pl-6 flex items-center max-lg:hidden">
                    {navLinks.map((linkItem, idx) => {
                        return !linkItem?.children ? (
                            <Link
                                key={linkItem.title}
                                to={idx === 3 && !productGuideObj?.folders ? "#" : linkItem.path}
                                onClick={() => {
                                    setPreviousLink(activeLink);
                                    setActiveLink(idx);
                                    if (idx === 3 && !productGuideObj?.folders) {
                                        saveToStorage(
                                            "productGuide",
                                            JSON.stringify({
                                                ...JSON.parse(productGuide),
                                                folders: true,
                                            })
                                        );
                                        return setFolderGuide(true);
                                    }
                                }}
                                className={`text-sm font-rocGroteskMedium px-3 py-[10px] hover:bg-mvx-light-blue rounded ${
                                    activeLink === idx && "bg-mvx-light-blue"
                                }`}
                            >
                                {linkItem.title}
                            </Link>
                        ) : (
                            <Dropdown
                                value={""}
                                key={linkItem.title}
                                dropdown={
                                    <div
                                        onClick={() => {
                                            setHoverItemId(null);
                                            if (idx === 1 && !productGuideObj?.shipment) {
                                                saveToStorage(
                                                    "productGuide",
                                                    JSON.stringify({
                                                        ...JSON.parse(productGuide),
                                                        shipment: true,
                                                    })
                                                );
                                                return setShipmentGuide(true);
                                            }
                                        }}
                                        className={`flex items-center gap-1 text-sm font-rocGroteskMedium px-3 py-[10px] hover:bg-mvx-light-blue rounded ${
                                            activeLink === idx && "bg-mvx-light-blue"
                                        }`}
                                    >
                                        <p className="text-inherit">{linkItem.title}</p>
                                        <i className="ri-arrow-down-s-line"></i>
                                    </div>
                                }
                                disabled={!Boolean(productGuideObj?.shipment) && idx === 1}
                                dropdownContainerClasses={
                                    "left-[-70px] !py-0 top-[55px] shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.03),0px_20px_24px_-4px_rgba(16,24,40,0.08)] rounded !border-0"
                                }
                                dropdownClassName={`!max-h-fit `}
                                dropdownTriggerClassName={`${"nav-dropdown-" + idx}`}
                                name={"quickAction"}
                                dropdownOptions={[
                                    {
                                        customChild: (
                                            <div className="bg-white w-[793px] h-[340px]">
                                                <div className="w-full h-full flex">
                                                    <div className="w-[55%] bg-white py-4">
                                                        {linkItem?.children?.map(
                                                            (childLink, idx) => (
                                                                <div
                                                                    key={childLink?.title}
                                                                    onClick={childLink?.action}
                                                                    onMouseEnter={() =>
                                                                        setHoverItemId(idx)
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        setHoverItemId(null)
                                                                    }
                                                                    className="flex items-center gap-4 px-8 cursor-pointer py-4 hover:bg-mvx-light-blue"
                                                                >
                                                                    <div>{childLink?.icon}</div>
                                                                    <div className="justify-between flex items-center w-full">
                                                                        <div>
                                                                            <p className="text-[15px] font-rocGroteskMedium">
                                                                                {childLink?.title}
                                                                            </p>
                                                                            <p className="text-xs font-rocGroteskMedium text-mvx-neutral">
                                                                                {childLink?.subText}
                                                                            </p>
                                                                        </div>
                                                                        {hoverItemId === idx && (
                                                                            <i className="ri-arrow-right-line"></i>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                    <div className="w-[45%] bg-[#EDFDF9] p-8">
                                                        <div className="flex mb-6">
                                                            <img
                                                                src="https://res.cloudinary.com/dvxi7qcmd/image/upload/v1689156009/Web%20App/dashboard/image_5346_vtjhaa.svg"
                                                                alt="face one"
                                                                className="rounded-full w-[79px] h-[79px] border-[4px] border-white"
                                                            />
                                                            <img
                                                                src="https://res.cloudinary.com/dvxi7qcmd/image/upload/v1689155977/Web%20App/dashboard/image_5347_iojfqi.svg"
                                                                alt="face two"
                                                                className="rounded-full w-[79px] h-[79px] border-[4px] border-white ml-[-16px]"
                                                            />
                                                            <img
                                                                src="https://res.cloudinary.com/dvxi7qcmd/image/upload/v1689155996/Web%20App/dashboard/image_5348_yogmgd.svg"
                                                                alt="face third"
                                                                className="rounded-full w-[79px] h-[79px] border-[4px] border-white ml-[-16px]"
                                                            />
                                                        </div>
                                                        <div className="mb-6">
                                                            <p className="text-base font-rocGroteskBold mb-1.5">
                                                                Need help? Book a call with an Ally
                                                            </p>
                                                            <p className="text-sm font-rocGroteskRegular ">
                                                                Learn how the Fleet+ end-to-end
                                                                freight management software can help
                                                                you build and grow your business.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <a
                                                                href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-sm font-rocGroteskBold underline pr-4 border-r mr-4"
                                                            >
                                                                Book a demo
                                                            </a>
                                                            <a
                                                                href="mailto:hello@fleetplus.io"
                                                                className="text-sm font-rocGroteskBold underline "
                                                            >
                                                                Contact sales
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    <i
                        className="ri-smartphone-fill cursor-pointer text-xl"
                        onClick={() => {
                            if (!productGuideObj?.downloadApp) {
                                saveToStorage(
                                    "productGuide",
                                    JSON.stringify({
                                        ...JSON.parse(productGuide),
                                        downloadApp: true,
                                    })
                                );
                                setDownloadAppGuide(true);
                            } else {
                                setGetTradeAllyApp(true);
                            }
                        }}
                    />
                    <i
                        className={`ri-notification-2-fill cursor-pointer text-xl relative`}
                        onClick={() => setOpenNotifications(true)}
                    >
                        {notifications?.some((not) => !not?.read) && (
                            <i
                                className={`absolute top-0.5 right-[1px] h-[9px] w-[9px] rounded-full bg-[#FF3347] border-2 border-white z-30`}
                            />
                        )}
                    </i>
                    <i
                        className="ri-settings-5-fill text-xl cursor-pointer"
                        onClick={() => navigate("/dashboard/settings")}
                    ></i>
                    <div className="">
                        <Dropdown
                            value={""}
                            dropdown={
                                <div>
                                    <div className="max-sm:hidden">
                                        {ffProfile?.result?.profile?.logo ||
                                        updateBusinessProfile?.ffUpdated?.user?.profile?.logo ? (
                                            <img
                                                className="w-8 h-8 rounded-full border object-cover object-top"
                                                src={
                                                    updateBusinessProfile?.ffUpdated?.user?.profile
                                                        ?.logo
                                                        ? updateBusinessProfile?.ffUpdated?.user
                                                              ?.profile?.logo
                                                        : ffProfile?.result?.profile?.logo
                                                        ? ffProfile?.result?.profile?.logo
                                                        : organization
                                                }
                                                alt={ffProfile?.result?.fullName}
                                            />
                                        ) : (
                                            <img
                                                className="w-8 h-8 rounded-full border object-cover object-top"
                                                src={organization}
                                                alt={ffProfile?.result?.fullName}
                                            />
                                        )}
                                    </div>
                                    {/* <div className="hidden max-sm:block"> */}
                                    <i className="ri-menu-3-line text-xl cursor-pointer hidden max-sm:block"></i>
                                    {/* </div> */}
                                </div>
                            }
                            dropdownContainerClasses={
                                "left-[-260px] max-sm:left-[-274px] top-[51px] shadow-dropdownShadow rounded !border-0 !z-30"
                            }
                            dropdownClassName={"!max-h-fit"}
                            name={"quickAction"}
                            dropdownOptions={[
                                {
                                    customChild: (
                                        <div className="bg-white w-[295px]">
                                            <div className="px-4 pt-3 pb-4">
                                                <p className="text-sm font-rocGroteskMedium">
                                                    Your business account is currently on Fleet+{" "}
                                                    <span className="capitalize">
                                                        {
                                                            getSubscriptionSuccess?.subscription
                                                                ?.plan?.name
                                                        }
                                                    </span>{" "}
                                                    Plan{" "}
                                                    <a
                                                        href="/dashboard/settings?subscription=true"
                                                        className="underline"
                                                    >
                                                        Learn more
                                                    </a>
                                                </p>
                                            </div>
                                            <hr />
                                            <div className="bg-[#FAFBFC] py-3 px-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        {ffProfile?.result?.profile?.logo ||
                                                        updateBusinessProfile?.ffUpdated?.user
                                                            ?.profile?.logo ? (
                                                            <img
                                                                className="w-8 h-8 rounded-full border object-cover object-top"
                                                                src={
                                                                    updateBusinessProfile?.ffUpdated
                                                                        ?.user?.profile?.logo
                                                                        ? updateBusinessProfile
                                                                              ?.ffUpdated?.user
                                                                              ?.profile?.logo
                                                                        : ffProfile?.result?.profile
                                                                              ?.logo
                                                                        ? ffProfile?.result?.profile
                                                                              ?.logo
                                                                        : organization
                                                                }
                                                                alt={ffProfile?.result?.fullName}
                                                            />
                                                        ) : (
                                                            <img
                                                                className="w-8 h-8 rounded-full border object-cover object-top"
                                                                src={organization}
                                                                alt={ffProfile?.result?.fullName}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-rocGroteskMedium">
                                                            {_.truncate(
                                                                updateBusinessProfile?.ffUpdated
                                                                    ?.user?.fullName ??
                                                                    ffProfile?.result?.fullName,
                                                                {
                                                                    length: 20,
                                                                }
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-mvx-neutral">
                                                            {_.truncate(
                                                                updateBusinessProfile?.ffUpdated
                                                                    ?.user?.email ??
                                                                    ffProfile?.result?.email,
                                                                {
                                                                    length: 24,
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`material-icons text-mvx-black text-lg`}
                                                >
                                                    done
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex-col hidden max-lg:flex">
                                                    {navLinks.map((linkItem, idx) => {
                                                        return (
                                                            <Link
                                                                key={linkItem.title}
                                                                to={linkItem.path}
                                                                onClick={() => setActiveLink(idx)}
                                                                className={`text-sm font-rocGroteskMedium px-4 py-2.5 hover:bg-mvx-light-blue rounded ${
                                                                    activeLink === idx &&
                                                                    "bg-mvx-light-blue"
                                                                }`}
                                                            >
                                                                {linkItem.title}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                                <a
                                                    href="/dashboard/settings?tab=team"
                                                    className="text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2.5 cursor-pointer"
                                                >
                                                    Invite team members
                                                </a>
                                                <a
                                                    href="/dashboard/settings?tab=bank"
                                                    className="text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2.5 cursor-pointer"
                                                >
                                                    Bank account
                                                </a>
                                                <a
                                                    href="/dashboard/settings"
                                                    className="text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2.5 cursor-pointer"
                                                >
                                                    Settings
                                                </a>
                                                <p
                                                    onClick={logOut}
                                                    className="text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-1.5 cursor-pointer flex items-center justify-between"
                                                >
                                                    <span className="text-inherit">Log out</span>
                                                    <i className="ri-arrow-right-line before:text-lg before:content-['\ea6c']"></i>
                                                </p>
                                            </div>
                                            {!getSubscriptionSuccess && <hr />}
                                            {!getSubscriptionSuccess && (
                                                <div className=" py-3 px-4">
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                "/dashboard/settings?subscription=true"
                                                            )
                                                        }
                                                        className="text-white bg-pacific-cyan py-2 px-4 w-full rounded text-sm font-rocGroteskMedium"
                                                    >
                                                        Upgrade to Pro
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </div>
                {/* </div> */}
            </nav>

            {getTradeAllyApp && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[65%] max-lg:w-[85%] max-sm:w-[95%]"
                    closeModal={() => {
                        setGetTradeAllyApp(false);
                    }}
                >
                    <div className="bg-white rounded-lg w-full flex max-sm:flex-col-reverse shadow-modalShadow">
                        <div className="w-1/2 max-sm:w-full h-auto max-sm:h-[320px] bg-white relative flex flex-col items-center justify-center max-sm:justify-start rounded-tl-lg rounded-bl-lg">
                            <div className="w-[80%] max-sm:pt-4">
                                <p className="font-rocGroteskBold text-[40px] max-sm:text-2xl text-center">
                                    Introducing: The Fleet+ app
                                </p>
                                <p className="text-base text-center mb-12 max-sm:mb-3">
                                    All the tools you need to connect with global freight partners
                                    and grow your business
                                </p>
                                <p className="font-rocGroteskMedium text-base text-center">
                                    Now available on{" "}
                                    <a
                                        href="https://apps.apple.com/us/app/fleetplus/id6444654640"
                                        target={"_blank"}
                                        rel="noreferrer"
                                        className="underline"
                                    >
                                        iOS
                                    </a>{" "}
                                    and{" "}
                                    <a
                                        href="https://play.google.com/store/search?q=fleetplus&c=apps"
                                        target={"_blank"}
                                        rel="noreferrer"
                                        className="underline"
                                    >
                                        Android
                                    </a>
                                </p>
                            </div>

                            <div className="p-6  border-t w-full bg-white absolute bottom-0 z-30">
                                <a
                                    href={getOperatingSystem()}
                                    target={"_blank"}
                                    rel="noreferrer"
                                    className="bg-mvx-orange text-white cursor-pointer rounded text-sm font-rocGroteskBold flex justify-center items-center py-3 w-full"
                                >
                                    Get the app
                                </a>
                            </div>
                        </div>
                        <div className="w-1/2 max-sm:w-full h-full bg-mvx-light-blue flex justify-center relative px-6 pt-6 rounded-tr-lg rounded-br-lg">
                            <div className="absolute right-[24px] z-30">
                                <div
                                    onClick={() => setGetTradeAllyApp(false)}
                                    className="flex cursor-pointer items-center justify-center rounded-full bg-[#EBECF0] w-8 h-8"
                                >
                                    <i className="ri-close-fill"></i>
                                </div>
                            </div>
                            <div className="relative mt-[102px]">
                                <img
                                    src={newTag}
                                    alt="new tag"
                                    className="w-[60px] h-[60px] absolute top-[-30px] z-30"
                                />
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687268639/Web%20App/dashboard/mobileApp_kpz6s6.svg"
                                    }
                                    alt="Fleet+ App"
                                    className="max-sm:h-[330px] min-h-[420px]"
                                />
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {folderGuide && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-fit max-lg:w-[85%] max-sm:w-[95%] absolute top-[68px] left-[50%] z-30"
                >
                    <div className="bg-white w-[650px] rounded shadow-modalShadow">
                        <div className="w-full h-full flex ">
                            <div className="w-[55%] rounded-l bg-[url('https://res.cloudinary.com/dvxi7qcmd/image/upload/v1690290814/Web%20App/product_guide/folder_guide_a1geyb.gif')] bg-cover"></div>
                            <div className="w-[45%] bg-white p-6 rounded-r">
                                <div className="mb-6">
                                    <p className="text-lg font-rocGroteskBold mb-1">
                                        Folder management
                                    </p>
                                    <p className="text-[13px] font-rocGroteskMedium">
                                        To store and manage documents related to your shipments,
                                        click on the "Folder" tab. You can upload, download, view
                                        documents.
                                    </p>
                                </div>
                                <div className="w-full flex justify-end">
                                    <button
                                        onClick={() => {
                                            setFolderGuide(false);
                                            navigate("/dashboard/folders");
                                        }}
                                        className="w-fit bg-pacific-cyan py-2 px-4 rounded text-sm"
                                    >
                                        Okay, got it
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {shipmentGuide && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-fit max-lg:w-[85%] max-sm:w-[95%] absolute top-[68px] left-[40%] z-30"
                >
                    <div className="bg-white w-[650px] rounded shadow-modalShadow">
                        <div className="w-full h-full flex ">
                            <div className="w-[55%] rounded-l bg-[url('https://res.cloudinary.com/dvxi7qcmd/image/upload/v1690291078/Web%20App/product_guide/shipment_guide_mtlyc1.gif')] bg-cover"></div>
                            <div className="w-[45%] bg-white p-6 rounded-r">
                                <div className="mb-6">
                                    <p className="text-lg font-rocGroteskBold mb-1">Shipment</p>
                                    <p className="text-[13px] font-rocGroteskMedium">
                                        All your shipments will appear here, regardless of their
                                        status, such as active, pending, new, and so on. Start
                                        earning by creating a shipment or responding to a quote
                                    </p>
                                </div>
                                <div className="w-full flex justify-end">
                                    <button
                                        onClick={() => {
                                            const selectedNavLink =
                                                document.getElementsByClassName("nav-dropdown-1");
                                            setShipmentGuide(false);
                                            selectedNavLink?.[0]?.click();
                                        }}
                                        className="w-fit bg-pacific-cyan py-2 px-4 rounded text-sm"
                                    >
                                        Okay, got it
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {downloadAppGuide && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-fit max-lg:w-[85%] max-sm:w-[95%] absolute top-[68px] right-[10%] z-30"
                >
                    <div className="bg-white w-[354px] h-[429px] rounded-t shadow-modalShadow">
                        <div className="w-full h-full ">
                            <div className="w-full h-[57%] rounded-t bg-[url('https://res.cloudinary.com/dvxi7qcmd/image/upload/v1690272530/Web%20App/product_guide/download_app_guide_qtzby0.png')] bg-cover "></div>
                            <div className="w-full bg-white p-6 rounded-b">
                                <div className="mb-6">
                                    <p className="text-lg font-rocGroteskBold mb-1">
                                        Download the Fleet+ app
                                    </p>
                                    <p className="text-[13px] font-rocGroteskMedium">
                                        All the tools you need to grow business and connect with
                                        global freight partners for you business. Now available on
                                        iOS and Android
                                    </p>
                                </div>
                                <div className="w-full flex justify-end">
                                    <button
                                        onClick={() => {
                                            setDownloadAppGuide(false);
                                            window.open(getOperatingSystem(), "_blank");
                                        }}
                                        className="w-fit bg-pacific-cyan py-2 px-4 rounded text-sm"
                                    >
                                        Get the app
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            <Notifications
                isActive={openNotifications}
                closeNotification={() => setOpenNotifications(false)}
            />
        </div>
    );
};

export default NavTwo;
