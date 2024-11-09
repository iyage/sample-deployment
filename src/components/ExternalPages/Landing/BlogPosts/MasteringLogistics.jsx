import React from "react";
import LandingNav2 from "../components/LandingNav2";
import FooterSubscribe from "../components/FooterSubscribe";
import LandingFooter2 from "../components/LandingFooter2";

const MasteringLogistics = () => {
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
            <div>
                <LandingNav2 />
                <div className="pb-10 lg:pb-20 lg:pt-[120px] pt-[80px]">
                    {/* <h1 className="uppercase text-2xl font-inter tracking-[2px] text-[#03B5D1] font-bold text-center">
                    LOGISTICS
                </h1> */}
                    <p className="text-center mt-4 mb-3 font-rocGroteskBold text-[38px] lg:text-[50px] text-[#000918] px-5">
                        Mastering Logistics Complexity with Fleet+:{" "}
                        <br className="lg:block hidden" />A Game-Changer for Operators
                    </p>
                    <p className="text-center text-[#888F9C] font-inter uppercase">
                        24th November, 2023
                    </p>
                </div>

                <div className="lg:w-[89vw] mx-auto lg:px-[26px] px-10">
                    <img
                        src="https://res.cloudinary.com/dwp6wpymz/image/upload/v1706433922/Image_from_iOS_1_os7mge.jpg"
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
                                    Logistics operators face a myriad of challenges in managing the
                                    intricate web of supply chains, shipments, and regulatory
                                    compliance. Fleet+ emerges as a game-changer, offering
                                    comprehensive solutions to master the complexities of logistics
                                    operations.
                                </p>
                                <p className="text-[#888F9C] font-inter font-medium text-lg">
                                    <span className="text-[#000918] font-semibold">
                                        1. Centralized Command Center:
                                    </span>{" "}
                                    Fleet+ serves as the central command center for logistics
                                    operators, providing a unified dashboard to monitor and manage
                                    all facets of operations. This bird's-eye view enhances control
                                    and decision-making, ensuring a synchronized and
                                    well-coordinated logistics network.
                                </p>
                                <p className="text-[#888F9C] font-inter font-medium text-lg">
                                    <span className="text-[#000918] font-semibold">
                                        2. Compliance Management:
                                    </span>{" "}
                                    Navigating the regulatory landscape is a constant challenge in
                                    logistics. Fleet+ integrates compliance management features,
                                    automating documentation processes and ensuring adherence to
                                    international shipping regulations. This not only mitigates
                                    risks but also facilitates smooth cross-border operations.
                                </p>
                                <p className="text-[#888F9C] font-inter font-medium text-lg">
                                    <span className="text-[#000918] font-semibold">
                                        3. Inventory Optimization:
                                    </span>{" "}
                                    Efficient inventory management is critical for logistics
                                    operators. Fleet+ optimizes inventory levels by providing
                                    real-time insights into stock levels, order fulfillment, and
                                    demand forecasting. This prevents stockouts, reduces carrying
                                    costs, and enhances overall supply chain efficiency.
                                </p>
                                <p className="text-[#888F9C] font-inter font-medium text-lg">
                                    <span className="text-[#000918] font-semibold">
                                        4. Collaboration and Communication:
                                    </span>{" "}
                                    Logistics is a team effort, and communication is key. Fleet+
                                    incorporates collaboration tools that enable seamless
                                    communication among team members, drivers, and other
                                    stakeholders. This fosters a culture of transparency and ensures
                                    everyone is on the same page, leading to smoother operations.
                                </p>
                                <p className="text-[#888F9C] font-inter font-medium text-lg">
                                    <span className="text-[#000918] font-semibold">
                                        5. Customer Experience Enhancement:
                                    </span>{" "}
                                    In the era of heightened customer expectations, Fleet+ elevates
                                    the customer experience. From real-time shipment tracking to
                                    transparent communication and accurate delivery estimates,
                                    logistics operators using Fleet+ can provide a superior
                                    experience that sets them apart in the market.
                                </p>
                                <p className="text-[#888F9C] font-inter font-medium text-lg">
                                    By leveraging Fleet+, logistics operators can not only navigate
                                    the complexities of their industry but also elevate their
                                    operations to new heights of efficiency and customer
                                    satisfaction.
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
        </div>
    );
};

export default MasteringLogistics;
