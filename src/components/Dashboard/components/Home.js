import React from "react";
// import ReactCountryFlag from "react-country-flag";
import cargoImg from "assets/images/shipments/cargo.svg";
import { useNavigate } from "react-router-dom";
import Dropdown from "components/common/Dropdown";
import ReactCountryFlag from "react-country-flag";
import _, { flattenDeep, truncate } from "lodash";
import { getCurrencyFromCurrencyCode, saveToStorage } from "helpers";
import { formatMoney } from "helpers/formatMoney";
import { getOperatingSystem } from "helpers/getOS";
import { productGuideData } from "variables/productGuide";
import { toast } from "react-hot-toast";
import CustomToast from "components/common/CustomToast";

const Home = ({
    tableData,
    setSelectedShipment,
    selectedShipment,
    getStartedContent,
    tabs,
    setActiveTab,
    activeTab,
    displayOptions,
    hotDeals,
}) => {
    const navigate = useNavigate();

    const getHotDeals = (deals) => {
        const hotDeals = deals?.map((deal) => {
            return deal?.deal;
        });
        return flattenDeep(hotDeals);
    };

    const displayStatus = (status) => {
        let color;
        switch (status) {
            case "active":
                color = "#1C56F2";
                break;
            case "pending":
                color = "#FF8A00";
                break;
            case "completed":
                color = "#16C6A4";
                break;
            case "cancelled":
                color = "#F90000";
                break;
            default:
                color = "#6C42F5";
                break;
        }
        return (
            <span className={`material-icons text-[8px]`} style={{ color }}>
                fiber_manual_record
            </span>
        );
    };

    const displayShipments = () => {
        return tableData && tableData.length > 0 ? (
            tableData?.slice(0, 5)?.map((shipment) => {
                return (
                    <div
                        key={shipment.mvxid}
                        onClick={() => {
                            return (
                                activeTab !== 3 && navigate(`/dashboard/shipment/${shipment?._id}`)
                            );
                        }}
                        className={`${activeTab !== 3 && "hover:bg-[#FAFBFC] cursor-pointer"}`}
                    >
                        <hr />
                        <div className="w-full grid grid-cols-[1fr_1fr_2.5fr_1fr_1fr_0.2fr] py-3 px-4 max-sm:hidden">
                            <div className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                TA {shipment?.mvxid}
                            </div>
                            <div className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                {_.truncate(shipment?.shipperDetails?.fullName, {
                                    length: 20,
                                })}
                            </div>
                            <div className="pr-16">
                                <div>
                                    <div className="flex items-center">
                                        <span className="basis-[7px] h-1.5 bg-mvx-black mr-2"></span>
                                        <span className="flex-1 h-1 bg-mvx-black"></span>
                                        <span className="material-icons mx-2 text-lg">
                                            {shipment?.serviceMode?.toLowerCase() === "land"
                                                ? "local_shipping"
                                                : shipment?.serviceMode?.toLowerCase() === "air"
                                                ? "flight_takeoff"
                                                : "directions_boat"}
                                        </span>
                                        <span className="flex-1 h-1 bg-[#DFE1E6]"></span>
                                        <span className="basis-[7px] h-1.5 bg-[#DFE1E6] ml-2"></span>
                                    </div>
                                    <div className="flex items-start justify-between gap-4">
                                        <p className="text-sm text-gun-metal font-rocGroteskMedium w-1/2">
                                            {shipment?.origin?.address}
                                            <span className="text-mvx-neutral text-xs block font-rocGroteskMedium mt-[1px] text-left">
                                                {_.truncate(
                                                    shipment?.freightForwarder?.profile
                                                        ?.businessName ??
                                                        shipment?.freightForwarder?.fullName,
                                                    {
                                                        length: 20,
                                                    }
                                                )}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gun-metal font-rocGroteskMedium text-right w-1/2">
                                            {shipment?.destination?.address}
                                            <span className="text-mvx-neutral text-xs block font-rocGroteskMedium mt-[1px]">
                                                {_.truncate(
                                                    shipment?.shipperDetails?.fullName ??
                                                        "Customer",
                                                    {
                                                        length: 20,
                                                    }
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="capitalize flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal">
                                {shipment?.serviceMode}
                            </div>
                            <div className="flex justify-start gap-2 items-center text-sm font-rocGroteskMedium text-gun-metal">
                                {displayStatus(shipment?.currentStatus?.toLowerCase())}
                                <span className="capitalize">
                                    {shipment?.ended ? "Delivered" : shipment?.currentStatus}
                                </span>
                            </div>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className=" flex items-center justify-start text-sm font-rocGroteskMedium text-gun-metal"
                            >
                                {displayOptions()?.length > 0 ? (
                                    <div
                                        className={`flex justify-center items-center w-8 h-8 rounded-full hover:bg-mvx-light-blue ${
                                            shipment?._id === selectedShipment?.id &&
                                            "bg-mvx-light-blue"
                                        }`}
                                    >
                                        <Dropdown
                                            value={""}
                                            dropdown={
                                                <span
                                                    onClick={() => setSelectedShipment(shipment)}
                                                    className="material-icons text-base"
                                                >
                                                    more_vert
                                                </span>
                                            }
                                            dropdownContainerClasses={`${
                                                activeTab === 1 ? "left-[-150px]" : "left-[-170px]"
                                            } shadow-dropdownShadow rounded border-0 !max-h-fit`}
                                            dropdownItemsClasses={`${
                                                activeTab === 2
                                                    ? ""
                                                    : "last:text-[#FF0000] last:hover:bg-[#FFF4F4]"
                                            }`}
                                            name={shipment.freightForwarderId}
                                            dropdownOptions={displayOptions()}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="hidden max-sm:block">
                            <div className="py-5">
                                <div className="flex justify-between mb-1.5">
                                    <div>
                                        <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                            TA {shipment?.mvxid}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="text-sm text-gun-metal">
                                                {_.truncate(shipment?.origin?.address, {
                                                    length: 20,
                                                })}
                                            </span>
                                            <span className="material-icons text-sm font-normal">
                                                arrow_forward
                                            </span>
                                            <span className="text-sm text-gun-metal">
                                                {_.truncate(shipment?.destination?.address, {
                                                    length: 20,
                                                })}
                                            </span>
                                        </p>
                                    </div>
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className=" flex items-center justify-start text-xs font-rocGroteskMedium text-gun-metal"
                                    >
                                        {displayOptions()?.length > 0 ? (
                                            <div
                                                className={`flex justify-center items-center w-8 h-8 rounded-full hover:bg-mvx-light-blue ${
                                                    shipment?._id === selectedShipment?.id &&
                                                    "bg-mvx-light-blue"
                                                }`}
                                            >
                                                <Dropdown
                                                    value={""}
                                                    dropdown={
                                                        <span
                                                            onClick={() =>
                                                                setSelectedShipment(shipment)
                                                            }
                                                            className="material-icons text-base"
                                                        >
                                                            more_vert
                                                        </span>
                                                    }
                                                    dropdownContainerClasses={`${
                                                        activeTab === 1
                                                            ? "left-[-150px]"
                                                            : "left-[-170px]"
                                                    } shadow-dropdownShadow rounded border-0`}
                                                    dropdownItemsClasses={`${
                                                        activeTab === 2
                                                            ? ""
                                                            : "last:text-[#FF0000] last:hover:bg-[#FFF4F4]"
                                                    }`}
                                                    name={shipment.freightForwarderId}
                                                    dropdownOptions={displayOptions()}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center bg-mvx-light-blue rounded px-2 py-1 w-fit">
                                        <span className="text-xs text-mvx-neutral">
                                            {shipment?.serviceMode}
                                        </span>
                                        <span className="material-icons mx-2 text-sm text-mvx-neutral">
                                            {shipment?.serviceMode?.toLowerCase() === "land"
                                                ? "local_shipping"
                                                : shipment?.serviceMode?.toLowerCase() === "air"
                                                ? "flight_takeoff"
                                                : "directions_boat"}
                                        </span>
                                    </div>
                                    <div className="flex justify-start gap-2 items-center text-xs font-rocGroteskMedium text-gun-metal">
                                        {displayStatus(shipment?.currentStatus?.toLowerCase())}
                                        <span className="capitalize">
                                            {shipment?.ended
                                                ? "Delivered"
                                                : shipment?.currentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })
        ) : (
            <div>
                <hr />
                <div className="flex flex-col items-center p-16">
                    <img width={42} className="mb-4" src={cargoImg} alt="cargo" />
                    <p className="text-center mb-1 text-lg text-gun-metal font-rocGroteskMedium">
                        No shipments yet
                    </p>
                    <p className="text-center text-gun-metal text-sm">
                        You don't have any shipments yet.
                    </p>
                    {activeTab === 1 && (
                        <div className="mt-2">
                            <button
                                className="bg-gun-metal text-white font-rocGroteskMedium w-full py-2 text-sm rounded px-7"
                                type={"button"}
                            >
                                Create a shipment
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            <div className="mb-10">
                <p className="text-sm font-rocGroteskBold mb-3">Get started with Fleet+</p>
                <div>
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 max-lg:grid-cols-[1fr_1fr] max-sm:grid-cols-[1fr]">
                        {getStartedContent.map((item, idx) => {
                            return (
                                <div
                                    key={item.title + idx}
                                    className="flex gap-4 px-4 max-sm:px-4 py-4 border rounded cursor-pointer"
                                    onClick={() => item.action()}
                                >
                                    <div className="mt-[-2px]">{item.icon}</div>
                                    <div>
                                        <p className="text-sm font-rocGroteskBold mb-[2px]">
                                            {item.title}
                                        </p>
                                        <p className="text-xs font-rocGroteskRegular">
                                            {item.subText}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {getHotDeals(hotDeals)?.length > 0 && (
                <div className="mb-10">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-rocGroteskBold">Today's Hot Deals</p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Best rates from leading logistics providers.
                            </p>
                        </div>
                        <div>
                            <a
                                href="/dashboard/instant-quote"
                                className="underline text-xs font-rocGroteskMedium"
                            >
                                See all deals
                            </a>
                        </div>
                    </div>

                    <div>
                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] max-lg:grid-cols-[1fr_1fr_1fr] gap-4 max-sm:grid-cols-[1fr] max-sm:overflow-x-auto">
                            {getHotDeals(hotDeals)
                                ?.slice(0, 4)
                                ?.map((deal) => {
                                    return (
                                        <div
                                            key={deal._id?.id}
                                            className="pl-4 pr-2 py-4 border rounded cursor-pointer"
                                            onClick={() =>
                                                navigate(`/dashboard/instant-quote/${deal._id?.id}`)
                                            }
                                        >
                                            <div className="mb-4 flex">
                                                <div>
                                                    <ReactCountryFlag
                                                        countryCode={deal.originCountry}
                                                        svg
                                                        style={{
                                                            borderRadius: "100%",
                                                            width: "32px",
                                                            height: "30px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-[-8px] border-[2px] border-white mt-[-2px] rounded-full">
                                                    <ReactCountryFlag
                                                        countryCode={deal.destinationCountry}
                                                        svg
                                                        style={{
                                                            borderRadius: "100%",
                                                            width: "32px",
                                                            height: "30px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <p className="flex items-center gap-1 mb-2">
                                                <span className="text-sm font-rocGroteskMedium text-gun-metal">
                                                    {truncate(deal.originCountry, {
                                                        length: 20,
                                                    })}
                                                </span>
                                                <span className="material-icons text-xs text-gun-metal">
                                                    arrow_forward
                                                </span>
                                                <span className="text-sm font-rocGroteskMedium text-gun-metal">
                                                    {truncate(deal.destinationCountry, {
                                                        length: 20,
                                                    })}
                                                </span>
                                            </p>
                                            <div className="flex justify-between items-end gap-1">
                                                <div className="font-rocGroteskMedium text-mvx-neutral">
                                                    <p className="text-xs text-inherit leading-[17px]">
                                                        Starting from
                                                    </p>
                                                    <p className="text-sm text-inherit leading-[20px]">
                                                        {getCurrencyFromCurrencyCode(deal.currency)}
                                                        {formatMoney().format(deal.totalCharges)}
                                                    </p>
                                                </div>

                                                <p className="font-rocGroteskMedium text-xs px-2 py-1 bg-mvx-light-blue text-gun-metal w-fit rounded-[2px] flex items-center justify-center gap-2">
                                                    <i
                                                        className={`ri-ship-2-fill ${
                                                            deal?.mode?.toLowerCase() === "ocean"
                                                                ? "ocean-shipment-icon"
                                                                : deal?.mode?.toLowerCase() ===
                                                                  "land"
                                                                ? "land-shipment-icon"
                                                                : "air-shipment-icon"
                                                        } before:text-mvx-neutral`}
                                                    ></i>
                                                    <span className="text-inherit">
                                                        {deal._id?.loadType === "40" ||
                                                        deal._id?.loadType === "20"
                                                            ? "FCL"
                                                            : "LCL"}{" "}
                                                        •{" "}
                                                        {truncate(deal._id?.loadType, {
                                                            length: 10,
                                                        })}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}
            <div className="mb-10">
                <p className="text-sm font-rocGroteskBold mb-3">Shipments</p>
                <div>
                    <div className="flex gap-8 max-sm:gap-0 max-sm:justify-between max-sm:w-full mb-6">
                        {tabs.map((tab, idx) => {
                            return (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setActiveTab(idx);
                                    }}
                                    className={`flex gap-1 items-center ${
                                        activeTab === idx && "border-b-[3px] border-gun-metal"
                                    } w-fit py-2 cursor-pointer`}
                                >
                                    <p
                                        className={`text-sm capitalize font-rocGroteskMedium ${
                                            activeTab === idx
                                                ? "text-gun-metal"
                                                : "text-mvx-neutral"
                                        }`}
                                    >
                                        {tab}
                                    </p>
                                    {activeTab === idx && (
                                        <p className="flex justify-center items-center text-sm font-rocGroteskMedium text-mvx-neutral py-[2px] px-2 bg-[#E4E5E7] rounded-[10px]">
                                            {tableData?.slice(0, 5)?.length}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="border max-sm:border-none rounded">
                        <div className="w-full grid grid-cols-[1fr_1fr_2.5fr_1fr_1fr_0.2fr] my-3 px-4 max-sm:hidden">
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                SHIPMENT ID
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                CLIENT
                            </div>
                            <div className="flex justify-between pr-16">
                                <div className="uppercase text-xs font-rocGroteskMedium text-mvx-neutral">
                                    Origin
                                </div>
                                <div className="uppercase text-xs font-rocGroteskMedium text-mvx-neutral">
                                    Destination
                                </div>
                            </div>

                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                MODE
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                STATUS
                            </div>
                            <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral"></div>
                        </div>
                        <div>{displayShipments()}</div>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-20 right-12 max-sm:right-8">
                <Dropdown
                    value={""}
                    dropdown={
                        <div className="flex items-center relative justify-center rounded-full w-9 h-9 bg-white border shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                            <i className="ri-question-mark"></i>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF3347] top-[2px] left-[2px] absolute" />
                        </div>
                    }
                    dropdownContainerClasses={
                        "!py-0 left-[-195px] !top-[-375px] !max-h-fit shadow-dropdownShadow border rounded"
                    }
                    name={"dropdown"}
                    dropdownOptions={[
                        {
                            customChild: (
                                <div className="bg-white w-[230px] ">
                                    <div className="pt-2 flex flex-col mb-2 border-b">
                                        <a
                                            href={getOperatingSystem()}
                                            target={"_blank"}
                                            rel="noreferrer"
                                            className="text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2.5 cursor-pointer"
                                        >
                                            Get mobile app
                                        </a>
                                        <a
                                            href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2.5 cursor-pointer"
                                        >
                                            Contact sales
                                        </a>
                                        <a
                                            href="/about?contactUs=true"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2.5 cursor-pointer"
                                        >
                                            Submit feedback
                                        </a>
                                    </div>
                                    <div className="flex flex-col mb-2 ">
                                        <a
                                            href="https://chat.whatsapp.com/G4JFojXSPvtJ5aUSjwqF4Q"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2.5 cursor-pointer"
                                        >
                                            Join our community
                                        </a>
                                        <p
                                            onClick={() => {
                                                saveToStorage(
                                                    "productGuide",
                                                    JSON.stringify(productGuideData)
                                                );
                                                window.location.reload();
                                                toast.custom((t) => (
                                                    <CustomToast
                                                        t={t}
                                                        message={"Reset Successful"}
                                                        type="success"
                                                    />
                                                ));
                                            }}
                                            className="text-sm font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-2.5 cursor-pointer"
                                        >
                                            Reset onboarding
                                        </p>
                                    </div>
                                    <div className="flex flex-col border-b">
                                        <a
                                            href="https://twitter.com/fleetplus_"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-mvx-neutral font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-1.5 cursor-pointer"
                                        >
                                            Twitter - @fleetplus_
                                        </a>
                                        <a
                                            href="/cookie-policy"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-mvx-neutral font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-1.5 cursor-pointer"
                                        >
                                            Terms & Privacy
                                        </a>
                                        <a
                                            href="/faqs"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-mvx-neutral font-rocGroteskMedium hover:bg-mvx-light-blue px-4 py-1.5 cursor-pointer"
                                        >
                                            FAQ
                                        </a>
                                    </div>
                                    <div className="flex flex-col py-3">
                                        <p className="text-xs text-mvx-neutral font-rocGroteskMedium px-3 ">
                                            Fleet+ version 0.00001
                                        </p>
                                        <p className="text-xs text-mvx-neutral font-rocGroteskMedium px-3 ">
                                            Updated 24 hours ago
                                        </p>
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default Home;
