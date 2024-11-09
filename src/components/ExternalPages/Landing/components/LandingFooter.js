// import {
// AppleStoreIcon,
// FacebookIcon,
// FooterLogo,
// GoogleStoreIcon,
// InstagramIcon,
// LinkedInIcon,
// TwitterIcon,
// } from "assets/arts";
import Loader from "components/common/Loader";
import { useState } from "react";
import { Link } from "react-router-dom";
import { websiteService } from "services";

const LandingFooter = () => {
    const [email, setEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);
    const emailRegex = /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+$/;

    return (
        <>
            <div className="bg-white h-[1px] mx-[85px] max-lg:mx-[45px] 2xl:mx-40 1750:mx-52" />
            <footer className="lg:grid grid-cols-[50%,50%] gap-x-8 1400:grid-cols-[60%,40%] max-lg:px-6 px-[70px] xl:px-[127px] pt-16 pb-[105px] max-lg:flex max-lg:flex-col max-lg:justify-center 2xl:px-48 1750:px-60 ">
                <h3 className="!text-pacific-cyan font-rocGroteskMedium text-[40px] lg:text-4xl 1100:text-[40px] max-sm:!leading-[34.56px] !leading-[57.6px] mt-3 max-sm:text-2xl max-lg:text-center max-sm:mb-8">
                    Sign up today to grow your <br />
                    business
                </h3>
                {/* <div className="1400:ml-auto">
                    <p className="text-white text-sm 420:text-lg max-lg:text-center max-sm:text-sm max-sm:mt-3 max-lg:mt-9">
                        It’s so easy to use; it’s perfect for freight forwarders new{" "}
                        <br className="max-1500:hidden" /> to freight technology.
                    </p>
                </div> */}
            </footer>
            <footer
                className={`max-lg:hidden px-3 400:px-4 sm:px-16 1100:px-[70px] xl:px-[176px] pb-[72px] relative z-10 [&_*]:text-white 2xl:px-56 1750:px-72`}
            >
                {/* <FooterLogo className="mb-5" /> */}
                <img src="/logo.svg" alt="Footer Logo" className="" width={32} height={32} />
                <div className="flex items-start border-b border-[#DFE1E6] pb-7">
                    {/* <h3 className="font-rocGroteskBold text-2xl">
                        A business Ally
                        <span className="block mt-1">you can trust</span>
                        <span className="block font-rocGroteskMedium text-sm mt-1">
                            Fleet+ Inc. All rights reserved.
                        </span>
                    </h3> */}

                    <h3 className="font-rocGroteskBold mt-[6px] text-sm ml-auto">
                        SUPPORT
                        <Link
                            to={"/about?contactUs=true"}
                            className="block font-rocGroteskMedium text-sm mt-4"
                        >
                            Contact us
                        </Link>
                        <Link to={"/faqs"} className="block font-rocGroteskMedium text-sm mt-4">
                            FAQs
                        </Link>
                    </h3>

                    <h3 className="font-rocGroteskBold text-sm mt-[6px] ml-14">
                        EMAIL
                        <a
                            href="mailto:hello@fleetplus.io"
                            className="block font-rocGroteskMedium text-sm mt-4"
                        >
                            hello@fleetplus.io
                        </a>
                    </h3>

                    <h3 className="font-rocGroteskBold mt-[6px] text-sm ml-[50px]">
                        ADDRESS
                        <p className="block font-rocGroteskMedium text-sm mt-4">
                            19, Dr. S. Ezekuse Close, Lekki Phase 1, Lagos.
                        </p>
                    </h3>
                </div>

                <div className="flex items-center justify-between pt-5">
                    <h3 className="font-rocGroteskBold text-2xl">
                        Stay in the Loop
                        <span className="block font-rocGroteskMedium text-base mt-2">
                            Subscribe to our newsletter.
                        </span>
                    </h3>

                    <div className="basis-[50%] ml-auto mr-2 grid grid-cols-[80%,1fr] items-center">
                        <input
                            className={`border text-sm font-rocGroteskMedium h-[48px] px-[10px] border-[#DFE1E6] border-r-0 text-[#DFE1E6] rounded-l py-[9.3px] bg-inherit translate-y-[.4px] placeholder:text-sm placeholder:font-rocGroteskMedium placeholder:text-[#6B778C]`}
                            placeholder="Your email address"
                            type={"email"}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <button
                            type="button"
                            disabled={!email.match(emailRegex)}
                            onClick={() => {
                                websiteService.subscribeToNewsletter(
                                    { email },
                                    setEmail,
                                    setSubscribing
                                );
                            }}
                            className="bg-white font-rocGroteskMedium py-[10.2px] h-[48px] !text-gun-metal rounded-l-none rounded-r text-base"
                        >
                            {subscribing ? <Loader size={4} color="gun-metal" /> : "Subscribe"}
                        </button>
                    </div>

                    {/* <div className="flex justify-between items-center [&>*:not(first-of-type)]:ml-5">
                        <a
                            href="https://twitter.com/TradeAlly_io"
                            target={"_blank"}
                            rel="noreferrer"
                        >
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261897/Web%20App/Twitter_sixlxb.svg"
                                }
                                alt="Twitter Icon"
                                width={24}
                                height={24}
                            />
                        </a>
                        <a href="https://facebook.com/TradeAlly" target={"_blank"} rel="noreferrer">
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261442/Web%20App/Facebook_kybnjz.svg"
                                }
                                alt="Facebook Icon"
                                width={24}
                                height={24}
                            />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/89720177/admin/"
                            target={"_blank"}
                            rel="noreferrer"
                        >
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261771/Web%20App/LinkedIn_w7ug35.svg"
                                }
                                alt="LinkedIn Icon"
                                width={24}
                                height={24}
                            />
                        </a>
                        <a
                            href="https://www.instagram.com/tradeally_io/"
                            target={"_blank"}
                            rel="noreferrer"
                        >
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261586/Web%20App/Instagram_sx2yaz.svg"
                                }
                                alt="Instagram Icon"
                                width={24}
                                height={24}
                            />
                        </a>
                    </div> */}
                </div>
            </footer>
            <footer
                className={`max-lg:block hidden max-lg:px-6 pt-6 pb-10 relative z-10 [&_*]:text-white`}
            >
                <div className="flex gap-[10px] justify-center">
                    <span>
                        <img src="/logo.svg" alt="Footer Logo" width={32} height={32} />
                    </span>
                    <span>
                        <h3 className="font-rocGroteskBold text-2xl max-sm:text-lg">
                            A business Ally you can trust
                        </h3>
                    </span>
                </div>
                <div className="flex items-center justify-center max-lg:gap-10 max-sm:gap-6 just border-b border-[#DFE1E6] pb-7 mt-4">
                    <h3 className="font-rocGroteskBold mt-[6px]  ">
                        <Link
                            to={"/about?contactUs=true"}
                            className="block font-rocGroteskMedium max-lg:text-base max-sm:text-sm "
                        >
                            Contact us
                        </Link>
                    </h3>

                    <h3 className="font-rocGroteskBold mt-[6px]  ">
                        <Link
                            to={"/faqs"}
                            className="block font-rocGroteskMedium max-lg:text-base max-sm:text-sm"
                        >
                            FAQs
                        </Link>
                    </h3>

                    <h3 className="font-rocGroteskBold  mt-[6px] ">
                        <a
                            href="mailto:hello@tradeally.io"
                            className="block font-rocGroteskMedium max-lg:text-base max-sm:text-sm "
                        >
                            hello@tradeally.io
                        </a>
                    </h3>
                </div>

                <div className="flex max-lg:flex-col max-lg:justify-center items-center justify-between pt-5">
                    <h3 className="font-rocGroteskBold text-2xl mb-[14px]">
                        Stay in the Loop
                        <span className="block font-rocGroteskMedium text-sm mt-2">
                            Subscribe to our newsletter.
                        </span>
                    </h3>

                    <div className="w-[75%] gap-3 max-lg:ml-0 mr-2 flex flex-col justify-center mb-[14px]">
                        <input
                            className={`border text-sm font-rocGroteskMedium px-[10px] border-[#DFE1E6] text-[#DFE1E6] rounded py-[9.3px] bg-inherit translate-y-[.4px] placeholder:text-[11px] placeholder:font-rocGroteskMedium placeholder:text-[#6B778C]`}
                            placeholder="Your email address"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <button
                            type="button"
                            disabled={!email.match(emailRegex)}
                            onClick={() => {
                                websiteService.subscribeToNewsletter(
                                    { email },
                                    setEmail,
                                    setSubscribing
                                );
                            }}
                            className="bg-white font-rocGroteskMedium py-[10.2px] !text-gun-metal rounded text-sm mt-1"
                        >
                            {subscribing ? <Loader size={4} color="gun-metal" /> : "Subscribe"}
                        </button>
                    </div>

                    <div className="flex justify-between items-center gap-7 mt-5 mb-8">
                        {/* <YoutubeIcon /> */}
                        <a
                            href="https://twitter.com/TradeAlly_io"
                            target={"_blank"}
                            rel="noreferrer"
                        >
                            {/* <TwitterIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261897/Web%20App/Twitter_sixlxb.svg"
                                }
                                alt="Twitter Icon"
                                width={24}
                                height={24}
                            />
                        </a>
                        <a href="https://facebook.com/TradeAlly" target={"_blank"} rel="noreferrer">
                            {/* <FacebookIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261442/Web%20App/Facebook_kybnjz.svg"
                                }
                                alt="Facebook Icon"
                                width={24}
                                height={24}
                            />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/89720177/admin/"
                            target={"_blank"}
                            rel="noreferrer"
                        >
                            {/* <LinkedInIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261771/Web%20App/LinkedIn_w7ug35.svg"
                                }
                                alt="LinkedIn Icon"
                                width={24}
                                height={24}
                            />
                        </a>
                        <a
                            href="https://www.instagram.com/tradeally_io/"
                            target={"_blank"}
                            rel="noreferrer"
                        >
                            {/* <InstagramIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261586/Web%20App/Instagram_sx2yaz.svg"
                                }
                                alt="Instagram Icon"
                                width={24}
                                height={24}
                            />
                        </a>
                    </div>
                    <p className="text-center">USA: 7000 North Mopac Expressway Austin, Texas</p>
                </div>
            </footer>
        </>
    );
};

export default LandingFooter;
