import React from "react";
import { Link } from "react-router-dom";

const MobileNav = ({ mobileMenu, setMobileMenu }) => {
    return (
        <div className={`${mobileMenu ? "block" : "hidden"} w-full h-full bg-white sm:hidden p-10`}>
            <Link to={"/about"} className="mx-7 translate-y-[1px] uppercase font-semibold">
                <div className="w-full">About Us</div>
            </Link>
            <Link to={"/resources"} className="mx-7 translate-y-[1px] uppercase font-semibold">
                <div className="w-full">Resources</div>
            </Link>
            <Link to={"/features"} className="mx-7 translate-y-[1px] uppercase font-semibold">
                <div className="w-full">Features</div>
            </Link>
            <Link to={"/contact-us"} className="mx-7 translate-y-[1px] uppercase font-semibold">
                <div className="w-full">Contact Us</div>
            </Link>
            <div className="text-center pb-20 mt-6">
                <a href="https://calendly.com/fleetplus-demo/30min">
                    <button
                        className={`px-8 py-3 bg-[#B3F00D] text-[#000918] rounded-md font-medium w-full`}
                    >
                        Get started for free
                    </button>
                </a>
                <Link to="/login">
                    <button
                        className={`px-8 py-3 border border-white bg-transparent text-black mt-4 rounded-md font-medium`}
                    >
                        Sign in
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default MobileNav;
