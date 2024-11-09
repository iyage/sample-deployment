// import { LogoIcon } from "assets/arts";
// import { isMobile } from "helpers";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LandingNav = () => {
    const navigate = useNavigate();
    // const [navToBottom, setNavToBottom] = useState(false);
    const [navBlur, setNavBlur] = useState(false);
    const [navMenuOpen, setNavMenuOpen] = useState(false);

    useEffect(() => {
        // const moveNavDown = () => {
        //     var scrollPosition = window.scrollY;

        //     if (scrollPosition >= 500 && !isMobile) {
        //         setNavToBottom(true);
        //     } else {
        //         setNavToBottom(false);
        //     }
        // };

        const blurNav = () => {
            var scrollPosition = window.scrollY;

            if (scrollPosition >= 100) {
                setNavBlur(true);
            } else {
                setNavBlur(false);
            }
        };

        window.addEventListener("scroll", () => {
            // moveNavDown();
            blurNav();
        });

        return () => {
            window.removeEventListener("scroll", () => {
                // moveNavDown();
                blurNav();
            });
        };
    }, []);

    return (
        <div className="relative">
            <nav
                className={`fixed left-0 transition-all duration-1000 translate-y-6 w-screen h-max z-[1000]`}
            >
                <div
                    className={`w-[89vw] max-lg:w-[94vw] [&_*]:text-white [&_*]:font-rocGroteskMedium [&_*]:text-[17px] mx-auto rounded-[10px] border border-[#344563] flex justify-between items-center bg-[#344563]/20 transition-all ${
                        navBlur && "backdrop-blur-md backdrop-brightness-[.7]"
                    } px-[26px] py-4`}
                >
                    <div className="flex items-center">
                        {/* <LogoIcon
                            className="cursor-pointer max-sm:w-[120px]"
                            onClick={() => navigate("/")}
                        /> */}
                        <img
                            src="logo-full-white.svg"
                            alt="Logo Icon"
                            className="cursor-pointer max-sm:w-[110px] w-[110px]"
                            onClick={() => navigate("/")}
                        />
                        <Link to={"/about"} className="mx-7 translate-y-[1px] max-lg:hidden">
                            About Us
                        </Link>
                        <Link to={"/blog"} className="translate-y-[1px] max-lg:hidden">
                            Blog
                        </Link>
                    </div>
                    <div className="flex items-center max-lg:hidden">
                        <a
                            href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                            target={"_blank"}
                            rel="noreferrer"
                            className="mr-6 translate-y-[1px]"
                        >
                            Book a Demo
                        </a>
                        <span className="bg-white w-[1px] h-[27px]" />
                        {/* <Link to={"/register"} className="translate-y-[1px] ml-6 mr-5">
                            Sign Up
                        </Link> */}
                        <Link to={"/login"} className="translate-y-[1px] ml-6 !text-pacific-cyan">
                            Sign In
                        </Link>
                    </div>

                    <div className="hidden max-lg:block">
                        <i
                            onClick={() => setNavMenuOpen(true)}
                            className="ri-menu-line before:text-xl before:text-white before:content-['\ef3e'] cursor-pointer"
                        ></i>
                    </div>
                </div>
            </nav>
            {navMenuOpen && (
                <div className="w-screen h-screen bg-[#0F2231] fixed z-[9999] px-6 py-11">
                    <div className="flex justify-end">
                        <i
                            onClick={() => setNavMenuOpen(false)}
                            className="ri-close-fill before:content-['\eb98'] before:text-white text-4xl cursor-pointer"
                        ></i>
                    </div>
                    <div className="flex flex-col gap-6 items-center mt-[20%]">
                        <Link to={"/"} className="text-white text-xl font-rocGroteskMedium">
                            Home
                        </Link>

                        <Link to={"/about"} className="text-white text-xl font-rocGroteskMedium">
                            About Us
                        </Link>
                        <Link to={"/blog"} className="text-white text-xl font-rocGroteskMedium">
                            Blog
                        </Link>
                        <a
                            href={"https://calendar.app.google/61y6qdd1LvycbXHa7"}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white text-xl font-rocGroteskMedium"
                        >
                            Book a Demo
                        </a>
                    </div>
                    <div className="flex flex-col gap-4 items-center mt-[20%]">
                        {/* <button
                            onClick={() => navigate("/register")}
                            className="py-2.5 bg-white rounded w-full flex justify-center items-center font-rocGroteskMedium !text-gun-metal"
                        >
                            Sign Up
                        </button> */}
                        <button
                            onClick={() => navigate("/login")}
                            className="py-2.5 bg-pacific-cyan rounded w-full flex justify-center font-rocGroteskMedium items-center text-white"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingNav;
