import NavTwo from "components/common/NavTwo";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ModalContainer from "components/common/ModalContainer";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "actions/appActions";
import { getCurrencyFromCurrencyCode, isMobile } from "helpers";
import moment from "moment";
import _ from "lodash";
import Loader from "components/common/Loader";
import { formatMoney } from "helpers/formatMoney";

const Referral = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [shareLinkModal, setShareModal] = useState(false);
    const [sharedLink, setSharedLink] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [confirmed, setConfirmed] = useState([]);
    const [pending, setPending] = useState([]);
    const referralRef = useRef(null);
    const [currentPage, setCurrentPage] = useState({
        confirmedReferralsPage: 1,
        pendingReferralsPage: 1,
    });
    const [referralPagination, setReferralPangination] = useState({
        confirmed: {},
        pending: {},
    });
    const dispatch = useDispatch();
    const {
        referralWallet,
        referralWalletLoading,
        confirmedReferrals,
        confirmedReferralsLoading,
        pendingReferrals,
        pendingReferralsLoading,
    } = useSelector((state) => state.app);
    const { ffProfile } = useSelector((state) => state.auth);

    const displayReferrals = () => {
        switch (activeTab) {
            case 0:
                return confirmed?.map((item) => {
                    const initials =
                        (item?.referree?.fullName?.split(" ")?.[0]?.[0]?.toUpperCase() ?? "") +
                        (item?.referree?.fullName?.split(" ")?.[1]?.[0]?.toUpperCase() ?? "");

                    return (
                        <div
                            key={item?._id}
                            className="flex py-[18px] justify-between items-center"
                        >
                            <div className=" flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full text-sm flex justify-center items-center text-white bg-gun-metal">
                                    {initials}
                                </div>
                                <div>
                                    <p className="capitalize font-rocGroteskMedium text-sm text-gun-metal">
                                        {item?.referree?.fullName}
                                    </p>
                                    <p className="font-rocGroteskMedium text-xs text-mvx-neutral">
                                        Signed up:{" "}
                                        {moment(item?.createdAt).format("DD.MM.YYYY, hh:mm a")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                });

            case 1:
                return pending?.map((item) => {
                    const initials =
                        (item?.referree?.fullName?.split(" ")?.[0]?.[0]?.toUpperCase() ?? "") +
                        (item?.referree?.fullName?.split(" ")?.[1]?.[0]?.toUpperCase() ?? "");

                    return (
                        <div
                            key={item?._id}
                            className="flex py-[18px] justify-between items-center"
                        >
                            <div className=" flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full text-sm flex justify-center items-center text-white bg-gun-metal">
                                    {initials}
                                </div>
                                <div>
                                    <p className="capitalize font-rocGroteskMedium text-sm text-gun-metal">
                                        {item?.referree?.fullName}
                                    </p>
                                    <p className="font-rocGroteskMedium text-xs text-mvx-neutral">
                                        Signed up:{" "}
                                        {moment(item?.createdAt).format("DD.MM.YYYY, hh:mm a")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                });

            default:
                break;
        }
    };

    const onScroll = useCallback(() => {
        let scrollTop = referralRef?.current?.scrollTop;
        const scrollHeight = referralRef?.current?.scrollHeight;
        const clientHeight = referralRef?.current?.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
            switch (activeTab) {
                case 0: {
                    if (
                        currentPage.confirmedReferralsPage <
                        referralPagination?.confirmed?.number_of_pages
                    ) {
                        setCurrentPage((prev) => {
                            return {
                                ...prev,
                                confirmedReferralsPage: prev.confirmedReferralsPage + 1,
                            };
                        });
                    }

                    break;
                }
                case 1: {
                    if (
                        currentPage.pendingReferralsPage <
                        referralPagination?.pending?.number_of_pages
                    ) {
                        setCurrentPage((prev) => {
                            return {
                                ...prev,
                                pendingReferralsPage: prev.pendingReferralsPage + 1,
                            };
                        });
                    }

                    break;
                }

                default:
                    break;
            }
        }
    }, [
        activeTab,
        currentPage?.confirmedReferralsPage,
        currentPage.pendingReferralsPage,
        referralPagination?.confirmed?.number_of_pages,
        referralPagination?.pending?.number_of_pages,
    ]);

    useEffect(() => {
        dispatch(appActions.getReferralWallet());
    }, [dispatch]);

    useEffect(() => {
        dispatch(appActions.getConfirmedReferrals(currentPage.confirmedReferralsPage));
    }, [dispatch, currentPage.confirmedReferralsPage]);

    useEffect(() => {
        dispatch(appActions.getPendingReferrals(currentPage.pendingReferralsPage));
    }, [dispatch, currentPage.pendingReferralsPage]);

    useEffect(() => {
        if (Boolean(confirmedReferrals)) {
            setConfirmed((prevState) =>
                _.uniqWith([...prevState, ...confirmedReferrals?.data], _.isEqual)
            );
            setReferralPangination((prev) => ({
                ...prev,
                confirmed: confirmedReferrals?.pagination,
            }));
        }
    }, [confirmedReferrals]);

    useEffect(() => {
        if (Boolean(pendingReferrals)) {
            setPending((prevState) =>
                _.uniqWith([...prevState, ...pendingReferrals?.data], _.isEqual)
            );
            setReferralPangination((prev) => ({ ...prev, pending: pendingReferrals?.pagination }));
        }
    }, [pendingReferrals]);

    if (referralWalletLoading || confirmedReferralsLoading || pendingReferralsLoading) {
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
                <div className="mt-16 flex gap-[147px] px-[104px]">
                    <div className="w-1/2">
                        <p className="text-lg font-rocGroteskBold mb-6">Referral</p>
                        <div className="flex gap-6">
                            <div>
                                <p>
                                    <span className="text-base font-rocGroteskBold">
                                        {getCurrencyFromCurrencyCode(
                                            referralWallet?.data?.amountUsed?.currency
                                        )}
                                    </span>
                                    <span className="text-3xl font-rocGroteskBold">
                                        {formatMoney().format(
                                            referralWallet?.data?.amountUsed?.amount
                                        )}
                                    </span>
                                </p>
                                <p className="text-sm font-rocGroteskRegular">
                                    Total Referral Earnings
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="text-base font-rocGroteskBold">
                                        {getCurrencyFromCurrencyCode(
                                            referralWallet?.data?.currentBalance?.currency
                                        )}
                                    </span>
                                    <span className="text-3xl font-rocGroteskBold">
                                        {formatMoney().format(
                                            referralWallet?.data?.currentBalance?.amount
                                        )}
                                    </span>
                                </p>
                                <p className="text-sm font-rocGroteskRegular">Earnings Balance</p>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-3">
                            {/* <Dropdown
                                value={""}
                                dropdown={
                                    <button
                                        className="flex items-center justify-center bg-gun-metal text-white font-rocGroteskMedium w-fit py-2 px-6 text-sm rounded"
                                        type={"button"}
                                    >
                                        <span className="text-inherit">Invite via email</span>
                                    </button>
                                }
                                dropdownContainerClasses={
                                    "left-[-2px] top-[40px] !w-[511px] shadow-dropdownShadow rounded"
                                }
                                dropdownItemsClasses={"last:text-[#FF0000]"}
                                name={"bank option"}
                                dropdownOptions={[
                                    {
                                        customChild: (
                                            <div>
                                                <div className="px-6 pb-4 pt-2 border-b">
                                                    <p className="font-rocGroteskMedium text-base">
                                                        Invite people
                                                    </p>
                                                </div>
                                                <div className="p-6">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={""}
                                                            placeholder="Enter email address"
                                                            className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                            required
                                                            name="referralLink"
                                                            // onChange={(event) =>
                                                            //     handleInputChange(
                                                            //         event.target.name,
                                                            //         event.target.value
                                                            //     )
                                                            // }
                                                        />
                                                        <button
                                                            className="flex items-center justify-center bg-gun-metal whitespace-nowrap text-white font-rocGroteskMedium w-fit py-3 px-6 text-sm rounded"
                                                            type={"button"}
                                                        >
                                                            Share link
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    },
                                ]}
                            /> */}

                            <button
                                className="flex items-center justify-center gap-2 bg-mvx-light-blue text-gun-metal font-rocGroteskMedium w-fit py-2 px-6 text-sm rounded"
                                type={"button"}
                                onClick={() => setShareModal(true)}
                            >
                                <span className="text-inherit">Share your link</span>
                                <i className="ri-link"></i>
                            </button>
                        </div>
                        <div className="mt-8">
                            <div>
                                <div className="flex gap-4">
                                    <div
                                        className={`flex gap-1 items-center
                                                ${activeTab === 0 && "border-b-2 border-gun-metal"}
                                            w-fit py-3 cursor-pointer`}
                                        onClick={() => setActiveTab(0)}
                                    >
                                        <p
                                            className={`text-sm capitalize font-rocGroteskMedium ${
                                                activeTab === 0
                                                    ? "text-gun-metal"
                                                    : " text-mvx-neutral"
                                            } px-5`}
                                        >
                                            <span className="text-inherit">Confirmed</span>
                                            <span className="text-inherit"></span>
                                        </p>
                                    </div>
                                    <div
                                        className={`flex gap-1 items-center
                                                ${activeTab === 1 && "border-b-2 border-gun-metal"}
                                            w-fit py-3 cursor-pointer`}
                                        onClick={() => setActiveTab(1)}
                                    >
                                        <p
                                            className={`text-sm capitalize font-rocGroteskMedium ${
                                                activeTab === 1
                                                    ? "text-gun-metal"
                                                    : " text-mvx-neutral"
                                            } px-5`}
                                        >
                                            Pending
                                        </p>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        </div>
                        <div
                            onScroll={onScroll}
                            ref={referralRef}
                            className="max-h-[400px] overflow-auto"
                        >
                            {displayReferrals()}
                            {(confirmedReferralsLoading || pendingReferralsLoading) && (
                                <div className="flex w-full mt-2 justify-center">
                                    <Loader color={"gun-metal"} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div className="bg-white">
                            <div className="w-full h-[255px] rounded-t bg-[url('assets/images/referral.svg')] bg-cover bg-no-repeat"></div>
                            <div className="rounded-b shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                                <div className="py-7 px-12 ">
                                    <div className="mb-6">
                                        <p className="text-sm mb-1 font-rocGroteskMedium">
                                            Referral Link
                                        </p>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                defaultValue={`https://fleetplus.io/register?referralCode=${ffProfile?.result?.profile?.referralCode}`}
                                                placeholder={`https://fleetplus.io/register?referralCode=${ffProfile?.result?.profile?.referralCode}`}
                                                className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                disabled
                                                name="referralLink"
                                            />
                                            <button
                                                className="flex gap-2 items-center justify-center bg-gun-metal whitespace-nowrap text-white font-rocGroteskMedium w-fit py-3 px-6 text-sm rounded"
                                                type={"button"}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        `https://fleetplus.io/register?referralCode=${ffProfile?.result?.profile?.referralCode}`
                                                    );
                                                    setSharedLink(true);
                                                }}
                                            >
                                                <span className="text-inherit">
                                                    {sharedLink ? "Shared link" : "Share link"}
                                                </span>
                                                {sharedLink && (
                                                    <i className="ri-checkbox-circle-fill before:content-['\eb80'] before:text-pacific-cyan"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="">
                                        <p className="text-sm mb-1 font-rocGroteskMedium">
                                            Referral Code
                                        </p>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                defaultValue={
                                                    ffProfile?.result?.profile?.referralCode
                                                }
                                                placeholder={
                                                    ffProfile?.result?.profile?.referralCode
                                                }
                                                className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                disabled
                                                name="referralCode"
                                            />
                                            <button
                                                className="flex gap-2 items-center justify-center bg-gun-metal whitespace-nowrap text-white font-rocGroteskMedium w-fit py-3 px-6 text-sm rounded"
                                                type={"button"}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        ffProfile?.result?.profile?.referralCode
                                                    );
                                                    setCopiedCode(true);
                                                }}
                                            >
                                                <span className="text-inherit">
                                                    {copiedCode ? "Copied" : "Copy code"}
                                                </span>
                                                {copiedCode && (
                                                    <i className="ri-checkbox-circle-fill before:content-['\eb80'] before:text-pacific-cyan"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p className="font-rocGroteskMedium text-xs underline text-center pb-[18px]">
                                    View Terms & Conditions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {shareLinkModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[45%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        setShareModal(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="bg-white">
                            <div className="w-full h-[255px] rounded-t bg-[url('assets/images/referral.svg')] bg-cover bg-no-repeat"></div>
                            <div className="rounded-b shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                                <div className="py-7 px-12">
                                    <div className="mb-7">
                                        <p className="text-sm mb-1 font-rocGroteskMedium">
                                            Referral Link
                                        </p>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                defaultValue={`https://fleetplus.io/register?referralCode=${ffProfile?.result?.profile?.referralCode}`}
                                                placeholder={`https://fleetplus.io/register?referralCode=${ffProfile?.result?.profile?.referralCode}`}
                                                className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                name="referralLink"
                                                disabled
                                            />
                                            <button
                                                className="flex gap-2 items-center justify-center bg-gun-metal whitespace-nowrap text-white font-rocGroteskMedium w-fit py-3 px-6 text-sm rounded"
                                                type={"button"}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        `https://fleetplus.io/register?referralCode=${ffProfile?.result?.profile?.referralCode}`
                                                    );
                                                    setSharedLink(true);
                                                }}
                                            >
                                                <span className="text-inherit">
                                                    {sharedLink ? "Shared link" : "Share link"}
                                                </span>
                                                {sharedLink && (
                                                    <i className="ri-checkbox-circle-fill before:content-['\eb80'] before:text-pacific-cyan"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-xs text-mvx-neutral font-rocGroteskRegular">
                                            Referral Code
                                        </p>
                                        <p className="text-[32px] text-gun-metal font-rocGroteskBold mb-2">
                                            {ffProfile?.result?.profile?.referralCode}
                                        </p>
                                        <button
                                            className="flex gap-2 items-center leading-6 justify-center bg-mvx-light-blue whitespace-nowrap text-gun-metal font-rocGroteskMedium w-fit py-1.5 px-6 text-sm rounded"
                                            type={"button"}
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    ffProfile?.result?.profile?.referralCode
                                                );
                                                setCopiedCode(true);
                                            }}
                                        >
                                            <span className="text-inherit">
                                                {copiedCode ? "Copied" : "Copy code"}
                                            </span>
                                            {copiedCode && (
                                                <i className="ri-checkbox-circle-fill before:content-['\eb80'] before:text-pacific-cyan"></i>
                                            )}
                                        </button>
                                        <div className="mt-[17px] flex gap-1">
                                            <a
                                                href={`https://www.facebook.com/sharer/sharer.php?u=https://fleetplus.io/register?referralCode=${ffProfile?.result?.profile?.referralCode}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <div className="w-8 h-8 cursor-pointer rounded-full bg-mvx-light-blue flex items-center justify-center">
                                                    <i className="ri-facebook-fill"></i>
                                                </div>
                                            </a>

                                            <a
                                                className="twitter-share-button"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                data-size="large"
                                                href={`https://twitter.com/intent/tweet?text=Sign up on Fleetplus using my referral code ${ffProfile?.result?.profile?.referralCode} or click on the link: https://fleetplus.io/register?referralCode=${ffProfile?.result?.profile?.referralCode}`}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-mvx-light-blue flex items-center justify-center">
                                                    <i className="ri-twitter-fill"></i>
                                                </div>
                                            </a>

                                            <a
                                                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://fleetplus.io/register?referralCode=${ffProfile?.result?.profile?.referralCode}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <div className="w-8 h-8 cursor-pointer rounded-full bg-mvx-light-blue flex items-center justify-center">
                                                    <i className="ri-linkedin-box-fill"></i>
                                                </div>
                                            </a>

                                            <a
                                                href={`${
                                                    isMobile
                                                        ? "whatsapp"
                                                        : "https://api.whatsapp.com"
                                                }://send?text=Sign up on Fleetplus using my referral code ${
                                                    ffProfile?.result?.profile?.referralCode
                                                } or click on the link: https://fleetplus.io/register?referralCode=${
                                                    ffProfile?.result?.profile?.referralCode
                                                }`}
                                                target="_blank"
                                                action="share/whatsapp/share"
                                                rel="noopener noreferrer"
                                            >
                                                <div className="w-8 h-8 cursor-pointer rounded-full bg-mvx-light-blue flex items-center justify-center">
                                                    <i className="ri-whatsapp-fill"></i>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default Referral;
