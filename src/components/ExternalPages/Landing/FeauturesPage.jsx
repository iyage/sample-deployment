import React, { useState } from "react";
import ExperienceLogisticsSection from "./components/ExperienceLogisticsSection";
import ScheduleSection from "./components/ScheduleSection";
import LandingNav2 from "./components/LandingNav2";
import Button from "components/common/Button";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import LandingFooter2 from "./components/LandingFooter2";

const FeauturesPage = () => {
    const navigate = useNavigate();
    const tabs = [
        { title: "For Freight Forwarders", key: "forwarders" },
        { title: "For Shippers", key: "shippers" },
    ];
    const [activeTab, setActiveTab] = useState(tabs?.at(0)?.key);

    const featuresList = [
        {
            title: "Quote Management",
            icon: "/img/landing/quote-request-features.svg",
            description:
                "Generate instant quotes with ease. Provide your clients with quick and accurate pricing information, enhancing their experience with you.",
            type: "forwarders",
        },
        {
            title: "Invoice Management",
            icon: "/img/landing/features-invoice.svg",
            description:
                "Manage invoices and billing. Integrate your financial processes with our user-friendly invoice management system.",
            type: "forwarders",
        },
        {
            title: "Warehouse Management",
            icon: "/img/landing/features-warehouse.svg",
            description:
                "Optimize your warehouse operations with our premium warehouse management features. Ensure efficient storage, retrieval, and inventory control.",
            type: "forwarders",
        },
        {
            title: "Easy Payment",
            icon: "/img/landing/features-payment.svg",
            description:
                "Simplify payment processes with Fleet+. Manage invoices, track payments, and ensure a smooth financial transaction experience.",
            type: "forwarders",
        },
        {
            title: "Order Management",
            icon: "/img/landing/features-order.svg",
            description:
                "Enhance order fulfilment with our order management features. Ensure your order processing workflow is at its best.",
            type: "forwarders",
        },
        {
            title: "Rate Management",
            icon: "/img/landing/features-rate.svg",
            description:
                "Enhance order fulfilment with our order management features. Ensure your order processing workflow is at its best.",
            type: "forwarders",
        },
        {
            title: "Transport Management",
            icon: "/img/landing/features-transport.svg",
            description:
                "Effectively manage your transportation operations. From route optimization to vehicle tracking, Fleet+ has you covered.",
            type: "forwarders",
        },
        {
            title: "Inventory Management",
            icon: "/img/landing/features-inventory.svg",
            description:
                "Take your inventory management to the next level with our premium features. Keep track of stock levels, manage orders, and prevent stockouts.",
            type: "forwarders",
        },
        {
            title: "Booking and Scheduling",
            icon: "/img/landing/features-bookings.svg",
            description:
                "Enhance your operational efficiency with easy-to-use booking and scheduling features. Don’t waste time looking for carriers or forwarders.",
            type: "shippers",
        },
        {
            title: "Shipment Management",
            icon: "/img/landing/features-shipment.svg",
            description:
                "Track and manage all your shipments in one place. Stay on top of delivery schedules, monitor progress, and ensure smooth transportation.",
            type: "shippers",
        },
        {
            title: "Document Management",
            icon: "/img/landing/features-document.svg",
            description:
                "Organise and store essential documents securely. Simplify document retrieval and enhance collaboration among team members.",
            type: "shippers",
        },
        {
            title: "Shipment Tracking",
            icon: "/img/landing/features-tracking.svg",
            description:
                "Real-time tracking of shipments for enhanced visibility. Keep your clients informed and build trust with accurate and up-to-date tracking information.",
            type: "shippers",
        },
    ];
    return (
        <div>
            <LandingNav2 />
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:max-h-[800px] lg:h-[90vh] lg:min-h-[800px]">
                <div className="pt-[120px] lg:pt-[180px] lg:pl-[26px] px-10 lg:ml-[5.5vw] w-full lg:pr-10">
                    <h1 className="text-[#03B5D1] font-inter font-bold tracking-[2px] text-xl">
                        WHY FLEET+?
                    </h1>
                    <p className="text-[40px] lg:text-[70px] mt-4 text-[#000918] leading-[1.2] font-rocGroteskBold">
                        Solutions just <br />
                        for you
                    </p>
                    <p className="text-[#888F9C] font-inter text-sm lg:text-lg mb-5">
                        Our intelligent matching algorithm ensures you find the{" "}
                        <br className="lg:block hidden" />
                        perfect freight solutions that meet your specific shipping{" "}
                        <br className="lg:block hidden" />
                        requirements.
                    </p>
                    <Button
                        onClick={() => navigate("/register")}
                        className="!w-[177px] lg:!w-[284px] text-[#000918] py-3 rounded-lg bg-[#B3F00D] font-semibold font-inter text-sm lg:text-lg border-2 border-[#B3F00D]"
                    >
                        Get Started for free
                    </Button>
                </div>

                <img
                    src="https://res.cloudinary.com/dwp6wpymz/image/upload/v1706713070/Rectangle_2922_a3ch6g.png"
                    alt="Engineer"
                    className="w-full h-auto lg:hidden block"
                />

                <div className="w-full h-full bg-[url('https://res.cloudinary.com/dwp6wpymz/image/upload/v1706226996/solutions_cvod6e.png')] bg-no-repeat bg-[length:100%_100%] lg:block hidden" />
            </div>
            <div className="py-20 bg-[#F8F8F8] w-full">
                <div className="lg:w-[89vw] lg:px-[26px] mx-auto px-10 ">
                    <div className="flex gap-6 lg:gap-10 w-full overflow-x-scroll pb-14 scrollbar-hide">
                        {tabs?.map((t) => (
                            <h1
                                key={t?.key}
                                className={classNames(
                                    "font-rocGroteskBold text-2xl lg:text-[30px] relative cursor-pointer flex-shrink-0",
                                    {
                                        "text-[#00255E] landing-tab-active": t.key === activeTab,
                                        "text-[#888F9C]": t.key !== activeTab,
                                    }
                                )}
                                onClick={() => setActiveTab(t?.key)}
                            >
                                {t?.title}
                            </h1>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10">
                        {featuresList
                            ?.filter((f) => f?.type === activeTab)
                            ?.map((f) => (
                                <div
                                    key={f?.title}
                                    className="px-6 py-10 bg-white rounded-2xl shadow-[0px_4px_32px_0px_rgba(0,0,0,0.06),0px_0px_4px_0px_rgba(0,0,0,0.04)] flex lg:items-center gap-4 lg:flex-row flex-col"
                                >
                                    <div className="rounded-full h-24 w-24 bg-[#03B5D110] flex items-center justify-center flex-shrink-0">
                                        <img src={f?.icon} alt={f?.title} />
                                    </div>
                                    <div>
                                        <h1 className="text-xl lg:text-2xl font-rocGroteskBold mb-2 text-[#000918]">
                                            {f?.title}
                                        </h1>
                                        <p className="font-inter font-medium text-[#888F9C] text-sm lg:text-base">
                                            {f?.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="flex items-center justify-center mt-12">
                        <Button
                            className="!w-[180px] lg:!w-[288px] py-4 rounded-lg text-sm lg:text-xl font-inter font-semibold"
                            onClick={() => navigate("/register")}
                        >
                            Get Started for Free
                        </Button>
                    </div>
                </div>
            </div>
            <ScheduleSection />
            <ExperienceLogisticsSection />
            <LandingFooter2 />
        </div>
    );
};

export default FeauturesPage;
