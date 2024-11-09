import LandingFooter from "./components/LandingFooter";
import LandingNav from "./components/LandingNav";
import unleashBg from "assets/images/landing/unleash-vector.svg";
import aboutVectorBg from "assets/images/landing/about-vector.svg";
import Testimonials from "./components/Testimonials";
// import {
//     UnleashAdaptIcon,
//     // UnleashArrowIcon,
//     UnleashEmpowerIcon,
//     UnleashHonourIcon,
//     UnleashLeverageIcon,
//     UnleashNavigateIcon,
//     UnleashSecureIcon,
//     UnleashUnderstandIcon,
// } from "assets/arts";
import { useEffect, useRef, useState } from "react";
import ContactSection from "./components/ContactSection";
import { useSearchParams } from "react-router-dom";
import CookiePrompt from "./components/CookiePrompt";

const About = () => {
    const [activeLetter, setActiveLetter] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const scrollRef = useRef(null);
    const scrollableRef = useRef(null);
    const contactRef = useRef(null);
    const [param] = useSearchParams();
    const contactUs = param.get("contactUs");

    const acronym = ["U.", "N.", "L.", "E.", "A.", "S.", "H"];

    const handleLetterClick = (letter) => {
        setActiveLetter(letter);
        const container = document.getElementById("cards-section");
        const card = document.getElementById(`card-${letter}`);
        if (container && card) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const scrollOffset =
                cardRect.left - containerRect.left - containerRect.width / 2 + cardRect.width / 2;
            container.scrollLeft += scrollOffset;
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollSection = document.getElementById("cards-section");
            const scrollContainer = document.getElementById("cards-container-section");
            const cardElements = Array.from(scrollContainer?.children);
            const containerWidth = scrollSection?.offsetWidth;

            const middleScrollPosition = containerWidth / 2;

            let activeCard;

            cardElements.forEach((card, idx) => {
                const cardRect = card?.getBoundingClientRect();

                if (
                    cardRect?.left <= middleScrollPosition &&
                    cardRect?.right >= middleScrollPosition
                ) {
                    activeCard = idx + 1;
                }
            });

            if (activeCard && windowWidth <= 1024) {
                setActiveLetter(activeCard - 1);
            }
        };

        const scrollContainer = document.getElementById("cards-section");

        scrollContainer.addEventListener("scroll", handleScroll);

        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
        };
    }, [windowWidth]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (contactUs) {
            contactRef?.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [contactUs]);

    return (
        <div className="bg-landing-black [&_*]:text-white">
            <LandingNav />

            <header className="max-lg:px-6 px-[100px] pb-28 pt-48 max-lg:pt-32 flex max-lg:flex-col max-lg:justify-center justify-between items-center">
                <div className="w-[45%] max-lg:w-full max-lg:mb-[39px]">
                    <h1 className="text-6xl max-sm:text-[32px] max-sm:leading-[46px] leading-[86.4px] font-rocGroteskBold relative">
                        You Are Better <br className="max-sm:hidden" />
                        With An Ally
                        <img
                            src={aboutVectorBg}
                            alt="header design vector"
                            className="absolute w-[30%] bottom-[6px] left-[200px] max-sm:left-[6px] max-sm:bottom-[10px] max-sm:w-[12%] max-sm:bottom-[5px] max-lg:right-[380px] max-lg:bottom-[4px] max-lg:w-[25%]"
                        />
                    </h1>
                    <p className="text-lg max-sm:text-[13px] leading-[29px] max-sm:leading-[19px] mb-[33px] mt-4">
                        We believe that freight forwarders are the architects of{" "}
                        <br className=" max-sm:hidden" /> global trade, and Fleet+ is here to equip
                        you with the <br className=" max-sm:hidden" /> right tools for success.
                    </p>
                    <button
                        onClick={() => contactRef?.current?.scrollIntoView({ behavior: "smooth" })}
                        className="bg-pacific-cyan font-rocGroteskMedium h-[50px] text-lg w-[166px]"
                    >
                        Talk to an Ally
                    </button>
                </div>

                <div className="w-1/2 max-lg:w-full justify-center">
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687179538/Web%20App/website/about-image_tsd4f8.png"
                        }
                        alt="Better with an ally!"
                        className="h-[579px] rounded-lg max-lg:w-full max-lg:h-auto"
                    />
                </div>
            </header>

            <section className="max-lg:px-6 px-[100px] pb-24 pt-[105px] flex max-lg:flex-col max-lg:text-center gap-x-16 justify-between items-center [&_*]:!text-gun-metal bg-white">
                <div className="w-[45%] max-lg:w-full max-lg:mb-8">
                    <h3 className="font-rocGroteskMedium text-4xl mb-[18px]">Why Fleet+?</h3>
                    <p className="text-lg leading-[29px]">
                        At Fleet+, we believe that global trade should be accessible to all, and
                        we’re making this possible with technology. We enable connections that
                        unleash collaborations through freight forwarders, the architects of global
                        trade. <br />
                        <br />
                        As your Allies, we’re committed to creating economic opportunities for
                        everyone and promoting trade diversity and inclusion to create a better
                        future for global trade. With Fleet+ as an Ally, we can make the world more
                        connected and trade more efficient.
                    </p>
                </div>
                <div className="w-1/2 max-lg:w-full">
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687179653/Web%20App/website/why_Fleet+_xh2muz.png"
                        }
                        alt={"why Fleet+"}
                        className="w-full h-[510px] max-lg:w-full max-lg:h-auto object-cover rounded-xl"
                    />
                </div>
            </section>

            <section className="pt-16 pb-36">
                <h3 className="text-center mb-7 mx-[21%] max-lg:mx-0 text-xl">
                    Our mission is to empower freight forwarders to be more productive and
                    successful. We’re committed to making this mission a reality, and here are our
                    promises to you:
                </h3>

                <div className="flex justify-center gap-4 relative">
                    {acronym?.map((value, idx) => {
                        return (
                            <div key={value} className="relative">
                                <h1
                                    onClick={() => {
                                        if (windowWidth >= 1024) {
                                            handleLetterClick(idx);
                                        }
                                    }}
                                    className={`${
                                        activeLetter === idx ? "text-white" : "!text-white/20"
                                    } text-[45px] max-sm:text-[30px] cursor-pointer font-gilroyBold`}
                                >
                                    {value}
                                </h1>
                                {activeLetter === idx && (
                                    <div className="h-[30px] w-[7px] max-lg:hidden max-sm:w-[4.7px] max-sm:h-5 max-sm:h bg-white absolute left-[11px] -bottom-7 max-sm:left-[8px] max-sm:bottom-[-18px] cursor-none" />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div
                    className="flex overflow-hidden max-lg:overflow-x-auto max-lg:snap-x max-lg:snap-mandatory max-lg:pr-[50%] max-lg:px-[30%] scroll-smooth mt-10 scrollbar-hide"
                    style={{
                        background: `url(${unleashBg}) no-repeat`,
                        backgroundPositionX: "center",
                        backgroundPositionY: "32%",
                        backgroundSize: "cover",
                    }}
                    ref={scrollRef}
                    id="cards-section"
                    // onScroll={handleScroll}
                >
                    <div
                        ref={scrollableRef}
                        id="cards-container-section"
                        className={`grid grid-cols-[repeat(7,auto)]   gap-10 max-sm:gap-6 pr-[14%] pl-[calc(50%-344px)] pr-[calc(50%-400px)]`}
                    >
                        {unleash.map(({ icon, title, content }, idx) => (
                            <div
                                id={`card-${idx}`}
                                className={`  h-[343px] rounded-lg p-5 relative w-[344px] max-sm:w-[250px] max-sm:h-auto max-lg:snap-center max-lg:snap-always ${
                                    activeLetter === idx ? "bg-white" : "bg-[#C1C7D0]/90"
                                } ${idx === 0 ? "max-sm:ml-4" : ""}`}
                                key={title.toLowerCase() + idx}
                                data-letter={title[0]}
                            >
                                {/* <Icon
                                    className={`w-[64px] h-[64px] max-sm:w-7 max-sm:h-7 ${
                                        activeLetter !== idx &&
                                        "[&_path:first-of-type]:fill-[#B3BAC5]"
                                    }`}
                                /> */}
                                <img
                                    src={icon}
                                    className={`w-[64px] h-[64px] max-sm:w-7 max-sm:h-7 mix-blend-darken ${
                                        activeLetter !== idx &&
                                        "[&_path:first-of-type]:fill-[#B3BAC5] "
                                    }`}
                                    alt={`unleash ${title} icon`}
                                />
                                <h3 className="font-rocGroteskMedium text-xl max-lg:text-lg !text-gun-metal mt-8 mb-5 max-sm:mt-[18px] max-sm:mb-3 max-sm:text-sm">
                                    {title}
                                </h3>
                                <p className="text-base max-lg:text-sm !text-mvx-neutral font-rocGroteskRegular max-sm:mb-10 max-sm:text-[12px]">
                                    {content}
                                </p>

                                <div
                                    className={` ${
                                        idx ? "bg-[#B3BAC5]" : "bg-[#D9D9D9]"
                                    } grid place-items-center rounded-full w-[23px] h-[23px] cursor-pointer absolute bottom-5 left-5`}
                                >
                                    {/* <UnleashArrowIcon className="w-[8.43px] font-rocGroteskBold" /> */}
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687265741/Web%20App/website/icons/unleash-arrow_ledcgh.svg"
                                        }
                                        alt="unleash arrow icon"
                                        className="w-[8.43px] font-rocGroteskBold"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Testimonials />

            <div ref={contactRef}>
                <ContactSection />
            </div>

            <LandingFooter />
            <CookiePrompt />
        </div>
    );
};

const unleash = [
    {
        icon: "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687265991/Web%20App/website/icons/understand_avzeqv.svg",
        title: "Understand",
        content:
            "We strive to truly understand your needs and challenges. Our goal is to provide solutions that meet and exceed your expectations.",
    },
    {
        icon: "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687266278/Web%20App/website/icons/navigate_xmiswy.svg",
        title: "Navigate",
        content:
            "We help you navigate the complex world of international trade by providing you with the tools, resources, and expertise you need to succeed.",
    },
    {
        icon: "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687266313/Web%20App/website/icons/leverage_ntm0zx.svg",
        title: "Leverage",
        content:
            "We leverage our extensive network and technology to drive connection and collaboration between our users.",
    },
    {
        icon: "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687266332/Web%20App/website/icons/empower_rwgl12.svg",
        title: "Empower",
        content:
            "We empower you by giving you access to the knowledge, insights, and resources needed to make informed decisions and grow your businesses.",
    },
    {
        icon: "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687266409/Web%20App/website/icons/adapt_qxs01w.svg",
        title: "Adapt",
        content:
            "We always adapt to your changing needs, industry trends, and technological advancements to provide the best customer experience.",
    },
    {
        icon: "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687266439/Web%20App/website/icons/secure_hhts7d.svg",
        title: "Secure",
        content:
            "We take security seriously and are committed to protecting your data and privacy with the highest security measures.",
    },
    {
        icon: "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687266457/Web%20App/website/icons/honour_bf3dr8.svg",
        title: "Honour",
        content:
            "We honor our commitments to you, our customers, delivering on our promises and always acting with integrity and transparency.",
    },
];

export default About;
