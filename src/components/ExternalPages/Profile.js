// import { ShareIcon } from "assets/arts";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "components/common/Footer";
import { convertStoMs } from "helpers/convertSecondsToMinutes";
import { regionNames } from "helpers/getCountryNameFromCountryCode";
import ReactCountryFlag from "react-country-flag";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "actions";
import Navbar from "components/common/Navbar";
import Loader from "components/common/Loader";
import moment from "moment";

const Profile = () => {
    const { ffProfileLoading, ffProfile } = useSelector((state) => state.auth);
    const [isCopied, setIsCopied] = useState(false);
    const { ffid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(authActions.fetchFreightForwarderProfile(ffid));
    }, [ffid, dispatch]);

    if (ffProfileLoading || !ffProfile) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            <div className="w-full h-[160px] bg-mvx-light-blue max-sm:flex max-sm:justify-end max-sm:pt-4 max-sm:px-[22px] max-sm:items-start">
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setIsCopied(true);
                    }}
                    className="hidden max-sm:flex text-mvx-black text-base items-center justify-center bg-white border p-3.5"
                >
                    {isCopied ? (
                        <span className="material-icons text-green-700">check_circle</span>
                    ) : (
                        // <ShareIcon />
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687258567/Web%20App/external_pages/icons/share_qtouze.svg"
                            }
                            alt="Share Icon"
                        />
                    )}
                </button>
            </div>

            <div className="bg-white relative px-[112px] max-lg:px-8 pt-[87px] pb-[190px]">
                <div className="flex absolute top-[-80px]">
                    <div className="shadow rounded-lg  w-[145px] h-[145px] flex items-center justify-center">
                        <img
                            src={ffProfile?.result?.profile?.logo}
                            className="object-cover w-full h-full rounded-lg "
                            alt="logo"
                        />
                    </div>
                </div>

                <div className="flex w-full relative ">
                    <div className="w-[53%] max-lg:w-full">
                        <div className="flex items-center gap-4">
                            <span className="font-rocGroteskBold text-[32px] ">
                                {ffProfile?.result?.profile?.businessName}
                            </span>
                            <span>
                                {/* <VerifiedProfileIcon /> */}
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687188291/Web%20App/external_pages/icons/verifiedChecked_pzmxiu.svg"
                                    }
                                    alt="verified icon"
                                />
                            </span>
                        </div>
                        <div className="flex flex-wrap text-sm font-rocGroteskMedium items-center gap-2 mb-6">
                            <>
                                <p className="flex gap-2 items-center whitespace-nowrap max-lg:whitespace-normal">
                                    <span className="material-icons text-mvx-black mt-[-2px] text-sm">
                                        star
                                    </span>
                                    <a href="#reviews" className="underline">
                                        {ffProfile?.feedbacks?.average.toFixed(1)} (
                                        {ffProfile?.feedbacks?.numberOfFeedbacks}{" "}
                                        {ffProfile?.feedbacks?.numberOfFeedbacks > 1
                                            ? "reviews"
                                            : "review"}
                                        )
                                    </a>
                                </p>
                                <div className="rounded-full bg-mvx-black p-[2.5px]" />
                            </>

                            <p className="whitespace-nowrap max-lg:whitespace-normal">
                                {ffProfile?.result?.mobile}
                            </p>
                            <div className="rounded-full bg-mvx-black p-[2.5px]" />
                            <p className="">
                                {ffProfile?.result?.profile?.businessAddress?.address}
                            </p>
                        </div>
                        <div className="mb-6">
                            <p className="font-rocGroteskMedium text-sm leading-6">
                                {ffProfile?.result?.profile?.description}
                            </p>
                        </div>
                        <div className="flex gap-4 font-rocGroteskMedium mb-8">
                            <button
                                onClick={() => navigate(`/request-quote/${ffid}`)}
                                className="text-white text-base flex items-center justify-center bg-mvx-black py-3 px-6"
                            >
                                Request a quote
                            </button>
                            <button
                                onClick={() => navigate(`/search-tracking-number/${ffid}`)}
                                className="text-mvx-black text-base flex items-center justify-center bg-white border py-3 px-6"
                            >
                                Track shipment
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setIsCopied(true);
                                }}
                                className="max-sm:hidden text-mvx-black text-base flex items-center justify-center bg-white border p-3.5"
                            >
                                {isCopied ? (
                                    <span className="material-icons text-green-700">
                                        check_circle
                                    </span>
                                ) : (
                                    // <ShareIcon />
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687258567/Web%20App/external_pages/icons/share_qtouze.svg"
                                        }
                                        alt="Share Icon"
                                    />
                                )}
                            </button>
                        </div>
                        <div className="w-full mt-4 mb-7 hidden max-lg:flex">
                            <div className="border w-[65%] max-sm:w-full h-fit shadow-[0_0_5px_rgba(0,0,0,0.05),0_25px_35px_rgba(0,0,0,0.03)]">
                                <div className="flex p-6 border-b items-center gap-4">
                                    <span className="material-icons text-2xl">favorite</span>
                                    <div>
                                        <p className="font-rocGroteskBold text-base mb-0.5">
                                            {ffProfile?.stats?.total}
                                        </p>
                                        <p className="font-rocGroteskMedium text-sm text-mvx-neutral">
                                            Shipment requests count
                                        </p>
                                    </div>
                                </div>
                                <div className="flex p-6 border-b items-center gap-4">
                                    <span className="material-icons">star</span>
                                    <div>
                                        <p className="font-rocGroteskBold text-base mb-0.5">
                                            {ffProfile?.stats?.fufilled}
                                        </p>
                                        <p className="font-rocGroteskMedium text-sm text-mvx-neutral">
                                            Fulfilled shipment count
                                        </p>
                                    </div>
                                </div>
                                <div className="flex p-6 border-b items-center gap-4">
                                    <span className="material-icons">check_circle</span>
                                    <div>
                                        <p className="font-rocGroteskBold text-base mb-0.5">
                                            {convertStoMs(ffProfile?.stats?.matchTotal)}
                                        </p>
                                        <p className="font-rocGroteskMedium text-sm text-mvx-neutral">
                                            Quote Response Time
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-8">
                            <p className="mb-1 text-base font-rocGroteskBold">Services offered</p>
                            <div className="font-rocGroteskMedium text-sm flex gap-[6px] items-center">
                                <span>Import</span>
                                <div className="rounded-full bg-mvx-black p-[2.5px]" />
                                <span>Export</span>
                                <div className="rounded-full bg-mvx-black p-[2.5px]" />
                                <span>Haulage</span>
                                <div className="rounded-full bg-mvx-black p-[2.5px]" />
                                <span>Customs</span>
                            </div>
                        </div>
                        <div className="mb-8">
                            <p className="mb-1 text-base font-rocGroteskBold">Mode of Shipment</p>
                            <div className="font-rocGroteskMedium text-sm flex gap-[6px] items-center">
                                {ffProfile?.result?.profile?.mode?.map((name, idx) => {
                                    return (
                                        <div key={name} className="flex items-center gap-[6px]">
                                            <span className="capitalize">{name}</span>
                                            {ffProfile?.result?.profile?.mode?.length !==
                                                idx + 1 && (
                                                <div className="rounded-full bg-mvx-black p-[2.5px]" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="mb-1 text-base font-rocGroteskBold">Trade Lane</p>
                            <div className="font-rocGroteskMedium text-mvx-neutral w-fit text-sm grid grid-cols-[1fr_1fr_1fr] max-sm:grid-cols-[1fr] max-lg:grid-cols-[1fr_1fr]">
                                {ffProfile?.result?.profile?.tradeLanes?.map(
                                    ({ _id, from, to }, idx) => {
                                        return (
                                            <span
                                                key={_id}
                                                className={`px-4 py-2.5 border flex items-center justify-center gap-2 whitespace-nowrap`}
                                            >
                                                <ReactCountryFlag countryCode={from} />{" "}
                                                {regionNames.of(from)}{" "}
                                                <i className="ri-arrow-left-right-line"></i>{" "}
                                                <ReactCountryFlag countryCode={to} />{" "}
                                                {regionNames.of(to)}
                                            </span>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-[47%] flex max-lg:hidden justify-end">
                        <div className="border mt-[66px] w-[65%] h-fit shadow-[0_0_5px_rgba(0,0,0,0.05),0_25px_35px_rgba(0,0,0,0.03)]">
                            <div className="flex p-6 border-b items-center gap-4">
                                <span className="material-icons text-2xl">favorite</span>
                                <div>
                                    <p className="font-rocGroteskBold text-base mb-0.5">
                                        {ffProfile?.stats?.total}
                                    </p>
                                    <p className="font-rocGroteskMedium text-sm text-mvx-neutral">
                                        Shipment requests count
                                    </p>
                                </div>
                            </div>
                            <div className="flex p-6 border-b items-center gap-4">
                                <span className="material-icons">star</span>
                                <div>
                                    <p className="font-rocGroteskBold text-base mb-0.5">
                                        {ffProfile?.stats?.fufilled}
                                    </p>
                                    <p className="font-rocGroteskMedium text-sm text-mvx-neutral">
                                        Fulfilled shipment count
                                    </p>
                                </div>
                            </div>
                            <div className="flex p-6 border-b items-center gap-4">
                                <span className="material-icons">check_circle</span>
                                <div>
                                    <p className="font-rocGroteskBold text-base mb-0.5">
                                        {convertStoMs(ffProfile?.stats?.matchTotal)}
                                    </p>
                                    <p className="font-rocGroteskMedium text-sm text-mvx-neutral">
                                        Quote Response Time
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {ffProfile?.feedbacks?.numberOfFeedbacks > 0 && (
                    <div className="w-3/5 max-lg:w-full mt-20" id="reviews">
                        <h3 className="font-rocGroteskBold text-[22px] mb-10">
                            Customer reviews ({ffProfile?.feedbacks?.average.toFixed(1)})
                        </h3>
                        <div className="flex flex-col gap-14">
                            {ffProfile?.feedbacks?.feedbacks?.slice(0, 4)?.map((review) => {
                                return (
                                    <div key={review?._id}>
                                        <div className="mb-4">
                                            <h4 className="font-rocGroteskBold text-base mb-2.5">
                                                {review?.shipment?.shipperDetails?.fullName}
                                            </h4>
                                            <div className="flex items-center gap-5">
                                                <div className="flex gap-1 mt-[-5px]">
                                                    {Array(5)
                                                        .fill(0)
                                                        .map((_, idx) => {
                                                            return (
                                                                <span
                                                                    key={idx}
                                                                    className={`material-icons text-2xl ${
                                                                        idx + 1 > review?.rating &&
                                                                        "text-[#DFE1E6]"
                                                                    }`}
                                                                >
                                                                    star
                                                                </span>
                                                            );
                                                        })}
                                                </div>
                                                <div>
                                                    <p className="text-base font-rocGroteskMedium ">
                                                        {moment(review?.createdAt).format(
                                                            "DD MMMM YYYY"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="font-rocGroteskMedium text-base">
                                            {review?.review}
                                        </p>
                                        <div className="flex gap-6 mt-2 max-lg:grid max-lg:grid-cols-[1fr_1fr_1fr] max-sm:grid-cols-[1fr] max-sm:gap-2">
                                            <p className="border-r max-sm:border-none pr-6 font-rocGroteskMedium whitespace-nowrap flex items-center max-lg:whitespace-normal capitalize text-mvx-neutral">
                                                Mode: {review?.shipment?.serviceMode}
                                            </p>
                                            <p className="border-r max-sm:border-none pr-6 font-rocGroteskMedium whitespace-nowrap flex items-center max-lg:whitespace-normal capitalize text-mvx-neutral">
                                                Service Type: {review?.shipment?.serviceType}
                                            </p>
                                            <p className="border-r max-sm:border-none pr-6 font-rocGroteskMedium  whitespace-nowrap flex items-center max-lg:whitespace-normal capitalize text-mvx-neutral">
                                                Origin: {review?.shipment?.origin?.address}
                                            </p>
                                            <p className="font-rocGroteskMedium capitalize whitespace-nowrap flex items-center max-lg:whitespace-normal text-mvx-neutral">
                                                Destination:{" "}
                                                {review?.shipment?.destination?.address}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="hidden max-sm:block">
                            <button
                                onClick={() => navigate(`/reviews/${ffid}`)}
                                className="w-full mt-6 font-rocGroteskMedium text-mvx-black text-base flex items-center justify-center bg-white border py-3 px-6"
                            >
                                Show all reviews
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
