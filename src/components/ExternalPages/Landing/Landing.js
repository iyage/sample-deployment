import React, { useEffect } from "react";
import singlePlatformImg from "assets/images/externalPages/phoneImg.svg";
import perfectMatchPhone from "assets/images/externalPages/perfectMatchImg.png";
import superNewStar from "assets/images/externalPages/superNewStar.svg";
// import {
// BriefcaseIcon,
// CustomerServiceIcon,
// Free100UsdIcon,
// FreeLogoIcon,
// GlobeIcon,
// LinkIcon,
// ProTradeallyIcon,
// TakeBusinessOnlineIcon,
// TrackingAndVisibilityIcon,
// } from "assets/arts";
import LandingSubFooter from "components/common/LandingSubFooter";
// import LandingFooter from "components/ExternalPages/Landing/components/LandingFooter";
// import LandingNav from "components/ExternalPages/Landing/components/LandingNav";
import Carousel from "react-multi-carousel";
import { useNavigate } from "react-router-dom";
import triggerTrackingPages from "helpers/triggerTrackingPages";
import LandingTempFooter from "./components/LandingTempFooter";
import LandingTempNav from "./components/LandingTempNav";

const Landing = () => {
    const navigate = useNavigate();
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 1, // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 1, // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1.1,
            slidesToSlide: 1, // optional, default to 1.
        },
    };

    useEffect(() => {
        triggerTrackingPages();
    }, []);

    return (
        <div>
            <section className="bg-gun-metal">
                {/* <LandingNav /> */}
                <LandingTempNav />

                <div className="flex flex-col text-center items-center mt-[79px] mb-6 px-6">
                    <div className="w-[65%] max-lg:w-full max-xl:w-[85%]">
                        <h1 className="text-7xl max-lg:text-[40px] max-lg:leading-[47px] font-rocGroteskBold mb-6 leading-[84px]">
                            <span className="text-pacific-cyan">Do more, Go further,</span>
                            <br />
                            <span className="text-white">You’re better with an Ally.</span>
                        </h1>
                        <p className="text-xl text-white font-rocGroteskMedium px-[55px] max-lg:px-0 mb-8">
                            <p className="text-inherit">
                                Fleet+ makes it simple for freight forwarders to utilize freight
                                management
                            </p>{" "}
                            <p className="text-inherit">
                                tools and connect with global freight partners to scale their
                                business operations.
                            </p>
                        </p>
                        <button
                            onClick={() => navigate("/waitlist")}
                            className="py-3 px-6 bg-pacific-cyan text-gun-metal text-lg font-rocGroteskMedium rounded-[4px] "
                        >
                            Join the waitlist
                        </button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_auto:best,f_auto/v1687268927/Web%20App/external_pages/landingPageGlobe_zjpgly.svg"
                        }
                        alt="globe"
                    />
                </div>
            </section>
            <section className="px-[146px] max-lg:px-6 max-xl:px-[70px] bg-white py-24">
                <div className="flex justify-center w-full">
                    <div className="text-center w-[65%] max-lg:w-full">
                        <p className="text-sm text-gun-metal font-rocGroteskBold mb-4 uppercase">
                            What Sets Fleet+ Apart
                        </p>
                        <h3 className="text-[42px] max-lg:text-[34px] text-gun-metal font-rocGroteskBold leading-[49px]">
                            Join us and take your freight business digital with our mobile app
                        </h3>
                    </div>
                </div>
                <div className="mt-[87px] max-lg:mt-10 grid grid-cols-[1fr_1fr_1fr] max-lg:grid-cols-[1fr_1fr] max-sm:grid-cols-[1fr] max-sm:gap-10">
                    <div className="px-4 py-[30px] max-sm:p-0">
                        <div className="flex justify-center mb-6">
                            {/* <TakeBusinessOnlineIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687188780/Web%20App/external_pages/icons/takeBusinessOnline_xugfts.svg"
                                }
                                alt="Take Business Online Icon"
                            />
                        </div>
                        <div className="text-gun-metal text-center">
                            <p className="text-2xl font-rocGroteskBold mb-6 text-gun-metal">
                                Take your Business Online
                            </p>
                            <p className="font-rocGroteskMedium text-base text-gun-metal">
                                Join us and take your business digital with a mobile app, webpage
                                and a custom web domain. The process is as simple as setting up a
                                Facebook page.
                            </p>
                        </div>
                    </div>
                    <div className="px-4 py-[30px] max-sm:p-0">
                        <div className="flex justify-center mb-6">
                            {/* <BriefcaseIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687189276/Web%20App/external_pages/icons/briefcase_hp9ep2.svg"
                                }
                                alt="Brief case Icon"
                            />
                        </div>
                        <div className="text-gun-metal text-center">
                            <p className="text-2xl font-rocGroteskBold mb-6 text-gun-metal">
                                Manage Your Operations
                            </p>
                            <p className="font-rocGroteskMedium text-base text-gun-metal">
                                Our software is a back office that enables you to create, manage and
                                track your customers’ shipments with ease. You can also create
                                quotes for your shipments, and request for quotes from partners
                                around the world.
                            </p>
                        </div>
                    </div>
                    <div className="px-4 py-[30px] max-sm:p-0">
                        <div className="flex justify-center mb-6">
                            {/* <GlobeIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687188428/Web%20App/external_pages/icons/globe_afy2eo.svg"
                                }
                                alt="globe icon"
                            />
                        </div>
                        <div className="text-gun-metal text-center">
                            <p className="text-2xl font-rocGroteskBold mb-6 text-gun-metal">
                                Access to Foreign Partners
                            </p>
                            <p className="font-rocGroteskMedium text-base text-gun-metal">
                                You get access to over 9000 partners in 190+ countries, including
                                China, India, USA, and the UK. You no longer have to struggle with
                                finding and connecting with global partners.
                            </p>
                        </div>
                    </div>
                    <div className="px-4 py-[30px] max-sm:p-0">
                        <div className="flex justify-center mb-6">
                            {/* <TrackingAndVisibilityIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687188991/Web%20App/external_pages/icons/trackingAndVisibility_awt1wv.svg"
                                }
                                alt="Tracking And Visibility Icon"
                            />
                        </div>
                        <div className="text-gun-metal text-center">
                            <p className="text-2xl font-rocGroteskBold mb-6 text-gun-metal">
                                Tracking and Visibility
                            </p>
                            <p className="font-rocGroteskMedium text-base text-gun-metal">
                                With our software, you make money by automating, issuing invoices
                                and also be able to send reminders to customers and accept fast
                                online Naira payment.
                            </p>
                        </div>
                    </div>
                    <div className="px-4 py-[30px] max-sm:p-0">
                        <div className="flex justify-center mb-6">
                            {/* <LinkIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687189633/Web%20App/external_pages/icons/link_dcndlk.svg"
                                }
                                alt="Link Icon"
                            />
                        </div>
                        <div className="text-gun-metal text-center">
                            <p className="text-2xl font-rocGroteskBold mb-6 text-gun-metal whitespace-nowrap">
                                Receive/Make Payments Easily
                            </p>
                            <p className="font-rocGroteskMedium text-base text-gun-metal">
                                With our software, you’ll easily make money by automating invoicing
                                and enabling fast online naira payment. Your customers can easily
                                make payments through a payment link, and you can send money
                                directly to your partners. You send naira and they receive Forex.
                            </p>
                        </div>
                    </div>
                    <div className="px-4 py-[30px] max-sm:p-0">
                        <div className="flex justify-center mb-6">
                            {/* <CustomerServiceIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687189406/Web%20App/external_pages/icons/customerService_jmbspz.svg"
                                }
                                alt="Customer Service Icon"
                            />
                        </div>
                        <div className="text-gun-metal text-center">
                            <p className="text-2xl font-rocGroteskBold mb-6 text-gun-metal">
                                24/7 Support
                            </p>
                            <p className="font-rocGroteskMedium text-base text-gun-metal">
                                You also get a support team that’s available 24/7, dedicated solely
                                to you and your customers. Your business conversations can now
                                happen on the Fleet+ app with our support team in the loop, and you
                                can reserve WhatsApp for casual chats.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="flex w-full pr-[95px] pl-[100px] bg-[#FAFBFC] pt-24 max-sm:flex-col max-xl:pr-[70px] max-xl:pl-0 max-lg:pr-6 max-lg:pl-0 max-sm:pl-6 max-sm:gap-[76px]">
                <div className="w-1/2 max-sm:w-full flex items-end justify-center max-lg:items-end">
                    <img
                        src={perfectMatchPhone}
                        alt="phone"
                        className="h-fit max-lg:h-[400px] max-sm:h-[320px]"
                    />
                </div>
                <div className="w-1/2 max-sm:w-full pb-24 max-lg:pb-12">
                    <h3 className="text-[42px] max-lg:text-[34px] font-rocGroteskBold leading-[49px] w-[80%] max-sm:w-full mb-[29px] text-left text-gun-metal">
                        The Perfect Match For Your Freight Business
                    </h3>
                    <p className="text-lg fontgilroyMedium mb-4 text-gun-metal">
                        Once a shipment goes live, it’s just you, constant WhatsApp notifications, a
                        prayer and low margins. Your phone is blowing up with your customers’
                        frustrations, but there’s nothing you can do about it.
                    </p>
                    <p className="text-lg fontgilroyMedium mb-8 text-gun-metal">
                        At that moment, you probably wish you could clone yourself; create another
                        person with your understanding of the customer’s needs and an expertise in
                        making things happen. That’s where Fleet+ comes in.
                    </p>
                    <div className="flex justify-start">
                        <button
                            onClick={() => navigate("/waitlist")}
                            className="py-3 px-6 bg-pacific-cyan text-gun-metal text-lg font-rocGroteskMedium rounded-[4px] "
                        >
                            Join the waitlist
                        </button>
                    </div>
                </div>
            </section>
            <section className="p-24 max-lg:px-6 max-xl:px-[70px] max-lg:py-10 bg-gun-metal flex jusitfy-center ">
                <div className="text-center">
                    <p className="text-sm text-[#E2F6FF] font-rocGroteskBold mb-4 uppercase">
                        Why We Are Building Fleet+
                    </p>
                    <p className="text-white text-[32px] max-sm:px-0 max-sm:text-[22px] font-rocGroteskBold px-20">
                        According to the International Monetary Fund (IMF), by 2026, Sub-Saharan
                        Africa's contributions to global exports and imports will grow
                        significantly, but only a small percentage of freight forwarders are using
                        technology effectively to take advantage of this growth.
                    </p>
                </div>
            </section>
            <section className="pt-[132px] px-[176px] max-xl:px-[70px] max-lg:px-6">
                <div className="flex max-sm:flex-col-reverse max-sm:gap-8 justify-between text-gun-metal mb-24">
                    <div className="w-1/2 max-sm:w-full">
                        <div className="w-[80%] max-sm:w-full">
                            <p className="text-sm font-rocGroteskBold mb-3 uppercase text-gun-metal">
                                TOOLS JUST FOR YOU
                            </p>
                            <h3 className="text-[42px] max-lg:text-[34px] font-rocGroteskBold leading-[49px] mb-6 text-gun-metal">
                                A single platform with all the tools you need to grow
                            </h3>
                            <p className="text-lg font-rocGroteskMedium text-gun-metal">
                                Running a freight forwarding business is incredibly complex, so we
                                want to be your trade ally. In addition to the Fleet+ features that
                                help you earn more by doing less, when you manage your shipments
                                through Fleet+, you also get:
                            </p>
                        </div>
                    </div>
                    <div className="w-1/2 max-sm:w-full flex justify-center">
                        <img src={singlePlatformImg} alt="phone" />
                    </div>
                </div>
                <div className="text-gun-metal grid grid-cols-[1fr_1fr_1fr] max-lg:hidden gap-4 relative">
                    <div className="p-8 bg-Fleet+-light-green">
                        <div className="mb-6">
                            {/* <ProTradeallyIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687189128/Web%20App/external_pages/icons/proTradeally_ezll7z.svg"
                                }
                                alt="Pro Fleet+ Icon"
                            />
                        </div>
                        <p className="text-2xl mb-6 font-rocGroteskBold text-gun-metal">
                            Pro version of Fleet+
                        </p>
                        <p className="font-rocGroteskMedium text-base pb-6 text-gun-metal">
                            Access to the pro version of Fleet+, for free, for up to 30 days after
                            the beta period. Allowing you to try out all of our advanced features
                            and see how they can benefit your business.
                        </p>
                    </div>
                    <div className="p-8 bg-tradeally-light-green">
                        <div className="mb-6">
                            {/* <FreeLogoIcon /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687188669/Web%20App/external_pages/icons/freeLogo_h0uoin.svg"
                                }
                                alt="Free Logo Icon"
                            />
                        </div>
                        <p className="text-2xl mb-6 font-rocGroteskBold text-gun-metal">
                            Free Logo Design
                        </p>
                        <p className="font-rocGroteskMedium text-base pb-6 text-gun-metal">
                            Free professional logo design that’ll help you stand out in the crowded
                            freight forwarding market.
                        </p>
                    </div>
                    <div>
                        <div className="p-8 bg-tradeally-light-green h-full">
                            <div className="mb-6">
                                {/* <Free100UsdIcon /> */}
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687188565/Web%20App/external_pages/icons/free100Usd_izmcwz.svg"
                                    }
                                    alt="Free 100 Usd Icon"
                                />
                            </div>
                            <p className="text-2xl mb-6 font-rocGroteskBold text-gun-metal">
                                $100 bonus
                            </p>
                            <p className="font-rocGroteskMedium text-base pb-6 text-gun-metal">
                                A $100 bonus on every 5 active shipments you make within a month.
                                This is a limited-time offer, only valid during the beta period.
                            </p>
                        </div>
                        <div className="absolute top-[-70px] right-[-40px]">
                            <img src={superNewStar} alt="super new" />
                        </div>
                    </div>
                </div>
                <div className="w-full lg:hidden">
                    <Carousel
                        swipeable={false}
                        draggable={false}
                        slidesToSlide={1}
                        responsive={responsive}
                        infinite={true}
                        autoPlay={true}
                        autoPlaySpeed={4000}
                        keyBoardControl={true}
                        customTransition="all .5"
                        transitionDuration={500}
                        containerClass="carousel-container h-full"
                        sliderClass="h-full max-sm:gap-6"
                        className="w-full h-full"
                        itemClass="h-[370px] max-sm:h-[400px]"
                        showDots={false}
                        arrows={false}
                    >
                        <div className="p-8 bg-tradeally-light-green h-full mr-4 max-sm:mr-0">
                            <div className="mb-6">
                                {/* <ProTradeallyIcon /> */}
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687189128/Web%20App/external_pages/icons/proTradeally_ezll7z.svg"
                                    }
                                    alt="Pro Fleet+ Icon"
                                />
                            </div>
                            <p className="text-2xl mb-6 font-rocGroteskBold text-gun-metal">
                                Pro version of Fleet+
                            </p>
                            <p className="font-rocGroteskMedium text-base pb-6 text-gun-metal">
                                Access to the pro version of Fleet+, for free, for up to 30 days
                                after the beta period. Allowing you to try out all of our advanced
                                features and see how they can benefit your business.
                            </p>
                        </div>
                        <div className="p-8 bg-tradeally-light-green h-full mr-4 max-sm:mr-0">
                            <div className="mb-6">
                                {/* <FreeLogoIcon /> */}
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687188669/Web%20App/external_pages/icons/freeLogo_h0uoin.svg"
                                    }
                                    alt="Free Logo Icon"
                                />
                            </div>
                            <p className="text-2xl mb-6 font-rocGroteskBold text-gun-metal">
                                Free Logo Design
                            </p>
                            <p className="font-rocGroteskMedium text-base pb-6 text-gun-metal">
                                Free professional logo design that’ll help you stand out in the
                                crowded freight forwarding market.
                            </p>
                        </div>
                        <div className="p-8 bg-tradeally-light-green h-full mr-4 max-sm:mr-0">
                            <div className="mb-6">
                                {/* <Free100UsdIcon /> */}
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687188565/Web%20App/external_pages/icons/free100Usd_izmcwz.svg"
                                    }
                                    alt="Free 100 Usd Icon"
                                />
                            </div>
                            <p className="text-2xl mb-6 font-rocGroteskBold text-gun-metal">
                                $100 bonus
                            </p>
                            <p className="font-rocGroteskMedium text-base pb-6 text-gun-metal">
                                A $100 bonus on every 5 active shipments you make within a month.
                                This is a limited-time offer, only valid during the beta period.
                            </p>
                        </div>
                    </Carousel>
                </div>
            </section>

            <section className=" w-full px-[176px] max-lg:px-6 max-xl:px-[70px] pt-[128px] pb-24">
                <div>
                    <div className="text-center px-6 max-lg:px-0 max-xl:px-0">
                        <p className="font-rocGroteskMedium text-gun-metal text-[32px] max-lg:text-[22px] mb-8">
                            “We exist for the dreamer, the believer. Fleet+ is the app for building
                            a global digital freight forwarding business that your customers love.
                            Fleet+ gives you an ally you can trust. Now there’s two of you. Now you
                            can achieve anything.”
                        </p>
                        <p className="text-gun-metal font-rocGroteskBold text-xl">
                            Head of Product
                        </p>
                    </div>
                </div>
            </section>

            <LandingSubFooter shouldNavigate={true} />

            <LandingTempFooter />
            {/* <LandingFooter /> */}
        </div>
    );
};

export default Landing;
