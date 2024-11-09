import { Link, useNavigate } from "react-router-dom";
import Hamburger from "hamburger-react";
import { useState } from "react";
import MobileNav from "./MobileNav";

const LandingNav2 = () => {
    const navigate = useNavigate();
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <nav
            className={`${
                mobileMenu && "fixed h-screen"
            } flex flex-col sm:block sm:w-full left-0 transition-all duration-1000 w-screen sm:h-max z-[1000] bg-[#00255E]/80`}
        >
            <div
                className={`w-[89vw] max-lg:w-[94vw] [&_*]:text-white [&_*]:font-rocGroteskMedium [&_*]:text-[15px] mx-auto rounded-[10px] flex justify-between items-center transition-all sm:px-[26px] px-[10px] sm:py-4 py-2 duration-150`}
            >
                <div className="flex items-center justify-between w-full">
                    <img
                        src="/logo-full-white.svg"
                        alt="Logo Icon"
                        className="cursor-pointer max-sm:w-[110px] w-[110px]"
                        onClick={() => navigate("/")}
                    />
                    <div className="sm:hidden h-[48px] w-[48px]">
                        <Hamburger
                            color="#FFF"
                            toggled={mobileMenu}
                            toggle={setMobileMenu}
                            size={24}
                        />
                    </div>
                    <div className="hidden sm:block">
                        <Link to={"/"} className="mx-7 translate-y-[1px] max-lg:hidden">
                            Home
                        </Link>
                        <Link to={"/features"} className="mx-7 translate-y-[1px] max-lg:hidden">
                            Features
                        </Link>
                        <Link to={"/about"} className="mx-7 translate-y-[1px] max-lg:hidden">
                            About Us
                        </Link>
                        <Link to={"/resources"} className="mx-7 translate-y-[1px] max-lg:hidden">
                            Resources
                        </Link>
                        <Link to={"/contact-us"} className="mx-7 translate-y-[1px] max-lg:hidden">
                            Contact Us
                        </Link>
                    </div>
                </div>
                <div className="flex items-center max-lg:hidden">
                    <Link
                        to={"/login"}
                        className="translate-y-[1px] ml-6 !text-[#000918] bg-white px-4 py-1.5 rounded-lg whitespace-nowrap"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
            <MobileNav mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
        </nav>
    );
};

export default LandingNav2;
