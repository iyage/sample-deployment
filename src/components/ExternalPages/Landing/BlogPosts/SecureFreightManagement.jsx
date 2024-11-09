import React from "react";
import LandingNav2 from "../components/LandingNav2";
import FooterSubscribe from "../components/FooterSubscribe";
import LandingFooter2 from "../components/LandingFooter2";

const SecureFreightManagement = () => {
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
                    Secure and Seamless: Fleet+ Transforming <br className="lg:block hidden" />
                    Freight Management
                </p>
                <p className="text-center text-[#888F9C] font-inter uppercase">
                    24th November, 2023
                </p>
            </div>

            <div className="lg:w-[89vw] mx-auto lg:px-[26px] px-10">
                <img
                    src="https://res.cloudinary.com/dwp6wpymz/image/upload/v1706433922/Image_from_iOS_t6gcgd.jpg"
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
                                Freight management is a complex task that demands precision,
                                security, and seamless coordination. Fleet+ emerges as the go-to
                                solution, transforming freight management for businesses by ensuring
                                security, efficiency, and operational excellence.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    1. Secure Cargo Tracking:
                                </span>{" "}
                                Fleet+ provides freight operators with advanced cargo tracking
                                features, offering real-time visibility into the location and
                                condition of shipments. This not only enhances security but also
                                allows for immediate intervention in case of any anomalies or
                                delays.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    2. Risk Mitigation:
                                </span>{" "}
                                Freight+ incorporates risk mitigation tools to identify and address
                                potential risks in real time. By leveraging predictive analytics and
                                historical data, operators can anticipate challenges, implement
                                preventive measures, and minimize the impact of unforeseen events on
                                their freight operations.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    3. Integration with Customs Compliance:
                                </span>{" "}
                                Navigating customs regulations is a critical aspect of freight
                                management. Fleet+ integrates seamlessly with customs compliance
                                systems, automating documentation processes and ensuring that
                                freight operators comply with international trade regulations. This
                                not only reduces the risk of delays but also minimizes the chances
                                of fines or penalties.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    4. Secure Data Transmission:
                                </span>{" "}
                                Security is a top priority in freight management. Fleet+ employs
                                state-of-the-art encryption and secure data transmission protocols
                                to protect sensitive information related to shipments, ensuring that
                                data is only accessible to authorized personnel and stakeholders.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                <span className="text-[#000918] font-semibold">
                                    5. Real-Time Communication with Drivers:
                                </span>{" "}
                                Effective communication between operators and drivers is vital for
                                seamless freight management. Fleet+ facilitates real-time
                                communication through a secure platform, allowing operators to relay
                                important instructions, receive updates, and address any issues
                                promptly, ensuring a smooth flow of freight operations.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                By choosing Fleet+, freight operators can confidently navigate the
                                challenges of their industry, knowing that their operations are
                                secure, efficient, and well-optimized for success.
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

export default SecureFreightManagement;
