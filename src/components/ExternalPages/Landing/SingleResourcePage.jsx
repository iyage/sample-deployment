import React from "react";
import LandingNav2 from "./components/LandingNav2";

const SingleResourcePage = () => {
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

            <div className="pb-20 pt-[120px]">
                <h1 className="uppercase text-2xl font-inter tracking-[2px] text-[#03B5D1] font-bold text-center">
                    LOGISTICS
                </h1>
                <p className="text-center mt-4 mb-3 font-rocGroteskBold text-[50px] text-[#000918]">
                    Reshaping Trade Finance for African <br />
                    Businesses with Tech
                </p>
                <p className="text-center text-[#888F9C] font-inter uppercase">
                    22nd November, 2023
                </p>
            </div>

            <div className="w-[89vw] max-lg:w-[94vw] mx-auto px-[26px]">
                <img
                    src="https://res.cloudinary.com/dwp6wpymz/image/upload/v1706084118/blog-sample_soy7bp.png"
                    alt="Resource Sample"
                    className="w-full"
                />
                <div className="mt-[80px] grid grid-cols-[1fr_80px] gap-[120px]">
                    <div>
                        <h1 className="text-[#03B5D1] text-lg font-inter font-bold tracking-[2px]">
                            LABEL
                        </h1>
                        <h1 className="font-rocGroteskBold text-[36px] text-[#000918] mb-3">
                            Gathering Cyber Threat Intelligence on the Dark Web: Guidance for the
                            Private Sector
                        </h1>

                        <div className="space-y-2">
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                For cyber investigators, obtaining the complete picture for analysis
                                is increasingly important. Openly available information, commercial
                                data sets, and cyber intelligence feeds may form important
                                components of an investigation, but an additional source is often
                                omitted: the Dark Web.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                The Dark Web can be a valuable place to look when investigating
                                cyber threats. Illicit forums, or Dark Markets, are a haven for
                                criminals to discuss targets, share tactics, and even sell
                                vulnerabilities (such as malware) and data breach information.
                                Companies may also find their own customer data or internal login
                                credentials available to the highest bidder.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                Referring to websites and content that require special software and
                                protocols to access, the Dark Web is a general term that includes
                                sites accessible via TOR, Freenet, I2P, and other methods. Analysts
                                may face impediments to access including additional IT security
                                burdens, especially if accessing via an organization’s primary
                                network or on a dedicated standalone network used for research.
                            </p>
                            <p className="text-[#888F9C] font-inter font-medium text-lg">
                                For many organizations, visibility into cyber threats exchanged on
                                Dark Web forums provides a critical advantage to information
                                security practitioners who need to stay ahead of malicious actors
                                and understand the threat landscape.
                            </p>
                        </div>
                        <div className="p-8 bg-[#F8F8F8] rounded-2xl my-8 ">
                            <p className="text-[#000918] font-rocGroteskMedium text-[32px]">
                                “Gathering Cyber Threat Intelligence on the Dark Web: Guidance for
                                the Private Sector”
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col pt-10 space-y-7">
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
        </div>
    );
};

export default SingleResourcePage;
