import { useInfiniteQuery } from "@tanstack/react-query";
import Loader from "components/common/Loader";
import { quoteConstants } from "constants";
import React, { useEffect, useRef } from "react";
import { quoteService } from "services";
import { useIntersectionObserver } from "usehooks-ts";
import _ from "lodash";
import cargoImg from "assets/images/shipments/cargo.svg";
import moment from "moment";
import { RiCheckFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import useModal from "components/common/Modals/ModalProvider";
import { RxExternalLink } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const ApprovalQuotesListing = () => {
    const bottom = useRef(null);
    const navigate = useNavigate();
    const entry = useIntersectionObserver(bottom, {});
    const isVisible = !!entry?.isIntersecting;
    const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: [`${quoteConstants.FETCHING_APPROVAL_QUOTES_REQUEST}`],
        queryFn: ({ pageParam = 1 }) => quoteService.fetchInternalQuotes(pageParam),
        getNextPageParam: (lastPage, pages) => {
            const no_of_pages = lastPage?.data?.pagination?.number_of_pages;
            const nextPage = no_of_pages > pages.length ? pages.length + 1 : undefined;
            return nextPage;
        },
    });
    const { openModal } = useModal();
    const isEmpty = !data?.pages?.at(0)?.data?.data?.length;

    const goToEditQuote = (id) => navigate(`/dashboard/quotes/approval/edit/${id}`);

    const previewQuote = (id) => navigate(`/dashboard/quotes/approval/view/${id}`);

    useEffect(() => {
        if (isVisible && hasNextPage) {
            fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    return (
        <>
            <div className="border max-sm:border-none">
                <div className="max-sm:hidden w-full grid grid-cols-[0.5fr_1.5fr_2fr_1fr_1fr_1fr_0.9fr_0.4fr] gap-3 my-3 px-4">
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        ID
                    </div>
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        CUSTOMER
                    </div>

                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        ROUTE
                    </div>
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        TYPE
                    </div>
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        MODE
                    </div>

                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        DATE
                    </div>
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        ACTION
                    </div>
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        VIEW
                    </div>
                </div>

                {isEmpty && !isLoading && (
                    <div>
                        <hr />
                        <div className="flex flex-col items-center p-16 ">
                            <img width={42} className="mb-4" src={cargoImg} alt="cargo" />
                            <p className="text-center mb-1 text-lg text-gun-metal font-rocGroteskMedium">
                                No Quotes
                            </p>
                            <p className="text-center text-gun-metal text-sm">
                                You don't have any quotes.
                            </p>
                        </div>
                    </div>
                )}

                {!isEmpty && (
                    <div>
                        {data?.pages?.map((quotes, i) => (
                            <React.Fragment key={i}>
                                {quotes?.data?.data?.map((q) => (
                                    <div key={q?._id} className="hover:bg-[#FAFBFC] cursor-pointer">
                                        <hr />
                                        <div className="max-sm:hidden w-full grid grid-cols-[0.5fr_1.5fr_2fr_1fr_1fr_1fr_0.9fr_0.4fr] gap-3 py-3 px-4">
                                            <div
                                                className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal"
                                                onClick={() => goToEditQuote(q?._id)}
                                            >
                                                {q?._id?.slice(-6)}
                                            </div>
                                            <div
                                                className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal"
                                                onClick={() => goToEditQuote(q?._id)}
                                            >
                                                {_.truncate(q?.shipment?.shipperDetails?.fullName, {
                                                    length: 20,
                                                })}
                                            </div>
                                            <div
                                                className="capitalize flex items-center justify-between text-sm font-rocGroteskMedium text-gun-metal pr-2"
                                                onClick={() => goToEditQuote(q?._id)}
                                            >
                                                <span className="text-inherit text-left w-[42%]">
                                                    {q?.shipment?.origin?.address}
                                                </span>{" "}
                                                <span className="material-icons-outlined text-sm">
                                                    east
                                                </span>
                                                <span className="text-inherit text-right w-[42%]">
                                                    {q?.shipment?.destination?.address}
                                                </span>
                                            </div>
                                            <div className="flex justify-start gap-2 items-center text-sm font-rocGroteskMedium text-gun-metal">
                                                ---
                                            </div>
                                            <div className="flex justify-start gap-2 items-center text-sm font-rocGroteskMedium text-gun-metal">
                                                ---
                                            </div>

                                            <div
                                                className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal"
                                                onClick={() => goToEditQuote(q?._id)}
                                            >
                                                {moment(q?.createdAt).format("MMM DD, YYYY")}
                                            </div>
                                            <div
                                                className="flex items-center w-full"
                                                onClick={() => goToEditQuote(q?._id)}
                                            >
                                                {q?.status === "pending" ? (
                                                    <div className="flex items-center gap-6 w-full">
                                                        <div
                                                            className="w-8 h-8 flex items-center justify-center border border-gun-metal rounded-full cursor-pointer"
                                                            onClick={() =>
                                                                openModal("approve-quote", {
                                                                    quoteId: q?._id,
                                                                    type: "accept",
                                                                    quote: q,
                                                                })
                                                            }
                                                        >
                                                            <RiCheckFill className="text-xl" />
                                                        </div>

                                                        <div
                                                            className="w-8 h-8 flex items-center justify-center border border-gun-metal rounded-full cursor-pointer"
                                                            onClick={() =>
                                                                openModal("reject-quote", {
                                                                    quoteId: q?._id,
                                                                    quote: q,
                                                                })
                                                            }
                                                        >
                                                            <IoClose className="text-xl" />
                                                        </div>
                                                    </div>
                                                ) : q?.status === "accepted" ? (
                                                    <div className="flex items-center gap-2 w-full">
                                                        <div className="w-1.5 h-1.5 bg-[#00C6FA] rounded-full" />
                                                        <p className="font-medium text-sm text-gun-metal font-rocGroteskMedium">
                                                            Approved
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 w-full">
                                                        <div className="w-1.5 h-1.5 bg-[#FF0000] rounded-full" />
                                                        <p className="font-medium text-sm text-gun-metal font-rocGroteskMedium">
                                                            Rejected
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                <div
                                                    className="h-8 w-8 flex items-center justify-center border border-gun-metal rounded-full cursor-pointer text-gun-metal"
                                                    onClick={() => previewQuote(q?._id)}
                                                >
                                                    <RxExternalLink className="text-xl text-gun-metal" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>

            <div ref={bottom} className="" />

            {(isLoading || isFetchingNextPage) && (
                <div className="flex w-full mt-2 justify-center">
                    <Loader color={"gun-metal"} />
                </div>
            )}

            {!hasNextPage && !isLoading && !isEmpty && (
                <div className="flex w-full mt-2 justify-center">
                    <p className="text-sm font-rocGroteskMedium">End of list</p>
                </div>
            )}
        </>
    );
};

export default ApprovalQuotesListing;
