import React from "react";
import LandingNav2 from "../components/LandingNav2";
import FooterSubscribe from "../components/FooterSubscribe";
import LandingFooter2 from "../components/LandingFooter2";

const RevolutionizingLogistics = () => {
    const blogLinks = [
        { logo: "/img/landing/twitter.svg", alt: "Twitter" },
        { logo: "/img/landing/instagram.svg", alt: "Instagram" },
        { logo: "/img/landing/linkedin.svg", alt: "Linkedin" },
        { logo: "/img/landing/blog-mail.svg", alt: "Mail" },
        { logo: "/img/landing/whatsapp.svg", alt: "Whatsapp" },
        { logo: "/img/landing/facebook.svg", alt: "Facebook" },
        { logo: "/img/landing/blog-link.svg", alt: "Link" },
    ];
    return (
        <div>
            <LandingNav2 />
            <div className="pb-10 lg:pb-20 lg:pt-[120px] pt-[80px]">
                {/* <h1 className="uppercase text-2xl font-inter tracking-[2px] text-[#03B5D1] font-bold text-center">
                    LOGISTICS
                </h1> */}
                <p className="text-center mt-4 mb-3 font-rocGroteskBold text-[38px] lg:text-[50px] text-[#000918] px-5">
                    Revolutionizing Logistics: How Fleet+ Enhances{" "}
                    <br className="lg:block hidden" />
                    Freight Forwarders' Efficiency
                </p>
                <p className="text-center text-[#888F9C] font-inter uppercase">
                    24th November, 2023
                </p>
            </div>

            <div className="lg:w-[89vw] mx-auto lg:px-[26px] px-10">
                <img
                    src="https://res.cloudinary.com/dwp6wpymz/image/upload/v1706433923/Image_from_iOS_2_q7w1z3.jpg"
                    alt="Resource Sample"
                    className="w-full max-h-[250px] lg:max-h-[450px] object-cover"
                />
                <div className="mt-10 lg:mt-[80px] grid lg:grid-cols-[1fr_80px] gap-[60px] lg:gap-[120px]">
                    <div>
                        {/* <h1 className="text-[#03B5D1] text-lg font-inter font-bold tracking-[2px]">
                            LABEL
                        </h1> */}
                        {/* <h1 className="font-rocGroteskBold text-[36px] text-[#000918] mb-3">
                            Gathering Cyber Threat Intelligence on the Dark Web: Guidance for the
                            Private Sector
                        </h1> */}

                        <div className="space-y-2">
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                In the fast-paced world of logistics, efficiency is key. Freight
                                forwarders face the challenge of managing complex supply chains
                                while ensuring timely and cost-effective deliveries. Enter Fleet+, a
                                cutting-edge solution designed to streamline and optimize logistics
                                processes for freight forwarders.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    1. Real-Time Visibility:
                                </span>{" "}
                                Fleet+ provides freight forwarders with real-time visibility into
                                their entire fleet. From tracking vehicles on the road to monitoring
                                cargo in transit, this feature allows operators to make informed
                                decisions, optimize routes, and proactively address potential
                                delays.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    2. Route Optimization:
                                </span>{" "}
                                Efficient routes are the lifeline of logistics operations. Fleet+
                                employs advanced algorithms to optimize routes based on various
                                factors such as traffic conditions, delivery windows, and fuel
                                efficiency. This not only reduces operational costs but also ensures
                                on-time deliveries.
                            </p>{" "}
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    3. Predictive Analytics:
                                </span>{" "}
                                Anticipating challenges before they arise is crucial in the
                                logistics industry. Fleet+ harnesses the power of predictive
                                analytics, leveraging historical data to forecast potential
                                disruptions, plan for contingencies, and enhance overall operational
                                resilience.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    4. Asset Management:
                                </span>{" "}
                                Effective asset management is paramount for freight forwarders.
                                Fleet+ provides a centralized platform for tracking and managing
                                assets, from trucks and containers to equipment. This feature
                                improves resource allocation, minimizes idle time, and extends the
                                lifespan of valuable assets.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    5. Paperless Documentation:
                                </span>{" "}
                                Say goodbye to paperwork. Fleet+ streamlines documentation
                                processes, enabling digital record-keeping for shipments, invoices,
                                and compliance documents. This not only reduces the risk of errors
                                but also enhances overall operational efficiency by eliminating
                                manual paperwork.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                In adopting Fleet+, freight forwarders can revolutionize their
                                operations, delivering a seamless and efficient experience to
                                clients while staying ahead in an increasingly competitive industry.
                            </p>
                        </div>
                    </div>
                    <div className="flex lg:flex-col items-center lg:items-start lg:pt-10 lg:space-y-7 flex-wrap justify-center lg:justify-start gap-6 lg:gap-0">
                        {blogLinks?.map((b) => (
                            <div
                                key={b?.alt}
                                className="w-[72px] h-[72px] bg-[#F8F8F8] border border-[#0000001A] rounded-full flex items-center justify-center"
                            >
                                <img src={b?.logo} alt={b?.alt} className="" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <FooterSubscribe />
            <LandingFooter2 />
        </div>
    );
};

export default RevolutionizingLogistics;
