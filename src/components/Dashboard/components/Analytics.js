/* eslint-disable react-hooks/exhaustive-deps */
import Loader from "components/common/Loader";
import SelectInput from "components/common/SelectInput";
import { getPeriodState } from "helpers/getPeriodState";
import { percentageChange } from "helpers/percentageChange";
import millify from "millify";
import moment from "moment";
import _ from "lodash";
import React, { useCallback, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import config from "config/config";

const Analytics = ({
    shipmentGraphData,
    shipmentAnalyticsData,
    selectedShipmentDropdown,
    setSelectedShipmentDropdown,
    setSelectedShipmentDate,
    selectedShipmentDate,
    selectedQuoteDate,
    setSelectedQuoteDate,
    selectedQuoteDropdown,
    setSelectedQuoteDropdown,
    quoteAnalyticsData,
    quoteGraphData,
    selectedCustomerDate,
    setSelectedCustomerDate,
    customerAnalyticsData,
    earningAnalyticsData,
    paymentLinks,
    paymentLinkCurrentPage,
    setPaymentLinkCurrentPage,
    paymentLinkPagination,
    FFPaymentLinksLoading,
}) => {
    const [activeSection, setActiveSection] = useState(0);

    const graphRange = () => {
        if (activeSection === 0) {
            const data = shipmentGraphData?.sort((a, b) => {
                return selectedShipmentDate === "seven-days"
                    ? a?._id - b?._id
                    : a?._id?.month - b?._id?.month;
            });

            return data && selectedShipmentDate === "seven-days"
                ? data?.[0]?._id + " - " + data?.[data?.length - 1]?._id
                : data?.[0]?._id?.year <= data?.[data?.length - 1]?._id?.year
                ? moment(`${data?.[0]?._id?.month}-01-${data?.[0]?._id?.year}`).format(
                      "MMM, YYYY"
                  ) +
                  " - " +
                  moment(
                      `${data?.[data?.length - 1]?._id?.month}-01-${
                          data?.[data?.length - 1]?._id?.year
                      }`
                  ).format("MMM, YYYY")
                : moment(
                      `${data?.[data?.length - 1]?._id?.month}-01-${
                          data?.[data?.length - 1]?._id?.year
                      }`
                  ).format("MMM, YYYY") +
                  " - " +
                  moment(`${data?.[0]?._id?.month}-01-${data?.[0]?._id?.year}`).format("MMM, YYYY");
        }

        if (activeSection === 1) {
            const data = quoteGraphData?.sort((a, b) => {
                return selectedQuoteDate === "seven-days"
                    ? a?._id - b?._id
                    : a?._id?.month - b?._id?.month;
            });
            return data && selectedQuoteDate === "seven-days"
                ? data?.[0]?._id + " - " + data?.[0]?._id
                : data?.[0]?._id?.year <= data?.[data?.length - 1]?._id?.year
                ? moment(`${data?.[0]?._id?.month}-01-${data?.[0]?._id?.year}`).format(
                      "MMM, YYYY"
                  ) +
                  " - " +
                  moment(
                      `${data?.[data?.length - 1]?._id?.month}-01-${
                          data?.[data?.length - 1]?._id?.year
                      }`
                  ).format("MMM, YYYY")
                : moment(
                      `${data?.[data?.length - 1]?._id?.month}-01-${
                          data?.[data?.length - 1]?._id?.year
                      }`
                  ).format("MMM, YYYY") +
                  " - " +
                  moment(`${data?.[0]?._id?.month}-01-${data?.[0]?._id?.year}`).format("MMM, YYYY");
        }
    };

    const displayShipmentGraphDataByStatus = (item) => {
        switch (selectedShipmentDropdown) {
            case "All Shipments":
                return {
                    name:
                        selectedShipmentDate === "seven-days"
                            ? moment(item?._id).format("ddd")
                            : moment(item?._id?.month + "-01-" + item?._id?.year).format("MMM"),
                    completed: item?.completed,
                    cancelled: item?.cancelled,
                    pending: item?.pending,
                };
            case "Completed Shipments":
                return {
                    name:
                        selectedShipmentDate === "seven-days"
                            ? moment(item?._id).format("ddd")
                            : moment(item?._id?.month + "-01-" + item?._id?.year).format("MMM"),
                    completed: item?.completed,
                };
            case "Pending Shipments":
                return {
                    name:
                        selectedShipmentDate === "seven-days"
                            ? moment(item?._id).format("ddd")
                            : moment(item?._id?.month + "-01-" + item?._id?.year).format("MMM"),
                    pending: item?.pending,
                };
            case "Cancelled Shipments":
                return {
                    name:
                        selectedShipmentDate === "seven-days"
                            ? moment(item?._id).format("ddd")
                            : moment(item?._id?.month + "-01-" + item?._id?.year).format("MMM"),
                    cancelled: item?.cancelled,
                };
            default:
                return {
                    name:
                        selectedShipmentDate === "seven-days"
                            ? moment(item?._id).format("ddd")
                            : moment(item?._id?.month + "-01-" + item?._id?.year).format("MMM"),
                    completed: item?.completed,
                    cancelled: item?.cancelled,
                    pending: item?.pending,
                };
        }
    };

    const displayQuoteGraphDataByStatus = (item) => {
        switch (selectedQuoteDropdown) {
            case "All Quotes":
                return {
                    name:
                        selectedQuoteDate === "seven-days"
                            ? moment(item?._id).format("ddd")
                            : moment(item?._id?.month + "-01-" + item?._id?.year).format("MMM"),
                    accepted: item?.accepted,
                    rejected: item?.rejected,
                    pending: item?.pending,
                };
            case "Accepted Quotes":
                return {
                    name:
                        selectedQuoteDate === "seven-days"
                            ? moment(item?._id).format("ddd")
                            : moment(item?._id?.month + "-01-" + item?._id?.year).format("MMM"),
                    accepted: item?.accepted,
                };
            case "Pending Quotes":
                return {
                    name:
                        selectedQuoteDate === "seven-days"
                            ? moment(item?._id).format("ddd")
                            : moment(item?._id?.month + "-01-" + item?._id?.year).format("MMM"),
                    pending: item?.pending,
                };
            case "Rejected Quotes":
                return {
                    name:
                        selectedQuoteDate === "seven-days"
                            ? moment(item?._id).format("ddd")
                            : moment(item?._id?.month + "-01-" + item?._id?.year).format("MMM"),
                    rejected: item?.rejected,
                };
            default:
                return {
                    name:
                        selectedQuoteDate === "seven-days"
                            ? moment(item?._id).format("ddd")
                            : moment(item?._id?.month + "-01-" + item?._id?.year).format("MMM"),
                    accepted: item?.accepted,
                    rejected: item?.rejected,
                    pending: item?.pending,
                };
        }
    };

    const ShipmentAnalytics = () => {
        return (
            <>
                <div className="border-x border-b rounded-b pb-2 text-xs font-rocGroteskMedium text-mvx-neutral">
                    <div className="flex justify-end max-sm:justify-center pr-6 max-sm:pr-0 py-8">
                        <div className="flex w-fit justify-end max-sm:w-full max-sm:justify-center items-center">
                            <div>
                                <SelectInput
                                    value={selectedShipmentDropdown}
                                    name="category"
                                    handleChange={(_, value) => setSelectedShipmentDropdown(value)}
                                    isRequired={true}
                                    className="bg-mvx-light-blue rounded-tr-none rounded-br-none !h-[36px] !text-xs"
                                    optionItemClassName="!text-xs"
                                    activeOptionItemClassName="!text-sm"
                                    dropdownOptions={[
                                        {
                                            label: "All Shipments",
                                            value: "All Shipments",
                                        },
                                        {
                                            label: "Completed Shipments",
                                            value: "Completed Shipments",
                                        },
                                        {
                                            label: "Pending Shipments",
                                            value: "Pending Shipments",
                                        },
                                        {
                                            label: "Cancelled Shipments",
                                            value: "Cancelled Shipments",
                                        },
                                    ]}
                                />
                            </div>
                            <div className="w-[33%] max-sm:w-[45%]">
                                <SelectInput
                                    value={selectedShipmentDate}
                                    name="shipmentCategory"
                                    handleChange={(_, value) => setSelectedShipmentDate(value)}
                                    isRequired={true}
                                    className="rounded-none !border-r-0 !border-l-0 !h-[36px] max-sm:!border-r max-sm:rounded-tr max-sm:rounded-br !text-xs !text-mvx-neutral"
                                    optionItemClassName="!text-xs"
                                    activeOptionItemClassName="!text-sm"
                                    dropdownOptions={[
                                        {
                                            label: "Last 7 days",
                                            value: "seven-days",
                                        },
                                        {
                                            label: "Last 30 days",
                                            value: "one-month",
                                        },
                                        {
                                            label: "Last 365 days",
                                            value: "one-year",
                                        },
                                    ]}
                                />
                            </div>
                            <div className="px-4 border max-sm:hidden rounded-tr rounded-br h-[36px] flex items-center gap-1.5 justify-center">
                                <i className="ri-calendar-line"></i>
                                <span>
                                    {graphRange().includes("undefined") ? "None" : graphRange()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <ResponsiveContainer
                            className="w-full max-sm:!w-[110%] max-sm:ml-[-36px]"
                            height={550}
                        >
                            <BarChart
                                width={"100%"}
                                height={"100%"}
                                barSize={44}
                                data={shipmentGraphData?.map((item) => {
                                    return displayShipmentGraphDataByStatus(item);
                                })}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid vertical={false} strokeDasharray="2 2" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                {/* <Legend /> */}
                                <Bar dataKey="cancelled" stackId="a" fill="#FF6224" />
                                <Bar dataKey="completed" stackId="a" fill="#16C6A4" />
                                <Bar dataKey="pending" stackId="a" fill="#736CED" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center gap-6 my-5">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-pacific-cyan" />
                            <span className="text-xs font-rocGroteskMedium">
                                <span className="text-inherit max-sm:hidden">
                                    Completed Shipments
                                </span>
                                <span className="text-inherit hidden max-sm:block">Completed</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-mvx-orange" />
                            <span className="text-xs font-rocGroteskMedium">
                                <span className="text-inherit max-sm:hidden">
                                    Cancelled Shipments
                                </span>
                                <span className="text-inherit hidden max-sm:block">Cancelled</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#736CED]" />
                            <span className="text-xs font-rocGroteskMedium">
                                <span className="text-inherit max-sm:hidden">
                                    Pending Shipments
                                </span>
                                <span className="text-inherit hidden max-sm:block">Pending</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="my-8">
                    <p className="mb-4 text-base font-rocGroteskBold">Mode of shipment</p>
                    <div className="grid grid-cols-[1fr_1fr_1fr] max-lg:grid-cols-[1fr_1fr] gap-5 max-sm:grid-cols-[1fr]">
                        <div className="rounded border">
                            <p className="px-6 py-4 border-b text-sm font-rocGroteskMedium">
                                Completed shipments
                            </p>
                            <div className="p-6 flex justify-between items-center">
                                <div>
                                    <p className="mb-1 text-2xl font-rocGroteskMedium">
                                        {Boolean(
                                            shipmentAnalyticsData?.shipGraph?.[0]
                                                ?.completedShipmentDetails?.[0]?.air
                                        )
                                            ? millify(
                                                  Number(
                                                      shipmentAnalyticsData?.shipGraph?.[0]
                                                          ?.completedShipmentDetails?.[0]?.air
                                                  ),
                                                  {
                                                      precision: 2,
                                                      lowercase: true,
                                                  }
                                              )
                                            : "-"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <span className="material-icons text-lg">
                                            flight_takeoff
                                        </span>
                                        <span className="text-sm font-rocGroteskMedium">Air</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-2xl font-rocGroteskMedium">
                                        {Boolean(
                                            shipmentAnalyticsData?.shipGraph?.[0]
                                                ?.completedShipmentDetails?.[0]?.land
                                        )
                                            ? millify(
                                                  Number(
                                                      shipmentAnalyticsData?.shipGraph?.[0]
                                                          ?.completedShipmentDetails?.[0]?.land
                                                  ),
                                                  {
                                                      precision: 2,
                                                      lowercase: true,
                                                  }
                                              )
                                            : "-"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <span className="material-icons text-lg">
                                            local_shipping
                                        </span>
                                        <span className="text-sm font-rocGroteskMedium">Land</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-2xl font-rocGroteskMedium">
                                        {Boolean(
                                            shipmentAnalyticsData?.shipGraph?.[0]
                                                ?.completedShipmentDetails?.[0]?.ocean
                                        )
                                            ? millify(
                                                  Number(
                                                      shipmentAnalyticsData?.shipGraph?.[0]
                                                          ?.completedShipmentDetails?.[0]?.ocean
                                                  ),
                                                  {
                                                      precision: 2,
                                                      lowercase: true,
                                                  }
                                              )
                                            : "-"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <span className="material-icons text-lg">
                                            directions_boat
                                        </span>
                                        <span className="text-sm font-rocGroteskMedium">Sea</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded border">
                            <p className="px-6 py-4 border-b text-sm font-rocGroteskMedium">
                                Pending shipments
                            </p>
                            <div className="p-6 flex justify-between items-center">
                                <div>
                                    <p className="mb-1 text-2xl font-rocGroteskMedium">
                                        {Boolean(
                                            shipmentAnalyticsData?.shipGraph?.[0]
                                                ?.pendingShipmentDetails?.[0]?.air
                                        )
                                            ? millify(
                                                  Number(
                                                      shipmentAnalyticsData?.shipGraph?.[0]
                                                          ?.pendingShipmentDetails?.[0]?.air
                                                  ),
                                                  {
                                                      precision: 2,
                                                      lowercase: true,
                                                  }
                                              )
                                            : "-"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <span className="material-icons text-lg">
                                            flight_takeoff
                                        </span>
                                        <span className="text-sm font-rocGroteskMedium">Air</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-2xl font-rocGroteskMedium">
                                        {Boolean(
                                            shipmentAnalyticsData?.shipGraph?.[0]
                                                ?.pendingShipmentDetails?.[0]?.land
                                        )
                                            ? millify(
                                                  Number(
                                                      shipmentAnalyticsData?.shipGraph?.[0]
                                                          ?.pendingShipmentDetails?.[0]?.land
                                                  ),
                                                  {
                                                      precision: 2,
                                                      lowercase: true,
                                                  }
                                              )
                                            : "-"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <span className="material-icons text-lg">
                                            local_shipping
                                        </span>
                                        <span className="text-sm font-rocGroteskMedium">Land</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-2xl font-rocGroteskMedium">
                                        {Boolean(
                                            shipmentAnalyticsData?.shipGraph?.[0]
                                                ?.pendingShipmentDetails?.[0]?.ocean
                                        )
                                            ? millify(
                                                  Number(
                                                      shipmentAnalyticsData?.shipGraph?.[0]
                                                          ?.pendingShipmentDetails?.[0]?.ocean
                                                  ),
                                                  {
                                                      precision: 2,
                                                      lowercase: true,
                                                  }
                                              )
                                            : "-"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <span className="material-icons text-lg">
                                            directions_boat
                                        </span>
                                        <span className="text-sm font-rocGroteskMedium">Sea</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded border">
                            <p className="px-6 py-4 border-b text-sm font-rocGroteskMedium">
                                Cancelled shipments
                            </p>
                            <div className="p-6 flex justify-between items-center">
                                <div>
                                    <p className="mb-1 text-2xl font-rocGroteskMedium">
                                        {Boolean(
                                            shipmentAnalyticsData?.shipGraph?.[0]
                                                ?.cancelledShipmentDetails?.[0]?.air
                                        )
                                            ? millify(
                                                  Number(
                                                      shipmentAnalyticsData?.shipGraph?.[0]
                                                          ?.cancelledShipmentDetails?.[0]?.air
                                                  ),
                                                  {
                                                      precision: 2,
                                                      lowercase: true,
                                                  }
                                              )
                                            : "-"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <span className="material-icons text-lg">
                                            flight_takeoff
                                        </span>
                                        <span className="text-sm font-rocGroteskMedium">Air</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-2xl font-rocGroteskMedium">
                                        {Boolean(
                                            shipmentAnalyticsData?.shipGraph?.[0]
                                                ?.cancelledShipmentDetails?.[0]?.land
                                        )
                                            ? millify(
                                                  Number(
                                                      shipmentAnalyticsData?.shipGraph?.[0]
                                                          ?.cancelledShipmentDetails?.[0]?.land
                                                  ),
                                                  {
                                                      precision: 2,
                                                      lowercase: true,
                                                  }
                                              )
                                            : "-"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <span className="material-icons text-lg">
                                            local_shipping
                                        </span>
                                        <span className="text-sm font-rocGroteskMedium">Land</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-2xl font-rocGroteskMedium">
                                        {Boolean(
                                            shipmentAnalyticsData?.shipGraph?.[0]
                                                ?.cancelledShipmentDetails?.[0]?.ocean
                                        )
                                            ? millify(
                                                  Number(
                                                      shipmentAnalyticsData?.shipGraph?.[0]
                                                          ?.cancelledShipmentDetails?.[0]?.ocean
                                                  ),
                                                  {
                                                      precision: 2,
                                                      lowercase: true,
                                                  }
                                              )
                                            : "-"}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <span className="material-icons text-lg">
                                            directions_boat
                                        </span>
                                        <span className="text-sm font-rocGroteskMedium">Sea</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const QuoteAnalytics = () => {
        return (
            <>
                <div className="border-x border-b rounded-b pb-2 text-xs font-rocGroteskMedium text-mvx-neutral">
                    <div className="flex justify-end max-sm:justify-center pr-6 max-sm:pr-0 py-8">
                        <div className="flex w-fit justify-end max-sm:w-full max-sm:justify-center items-center">
                            <div>
                                <SelectInput
                                    value={selectedQuoteDropdown}
                                    name="category"
                                    handleChange={(_, value) => setSelectedQuoteDropdown(value)}
                                    isRequired={true}
                                    className="bg-mvx-light-blue rounded-tr-none rounded-br-none !h-[36px] !text-xs"
                                    optionItemClassName="!text-xs"
                                    activeOptionItemClassName="!text-sm"
                                    dropdownOptions={[
                                        {
                                            label: "All Quotes",
                                            value: "All Quotes",
                                        },
                                        {
                                            label: "Accepted Quotes",
                                            value: "Accepted Quotes",
                                        },
                                        {
                                            label: "Pending Quotes",
                                            value: "Pending Quotes",
                                        },
                                        {
                                            label: "Rejected Quotes",
                                            value: "Rejected Quotes",
                                        },
                                    ]}
                                />
                            </div>
                            <div className="w-[33%] max-sm:w-[45%]">
                                <SelectInput
                                    value={selectedQuoteDate}
                                    name="quoteCategory"
                                    // placeholder={"+000"}
                                    handleChange={(_, value) => setSelectedQuoteDate(value)}
                                    isRequired={true}
                                    className="rounded-none !border-r-0 !border-l-0 !h-[36px] max-sm:!border-r max-sm:rounded-tr max-sm:rounded-br !text-xs !text-mvx-neutral"
                                    optionItemClassName="!text-xs"
                                    activeOptionItemClassName="!text-sm"
                                    dropdownOptions={[
                                        {
                                            label: "Last 7 days",
                                            value: "seven-days",
                                        },
                                        {
                                            label: "Last 30 days",
                                            value: "one-month",
                                        },
                                        {
                                            label: "Last 365 days",
                                            value: "one-year",
                                        },
                                    ]}
                                />
                            </div>
                            <div className="px-4 border  max-sm:hidden rounded-tr gap-1.5 rounded-br h-[36px] flex items-center justify-center">
                                <i className="ri-calendar-line"></i>
                                <span>
                                    {graphRange().includes("undefined") ? "None" : graphRange()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <ResponsiveContainer
                        className="w-full max-sm:!w-[110%] max-sm:ml-[-36px]"
                        height={550}
                    >
                        <BarChart
                            width={"100%"}
                            height={"100%"}
                            barSize={44}
                            data={quoteGraphData?.map((item) => {
                                return displayQuoteGraphDataByStatus(item);
                            })}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="2 2" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            {/* <Legend /> */}
                            <Bar dataKey="rejected" stackId="a" fill="#FF6224" />
                            <Bar dataKey="accepted" stackId="a" fill="#16C6A4" />
                            <Bar dataKey="pending" stackId="a" fill="#736CED" />
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="flex justify-center gap-6 my-5">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-pacific-cyan" />
                            <span className="text-xs font-rocGroteskMedium">
                                <span className="text-inherit max-sm:hidden">Accepted Quotes</span>
                                <span className="text-inherit hidden max-sm:block">Accepted</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-mvx-orange" />
                            <span className="text-xs font-rocGroteskMedium">
                                <span className="text-inherit max-sm:hidden">Rejected Quotes</span>
                                <span className="text-inherit hidden max-sm:block">Rejected</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#736CED]" />
                            <span className="text-xs font-rocGroteskMedium">
                                <span className="text-inherit max-sm:hidden">Pending Quotes</span>
                                <span className="text-inherit hidden max-sm:block">Pending</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="my-8">
                    <div className="grid grid-cols-[1.3fr_1.3fr_0.5fr] max-lg:grid-cols-[1fr_1fr] max-sm:grid-cols-[1fr] gap-5">
                        <div>
                            <p className="mb-4 text-base font-rocGroteskBold">Your quotes</p>
                            <div className="rounded border">
                                <p className="px-6 py-4 border-b text-sm font-rocGroteskMedium">
                                    Total numbers of quotes created by you:{" "}
                                    {millify(
                                        Number(quoteAnalyticsData?.quoteDetails?.[0]?.count ?? 0),
                                        {
                                            precision: 2,
                                            lowercase: true,
                                        }
                                    )}
                                </p>
                                <div className="p-6 flex justify-between items-center">
                                    <div>
                                        <p className="mb-1 text-2xl font-rocGroteskMedium">
                                            {Boolean(
                                                quoteAnalyticsData?.quoteDetails?.[0]?.accepted
                                            )
                                                ? millify(
                                                      Number(
                                                          quoteAnalyticsData?.quoteDetails?.[0]
                                                              ?.accepted
                                                      ),
                                                      {
                                                          precision: 2,
                                                          lowercase: true,
                                                      }
                                                  )
                                                : "-"}
                                        </p>
                                        <p className=" text-sm font-rocGroteskMedium">
                                            Accepted Quotes
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-2xl font-rocGroteskMedium">
                                            {Boolean(
                                                quoteAnalyticsData?.quoteDetails?.[0]?.rejected
                                            )
                                                ? millify(
                                                      Number(
                                                          quoteAnalyticsData?.quoteDetails?.[0]
                                                              ?.rejected
                                                      ),
                                                      {
                                                          precision: 2,
                                                          lowercase: true,
                                                      }
                                                  )
                                                : "-"}
                                        </p>
                                        <p className=" text-sm font-rocGroteskMedium">
                                            Rejected Quotes
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-2xl font-rocGroteskMedium">
                                            {Boolean(quoteAnalyticsData?.quoteDetails?.[0]?.pending)
                                                ? millify(
                                                      Number(
                                                          quoteAnalyticsData?.quoteDetails?.[0]
                                                              ?.pending
                                                      ),
                                                      {
                                                          precision: 2,
                                                          lowercase: true,
                                                      }
                                                  )
                                                : "-"}
                                        </p>
                                        <p className=" text-sm font-rocGroteskMedium">
                                            Pending Quotes
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="mb-4 text-base font-rocGroteskBold">External quotes</p>
                            <div className="rounded border">
                                <p className="px-6 py-4 border-b text-sm font-rocGroteskMedium">
                                    Total numbers of quotes sent to you:{" "}
                                    {millify(
                                        Number(
                                            quoteAnalyticsData?.externalQuotesDetails?.[0]?.count ??
                                                0
                                        ),
                                        {
                                            precision: 2,
                                            lowercase: true,
                                        }
                                    )}
                                </p>
                                <div className="p-6 flex justify-between items-center">
                                    <div>
                                        <p className="mb-1 text-2xl font-rocGroteskMedium">
                                            {Boolean(
                                                quoteAnalyticsData?.externalQuotesDetails?.[0]
                                                    ?.accepted
                                            )
                                                ? millify(
                                                      Number(
                                                          quoteAnalyticsData
                                                              ?.externalQuotesDetails?.[0]?.accepted
                                                      ),
                                                      {
                                                          precision: 2,
                                                          lowercase: true,
                                                      }
                                                  )
                                                : "-"}
                                        </p>
                                        <p className=" text-sm font-rocGroteskMedium">
                                            Accepted Quotes
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-2xl font-rocGroteskMedium">
                                            {Boolean(
                                                quoteAnalyticsData?.externalQuotesDetails?.[0]
                                                    ?.rejected
                                            )
                                                ? millify(
                                                      Number(
                                                          quoteAnalyticsData
                                                              ?.externalQuotesDetails?.[0]?.rejected
                                                      ),
                                                      {
                                                          precision: 2,
                                                          lowercase: true,
                                                      }
                                                  )
                                                : "-"}
                                        </p>
                                        <p className=" text-sm font-rocGroteskMedium">
                                            Rejected Quotes
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-2xl font-rocGroteskMedium">
                                            {Boolean(
                                                quoteAnalyticsData?.externalQuotesDetails?.[0]
                                                    ?.pending
                                            )
                                                ? millify(
                                                      Number(
                                                          quoteAnalyticsData
                                                              ?.externalQuotesDetails?.[0]?.pending
                                                      ),
                                                      {
                                                          precision: 2,
                                                          lowercase: true,
                                                      }
                                                  )
                                                : "-"}
                                        </p>
                                        <p className=" text-sm font-rocGroteskMedium">
                                            Pending Quotes
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const CustomersAnalytics = () => {
        const totalCustomersTrend =
            customerAnalyticsData?.customerData?.[0]?.newFFcustomersCount?.[0]?.totalCustomers ===
            customerAnalyticsData?.customerData?.[0]?.totalFFcustomer?.[0]?.totalCustomers
                ? 0
                : (
                      (customerAnalyticsData?.customerData?.[0]?.newFFcustomersCount?.[0]
                          ?.totalCustomers /
                          customerAnalyticsData?.customerData?.[0]?.totalFFcustomer?.[0]
                              ?.totalCustomers) *
                      100
                  )?.toFixed(2);
        const newCustomersTrend = percentageChange(
            customerAnalyticsData?.customerData?.[0]?.newFFcustomerTrendsCount?.[0]?.totalCustomers,
            customerAnalyticsData?.customerData?.[0]?.newFFcustomersCount?.[0]?.totalCustomers
        );

        const returningCustomersTrend = percentageChange(
            customerAnalyticsData?.topCustomers?.[0]?.returningCustomersTrends?.[0]?.total,
            customerAnalyticsData?.topCustomers?.[0]?.returningCustomers?.[0]?.total
        );

        const averageSpendTrend = percentageChange(
            earningAnalyticsData?.totalEarningInUSDTrends /
                customerAnalyticsData?.customerData?.[0]?.totalFFcustomer?.[0]?.totalCustomers,
            earningAnalyticsData?.totalEarningsInUSD /
                customerAnalyticsData?.customerData?.[0]?.totalFFcustomer?.[0]?.totalCustomers
        );

        const removeNegativeSign = (num) => {
            let str = num.toString();
            if (str[0] === "-") {
                str = str.slice(1);
            }
            return Number(str);
        };

        return (
            <div className="mb-10">
                <div>
                    <div className="flex max-sm:flex-col max-sm:items-start max-sm:gap-y-4 items-center justify-between px-5 py-6 border-x">
                        <p className="text-base font-rocGroteskBold">
                            Top customers by number of shipments
                        </p>
                        <div className="w-[12%] max-sm:w-1/2">
                            <SelectInput
                                value={selectedCustomerDate}
                                name="customerCategory"
                                handleChange={(_, value) => setSelectedCustomerDate(value)}
                                isRequired={true}
                                className="!rounded !h-[36px] !text-xs !text-mvx-neutral"
                                optionItemClassName="!text-xs"
                                activeOptionItemClassName="!text-sm"
                                dropdownOptions={[
                                    {
                                        label: "Last 7 days",
                                        value: "seven-days",
                                    },
                                    {
                                        label: "Last 30 days",
                                        value: "one-month",
                                    },
                                    {
                                        label: "Last 365 days",
                                        value: "one-year",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr] border max-lg:grid-cols-[1fr_1fr] max-sm:grid-cols-[1fr]">
                    <div className={`pt-4 pb-6 px-6 border-r max-sm:border-r-0 max-lg:border-b`}>
                        <p className="mb-2 font-rocGroteskBold text-sm">Total customers</p>
                        <p className="font-rocGroteskBold text-[28px]">
                            {millify(
                                Number(
                                    customerAnalyticsData?.customerData?.[0]?.totalFFcustomer?.[0]
                                        ?.totalCustomers ?? 0
                                ),
                                {
                                    precision: 2,
                                    lowercase: true,
                                }
                            )}
                        </p>
                        {totalCustomersTrend !== 0 && (
                            <p
                                className={`text-sm font-rocGroteskMedium flex item-center ${
                                    totalCustomersTrend > 0 ? "text-pacific-cyan" : "text-[#FF0000]"
                                }`}
                            >
                                <span className="text-inherit">
                                    {totalCustomersTrend > 0 ? "Up" : "Down"}{" "}
                                    {removeNegativeSign(totalCustomersTrend)}% from last{" "}
                                    {getPeriodState(selectedCustomerDate)}
                                </span>
                                {totalCustomersTrend > 0 ? (
                                    <span className="material-icons-outlined text-inherit mt-[-4px]">
                                        arrow_drop_up
                                    </span>
                                ) : (
                                    <span className="material-icons-outlined text-inherit mt-[-4px]">
                                        arrow_drop_down
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                    <div className={`pt-4 pb-6 px-6 border-r max-lg:border-b max-lg:border-r-0`}>
                        <p className="mb-2 font-rocGroteskBold text-sm">New customers</p>
                        <p className="font-rocGroteskBold text-[28px]">
                            {millify(
                                Number(
                                    customerAnalyticsData?.customerData?.[0]
                                        ?.newFFcustomersCount?.[0]?.totalCustomers ?? 0
                                ),
                                {
                                    precision: 2,
                                    lowercase: true,
                                }
                            )}
                        </p>
                        {newCustomersTrend !== 0 && (
                            <p
                                className={`text-sm font-rocGroteskMedium flex item-center ${
                                    newCustomersTrend > 0 ? "text-pacific-cyan" : "text-[#FF0000]"
                                }`}
                            >
                                <span className="text-inherit">
                                    {newCustomersTrend > 0 ? "Up" : "Down"}{" "}
                                    {removeNegativeSign(newCustomersTrend)}% from last{" "}
                                    {getPeriodState(selectedCustomerDate)}
                                </span>
                                {newCustomersTrend > 0 ? (
                                    <span className="material-icons-outlined text-inherit mt-[-4px]">
                                        arrow_drop_up
                                    </span>
                                ) : (
                                    <span className="material-icons-outlined text-inherit mt-[-4px]">
                                        arrow_drop_down
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                    <div className={`pt-4 pb-6 px-6 border-r max-sm:border-b max-sm:border-r-0`}>
                        <p className="mb-2 font-rocGroteskBold text-sm">Returning customers</p>
                        <p className="font-rocGroteskBold text-[28px]">
                            {millify(
                                Number(
                                    customerAnalyticsData?.topCustomers?.[0]
                                        ?.returningCustomers?.[0]?.total ?? 0
                                ),
                                {
                                    precision: 2,
                                    lowercase: true,
                                }
                            )}
                        </p>
                        {returningCustomersTrend !== 0 && (
                            <p
                                className={`text-sm font-rocGroteskMedium flex item-center ${
                                    returningCustomersTrend > 0
                                        ? "text-pacific-cyan"
                                        : "text-[#FF0000]"
                                }`}
                            >
                                <span className="text-inherit">
                                    {returningCustomersTrend > 0 ? "Up" : "Down"}{" "}
                                    {removeNegativeSign(returningCustomersTrend)}% from last{" "}
                                    {getPeriodState(selectedCustomerDate)}
                                </span>
                                {returningCustomersTrend > 0 ? (
                                    <span className="material-icons-outlined text-inherit mt-[-4px]">
                                        arrow_drop_up
                                    </span>
                                ) : (
                                    <span className="material-icons-outlined text-inherit mt-[-4px]">
                                        arrow_drop_down
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                    <div className={`pt-4 pb-6 px-6 `}>
                        <p className="mb-2 font-rocGroteskBold text-sm">Average spend/customer</p>
                        <p className="font-rocGroteskBold text-[28px]">
                            $
                            {millify(
                                Number(
                                    earningAnalyticsData?.totalEarningsInUSD /
                                        customerAnalyticsData?.customerData?.[0]
                                            ?.totalFFcustomer?.[0]?.totalCustomers
                                ),
                                {
                                    precision: 2,
                                    lowercase: true,
                                }
                            )}
                        </p>
                        {averageSpendTrend !== 0 && (
                            <p
                                className={`text-sm font-rocGroteskMedium flex item-center ${
                                    averageSpendTrend > 0 ? "text-pacific-cyan" : "text-[#FF0000]"
                                }`}
                            >
                                <span className="text-inherit">
                                    {averageSpendTrend > 0 ? "Up" : "Down"}{" "}
                                    {removeNegativeSign(averageSpendTrend)}% from last{" "}
                                    {getPeriodState(selectedCustomerDate)}
                                </span>
                                {averageSpendTrend > 0 ? (
                                    <span className="material-icons-outlined text-inherit mt-[-4px]">
                                        arrow_drop_up
                                    </span>
                                ) : (
                                    <span className="material-icons-outlined text-inherit mt-[-4px]">
                                        arrow_drop_down
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                </div>
                <div className="border rounded-b border-t-0">
                    <div className="w-full grid grid-cols-[1fr_1fr_1fr] py-3 px-4 max-sm:grid-cols-[1fr_1fr] bg-[#FAFBFC]">
                        <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                            NAME
                        </div>
                        <div className="uppercase flex justify-start text-xs font-rocGroteskMedium max-sm:hidden text-mvx-neutral">
                            Email address
                        </div>
                        <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                            no of shipments
                        </div>
                        {/* <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                            TOTAL Earnings
                        </div> */}
                    </div>
                    <div>
                        {customerAnalyticsData?.topCustomers?.[0]?.topCustomers?.map(
                            (customer, idx) => {
                                return (
                                    <div key={customer?._id?.name}>
                                        <hr />
                                        <div className="w-full grid grid-cols-[1fr_1fr_1fr] max-sm:grid-cols-[1fr_1fr] py-3 px-4">
                                            <div className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                                {_.truncate(customer?._id?.name, {
                                                    length: 20,
                                                })}
                                            </div>
                                            <div className=" flex items-center justify-start text-sm max-sm:hidden font-rocGroteskMedium text-gun-metal">
                                                {customer?._id?.email}
                                            </div>
                                            <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                                {millify(Number(customer?.totalShipments ?? 0), {
                                                    precision: 2,
                                                    lowercase: true,
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
                {/* <div className="w-full mt-8 flex justify-center">
                    <div className="py-2 px-4 border bg-white rounded-[200px] cursor-pointer flex items-center justify-center shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                        <p className="text-sm font-rocGroteskMedium">View more customer</p>
                    </div>
                </div> */}
            </div>
        );
    };

    const TotalEarnings = () => {
        return (
            <div className="mb-10">
                <div>
                    <div className="flex items-center justify-between px-5 py-6 border-x">
                        <p className="text-base font-rocGroteskBold">Payment links</p>
                    </div>
                </div>

                <div className="border rounded-b border-t-0">
                    <div>
                        {paymentLinks?.map((paymentData) => {
                            return (
                                <div key={paymentData?._id}>
                                    <hr />
                                    <div className="w-full py-3 px-4 flex items-center justify-start">
                                        <a
                                            href={`${config?.BASE_URL}/payment/${paymentData?._id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="  text-sm font-rocGroteskMedium text-gun-metal underline"
                                        >
                                            <span className="max-sm:hidden text-inherit">{`${config?.BASE_URL}/payment/${paymentData?._id}`}</span>
                                            <span className="max-sm:block hidden text-inherit">
                                                {_.truncate(
                                                    `${config?.BASE_URL}/payment/${paymentData?._id}`,
                                                    {
                                                        length: 40,
                                                    }
                                                )}
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="w-full mt-8 flex justify-center">
                    {paymentLinkCurrentPage < paymentLinkPagination?.number_of_pages &&
                        !FFPaymentLinksLoading && (
                            <div
                                onClick={() =>
                                    setPaymentLinkCurrentPage((prevState) => prevState + 1)
                                }
                                className="py-2 px-4 border bg-white rounded-[200px] cursor-pointer flex items-center justify-center shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]"
                            >
                                <p className="text-sm font-rocGroteskMedium">Show more</p>
                            </div>
                        )}
                    {FFPaymentLinksLoading && <Loader color="gun-metal" size={4} />}
                    {paymentLinkCurrentPage === paymentLinkPagination?.number_of_pages &&
                        !FFPaymentLinksLoading && (
                            <p className="text-sm font-rocGroteskMedium">End</p>
                        )}
                </div>
            </div>
        );
    };

    const displayActiveSection = useCallback(() => {
        switch (activeSection) {
            case 0:
                return <ShipmentAnalytics />;

            case 1:
                return <QuoteAnalytics />;

            case 2:
                return <CustomersAnalytics />;

            case 3:
                return <TotalEarnings />;

            default:
                return <ShipmentAnalytics />;
        }
    }, [
        activeSection,
        selectedShipmentDropdown,
        shipmentGraphData,
        shipmentAnalyticsData,
        selectedQuoteDropdown,
        quoteGraphData,
        quoteAnalyticsData,
        customerAnalyticsData,
        paymentLinks,
        FFPaymentLinksLoading,
        paymentLinkCurrentPage,
    ]);

    return (
        <div>
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr] max-lg:grid-cols-[1fr_1fr] border rounded-t ">
                <div
                    onClick={() => setActiveSection(0)}
                    className={`pt-4 pb-6 px-6 max-sm:p-3 border-r hover:border-b-[3px] max-lg:border-b hover:border-b-gun-metal hover:bg-mvx-light-blue ${
                        activeSection === 0 && "border-b-[3px] border-b-gun-metal bg-mvx-light-blue"
                    } cursor-pointer`}
                >
                    <p className="mb-2 font-rocGroteskBold text-sm">Shipments</p>
                    <p className="font-rocGroteskBold text-[28px]">
                        {millify(Number(shipmentAnalyticsData?.totalShipment ?? 0), {
                            precision: 2,
                            lowercase: true,
                        })}
                    </p>
                </div>
                <div
                    onClick={() => setActiveSection(1)}
                    className={`pt-4 pb-6 px-6 max-sm:p-3 border-r hover:border-b-[3px] max-lg:border-b hover:border-b-gun-metal hover:bg-mvx-light-blue ${
                        activeSection === 1 && "border-b-[3px] border-b-gun-metal bg-mvx-light-blue"
                    } cursor-pointer`}
                >
                    <p className="mb-2 font-rocGroteskBold text-sm">Quotes</p>
                    <p className="font-rocGroteskBold text-[28px]">
                        {millify(Number(quoteAnalyticsData?.quoteDetails?.[0]?.count ?? 0), {
                            precision: 2,
                            lowercase: true,
                        })}
                    </p>
                </div>
                <div
                    onClick={() => setActiveSection(2)}
                    className={`pt-4 pb-6 px-6 max-sm:p-3 border-r hover:border-b-[3px] hover:border-b-gun-metal hover:bg-mvx-light-blue ${
                        activeSection === 2 && "border-b-[3px] border-b-gun-metal bg-mvx-light-blue"
                    } cursor-pointer`}
                >
                    <p className="mb-2 font-rocGroteskBold text-sm">Customers</p>
                    <p className="font-rocGroteskBold text-[28px]">
                        {millify(
                            Number(
                                customerAnalyticsData?.customerData?.[0]?.totalFFcustomer?.[0]
                                    ?.totalCustomers ?? 0
                            ),
                            {
                                precision: 2,
                                lowercase: true,
                            }
                        )}
                    </p>
                </div>
                <div
                    onClick={() => setActiveSection(3)}
                    className={`pt-4 pb-6 px-6 max-sm:p-3 hover:border-b-[3px] hover:border-b-gun-metal hover:bg-mvx-light-blue ${
                        activeSection === 3 && "border-b-[3px] border-b-gun-metal bg-mvx-light-blue"
                    } cursor-pointer`}
                >
                    <p className="mb-2 font-rocGroteskBold text-sm">Total Earnings</p>
                    <p className="font-rocGroteskBold text-[28px]">
                        $
                        {millify(Number(earningAnalyticsData?.totalEarningsInUSD ?? 0), {
                            precision: 2,
                            lowercase: true,
                        })}
                    </p>
                </div>
            </div>
            {displayActiveSection()}
        </div>
    );
};

export default Analytics;
