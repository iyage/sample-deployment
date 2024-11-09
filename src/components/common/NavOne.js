import React from "react";
import { Link } from "react-router-dom";

const NavOne = ({ className }) => {
    return (
        <div className="w-full fixed top-0 left-0 right-0 bottom-0 z-10 h-[72px]">
            <nav
                className={`flex w-full bg-white justify-between items-center text-mvx-black py-5 border-b border-[#DFE1E6] px-3 400:px-4 sm:px-16 1100:px-[70px] xl:px-[176px] ${className}`}
            >
                <Link to={"/"}>
                    <img src="/logo-full.svg" alt="Fleetplus" className="w-[126px] h-8" />
                </Link>

                <p className="text-sm font-rocGroteskMedium max-lg:hidden invisible">
                    Need help?{" "}
                    <a href={"mailto:hello@fleetplus.io"} className="underline font-medium">
                        Contact Support
                    </a>
                </p>
                <span className="material-icons hidden lg:hidden">menu</span>
            </nav>
        </div>
    );
};

export default NavOne;
