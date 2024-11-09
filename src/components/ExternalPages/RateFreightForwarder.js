import { shipmentActions } from "actions";
import Loader from "components/common/Loader";
import NavOne from "components/common/NavOne";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const RateFreightForwarder = () => {
    const [rated, setRated] = useState(null);
    const [rating, setRating] = useState(null);
    const [review, setReview] = useState("");
    const { shipmentId } = useParams();
    const dispatch = useDispatch();
    const ratingText = ["bad", "fair", "average", "good", "great"];
    const [isRated, setIsRated] = useState(false);
    const navigate = useNavigate();
    const { ffCustomerShipmentLoading, ffCustomerShipment, isSendingRating, isRatingCoomplete } =
        useSelector((state) => state.shipment);

    const deliveryDate = ffCustomerShipment?.shippingStatus.find(
        (item) => item?.status === "delivered"
    );

    const handleRate = () => {
        const data = {
            review,
            shipmentId: ffCustomerShipment?._id,
            rating: rated,
        };

        dispatch(shipmentActions.sendRating(JSON.stringify(data)));
    };

    useEffect(() => {
        if (shipmentId) {
            dispatch(shipmentActions.fetchFFSingleShipmentForCustomer(shipmentId));
        }
    }, [shipmentId, dispatch]);

    useEffect(() => {
        if (isRatingCoomplete) {
            setReview("");
            navigate(`/profile/${ffCustomerShipment?.freightForwarder?._id}`);
        }
    }, [isRatingCoomplete, ffCustomerShipment?.freightForwarder?._id, navigate]);

    if (ffCustomerShipmentLoading || !ffCustomerShipment) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col items-center justify-between w-full">
            <div className="w-full">
                <NavOne />
                <div className="flex justify-center items-center mb-12 py-7 px-8 bg-[#FAFBFC] border-b border-[#DFE1E6] max-lg:hidden">
                    <div className="grid grid-cols-3 gap-16">
                        <p className="text-base text-mvx-black">
                            <span className="font-rocGroteskBold">Shipment ID: </span>
                            <span className="font-rocGroteskMedium">{ffCustomerShipment?._id}</span>
                        </p>
                        <p className="text-base text-mvx-black">
                            <span className="font-rocGroteskBold">Devilery date: </span>
                            <span className="font-rocGroteskMedium">
                                {moment(deliveryDate?.time).format("DD MMM YYYY hh:mm")}
                            </span>
                        </p>
                        <p className="text-base text-mvx-black">
                            <span className="font-rocGroteskBold">Freight Forwarder: </span>
                            <span className="font-rocGroteskMedium">
                                {ffCustomerShipment?.freightForwarder?.profile?.businessName}{" "}
                            </span>
                        </p>
                    </div>
                </div>
                {!isRated && (
                    <div className="text-mvx-black max-lg:flex max-lg:h-[calc(100%-65px)] max-lg:items-center max-lg:w-full max-lg:absolute">
                        <div className="flex flex-col w-full items-center gap-8 justify-center max-lg:mt-[-24px]">
                            <p className="text-[32px] text-center font-rocGroteskBold w-[27%] max-lg:w-full">
                                How was your shipment delivery with{" "}
                                {ffCustomerShipment?.freightForwarder?.profile?.businessName}?
                            </p>
                            <div>
                                {Array(5)
                                    .fill(0)
                                    .map((_, idx) => {
                                        return (
                                            <span
                                                key={idx}
                                                className="material-icons text-4xl cursor-pointer"
                                                onMouseLeave={() => {
                                                    setRating(rated);
                                                }}
                                                onMouseEnter={() => {
                                                    setRating(idx + 1);
                                                }}
                                                onClick={() => {
                                                    setRated(idx + 1);
                                                }}
                                            >
                                                {(rating && rating >= idx + 1) ||
                                                (rated && rated >= idx + 1)
                                                    ? "star"
                                                    : "star_border"}
                                            </span>
                                        );
                                    })}
                            </div>
                            <p className="font-rocGroteskMedium text-base capitalize">
                                {ratingText[rating - 1]}
                            </p>
                            {rated && (
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setIsRated(true)}
                                        className="text-white text-sm font-rocGroteskMedium max-lg:w-full flex items-center justify-center bg-mvx-black py-3 px-6"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {isRated && (
                    <div className="text-mvx-black max-lg:h-[calc(90vh-65px)] flex items-center">
                        <div className="flex flex-col items-center gap-8 justify-center w-full">
                            <div className="w-[37%] max-sm:w-full max-lg:w-1/2">
                                <p className="text-[32px] max-sm:px-6 text-center font-rocGroteskBold whitespace-nowrap max-xl:whitespace-normal">
                                    Share feedback about this shipment
                                </p>
                                <p className="text-base max-sm:px-6 font-rocGroteskMedium text-center mb-14">
                                    This feedback is just for this shipment. Tell the Freight
                                    Forwarder and future shipper what you like about your shipment.
                                </p>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleRate();
                                    }}
                                    className="mx-4"
                                >
                                    <p className="text-base font-rocGroteskMedium mb-1">
                                        Review your shipment
                                    </p>
                                    <textarea
                                        className="border w-full py-2 px-3 resize-none "
                                        placeholder="Write a review"
                                        value={review}
                                        onChange={(event) => setReview(event.target.value)}
                                        rows={7}
                                        required
                                    />
                                    <div className="flex justify-end mt-6">
                                        <button
                                            type="submit"
                                            className={`${
                                                isSendingRating && "w-[168px] p-0"
                                            } text-white text-sm font-rocGroteskMedium max-lg:w-full flex items-center justify-center bg-mvx-black py-3 px-6`}
                                        >
                                            {isSendingRating ? (
                                                <Loader color="white" />
                                            ) : (
                                                <p className="text-inherit">Rate this shipment</p>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex mb-6 text-sm font-rocGroteskMedium">
                <p className="pr-4 border-r mr-4 ">
                    <span className="text-mvx-neutral">Powered by</span>{" "}
                    <span className="font-rocGroteskMedium text-mvx-neutral">TradeAlly</span>
                </p>
                <p className="flex gap-4">
                    <span className="text-mvx-neutral">Terms</span>
                    <span className="text-mvx-neutral">Privacy</span>
                </p>
            </div>
        </div>
    );
};

export default RateFreightForwarder;
