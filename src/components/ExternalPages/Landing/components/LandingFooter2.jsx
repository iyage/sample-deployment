import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SocialTwitter from "assets/images/landing/social/twitter.svg";
import SocialLinkedin from "assets/images/landing/social/linkedin.svg";
import SocialInstagram from "assets/images/landing/social/instagram.svg";
import SocialFacebook from "assets/images/landing/social/facebook.svg";

const LandingFooter2 = () => {
    const navigate = useNavigate();
    return (
        <div className="py-14 bg-[#000918]">
            <div className="w-full lg:w-[89vw] px-[26px] m-auto">
                <div className="sm:flex pb-10">
                    <div className="sm:w-[30%]">
                        <img
                            src="/logo-full-white.svg"
                            alt="Logo Icon"
                            className="cursor-pointer max-sm:w-[110px] w-[110px]"
                            onClick={() => navigate("/")}
                        />
                        <p className="text-white text-sm mt-8">Address:</p>
                        <p className="text-white/50 text-sm mt-1">19 Dr. S Ezekuse Close,</p>
                        <p className="text-white/50 text-sm mb-6 sm:mb-0 mt-1">Lekki Phase 1, Lagos</p>
                    </div>
                    <div className="sm:w-[70%] sm:flex">
                        <div className="sm:w-1/3 mb-6 sm:mb-0">
                            <p className="text-[#03B5D1] text-sm mb-4">PRODUCT</p>
                            <Link to={"/"}>
                                <p className="text-white text-sm mb-4">Home</p>
                            </Link>
                            <Link to={"/features"}>
                                <p className="text-white text-sm mb-4">Features</p>
                            </Link>
                            <Link to={"/about"}>
                                <p className="text-white text-sm mb-4">About Us</p>
                            </Link>
                            <Link to={"/contact-us"}>
                                <p className="text-white text-sm mb-4">Contact Us</p>
                            </Link>
                        </div>
                        <div className="sm:w-1/3 mb-6 sm:mb-0">
                            <p className="text-[#03B5D1] text-sm mb-4">RESOURCES</p>
                            <p className="text-white text-sm mb-4">Blog</p>
                            <p className="text-white text-sm mb-4">FAQs</p>
                            <p className="text-white text-sm mb-4">Newsletter</p>
                        </div>
                        <div className="sm:w-1/3">
                            <p className="text-[#03B5D1] text-sm mb-4">LEGAL</p>
                            <p className="text-white text-sm mb-4">Privacy Policy</p>
                            <p className="text-white text-sm mb-4">Cookie Policy</p>
                            <p className="text-white text-sm mb-4">Terms & Condiions</p>
                        </div>
                    </div>
                </div>
                <div className="w-full h-[1px] bg-white/30"></div>
                <div className="sm:flex items-center justify-between mt-6">
                    <div className="flex items-center mb-6 sm:mb-0">
                        <p className="shrink-0 text-white/50">&copy;</p>
                        <p className="text-xs text-white/50 ml-1">2023 - Fleet+, Inc</p>
                    </div>
                    <div className="flex items-center">
                        <a target="_blank" href="https://twitter.com/fleetplus_" rel="noreferrer">
                            <img src={SocialTwitter} alt="Fleet+ Twitter" className="h-4 mr-3" />
                        </a>
                        <a
                            target="_blank"
                            href="https://www.linkedin.com/company/fleetplus-io/about/?viewAsMember=true"
                            rel="noreferrer"
                        >
                            <img src={SocialLinkedin} alt="Fleet+ LinkedIn" className="h-4 mr-3" />
                        </a>
                        <a
                            target="_blank"
                            href="https://www.instagram.com/fleetplus_/?hl=en"
                            rel="noreferrer"
                        >
                            <img
                                src={SocialInstagram}
                                alt="Fleet+ Instagram"
                                className="h-4 mr-3"
                            />
                        </a>
                        <a
                            target="_blank"
                            href="https://www.facebook.com/profile.php?id=61552655978233"
                            rel="noreferrer"
                        >
                            <img src={SocialFacebook} alt="Fleet+ Facebook" className="h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingFooter2;
