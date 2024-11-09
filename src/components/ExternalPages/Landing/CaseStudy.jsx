import React from "react";
import ExperienceLogisticsSection from "./components/ExperienceLogisticsSection";
import LandingNav2 from "./components/LandingNav2";
import LandingFooter2 from "./components/LandingFooter2";

const CaseStudy = () => {
    return (
        <div>
            <LandingNav2 />
            <div className="h-[70vh] lg:h-[75vh] w-full min-h-[500px] lg:min-h-[600px] max-h-[800px] about-us-hero">
                <div className="absolute top-0 left-0 h-full w-full about-us-hero-sub z-[5]" />
                <div className="absolute top-0 left-0 z-[4] h-full object-cover w-full bg-[url('https://res.cloudinary.com/dwp6wpymz/image/upload/v1706167225/trailers_c0zeav.png')]" />

                <div className="relative z-10 px-10">
                    <h1 className="text-center pt-[120px] text-[40px] lg:text-[75px] font-rocGroteskBold text-white leading-tight">
                        Streamlining Operations <br className="lg:block hidden" />
                        with Fleet+ for{" "}
                        <span className="text-[#B3F00D]">
                            Global <br className="lg:block hidden" />
                            Logistics Solutions Inc.
                        </span>
                    </h1>
                </div>
            </div>
            <div className="lg:pt-20 py-16 lg:pb-[120px] px-10">
                <h1 className="uppercase text-base lg:text-2xl font-inter tracking-[2px] text-[#03B5D1] font-bold text-center">
                    Background
                </h1>
                <h2 className="text-center text-[#000918] font-rocGroteskBold text-[40px] lg:text-[70px] mt-5">
                    Company Profile
                </h2>

                <p className="text-center max-w-[960px] mx-auto text-[#000918] text-opacity-50 font-inter text-sm lg:text-xl mt-4 leading-relaxed">
                    Global Logistics Solutions Inc. is a multinational freight and logistics company
                    with a diverse range of clients. handles complex international shipments
                    involving multiple carriers and modes of transport. Manual paperwork and
                    disconnected systems lead to delays, errors, and frustrated customers.
                    Visibility and tracking are limited, making it difficult to monitor shipments
                    and respond to inquiries.
                </p>
            </div>
            <div className="py-16 lg:py-[120px] bg-[#F8F8F8] px-10">
                <h1 className="uppercase text-base lg:text-2xl font-inter tracking-[2px] text-[#03B5D1] font-bold text-center">
                    CHALLENGE
                </h1>
                <h2 className="text-center text-[#000918] font-rocGroteskBold text-[40px] lg:text-[70px] mt-5 mb-4">
                    Analyzing the problem
                </h2>
                <p className="text-center max-w-[960px] mx-auto text-[#000918] text-opacity-50 font-inter text-sm lg:text-xl mt-4 leading-relaxed">
                    Unraveling challenges and charting a course for improvement with Fleet+.
                </p>

                <div className="max-w-[1120px] mx-auto mt-10 lg:mt-16">
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
                        <div className="px-4 py-2 lg:p-6 shadow-[0px_4px_32px_0px_rgba(0,0,0,0.06),0px_0px_4px_0px_rgba(0,0,0,0.04)] flex items-center bg-white rounded-2xl gap-4">
                            <div className="flex items-center justify-center bg-[#03B5D110] lg:w-16 lg:h-16 w-10 h-10 rounded-full flex-shrink-0">
                                <img
                                    src="/img/landing/quote-request.svg"
                                    alt="Quote Request"
                                    className="w-5 h-5 lg:w-[34px] lg:h-[34px]"
                                />
                            </div>
                            <p className="text-[#000918] font-rocGroteskBold text-base lg:text-[28px]">
                                Ineficiencies in operations
                            </p>
                        </div>
                        <div className="px-4 py-2 lg:p-6 shadow-[0px_4px_32px_0px_rgba(0,0,0,0.06),0px_0px_4px_0px_rgba(0,0,0,0.04)] flex items-center bg-white rounded-2xl gap-4">
                            <div className="flex items-center justify-center bg-[#03B5D110] lg:w-16 lg:h-16 w-10 h-10 rounded-full flex-shrink-0">
                                <img
                                    src="/img/landing/quote-request.svg"
                                    alt="Quote Request"
                                    className="w-5 h-5 lg:w-[34px] lg:h-[34px]"
                                />
                            </div>
                            <p className="text-[#000918] font-rocGroteskBold text-base lg:text-[28px]">
                                Manual Tracking
                            </p>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 lg:px-5 mx-auto mt-6 lg:mt-10">
                        <div className="px-4 py-2 lg:p-6 shadow-[0px_4px_32px_0px_rgba(0,0,0,0.06),0px_0px_4px_0px_rgba(0,0,0,0.04)] flex items-center bg-white rounded-2xl gap-4">
                            <div className="flex items-center justify-center bg-[#03B5D110] lg:w-16 lg:h-16 w-10 h-10 rounded-full flex-shrink-0">
                                <img
                                    src="/img/landing/quote-request.svg"
                                    alt="Quote Request"
                                    className="w-5 h-5 lg:w-[34px] lg:h-[34px]"
                                />
                            </div>
                            <p className="text-[#000918] font-rocGroteskBold text-base lg:text-[28px]">
                                Lack of Real-Time Visibility
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-16 lg:py-[120px] bg-[#00255E]">
                <h1 className="uppercase text-base lg:text-2xl font-inter tracking-[2px] text-[#03B5D1] font-bold text-center">
                    KEY RESULTS
                </h1>
                <p className="text-center text-white mb-16 mt-4 text-[42px] lg:text-[70px] font-rocGroteskBold">
                    Achieving Success with <span className="text-[#B3F00D]">Fleet+</span>
                </p>

                <div className="gap-10 max-w-[1120px] grid lg:grid-cols-3 mx-auto lg:px-0 px-10">
                    {[
                        {
                            title: "Increased Efficiency",
                            text: "Real-time tracking reduced delays and improved shipment planning.",
                        },
                        {
                            title: "Cost Reduction",
                            text: "Automated processes led to reduced manual efforts and operational costs.",
                        },
                        {
                            title: "Client Satisfaction",
                            text: "Enhanced visibility and proactive communication improved customer satisfaction.",
                        },
                    ]?.map((d) => (
                        <div
                            className="shadow-[0px_4px_32px_0px_rgba(0,0,0,0.06),0px_0px_4px_0px_rgba(0,0,0,0.04)] rounded-2xl bg-[rgba(255,255,255,0.08)] p-8"
                            key={d?.title}
                        >
                            <div className="h-20 w-20 flex items-center justify-center bg-[#03B5D114] rounded-full">
                                <img
                                    src="/img/landing/quote-request.svg"
                                    alt="Quote Request"
                                    className=""
                                />
                            </div>
                            <h1 className="mt-5 mb-3 text-2xl font-rocGroteskBold text-white">
                                {d?.title}
                            </h1>
                            <p className="text-white text-opacity-70 font-inter">{d?.text}</p>
                        </div>
                    ))}
                </div>
            </div>
            <ExperienceLogisticsSection />
            <LandingFooter2 />
        </div>
    );
};

export default CaseStudy;
