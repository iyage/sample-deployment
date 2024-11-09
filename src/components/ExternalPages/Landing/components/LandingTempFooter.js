// import {
// FacebookIcon,
// FooterLogo,
// InstagramIcon,
// LinkedInIcon,
// TwitterIcon,
// YoutubeIcon,
// } from "assets/arts";
import { Link } from "react-router-dom";

const LandingTempFooter = () => {
    return (
        <>
            <footer className="bg-gun-metal max-1100:hidden px-3 400:px-4 sm:px-16 1100:px-[70px] xl:px-[176px] pt-28 pb-24 relative z-10 [&_*]:text-white">
                {/* <FooterLogo className="mb-5" /> */}
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687260980/Web%20App/footer-logo_uoq8i1.svg"
                    }
                    alt="Footer Logo"
                    className="mb-5"
                />
                <div className="flex items-center border-b border-[#DFE1E6] pb-7">
                    <h3 className="font-rocGroteskBold text-2xl">
                        An Ally You Can Trust
                        <span className="block font-rocGroteskMedium text-sm mt-1">
                            Fleet+ Inc. All rights reserved.
                        </span>
                    </h3>

                    <h3 className="font-rocGroteskBold mt-[6px] text-sm ml-auto">
                        SUPPORT
                        <Link to={"#"} className="block font-rocGroteskMedium text-sm mt-4">
                            Contact us
                        </Link>
                    </h3>

                    <h3 className="font-rocGroteskBold text-sm mt-[6px] ml-14">
                        EMAIL
                        <a
                            href="mailto:beta@tradeally.io"
                            className="block font-rocGroteskMedium text-sm mt-4"
                        >
                            beta@tradeally.io
                        </a>
                    </h3>

                    <h3 className="font-rocGroteskBold mt-[6px] text-sm ml-[50px]">
                        ADDRESS
                        <Link to={"#"} className="block font-rocGroteskMedium text-sm mt-4">
                            USA: 7000 North Mopac Expressway, Austin, Texas, 78731
                        </Link>
                    </h3>
                </div>

                <div className="flex items-center justify-between pt-5">
                    <h3 className="font-rocGroteskBold text-2xl">
                        Stay in the Loop
                        <span className="block font-rocGroteskMedium text-sm mt-2">
                            Subscribe to our newsletter.
                        </span>
                    </h3>

                    <form className="flex items-center" onClick={(evt) => evt.preventDefault()}>
                        <input
                            className="border text-sm font-rocGroteskMedium px-[10px] border-[#DFE1E6] text-[#DFE1E6] rounded-l py-[9.3px] bg-gun-metal translate-y-[.4px] w-[200px] placeholder:text-[11px] placeholder:font-rocGroteskMedium placeholder:text-[#6B778C]"
                            placeholder="Your full name"
                        />
                        <button
                            type="submit"
                            className="bg-white font-rocGroteskMedium py-[10px] !text-gun-metal rounded-l-none rounded-r text-sm"
                        >
                            Subscribe
                        </button>
                    </form>

                    <div className="flex justify-between items-center [&>*:not(first-of-type)]:ml-5">
                        {/* <YoutubeIcon /> */}
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687262028/Web%20App/Youtube_tlfaq3.svg"
                            }
                            alt="Youtube Icon"
                        />
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
                            />
                        </a>
                        <a href="https://facebook.com/TradeAlly" target={"_blank"} rel="noreferrer">
                            {/* <FacebookIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261442/Web%20App/Facebook_kybnjz.svg"
                                }
                                alt="Facebook Icon"
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
                            />
                        </a>
                    </div>
                </div>
            </footer>

            <footer className="bg-gun-metal block 1100:hidden px-3 400:px-4 sm:px-16 1100:px-[70px] xl:px-[176px] pt-9 pb-7 relative z-10 [&_*]:text-white">
                <h3 className="font-rocGroteskBold text-[22px] text-center">
                    Stay in the Loop
                    <span className="block font-rocGroteskMedium text-sm mt-[3px]">
                        Subscribe to our newsletter.
                    </span>
                </h3>

                <form className="w-[300px] mx-auto mt-4" onClick={(evt) => evt.preventDefault()}>
                    <input
                        className="border  text-sm block font-rocGroteskMedium px-[10px] border-[#DFE1E6] text-[#DFE1E6] rounded py-[9.3px] bg-gun-metal translate-y-[.4px] w-full placeholder:text-[11px] placeholder:font-rocGroteskMedium placeholder:text-[#6B778C]"
                        placeholder="Your full name"
                    />
                    <button
                        type="submit"
                        className="bg-white w-full font-rocGroteskMedium py-[10px] !text-gun-metal rounded text-sm mt-4"
                    >
                        Subscribe
                    </button>
                </form>

                <div className="flex justify-between items-center [&>*:not(first-of-type)]:ml-5 w-max mx-auto mt-5">
                    {/* <YoutubeIcon /> */}
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687262028/Web%20App/Youtube_tlfaq3.svg"
                        }
                        alt="Youtube Icon"
                    />
                    <a href="https://twitter.com/TradeAlly_io" target={"_blank"} rel="noreferrer">
                        {/* <TwitterIcon /> */}
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261897/Web%20App/Twitter_sixlxb.svg"
                            }
                            alt="Twitter Icon"
                        />
                    </a>
                    <a href="https://facebook.com/TradeAlly" target={"_blank"} rel="noreferrer">
                        {/* <FacebookIcon /> */}
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687261442/Web%20App/Facebook_kybnjz.svg"
                            }
                            alt="Facebook Icon"
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
                        />
                    </a>
                </div>

                <div className="w-max mx-auto mt-6 mb-3">
                    <Link to={"#"} className="font-rocGroteskMedium text-sm mr-4">
                        Contact us
                    </Link>{" "}
                    <a href="mailto:beta@tradeally.io" className="font-rocGroteskMedium text-sm">
                        beta@tradeally.io
                    </a>
                </div>

                <Link
                    to={"#"}
                    className="block w-max font-rocGroteskMedium text-sm mx-auto text-center max-400:w-[80%]"
                >
                    USA: 7000 North Mopac Expressway, Austin, Texas, 78731
                </Link>
            </footer>
        </>
    );
};

export default LandingTempFooter;
