import NavTwo from "components/common/NavTwo";
import React from "react";
import NewIncomingQuote from "./components/NewIncomingQuote";
import { useQuery } from "@tanstack/react-query";
import { quoteService } from "services";
import { quoteConstants } from "constants";
import useRouteQuery from "hooks/useRouteQuery";
import QuotesListing from "./components/QuotesListing";
import ExternalQuoteListing from "./components/ExternalQuoteListing";
import IncomingQuoteListing from "./components/IncomingQuoteListing";
import ApprovalQuotesListing from "./components/ApprovalQuotesListing";

const QuotesListNew = () => {
    const { data, isLoading } = useQuery({
        queryKey: [quoteConstants.FETCH_QUOTES_ANALYTICS_REQUEST],
        queryFn: () => quoteService.fetchQuotesAnalytics(),
    });
    const analytics = data?.data?.data?.graphData;
    const { searchParams, setURLQuery } = useRouteQuery();
    const activeTab = searchParams?.get("tab") ?? "approval";

    const switchTabs = (name) => {
        setURLQuery({
            tab: name,
            page: 1,
        });
    };

    const tabs = [
        {
            name: "Pending Approval",
            count: analytics?.approval?.at(0)?.approvalQuotesDetails?.at(0)?.count || 0,
            id: "approval",
        },
        { name: "Third Party Quotes", count: 0, id: "external" },
        { name: "Incoming Requests", count: 0, id: "incoming" },
        {
            name: "Sent Quotes",
            count: analytics?.quotes?.at(0)?.graphData?.at(0)?.count || 0,
            id: "quotes",
        },
    ];

    const details = [
        {
            name: "Pending Requests",
            count: analytics?.approval?.at(0)?.approvalQuotesDetails?.at(0)?.count || 0,
        },

        {
            name: "Accepted Quotes",
            count: analytics?.quotes?.at(0)?.graphData?.at(0)?.accepted || 0,
        },
        {
            name: "Rejected Quotes",
            count: analytics?.quotes?.at(0)?.graphData?.at(0)?.rejected || 0,
        },
        {
            name: "Sent Quotes",
            count: analytics?.quotes?.at(0)?.graphData?.at(0)?.count || 0,
        },
    ];

    const displayTable = () => {
        switch (activeTab) {
            case "quotes":
                return <QuotesListing />;
            case "external":
                return <ExternalQuoteListing />;
            case "incoming":
                return <IncomingQuoteListing />;
            case "approval":
                return <ApprovalQuotesListing />;
            default:
                return <QuotesListing />;
        }
    };

    return (
        <div>
            <NavTwo />
            <NewIncomingQuote />
            <div className={`mb-16 mt-[140px] px-[104px] max-lg:my-4 max-lg:px-4`}>
                <div className="flex items-center justify-between w-full mb-6 max-sm:mb-8">
                    <p className="font-rocGroteskBold text-2xl text-gun-metal max-sm:text-base">
                        Quote Management
                    </p>
                </div>

                <div className="flex gap-6 mb-20 max-sm:mb-10 max-sm:grid max-sm:grid-cols-2 max-sm:gap-4">
                    {details?.map((d) => (
                        <div className="max-sm:pt-4 pt-[45px] w-[275px] max-sm:w-fit" key={d?.name}>
                            <p className="mb-1 font-rocGroteskBold text-[32px] max-sm:text-xl text-gun-metal">
                                {isLoading ? "---" : d?.count}
                            </p>
                            <p className="font-rocGroteskMedium text-sm text-gun-metal">
                                {d?.name}
                            </p>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="mb-6">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex gap-8 max-sm:gap-6 max-sm:justify-between max-sm:w-full">
                                {tabs?.map((t, i) => (
                                    <div
                                        key={t?.id}
                                        onClick={() => switchTabs(t?.id)}
                                        className={`flex gap-1 items-center justify-center ${
                                            activeTab === t?.id && "border-b-[3px] border-gun-metal"
                                        } w-fit py-2 cursor-pointer`}
                                    >
                                        <p
                                            className={`text-sm capitalize font-rocGroteskMedium ${
                                                activeTab === t?.id
                                                    ? "text-gun-metal"
                                                    : "text-mvx-neutral"
                                            }`}
                                        >
                                            <span className="text-inherit hidden max-lg:block">
                                                {t?.name}
                                            </span>
                                            <span className="text-inherit max-lg:hidden">
                                                {t?.name}
                                            </span>
                                        </p>
                                        {activeTab === t?.id && (
                                            <p className="flex justify-center items-center text-xs font-rocGroteskMedium text-mvx-neutral py-[2px] px-2 bg-[#E4E5E7] rounded-[10px]">
                                                {t?.count}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className=""></div>
                        </div>
                    </div>
                    {displayTable()}
                </div>
            </div>
        </div>
    );
};

export default QuotesListNew;
