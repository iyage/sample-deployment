import { useEffect, useRef, useState } from "react";
import LandingFooter from "./components/LandingFooter";
import LandingNav from "./components/LandingNav";
import Testimonials from "./components/Testimonials";
import { Link } from "react-router-dom";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import FaqAccordion from "./components/FaqAccordion";
import { useTypewriter } from "react-simple-typewriter";
import { AnimatePresence, motion } from "framer-motion";
import { Slide } from "react-awesome-reveal";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FAQs from "variables/FAQs";
import AllInOneMobileLine from "./components/AllInOneMobileLine";
import CookiePrompt from "./components/CookiePrompt";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const [enlargeBg, setEnlargeBg] = useState(false);
    const [unleashSectionRef, unleashVisible, unObserveUnleashSection] = useIntersectionObserver({
        rootMargin: "400px 0px 0px 0px",
        threshold: 0.8,
    });
    const [isSectionOneVisible, setIsSectionOneVisible] = useState(false);
    const [isSectionTwoVisible, setIsSectionTwoVisible] = useState(false);
    const [isSectionThreeVisible, setIsSectionThreeVisible] = useState(false);
    const [isSectionFourVisible, setIsSectionFourVisible] = useState(false);
    const [isSectionFiveVisible, setIsSectionFiveVisible] = useState(false);
    const [activeIdx, setActiveIdx] = useState(null);
    const [joinTradeAllyBtn, setJoinTradeAllyBtn] = useState([
        {
            hover1: false,
            hover2: false,
            hover3: false,
            hover4: false,
            hover5: false,
        },
    ]);
    const [progress, setProgress] = useState(0);

    const scrollSnapSection = useRef(null);
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const section4Ref = useRef(null);
    const section5Ref = useRef(null);

    const [texts] = useTypewriter({
        words: ["Small", "Independent", "Busy", "Smart", "Simple"],
        delaySpeed: 2000,
        loop: 0,
    });

    const toggleAccordion = (idx) => {
        setActiveIdx((prev) => (prev === idx ? null : idx));
    };

    useEffect(() => {
        const handleScroll = () => {
            const target1Element = section1Ref.current;
            const target2Element = section2Ref.current;
            const target3Element = section3Ref.current;
            const target4Element = section4Ref.current;
            const target5Element = section5Ref.current;
            if (
                target1Element &&
                target2Element &&
                target3Element &&
                target4Element &&
                target5Element
            ) {
                const target1Rect = target1Element?.getBoundingClientRect();
                const target2Rect = target2Element?.getBoundingClientRect();
                const target3Rect = target3Element?.getBoundingClientRect();
                const target4Rect = target4Element?.getBoundingClientRect();
                const target5Rect = target5Element?.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const target1Top = target1Rect?.top + scrollTop;
                const target2Top = target2Rect?.top + scrollTop;
                const target3Top = target3Rect?.top + scrollTop;
                const target4Top = target4Rect?.top + scrollTop;
                const target5Top = target5Rect?.top + scrollTop;

                // Adjust the offset value as needed
                const offset = 500;

                if (scrollTop >= target1Top - offset) {
                    setIsSectionOneVisible(true);
                }
                if (scrollTop >= target2Top - offset) {
                    setIsSectionTwoVisible(true);
                }
                if (scrollTop >= target3Top - offset) {
                    setIsSectionThreeVisible(true);
                }
                if (scrollTop >= target4Top - offset) {
                    setIsSectionFourVisible(true);
                }
                if (scrollTop >= target5Top - offset) {
                    setIsSectionFiveVisible(true);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Clean up the event listener
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleBgSize = () => {
            var scrollPosition = window.scrollY;

            if (scrollPosition >= 80) {
                setEnlargeBg(true);
            } else {
                setEnlargeBg(false);
            }
        };

        window.addEventListener("scroll", handleBgSize);

        return () => {
            window.removeEventListener("scroll", handleBgSize);
        };
    }, []);

    useEffect(() => {
        if (unleashVisible) {
            unObserveUnleashSection(true);
        } else {
        }
    }, [unleashVisible, unObserveUnleashSection]);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.to(scrollSnapSection?.current, {
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: scrollSnapSection?.current,
                    pin: true,
                    refreshPriority: 1,
                    start: "top 5%",
                    // end: "bottom 0%",
                    markers: false,
                    toggleActions: "play reset play reset",
                    onUpdate: (self) => {
                        let p = (self.progress * 100).toFixed(1);
                        setProgress(p);
                    },
                },
            });
        }, ".main");

        return () => ctx.revert();
    }, []);

    return (
        <div className={`bg-landing-black main relative`}>
            <LandingNav />

            <header className="flex precede-pin flex-col align-center px-3 400:px-4 sm:px-16 1100:px-[100px] text-center pt-40 [&_*]:text-white">
                <h1 className="text-3xl sm:text-[50px] sm:leading-[72px] font-rocGroteskRegular">
                    Easy Freight Technology for{" "}
                    <span className="!text-transparent font-rocGroteskBold !bg-clip-text bg-gradient-to-t sm:!bg-gradient-to-b !from-[#736CED] sm:!from-[40%] !to-[#16C6A4] max-sm:!to-[60%]">
                        {texts}
                    </span>
                    <br />
                    Freight Forwarders.
                </h1>
                <p className="max-lg:px-4 text-center text-lg mt-4 mb-11">
                    Grow your business with Fleet+, a simple freight management software that
                    automates operations <br className="max-xl:hidden" /> and enables
                    forwarder-to-forwarder collaboration for small and mid-sized freight brokers.
                </p>
                <div className="flex w-max mx-auto md:flex-row flex-col gap-[18px]">
                    <Link to="/register">
                        <button className="bg-pacific-cyan h-[50px] md:w-[222px] text-lg w-full font-rocGroteskMedium">
                            Get started for free
                        </button>
                    </Link>

                    <a href="/about?contactUs=true">
                        <button className="bg-white !text-gun-metal h-[50px] md:w-[201px] w-full text-lg font-rocGroteskMedium">
                            Book a free demo
                        </button>
                    </a>
                </div>
                <img
                    src={
                        "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704964518/Fleet_Dashboard_1_jddhr0.svg"
                    }
                    className={`max-sm:hidden transition-all w-[75vw] 2xl:w-[70vw] 1750:w-[65vw] h-[416px] ease-in-out duration-500 ${
                        enlargeBg ? "scale-110 mt-12" : "mt-16 scale-100"
                    } mx-auto `}
                    alt="Fleet+"
                />
                <img
                    src={
                        "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704964518/Fleet_Dashboard_1_jddhr0.svg"
                    }
                    className={`hidden max-sm:block transition-all w-[85vw] ease-in-out duration-500 ${
                        enlargeBg ? "mt-12 scale-110" : "mt-16 scale-100"
                    } mx-auto `}
                    alt="Fleet+"
                />
            </header>

            <section className={` pt-20 pb-20 pt-[150px] relative [&_*]:text-white `}>
                <div className="px-[100px] max-lg:px-6">
                    <h3 className="font-rocGroteskBold text-[30px] max-sm:text-2xl max-lg:text-center">
                        Built With Care For Freight Forwarders
                    </h3>
                    <hr className="w-[605px] max-sm:w-full h-[1px] bg-[#C1C7D0] mt-[18px] mb-3.5" />
                    <p className="text-base max-sm:text-xs font-rocGroteskRegular max-lg:text-center leading-[29px] uppercase">
                        The Fleet+ software is a result of painstaking research, user-friendly
                        design, <br className="max-lg:hidden" />
                        and intentional engineering, because freight forwarders deserve amazing
                        technology too
                    </p>
                </div>

                <div
                    ref={scrollSnapSection}
                    style={{
                        background: `url('https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687175618/Web%20App/website/collaborators-bg_lkzvea.svg') center no-repeat`,
                        backgroundSize: "cover",
                    }}
                    id="pinned-section"
                    className={`h-[105vh] relative top-0 overflow-y-auto snap-y snap-mandatory scrollbar-hide max-lg:hidden `}
                >
                    <AnimatePresence mode="popLayout">
                        {progress < 25 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                key="content1"
                                className="h-screen content flex items-center justify-center px-[100px] max-lg:px-6 "
                            >
                                <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[47px]  ">
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687175945/Web%20App/website/collaborations_tm8zxr.svg"
                                        }
                                        loading="lazy"
                                        alt="collaborations"
                                        className="h-[655px] max-sm:w-full max-sm:h-auto"
                                    />
                                    <div className="h-max mt-auto">
                                        <div className="relative">
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687176061/Web%20App/website/orange_quote_geb4s4.svg"
                                                }
                                                alt="orange quote"
                                                className="absolute top-[22px]"
                                            />
                                            <h3 className="uppercase ml-[20px] font-rocGroteskRegular text-[50px] max-sm:text-2xl leading-[86.4px]">
                                                Global
                                                <br />
                                                collaborations
                                            </h3>
                                        </div>
                                        <hr className="w-[530px] max-sm:w-full h-[1px] bg-[#C1C7D0] max-lg:mt-[18px] mb-6 -mt-2" />
                                        <p className="font-rocGroteskRegular text-base leading-[34.56px]">
                                            Fleet+ opens up a world of global <br /> freight
                                            opportunities
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {progress > 25 && progress <= 50 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                key="content2"
                                className="h-screen content flex items-center justify-center px-[100px]  max-lg:px-6 "
                            >
                                <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[47px] ">
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto,f_auto/v1687175765/Web%20App/website/security_mofiql.svg"
                                        }
                                        alt="security"
                                        loading="lazy"
                                        className="h-[655px] max-sm:w-full max-sm:h-auto"
                                    />
                                    <div className="h-max mt-auto">
                                        <div className="relative">
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687176061/Web%20App/website/orange_quote_geb4s4.svg"
                                                }
                                                alt="orange quote"
                                                className="absolute top-[22px]"
                                            />
                                            <h3 className="uppercase ml-[20px] font-rocGroteskRegular text-[50px] max-sm:text-2xl leading-[86.4px]">
                                                Top
                                                <br />
                                                Security
                                            </h3>
                                        </div>
                                        <hr className="w-[530px] max-sm:w-full h-[1px] bg-[#C1C7D0] max-lg:mt-[18px] mb-6 -mt-2" />
                                        <p className="font-rocGroteskRegular text-base leading-[34.56px]">
                                            Fleet+ protected with the highest level of encryption
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {progress > 50 && progress <= 75 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                key="content3"
                                className="h-screen content flex items-center justify-center px-[100px]  max-lg:px-6 "
                            >
                                <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[47px] ">
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687176161/Web%20App/website/cost_saving_m1quvy.svg"
                                        }
                                        loading="lazy"
                                        alt="cost saving"
                                        className="h-[655px] max-sm:w-full max-sm:h-auto"
                                    />
                                    <div className="h-max mt-auto">
                                        <div className="relative">
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687176061/Web%20App/website/orange_quote_geb4s4.svg"
                                                }
                                                alt="orange quote"
                                                className="absolute top-[22px]"
                                            />
                                            <h3 className="uppercase ml-[20px] font-rocGroteskRegular text-[50px] max-sm:text-2xl leading-[86.4px]">
                                                Increased
                                                <br />
                                                Revenue
                                                <br />& Cost Saving
                                            </h3>
                                        </div>
                                        <hr className="w-[530px] max-sm:w-full h-[1px] bg-[#C1C7D0] max-lg:mt-[18px] mb-6 -mt-2" />
                                        <p className="font-rocGroteskRegular text-base leading-[34.56px]">
                                            Fleet+ helps you grow your revenue and reduce cost
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {progress > 75 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                key="content4"
                                className="h-screen content flex items-center justify-center px-[100px]  max-lg:px-6 "
                            >
                                <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[47px] ">
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687176261/Web%20App/website/easy_to_use_u2w11c.svg"
                                        }
                                        alt="easy To Use"
                                        loading="lazy"
                                        className="h-[655px] max-sm:w-full max-sm:h-auto"
                                    />
                                    <div className="h-max mt-auto">
                                        <div className="relative">
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687176061/Web%20App/website/orange_quote_geb4s4.svg"
                                                }
                                                alt="orange quote"
                                                className="absolute top-[22px]"
                                            />
                                            <h3 className="uppercase ml-[20px] font-rocGroteskRegular text-[50px] max-sm:text-2xl leading-[86.4px]">
                                                easy to use
                                            </h3>
                                        </div>
                                        <hr className="w-[530px] max-sm:w-full h-[1px] bg-[#C1C7D0] max-lg:mt-[18px] mb-6 -mt-2" />
                                        <p className="font-rocGroteskRegular text-base leading-[34.56px]">
                                            Fleet+ helps you grow your revenue and reduce cost
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div
                    style={{
                        background: `url('https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687175618/Web%20App/website/collaborators-bg_lkzvea.svg') center no-repeat`,
                        backgroundSize: "cover",
                    }}
                    className={`relative overflow-auto scrollbar-hide hidden mt-20  max-sm:mt-10 max-lg:block`}
                >
                    <div className="flex items-center justify-center px-[100px] mb-[60px] max-lg:px-6">
                        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[47px]  ">
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687175945/Web%20App/website/collaborations_tm8zxr.svg"
                                }
                                loading="lazy"
                                alt="collaborations"
                                className="h-[655px] max-sm:w-[364px] max-sm:h-[394px]"
                            />
                            <div className="h-max mt-auto">
                                <div className="relative">
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687176061/Web%20App/website/orange_quote_geb4s4.svg"
                                        }
                                        alt="orange quote"
                                        className="absolute top-[6px]"
                                    />
                                    <h3 className="uppercase ml-[22px] font-rocGroteskRegular text-[50px] max-sm:text-2xl leading-[86.4px]">
                                        Global
                                        <br />
                                        collaborations
                                    </h3>
                                </div>

                                <hr className="w-[530px] max-sm:w-full h-[1px] bg-[#C1C7D0] max-lg:mt-[18px] mb-6 -mt-2" />
                                <p className="font-rocGroteskRegular text-base max-sm:text-[13px] max-sm:leading-[19px] leading-[34.56px]">
                                    Fleet+ opens up a world of global <br /> freight opportunities
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center px-[100px] mb-[60px] max-lg:px-6 ">
                        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[47px] ">
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto,f_auto/v1687175765/Web%20App/website/security_mofiql.svg"
                                }
                                alt="security"
                                loading="lazy"
                                className="h-[655px] max-sm:w-[364px] max-sm:h-[394px]"
                            />
                            <div className="h-max mt-auto">
                                <div className="relative">
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687176061/Web%20App/website/orange_quote_geb4s4.svg"
                                        }
                                        alt="orange quote"
                                        className="absolute top-[6px]"
                                    />
                                    <h3 className="uppercase ml-[22px] font-rocGroteskRegular text-[50px] max-sm:text-2xl leading-[86.4px]">
                                        Top
                                        <br />
                                        Security
                                    </h3>
                                </div>
                                <hr className="w-[530px] max-sm:w-full h-[1px] bg-[#C1C7D0] max-lg:mt-[18px] mb-6 -mt-2" />
                                <p className="font-rocGroteskRegular text-base max-sm:text-[13px] max-sm:leading-[19px] leading-[34.56px]">
                                    Fleet+ is protected with the highest level of encryption
                                </p>
                                Fleet+ Fleet+ Fleet+
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center px-[100px] mb-[60px] max-lg:px-6 ">
                        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[47px] ">
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687176161/Web%20App/website/cost_saving_m1quvy.svg"
                                }
                                alt="cost saving"
                                loading="lazy"
                                className="h-[655px] max-sm:w-[364px] max-sm:h-[394px]"
                            />
                            <div className="h-max mt-auto">
                                <div className="relative">
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687176061/Web%20App/website/orange_quote_geb4s4.svg"
                                        }
                                        alt="orange quote"
                                        className="absolute top-[6px]"
                                    />
                                    <h3 className="uppercase ml-[22px] font-rocGroteskRegular text-[50px] max-sm:text-2xl leading-[86.4px]">
                                        Increased
                                        <br />
                                        Revenue
                                        <br />& Cost Saving
                                    </h3>
                                </div>
                                <hr className="w-[530px] max-sm:w-full h-[1px] bg-[#C1C7D0] max-lg:mt-[18px] mb-6 -mt-2" />
                                <p className="font-rocGroteskRegular text-base max-sm:text-[13px] max-sm:leading-[19px] leading-[34.56px]">
                                    Fleet+ helps you grow your revenue and reduce cost
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className=" flex items-center justify-center px-[100px] mb-6 max-lg:px-6">
                        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[47px] ">
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687176261/Web%20App/website/easy_to_use_u2w11c.svg"
                                }
                                alt="easy To Use"
                                loading="lazy"
                                className="h-[655px] max-sm:w-[364px] max-sm:h-[394px]"
                            />
                            <div className="h-max mt-auto">
                                <div className="relative">
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687176061/Web%20App/website/orange_quote_geb4s4.svg"
                                        }
                                        alt="orange quote"
                                        className="absolute top-[6px]"
                                    />
                                    <h3 className="uppercase ml-[22px] font-rocGroteskRegular text-[50px] max-sm:text-2xl leading-[86.4px]">
                                        easy to use
                                    </h3>
                                </div>
                                <hr className="w-[530px] max-sm:w-full h-[1px] bg-[#C1C7D0] max-lg:mt-[18px] mb-6 -mt-2" />
                                <p className="font-rocGroteskRegular text-base max-sm:text-[13px] max-sm:leading-[19px] leading-[34.56px]">
                                    Fleet+ helps you grow your revenue and reduce cost
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative h-[700px] lg:h-[987px]">
                <div
                    className="pt-16 pb-32 h-full w-full bg-[#000000] flex items-center absolute left-0 top-0"
                    ref={unleashSectionRef}
                >
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687176802/Web%20App/website/better-with-Ally-vector-bg_fkpc2p.svg"
                        }
                        alt="Better with an ally"
                        loading="lazy"
                        className="bg-transparent relative z-20 mx-auto w-[75%] h-[75%] lg:w-[85%] lg:h-[85%]"
                    />

                    <div className="w-full h-[250px] absolute z-30 bg-transparent">
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687176880/Web%20App/website/you-are-better_oauj4o.svg"
                            }
                            alt="You are better"
                            loading="lazy"
                            className="text-left pl-3 400:pl-4 sm:pl-16 1100:pl-[100px] max-sm:px-3 max-lg:w-[700px] 2xl:px-32 1750:px-44"
                        />
                        <img
                            src={
                                "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704635154/with_fleet_avbmo3.svg"
                            }
                            alt="With an ally"
                            loading="lazy"
                            className="absolute bottom-0 right-3 max-sm:!right-[0] max-sm:!bottom-[100px] max-sm:px-3 max-lg:w-[600px] 400:right-4 sm:right-16 1100:right-[100px] 2xl:px-32 1750:px-44"
                        />
                    </div>
                </div>
                <video
                    src={
                        unleashVisible
                            ? "https://res.cloudinary.com/dvxi7qcmd/video/upload/v1687176993/Web%20App/website/rocket-launcher_p9jr6a.mp4"
                            : ""
                    }
                    className={`w-full h-full absolute left-0 bottom-0 object-cover transition-all duration-500 ${
                        unleashVisible ? "opacity-100" : "opacity-0"
                    }`}
                    muted
                    autoPlay
                    playsInline
                    controls={false}
                    loop
                />
            </section>

            <section ref={section1Ref} className="bg-white max-lg:px-6 px-[100px] pt-24 pb-32">
                <p className="uppercase text-lg max-sm:text-xs max-lg:text-center">
                    all your operations in one simple place
                </p>
                <h3 className="text-[30px] max-sm:text-2xl font-rocGroteskBold mt-3 max-lg:text-center">
                    All-in-One Digital Solution For Your Business Needs
                </h3>
                <hr className="my-4 hidden max-sm:block" />
                <p className="text-base max-sm:text-sm max-lg:text-center">
                    Fleet+ helps simplify your freight forwarding business and operations
                </p>

                {/* Solution 1 */}
                <div className="grid grid-cols-[0.9fr,1fr] mt-8 max-lg:grid-cols-1">
                    <div className="max-lg:flex w-full justify-center hidden">
                        <AllInOneMobileLine />
                    </div>
                    <Slide direction="up" triggerOnce className="max-lg:hidden">
                        <img
                            src={
                                "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704661799/profit_optimisation_njbkun.jpg"
                            }
                            alt="solution 1"
                            loading="lazy"
                            className=" h-[463px] max-lg:w-full max-sm:h-[310px]"
                        />
                    </Slide>
                    <div className="hidden max-lg:block">
                        <img
                            src={
                                "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704661799/profit_optimisation_njbkun.jpg"
                            }
                            alt="solution 1"
                            loading="lazy"
                            className=" h-[463px] max-lg:w-full max-sm:h-[310px]"
                        />
                    </div>

                    <div className="flex ml-5  max-lg:ml-0">
                        <div className="flex flex-col items-center pt-2.5 max-lg:hidden">
                            <div
                                className="h-[33px] w-[33px] rounded-full grid place-items-center"
                                style={{
                                    background:
                                        "linear-gradient(180deg, rgba(115, 108, 237, 0.1) 0%, rgba(22, 198, 164, 0.1) 100%)",
                                }}
                            >
                                <div className="rounded-full w-[19px] h-[19px] bg-gradient-to-b p-[2px] from-[#736CED] from-10% to-[#16C6A4] to-100%">
                                    <div className="h-full bg-gray-100 rounded-full" />
                                </div>
                            </div>

                            <div
                                className={`w-[1.5px] ${
                                    isSectionOneVisible ? "h-[540px]" : "h-[10px]"
                                } transition-[height] duration-[3s] ease-in-out bg-gradient-to-b from-[#FFFFFF] from-0% via-[rgba(115,108,237,40] via-40% to-[#16C6A4] to-100%`}
                            />
                        </div>

                        <Slide direction="up" triggerOnce className="max-lg:hidden">
                            <div className="ml-10 max-lg:ml-0 pt-20 pb-[195px] max-lg:pb-0 max-lg:pt-10 max-lg:flex max-lg:flex-col max-lg:items-center">
                                <p className="font-rocGroteskMedium  bg-[#B3E9F2] text-sm rounded-full p-3 px-3.5 w-max">
                                    Profit Optimisation
                                </p>
                                <h3 className="font-rocGroteskBold max-lg:text-center text-[32px] max-sm:text-2xl mt-[22px] mb-[23px]">
                                    Drive your profit up.
                                </h3>
                                <p className="text-sm max-sm:text-sm max-sm:leading-[20px] max-lg:text-center leading-[24px]">
                                    Fleet+ empowers you to set competitive rates and optimize
                                    profits, ensuring that every shipment contributes to the growth
                                    and success of your business.
                                </p>

                                <a
                                    href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button
                                        onMouseEnter={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover1: true,
                                            }))
                                        }
                                        onMouseLeave={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover1: false,
                                            }))
                                        }
                                        className="text-gun-metal font-rocGroteskMedium hover:bg-gun-metal hover:!text-white text-base max-sm:text-base bg-white mt-8 rounded-full border border-gun-metal flex items-center p-2 px-4"
                                    >
                                        Join Fleet+{" "}
                                        <div
                                            className={`${
                                                joinTradeAllyBtn.hover1 &&
                                                "w-[23px] h-[23px] rounded-full bg-white flex items-center justify-center ml-1"
                                            }`}
                                        >
                                            {/* <BackArrowIcon
                                                className={`rotate-[135deg] [&_*]:fill-gun-metal m-1 `}
                                            /> */}
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687270177/Web%20App/website/icons/45_deg_arrow_dztgen.svg"
                                                }
                                                alt="arrow icon"
                                                className={` [&_*]:fill-gun-metal m-1 `}
                                                width={9}
                                                height={9}
                                            />
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </Slide>

                        <div className="hidden max-lg:block">
                            <div className="ml-10 max-lg:ml-0 pt-20 max-lg:pb-0 max-lg:pt-10 max-lg:flex max-lg:flex-col max-lg:items-center">
                                <p className="font-rocGroteskMedium  bg-[#FFF8EF] text-sm rounded-full p-3 px-3.5 w-max">
                                    Business profile
                                </p>
                                <h3 className="font-rocGroteskBold max-lg:text-center text-[32px] max-sm:text-2xl mt-[22px] mb-[23px]">
                                    A Website for Your Business
                                </h3>
                                <p className="text-sm max-sm:text-sm max-sm:leading-[20px] max-lg:text-center leading-[24px]">
                                    By creating a Fleet+ account, you automatically create a
                                    business profile for your freight business which can be shared
                                    with customers.
                                    <br />
                                    <br />
                                    That business profile is a functioning business page, at no
                                    extra cost!
                                </p>

                                <a
                                    href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button
                                        onTouchStart={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover1: true,
                                            }))
                                        }
                                        onTouchEnd={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover1: false,
                                            }))
                                        }
                                        className={`font-rocGroteskMedium ${
                                            joinTradeAllyBtn.hover1
                                                ? "bg-gun-metal text-white"
                                                : "bg-white text-gun-metal"
                                        }  text-base max-sm:text-base  mt-8 rounded-full border border-gun-metal flex items-center p-2 px-4`}
                                    >
                                        Join Fleet+{" "}
                                        <div
                                            className={`${
                                                joinTradeAllyBtn.hover1 &&
                                                "w-[23px] h-[23px] rounded-full bg-white flex items-center justify-center ml-1"
                                            }`}
                                        >
                                            {/* <BackArrowIcon
                                                className={`rotate-[135deg] [&_*]:fill-gun-metal m-1 `}
                                            /> */}
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687270177/Web%20App/website/icons/45_deg_arrow_dztgen.svg"
                                                }
                                                alt="arrow icon"
                                                className={` [&_*]:fill-gun-metal m-1 `}
                                                width={9}
                                                height={9}
                                            />
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Solution 2 */}
                <div
                    ref={section2Ref}
                    className="grid grid-cols-[0.9fr,1fr] max-lg:grid-cols-1 max-lg:mt-10"
                >
                    <div className="max-lg:flex w-full justify-center hidden">
                        <AllInOneMobileLine />
                    </div>
                    <Slide direction="up" triggerOnce className="max-lg:hidden">
                        <img
                            src={
                                "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704661797/collaboration_uclasi.jpg"
                            }
                            alt="solution 2"
                            loading="lazy"
                            className="w-[1004px] h-[463px] max-lg:w-full max-sm:h-[310px]"
                        />
                    </Slide>
                    <div className="hidden max-lg:block">
                        <img
                            src={
                                "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704661797/collaboration_uclasi.jpg"
                            }
                            alt="solution 2"
                            loading="lazy"
                            className="w-[1004px] h-[463px] max-lg:w-full max-sm:h-[310px]"
                        />
                    </div>

                    <div className="flex ml-5 max-lg:ml-0">
                        <div className="flex flex-col items-center pt-2.5 max-lg:hidden">
                            <div
                                className="h-[33px] w-[33px] rounded-full grid place-items-center"
                                style={{
                                    background:
                                        "linear-gradient(180deg, rgba(115, 108, 237, 0.1) 0%, rgba(22, 198, 164, 0.1) 100%)",
                                }}
                            >
                                <div className="rounded-full w-[19px] h-[19px] bg-gradient-to-b p-[2px] from-[#736CED] from-10% to-[#16C6A4] to-100%">
                                    <div className="h-full bg-gray-100 rounded-full" />
                                </div>
                            </div>

                            <div
                                className={`w-[1.5px] ${
                                    isSectionTwoVisible ? "h-[540px]" : "h-[10px]"
                                } transition-[height] duration-[3s] ease-in-out bg-gradient-to-b from-[#FFFFFF] from-0% via-[rgba(115,108,237,40] via-40% to-[#16C6A4] to-100%`}
                            />
                        </div>

                        <Slide direction="up" triggerOnce className="max-lg:hidden">
                            <div className="ml-10 pt-11 pb-[175px] max-lg:pb-0 max-lg:pt-10 max-lg:ml-0 max-lg:flex max-lg:flex-col max-lg:items-center">
                                <p className="font-rocGroteskMedium bg-[#E2F6FF] text-sm rounded-full p-3 px-3.5 w-max">
                                    Collaboration
                                </p>
                                <h3 className="font-rocGroteskBold  max-lg:text-center text-[32px] max-sm:text-2xl mt-[22px] mb-[23px] leading-[51.84px]">
                                    Global Agent-to-Agent <br />
                                    Connections
                                </h3>
                                <p className="text-sm max-sm:text-sm max-sm:leading-[20px] max-lg:text-center leading-[24px]">
                                    Fleet+ enables forwarders collaborate locally and in 190+
                                    countries. When a freight forwarder requests a quote for your
                                    trade lane, you receive a notification! You can also assign
                                    small or complex shipments to other freight forwarders. You
                                    never have to lose money again.
                                </p>

                                <a
                                    href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button
                                        onMouseEnter={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover2: true,
                                            }))
                                        }
                                        onMouseLeave={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover2: false,
                                            }))
                                        }
                                        className="text-gun-metal font-rocGroteskMedium hover:bg-gun-metal hover:!text-white text-base max-sm:text-base bg-white mt-8 rounded-full border border-gun-metal flex items-center p-2 px-4"
                                    >
                                        Join Fleet+{" "}
                                        <div
                                            className={`${
                                                joinTradeAllyBtn.hover2 &&
                                                "w-[23px] h-[23px] rounded-full bg-white flex items-center justify-center ml-1"
                                            }`}
                                        >
                                            {/* <BackArrowIcon
                                                className={`rotate-[135deg] [&_*]:fill-gun-metal m-1 `}
                                            /> */}
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687270177/Web%20App/website/icons/45_deg_arrow_dztgen.svg"
                                                }
                                                alt="arrow icon"
                                                className={` [&_*]:fill-gun-metal m-1 `}
                                                width={9}
                                                height={9}
                                            />
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </Slide>
                        <div className="hidden max-lg:block">
                            <div className="ml-10 pt-11  max-lg:pb-0 max-lg:pt-10 max-lg:ml-0 max-lg:flex max-lg:flex-col max-lg:items-center">
                                <p className="font-rocGroteskMedium bg-[#EFE9FB] text-sm rounded-full p-3 px-3.5 w-max">
                                    Collaboration
                                </p>
                                <h3 className="font-rocGroteskBold  max-lg:text-center text-[32px] max-sm:text-2xl mt-[22px] mb-[23px] leading-[51.84px]">
                                    Global Agent-to-Agent <br />
                                    Connections
                                </h3>
                                <p className="text-sm max-sm:text-sm max-sm:leading-[20px] max-lg:text-center leading-[24px]">
                                    Fleet+ enables forwarders collaborate locally and in 190+
                                    countries. When a freight forwarder requests a quote for your
                                    trade lane, you receive a notification! You can also assign
                                    small or complex shipments to other freight forwarders. You
                                    never have to lose money again.
                                </p>

                                <a
                                    href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button
                                        onTouchStart={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover2: true,
                                            }))
                                        }
                                        onTouchEnd={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover2: false,
                                            }))
                                        }
                                        className={`font-rocGroteskMedium ${
                                            joinTradeAllyBtn.hover2
                                                ? "bg-gun-metal !text-white"
                                                : "bg-white text-gun-metal"
                                        }  text-base max-sm:text-base  mt-8 rounded-full border border-gun-metal flex items-center p-2 px-4`}
                                    >
                                        Join Fleet+{" "}
                                        <div
                                            className={`${
                                                joinTradeAllyBtn.hover2 &&
                                                "w-[23px] h-[23px] rounded-full bg-white flex items-center justify-center ml-1"
                                            }`}
                                        >
                                            {/* <BackArrowIcon
                                                className={`rotate-[135deg] [&_*]:fill-gun-metal m-1 `}
                                            /> */}
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687270177/Web%20App/website/icons/45_deg_arrow_dztgen.svg"
                                                }
                                                alt="arrow icon"
                                                className={` [&_*]:fill-gun-metal m-1 `}
                                                width={9}
                                                height={9}
                                            />
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Solution 3 */}
                <div
                    ref={section3Ref}
                    className="grid grid-cols-[0.9fr,1fr] max-lg:grid-cols-1 max-lg:mt-10"
                >
                    <div className="max-lg:flex w-full justify-center hidden">
                        <AllInOneMobileLine />
                    </div>
                    <Slide direction="up" triggerOnce className="max-lg:hidden">
                        <img
                            src={
                                "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704661797/business_nalytics_lnpm3d.jpg"
                            }
                            alt="solution 3"
                            loading="lazy"
                            className="w-[1004px] h-[463px] max-lg:w-full max-sm:h-[310px]"
                        />
                    </Slide>
                    <div className="hidden max-lg:block">
                        <img
                            src={
                                "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704661797/business_nalytics_lnpm3d.jpg"
                            }
                            alt="solution 3"
                            loading="lazy"
                            className="w-[1004px] h-[463px] max-lg:w-full max-sm:h-[310px]"
                        />
                    </div>

                    <div className="flex ml-5  max-lg:ml-0">
                        <div className="flex flex-col items-center pt-2.5 max-lg:hidden">
                            <div
                                className="h-[33px] w-[33px] rounded-full grid place-items-center"
                                style={{
                                    background:
                                        "linear-gradient(180deg, rgba(115, 108, 237, 0.1) 0%, rgba(22, 198, 164, 0.1) 100%)",
                                }}
                            >
                                <div className="rounded-full w-[19px] h-[19px] bg-gradient-to-b p-[2px] from-[#736CED] from-10% to-[#16C6A4] to-100%">
                                    <div className="h-full bg-gray-100 rounded-full" />
                                </div>
                            </div>

                            <div
                                className={`w-[1.5px] ${
                                    isSectionThreeVisible ? "h-[540px]" : "h-[10px]"
                                } transition-[height] duration-[3s] ease-in-out bg-gradient-to-b from-[#FFFFFF] from-0% via-[rgba(115,108,237,40] via-40% to-[#16C6A4] to-100%`}
                            />
                        </div>

                        <Slide direction="up" triggerOnce className="max-lg:hidden">
                            <div className="ml-10 pb-[220px] max-lg:pb-0 max-lg:pt-10 max-lg:ml-0 max-lg:flex max-lg:flex-col max-lg:items-center">
                                <p className="font-rocGroteskMedium bg-[#E4FCF6] text-sm rounded-full p-3 px-3.5 w-max">
                                    Business analytics
                                </p>
                                <h3 className="font-rocGroteskBold max-lg:text-center text-[32px] max-sm:text-2xl mt-[22px] mb-[23px] leading-[51.84px]">
                                    Business Intelligence At Your <br />
                                    Fingertips
                                </h3>
                                <p className="text-sm max-sm:text-sm max-sm:leading-[20px] max-lg:text-center leading-[24px]">
                                    Using Fleet+ as your freight management software helps you track
                                    your business activities automatically. From how many shipments
                                    you’ve taken live in the last 7 days, to how many quote requests
                                    you’ve responded to, you have all the data. You don’t need any
                                    extra knowledge of statistics.
                                </p>

                                <a
                                    href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button
                                        onMouseEnter={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover3: true,
                                            }))
                                        }
                                        onMouseLeave={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover3: false,
                                            }))
                                        }
                                        className="text-gun-metal font-rocGroteskMedium hover:bg-gun-metal hover:!text-white text-base max-sm:text-base bg-white mt-8 rounded-full border border-gun-metal flex items-center p-2 px-4"
                                    >
                                        Join Fleet+{" "}
                                        <div
                                            className={`${
                                                joinTradeAllyBtn.hover3 &&
                                                "w-[23px] h-[23px] rounded-full bg-white flex items-center justify-center ml-1"
                                            }`}
                                        >
                                            {/* <BackArrowIcon
                                                className={`rotate-[135deg] [&_*]:fill-gun-metal m-1 `}
                                            /> */}
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687270177/Web%20App/website/icons/45_deg_arrow_dztgen.svg"
                                                }
                                                alt="arrow icon"
                                                className={` [&_*]:fill-gun-metal m-1 `}
                                                width={9}
                                                height={9}
                                            />
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </Slide>

                        <div className="hidden max-lg:block">
                            <div className="ml-10  max-lg:pb-0 max-lg:pt-10 max-lg:ml-0 max-lg:flex max-lg:flex-col max-lg:items-center">
                                <p className="font-rocGroteskMedium bg-[#E4FCF6] text-sm rounded-full p-3 px-3.5 w-max">
                                    Business analytics
                                </p>
                                <h3 className="font-rocGroteskBold max-lg:text-center text-[32px] max-sm:text-2xl mt-[22px] mb-[23px] leading-[51.84px]">
                                    Business Intelligence At Your <br />
                                    Fingertips
                                </h3>
                                <p className="text-sm max-sm:text-sm max-sm:leading-[20px] max-lg:text-center leading-[24px]">
                                    Using Fleet+ as your freight management software helps you track
                                    your business activities automatically. From how many shipments
                                    you’ve taken live in the last 7 days, to how many quote requests
                                    you’ve responded to, you have all the data. You don’t need any
                                    extra knowledge of statistics.
                                </p>

                                <a
                                    href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button
                                        onTouchStart={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover3: true,
                                            }))
                                        }
                                        onTouchEnd={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover3: false,
                                            }))
                                        }
                                        className={`font-rocGroteskMedium ${
                                            joinTradeAllyBtn.hover3
                                                ? "bg-gun-metal !text-white"
                                                : "bg-white text-gun-metal"
                                        }  text-base max-sm:text-base  mt-8 rounded-full border border-gun-metal flex items-center p-2 px-4`}
                                    >
                                        Join Fleet+{" "}
                                        <div
                                            className={`${
                                                joinTradeAllyBtn.hover3 &&
                                                "w-[23px] h-[23px] rounded-full bg-white flex items-center justify-center ml-1"
                                            }`}
                                        >
                                            {/* <BackArrowIcon
                                                className={`rotate-[135deg] [&_*]:fill-gun-metal m-1 `}
                                            /> */}
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687270177/Web%20App/website/icons/45_deg_arrow_dztgen.svg"
                                                }
                                                alt="arrow icon"
                                                className={` [&_*]:fill-gun-metal m-1 `}
                                                width={9}
                                                height={9}
                                            />
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Solution 4 */}
                <div
                    ref={section4Ref}
                    className="grid grid-cols-[0.9fr,1fr] max-lg:grid-cols-1 max-lg:mt-10"
                >
                    <div className="max-lg:flex w-full justify-center hidden">
                        <AllInOneMobileLine />
                    </div>
                    <Slide direction="up" triggerOnce className="max-lg:hidden">
                        <img
                            src={
                                "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704661798/documentation_lf0rbq.jpg"
                            }
                            alt="solution 4"
                            loading="lazy"
                            className="w-[1004px] h-[463px] max-lg:w-full max-sm:h-[310px]"
                        />
                    </Slide>
                    <div className="hidden max-lg:block">
                        <img
                            src={
                                "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704661798/documentation_lf0rbq.jpg"
                            }
                            alt="solution 4"
                            loading="lazy"
                            className="w-[1004px] h-[463px] max-lg:w-full max-sm:h-[310px]"
                        />
                    </div>

                    <div className="flex ml-5  max-lg:ml-0">
                        <div className="flex flex-col items-center pt-2.5 max-lg:hidden">
                            <div
                                className="h-[33px] w-[33px] rounded-full grid place-items-center"
                                style={{
                                    background:
                                        "linear-gradient(180deg, rgba(115, 108, 237, 0.1) 0%, rgba(22, 198, 164, 0.1) 100%)",
                                }}
                            >
                                <div className="rounded-full w-[19px] h-[19px] bg-gradient-to-b p-[2px] from-[#736CED] from-10% to-[#16C6A4] to-100%">
                                    <div className="h-full bg-gray-100 rounded-full" />
                                </div>
                            </div>

                            <div
                                className={`w-[1.5px] ${
                                    isSectionFourVisible ? "h-[540px]" : "h-[10px]"
                                } transition-[height] duration-[3s] ease-in-out bg-gradient-to-b from-[#FFFFFF] from-0% via-[rgba(115,108,237,40] via-40% to-[#16C6A4] to-100%`}
                            />
                        </div>

                        <Slide direction="up" triggerOnce className="max-lg:hidden">
                            <div className="ml-10 pb-[170px] max-lg:pb-0 max-lg:pt-10 max-lg:ml-0 max-lg:flex max-lg:flex-col max-lg:items-center">
                                <p className="font-rocGroteskMedium bg-[#E8FFE5] text-sm rounded-full p-3 px-3.5 w-max">
                                    Documentation
                                </p>
                                <h3 className="font-rocGroteskBold max-lg:text-center text-[32px] max-sm:text-2xl mt-[22px] mb-[23px] leading-[51.84px]">
                                    Your Shipment Documents Safe <br /> in One Space
                                </h3>
                                <p className="text-sm max-sm:text-sm max-sm:leading-[20px] max-lg:text-center leading-[24px]">
                                    Transition from paper-first to safe cloud storage for all your
                                    shipment documents on Fleet+. With the documents feature, all
                                    relevant documentation for each shipment can be stored in one
                                    folder.
                                    <br />
                                    <br />
                                    You can easily search and share them, and they’re safe from
                                    fire, water, and other damaging hazards.
                                </p>

                                <a
                                    href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button
                                        onMouseEnter={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover4: true,
                                            }))
                                        }
                                        onMouseLeave={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover4: false,
                                            }))
                                        }
                                        className="text-gun-metal font-rocGroteskMedium hover:bg-gun-metal hover:!text-white text-base max-sm:text-base bg-white mt-8 rounded-full border border-gun-metal flex items-center p-2 px-4"
                                    >
                                        Join Fleet+{" "}
                                        <div
                                            className={`${
                                                joinTradeAllyBtn.hover4 &&
                                                "w-[23px] h-[23px] rounded-full bg-white flex items-center justify-center ml-1"
                                            }`}
                                        >
                                            {/* <BackArrowIcon
                                                className={`rotate-[135deg] [&_*]:fill-gun-metal m-1 `}
                                            /> */}
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687270177/Web%20App/website/icons/45_deg_arrow_dztgen.svg"
                                                }
                                                alt="arrow icon"
                                                className={` [&_*]:fill-gun-metal m-1 `}
                                                width={9}
                                                height={9}
                                            />
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </Slide>

                        <div className="hidden max-lg:block">
                            <div className="ml-10  max-lg:pb-0 max-lg:pt-10 max-lg:ml-0 max-lg:flex max-lg:flex-col max-lg:items-center">
                                <p className="font-rocGroteskMedium bg-[#E8FFE5] text-sm rounded-full p-3 px-3.5 w-max">
                                    Documentation
                                </p>
                                <h3 className="font-rocGroteskBold max-lg:text-center text-[32px] max-sm:text-2xl mt-[22px] mb-[23px] leading-[51.84px]">
                                    Your Shipment Documents Safe <br /> in One Space
                                </h3>
                                <p className="text-sm max-sm:text-sm max-sm:leading-[20px] max-lg:text-center leading-[24px]">
                                    Transition from paper-first to safe cloud storage for all your
                                    shipment documents on Fleet+. With the documents feature, all
                                    relevant documentation for each shipment can be stored in one
                                    folder.
                                    <br />
                                    <br />
                                    You can easily search and share them, and they’re safe from
                                    fire, water, and other damaging hazards.
                                </p>

                                <a
                                    href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button
                                        onTouchStart={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover4: true,
                                            }))
                                        }
                                        onTouchEnd={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover4: false,
                                            }))
                                        }
                                        className={`font-rocGroteskMedium ${
                                            joinTradeAllyBtn.hover4
                                                ? "bg-gun-metal !text-white"
                                                : "bg-white text-gun-metal"
                                        }  text-base max-sm:text-base  mt-8 rounded-full border border-gun-metal flex items-center p-2 px-4`}
                                    >
                                        Join Fleet+{" "}
                                        <div
                                            className={`${
                                                joinTradeAllyBtn.hover4 &&
                                                "w-[23px] h-[23px] rounded-full bg-white flex items-center justify-center ml-1"
                                            }`}
                                        >
                                            {/* <BackArrowIcon
                                                className={`rotate-[135deg] [&_*]:fill-gun-metal m-1 `}
                                            /> */}
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687270177/Web%20App/website/icons/45_deg_arrow_dztgen.svg"
                                                }
                                                alt="arrow icon"
                                                className={` [&_*]:fill-gun-metal m-1 `}
                                                width={9}
                                                height={9}
                                            />
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Solution 5 */}
                <div
                    ref={section5Ref}
                    className="grid grid-cols-[0.9fr,1fr] max-lg:grid-cols-1 max-lg:mt-10"
                >
                    <div className="max-lg:flex w-full justify-center hidden">
                        <AllInOneMobileLine />
                    </div>
                    <Slide direction="up" triggerOnce className="max-lg:hidden">
                        <img
                            src={
                                "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704661799/shipment_tracking_y5ubtd.jpg"
                            }
                            alt="solution 4"
                            loading="lazy"
                            className="w-[1004px] h-[463px] max-lg:w-full max-sm:h-[310px]"
                        />
                    </Slide>
                    <div className="hidden max-lg:block">
                        <img
                            src={
                                "https://res.cloudinary.com/dwp6wpymz/image/upload/v1704661799/shipment_tracking_y5ubtd.jpg"
                            }
                            alt="solution 4"
                            loading="lazy"
                            className="w-[1004px] h-[463px] max-lg:w-full max-sm:h-[310px]"
                        />
                    </div>

                    <div className="flex ml-5 max-lg:ml-0">
                        <div className="flex flex-col items-center pt-2.5 max-lg:hidden">
                            <div
                                className="h-[33px] w-[33px] rounded-full grid place-items-center"
                                style={{
                                    background:
                                        "linear-gradient(180deg, rgba(115, 108, 237, 0.1) 0%, rgba(22, 198, 164, 0.1) 100%)",
                                }}
                            >
                                <div className="rounded-full w-[19px] h-[19px] bg-gradient-to-b p-[2px] from-[#736CED] from-10% to-[#16C6A4] to-100%">
                                    <div className="h-full bg-gray-100 rounded-full" />
                                </div>
                            </div>

                            <div
                                className={`w-[1.5px] ${
                                    isSectionFiveVisible ? "h-[440px]" : "h-[10px]"
                                } transition-[height] duration-[3s] ease-in-out bg-gradient-to-b from-[#FFFFFF] from-0% via-[rgba(115,108,237,40] via-40% to-[#16C6A4] to-100%`}
                            />
                        </div>

                        <Slide direction="up" triggerOnce className="max-lg:hidden">
                            <div className="ml-10 pb-[195px] max-lg:pb-0 max-lg:pt-10 max-lg:ml-0 max-lg:flex max-lg:flex-col max-lg:items-center">
                                <p className="font-rocGroteskMedium bg-[#736CED1F] text-sm rounded-full p-3 px-3.5 w-max">
                                    Shipment tracking
                                </p>
                                <h3 className="font-rocGroteskBold max-lg:text-center text-[32px] max-sm:text-2xl mt-[22px] mb-[23px] leading-[51.84px]">
                                    Seamless Tracking System
                                </h3>
                                <p className="text-sm max-sm:text-sm max-sm:leading-[20px] max-lg:text-center leading-[24px]">
                                    On the Fleet+ app, you can easily track your cargo on any
                                    shipping carrier or airline. All you need is your tracking
                                    number and you can find real-time updates on your cargo,
                                    wherever it is around the globe.
                                </p>
                                <a
                                    href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button
                                        onMouseEnter={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover5: true,
                                            }))
                                        }
                                        onMouseLeave={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover5: false,
                                            }))
                                        }
                                        className="text-gun-metal font-rocGroteskMedium hover:bg-gun-metal hover:!text-white text-base max-sm:text-base bg-white mt-8 rounded-full border border-gun-metal flex items-center p-2 px-4"
                                    >
                                        Join Fleet+{" "}
                                        <div
                                            className={`${
                                                joinTradeAllyBtn.hover5 &&
                                                "w-[23px] h-[23px] rounded-full bg-white flex items-center justify-center ml-1"
                                            }`}
                                        >
                                            {/* <BackArrowIcon
                                                className={`rotate-[135deg] [&_*]:fill-gun-metal m-1 `}
                                            /> */}
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687270177/Web%20App/website/icons/45_deg_arrow_dztgen.svg"
                                                }
                                                alt="arrow icon"
                                                className={` [&_*]:fill-gun-metal m-1 `}
                                                width={9}
                                                height={9}
                                            />
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </Slide>

                        <div className="hidden max-lg:block">
                            <div className="ml-10 pb-[120px] max-lg:pb-0 max-lg:pt-10 max-lg:ml-0 max-lg:flex max-lg:flex-col max-lg:items-center">
                                <p className="font-rocGroteskMedium bg-[#736CED1F] text-sm rounded-full p-3 px-3.5 w-max">
                                    Shipment tracking
                                </p>
                                <h3 className="font-rocGroteskBold max-lg:text-center text-[32px] max-sm:text-2xl mt-[22px] mb-[23px] leading-[51.84px]">
                                    Seamless Tracking System
                                </h3>
                                <p className="text-sm max-sm:text-sm max-sm:leading-[20px] max-lg:text-center leading-[24px]">
                                    On the Fleet+ app, you can easily track your cargo on any
                                    shipping carrier or airline. All you need is your tracking
                                    number and you can find real-time updates on your cargo,
                                    wherever it is around the globe.
                                </p>
                                <a
                                    href="https://calendar.app.google/61y6qdd1LvycbXHa7"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button
                                        onTouchStart={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover5: true,
                                            }))
                                        }
                                        onTouchEnd={() =>
                                            setJoinTradeAllyBtn((prev) => ({
                                                ...prev,
                                                hover5: false,
                                            }))
                                        }
                                        className={`font-rocGroteskMedium ${
                                            joinTradeAllyBtn.hover5
                                                ? "bg-gun-metal !text-white"
                                                : "bg-white text-gun-metal"
                                        }  text-base max-sm:text-base  mt-8 rounded-full border border-gun-metal flex items-center p-2 px-4`}
                                    >
                                        Join Fleet+{" "}
                                        <div
                                            className={`${
                                                joinTradeAllyBtn.hover5 &&
                                                "w-[23px] h-[23px] rounded-full bg-white flex items-center justify-center ml-1"
                                            }`}
                                        >
                                            {/* <BackArrowIcon
                                                className={`rotate-[135deg] [&_*]:fill-gun-metal m-1 `}
                                            /> */}
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687270177/Web%20App/website/icons/45_deg_arrow_dztgen.svg"
                                                }
                                                alt="arrow icon"
                                                className={` [&_*]:fill-gun-metal m-1 `}
                                                width={9}
                                                height={9}
                                            />
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Testimonials home />

            <section className="max-lg:mx-6 mx-[85px] 2xl:mx-44 1750:mx-56 mb-32 mt-10 rounded-[15px] min-h-[554px] overflow-hidden bg-[#F2FFFD] max-sm:p-4 p-24 pt-16">
                <h2 className="text-[45px] max-sm:text-2xl max-sm:mt-7 font-rocGroteskBold text-center mb-[38px]">
                    Frequently Asked Questions
                </h2>
                <div className="grid grid-cols-[44%,49%] max-lg:grid-cols-1 max-lg:gap-y-10 justify-between relative">
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687177600/Web%20App/website/contact-us-form_fdesx6.jpg"
                        }
                        alt="Contact us"
                        loading="lazy"
                        className="h-[467px] max-sm:h-[231px] w-full object-cover rounded-lg"
                    />
                    <div className="overflow-y-auto max-h-[400px] max-lg:max-h-[100%]">
                        {FAQs.map((faq, idx) => (
                            <FaqAccordion
                                idx={idx}
                                title={faq.title}
                                content={faq.content}
                                activeIdx={activeIdx}
                                toggleAccordion={toggleAccordion}
                                key={idx}
                            />
                        ))}

                        <p className="text-sm absolute max-lg:hidden left-[50%] bottom-0 h-max w-max">
                            Have more questions? Visit our{" "}
                            <Link
                                title="Fag pages"
                                className="font-rocGroteskMedium underline !text-blue-500"
                                to="/faqs"
                            >
                                FAQs page
                            </Link>
                        </p>
                        <p className="text-sm  max-lg:block hidden mt-10 h-max w-max">
                            Have more questions? Visit our{" "}
                            <Link
                                title="Fag pages"
                                className="font-rocGroteskMedium underline !text-blue-500"
                                to="/faqs"
                            >
                                FAQs page
                            </Link>
                        </p>
                    </div>
                </div>
            </section>

            <LandingFooter />
            <CookiePrompt />
        </div>
    );
};

export default Home;
