import { authActions } from "actions";
import Loader from "components/common/Loader";
import Navbar from "components/common/Navbar";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const Reviews = () => {
    const { ffProfileLoading, ffProfile } = useSelector((state) => state.auth);
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
            <div className="max-lg:hidden">
                <Navbar />
            </div>
            <div className="px-[112px] max-lg:px-8 hidden max-lg:block mt-12">
                <span className="material-icons" onClick={() => navigate(`/profile/${ffid}`)}>
                    arrow_back_ios
                </span>
            </div>
            <div className="px-[112px] max-lg:px-8 pb-12">
                {ffProfile?.feedbacks?.numberOfFeedbacks > 0 ? (
                    <div className="w-3/5 max-lg:w-full mt-10">
                        <h3 className="font-rocGroteskBold text-[22px] mb-10">
                            Customer reviews ({ffProfile?.feedbacks?.average.toFixed(1)})
                        </h3>
                        <div className="flex flex-col gap-14">
                            {ffProfile?.feedbacks?.feedbacks?.map((review) => {
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
                    </div>
                ) : (
                    <div className="h-[calc(100vh-65px)] flex flex-col justify-between items-center">
                        <div className="mt-12 px-4">
                            <p className="text-[28px] font-rocGroteskBold text-mvx-black text-center mb-4">
                                This Freight Forwarder has no Reviews
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;
