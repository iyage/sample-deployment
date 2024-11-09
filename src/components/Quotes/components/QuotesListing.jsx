import { useInfiniteQuery } from "@tanstack/react-query";
import Loader from "components/common/Loader";
import { quoteConstants } from "constants";
import React, { useEffect, useRef } from "react";
import cargoImg from "assets/images/shipments/cargo.svg";
import { quoteService } from "services";
import _ from "lodash";
import { displayStatusColor } from "helpers/utils";
import moment from "moment";
import { useIntersectionObserver } from "usehooks-ts";

const QuotesListing = () => {
    const bottom = useRef(null);
    const entry = useIntersectionObserver(bottom, {});
    const isVisible = !!entry?.isIntersecting;
    const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: [`${quoteConstants.FETCH_QUOTES_REQUEST}`],
        queryFn: ({ pageParam = 1 }) => quoteService.fetchQuotes(pageParam),
        getNextPageParam: (lastPage, pages) => {
            const no_of_pages = lastPage?.data?.pagination?.number_of_pages;
            const nextPage = no_of_pages > pages.length ? pages.length + 1 : undefined;
            return nextPage;
        },
    });
    const isEmpty = !data?.pages?.at(0)?.data?.data?.length;

    useEffect(() => {
        if (isVisible && hasNextPage) {
            fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    return (
        <>
            <div className="border max-sm:border-none">
                <div className="max-sm:hidden w-full grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_1fr_0.2fr] gap-3 my-3 px-4">
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        ID
                    </div>
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        CUSTOMER
                    </div>

                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        route
                    </div>
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        STATUS
                    </div>
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        TYPE
                    </div>
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        MODE
                    </div>

                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                        DUE DATE
                    </div>
                    <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral"></div>
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
                                    <div
                                        key={q?.mvxid}
                                        className="hover:bg-[#FAFBFC] cursor-pointer"
                                    >
                                        <hr />
                                        <div className="max-sm:hidden w-full grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_1fr_0.2fr] py-3 px-4 gap-3">
                                            <div className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                                {q?.mvxid}
                                            </div>
                                            <div className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                                {_.truncate(q?.shipment?.shipperDetails?.fullName, {
                                                    length: 20,
                                                })}
                                            </div>
                                            <div className="capitalize flex items-center justify-between text-sm font-rocGroteskMedium text-gun-metal pr-2">
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
                                                {displayStatusColor(q?.status?.toLowerCase())}
                                                <span className="capitalize">{q?.status}</span>
                                            </div>
                                            <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                                {q?.shipment?.loadType ?? "-"}
                                            </div>
                                            <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                                {q?.shipment?.serviceMode}
                                            </div>
                                            <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                                {moment(q?.dueDate).format("MMM DD, YYYY")}
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

export default QuotesListing;
