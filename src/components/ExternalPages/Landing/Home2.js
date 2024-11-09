import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import LandingNav2 from "./components/LandingNav2";
import HeroImg from "assets/images/hero.svg";
import SolutionsImg from "assets/images/solutions.svg";
import easyConnection from "assets/images/easy-connection.svg";
import spendLess from "assets/images/spend-less.svg";
import knowShipment from "assets/images/know-shipment.svg";
import workTogether from "assets/images/work-together.svg";
import ArrowImg from "assets/images/landing/arrow.svg";
import ArrowImgWhite from "assets/images/landing/arrow-white.svg";
import ReimagineBg from "assets/images/landing/reimagine/reimagine.svg";
import Reimagine2 from "assets/images/landing/reimagine/reimagine2.svg";
import Reimagine6 from "assets/images/landing/reimagine/reimagine6.svg";
import BetterImg from "assets/images/landing/better.svg";
import BetterCountriesImg from "assets/images/landing/better-countries.svg";
import LandingFooter2 from "./components/LandingFooter2";

var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    // autoplay: false,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 640,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

const Home = () => {
    return (
        <>
            <Hero
                url={HeroImg}
                className="w-screen h-screen left-0 top-0 overflow-hidden z-50 sm:relative sm:min-h-[90vh] bg-black"
            >
                <LandingNav2 />
                <div className="w-[90%] sm:w-full m-auto pt-28 sm:pt-48 pb-10 flex flex-col items-center">
                    <p className="bg-[#00255E]/40 border border-white/[0.15] px-4 py-1.5 text-white rounded-full w-max text-xs">
                        #1 FREIGHT MANAGEMENT PLATFORM
                    </p>
                    <p className="text-white text-4xl sm:text-6xl mt-8 text-center font-bold">
                        Experience the next level of <br />
                        <span className="text-[#B3F00D]">logistics solutions</span>
                    </p>
                    <p className="text-white text-lg sm:text-xl w-4/5 sm:w-1/2 mt-8 text-center">
                        Seamless logistics, optimised operations, increased profit, and a
                        sustainable future with Fleet+.
                    </p>
                </div>
                <div className="text-center pb-20 w-4/5 m-auto">
                    <Link to="/register">
                        <button
                            className={`px-8 py-3 bg-[#B3F00D] text-[#000918] rounded-md font-medium w-full sm:w-auto`}
                        >
                            Get Started for free
                        </button>
                    </Link>
                    <a href="https://calendly.com/fleetplus-demo/30min">
                        <button
                            className={`px-8 py-3 border border-white bg-transparent text-white mt-6 sm:mt-0 sm:ml-4 rounded-md font-medium w-full sm:w-auto`}
                        >
                            Schedule Demo
                        </button>
                    </a>
                </div>
            </Hero>
            <div className="sm:pb-20 overflow-x-hidden">
                <div className="text-center p-8 sm:p-20 w-full">
                    <p className="text-[#03B5D1] text-sm font-bold">WHY FLEET+?</p>
                    <p className="text-3xl sm:text-5xl font-bold py-4">Solutions just for you</p>
                    <p className="text-[#888F9C] text-sm w-4/5 sm:w-1/2 m-auto">
                        Our intelligent matching algorithm ensures you find the perfect freight
                        solutions that meet your specific shipping requirements.
                    </p>
                </div>
                <div className="w-[89vw] px-[10px] sm:px-[26px] m-auto">
                    <div className="block sm:flex items-center pb-10">
                        <div className="w-full sm:w-1/2 flex-shrink-0 mr-14">
                            <div className="border-b border-[#E6E6E6] py-4 sm:py-8 sm:flex items-center">
                                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 bg-[#03B5D1]/30 mr-6 rounded-full">
                                    <img
                                        src={easyConnection}
                                        alt="Fleet+ easy connection"
                                        className="h-full w-[50%]"
                                    />
                                </div>
                                <div className="w-full mt-6">
                                    <p className="text-xl font-semibold">Easy Connection</p>
                                    <p className="text-sm text-[#888F9C]">
                                        Seamless logistics, optimised operations, increased profit,
                                        and a sustainable future with Fleet+.
                                    </p>
                                </div>
                            </div>
                            <div className="border-b border-[#E6E6E6] py-4 sm:py-8 sm:flex items-center">
                                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 bg-[#03B5D1]/30 mr-6 rounded-full">
                                    <img
                                        src={spendLess}
                                        alt="Fleet+ easy connection"
                                        className="h-full w-[50%]"
                                    />
                                </div>
                                <div className="w-full mt-6">
                                    <p className="text-xl font-semibold">Spend less, Do More</p>
                                    <p className="text-sm text-[#888F9C]">
                                        Enjoy transparent and competitive pricing with fair
                                        transactions. No surprises or scary quote prices. 
                                    </p>
                                </div>
                            </div>
                            <div className="border-b border-[#E6E6E6] py-4 sm:py-8 sm:flex items-center">
                                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 bg-[#03B5D1]/30 mr-6 rounded-full">
                                    <img
                                        src={knowShipment}
                                        alt="Fleet+ easy connection"
                                        className="h-full w-[50%]"
                                    />
                                </div>
                                <div className="w-full mt-6">
                                    <p className="text-xl font-semibold">
                                        Know where your shipment is
                                    </p>
                                    <p className="text-sm text-[#888F9C]">
                                        Track your shipments in real-time, ensuring you're always
                                        updated and in control of your supply chain.
                                    </p>
                                </div>
                            </div>
                            <div className="border-b border-[#E6E6E6] py-4 sm:py-8 sm:flex items-center">
                                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 bg-[#03B5D1]/30 mr-6 rounded-full">
                                    <img
                                        src={workTogether}
                                        alt="Fleet+ easy connection"
                                        className="h-full w-[50%]"
                                    />
                                </div>
                                <div className="w-full mt-6">
                                    <p className="text-xl font-semibold">Work Together</p>
                                    <p className="text-sm text-[#888F9C]">
                                        Communicate and share immediate updates with team members
                                        and 3rd parties to optimize routes and resources.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center mt-4 mb-14 sm:mt-10 sm:mb-0">
                                <p className="text-[#00255E] text-md font-semibold">
                                    See more reasons
                                </p>
                                <img src={ArrowImg} alt="Fleet+" className="h-4 ml-4" />
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 flex-shrink-0">
                            <img
                                src={SolutionsImg}
                                alt="Fleet+ solutions"
                                className="h-full w-full sm:w-[85%]"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Reimagine
                url={ReimagineBg}
                className="sm:pb-20 mt-20 bg-[#F8F8F8] relative reimagine overflow-x-hidden"
            >
                <div className="w-[89vw] p-20 pb-0 px-[10px] sm:pb-20 sm:px-[26px] m-auto">
                    <p className="text-[#03B5D1] text-sm w-1/2 uppercase font-bold relative z-20">
                        How does Fleet+ work?
                    </p>
                    <p className="text-3xl sm:text-5xl font-bold py-4">
                        Reimagine Freight Forwarding
                    </p>
                </div>
                <div className="w-[89vw] px-[10px] sm:px-[26px] m-auto">
                    <div className="sm:flex mb-4 sm:mb-8">
                        <div className="w-full mb-4 sm:mb-0 sm:w-1/2 shadow sm:mr-8 bg-white rounded-[12px] p-4">
                            <ImagineImage
                                url={`https://res.cloudinary.com/dwp6wpymz/image/upload/v1708638492/reimagine1_hzb8xi.svg`}
                                className="h-64 rounded-[12px]"
                            ></ImagineImage>
                            <div className="min-h-[100px]">
                                <p className="mt-6 text-md text-[#000918]">Seamless Efficiency</p>
                                <p className="my-2 text-sm text-[#888F9C]">
                                     Experience ease with your workload. Tasks that once took hours
                                    can now be completed in minutes. Fleet+ is designed for
                                    effortless navigation, ensuring every interaction is a step
                                    towards enhanced efficiency.
                                </p>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 shadow bg-white rounded-[12px] p-4">
                            <ImagineImage
                                url={Reimagine2}
                                className="h-64 rounded-[12px]"
                            ></ImagineImage>
                            <div className="min-h-[100px]">
                                <p className="mt-6 text-md text-[#000918]">Global Connectivity</p>
                                <p className="my-2 text-sm text-[#888F9C]">
                                     No more geographical limitations. With Fleet+, your logistics
                                    network transcends borders. Connect with shippers and carriers
                                    worldwide, expanding your reach and opportunities on a global
                                    scale.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="sm:flex mb-4 sm:mb-8">
                        <div className="w-full mb-4 sm:mb-0 sm:w-1/2 shadow sm:mr-8 bg-white rounded-[12px] p-4">
                            <ImagineImage
                                url={`https://res.cloudinary.com/dwp6wpymz/image/upload/v1708638492/reimagine3_i8fv1f.svg`}
                                className="h-64 rounded-[12px]"
                            ></ImagineImage>
                            <div className="min-h-[100px]">
                                <p className="mt-6 text-md text-[#000918]">Smart Decision-Making</p>
                                <p className="my-2 text-sm text-[#888F9C]">
                                    Make informed decisions with Fleet+' insights. From setting
                                    freight requirements to selecting optimal routes, our platform
                                    empowers you with the data-driven tools needed to stay ahead.
                                </p>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 shadow bg-white rounded-[12px] p-4">
                            <ImagineImage
                                url="https://res.cloudinary.com/dwp6wpymz/image/upload/v1708638485/reimagine4_yeyaut.svg"
                                className="h-64 rounded-[12px]"
                            ></ImagineImage>
                            <div className="min-h-[100px]">
                                <p className="mt-6 text-md text-[#000918]">
                                    Sustainability Integration
                                </p>
                                <p className="my-2 text-sm text-[#888F9C]">
                                    Join the movement towards eco-conscious logistics. We are
                                    committed to reducing the environmental impact of shipping and
                                    aligning your operations with sustainability goals and industry
                                    standards.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="sm:flex mb-4 sm:mb-8">
                        <div className="w-full mb-4 sm:mb-0 sm:w-1/2 shadow sm:mr-8 bg-white rounded-[12px] p-4">
                            <ImagineImage
                                url="https://res.cloudinary.com/dwp6wpymz/image/upload/v1708638487/reimagine5_kypmfl.svg"
                                className="h-64 rounded-[12px]"
                            ></ImagineImage>
                            <div className="min-h-[100px]">
                                <p className="mt-6 text-md text-[#000918]">Real-Time Visibility</p>
                                <p className="my-2 text-sm text-[#888F9C]">
                                    Say goodbye to uncertainty. Get real-time tracking and
                                    management capabilities, putting the control of your shipments
                                    directly in your hands, wherever you are in the world.
                                </p>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 shadow bg-white rounded-[12px] p-4">
                            <ImagineImage
                                url={Reimagine6}
                                className="h-64 rounded-[12px]"
                            ></ImagineImage>
                            <div className="min-h-[100px]">
                                <p className="mt-6 text-md text-[#000918]">Profit Optimisation</p>
                                <p className="my-2 text-sm text-[#888F9C]">
                                    Drive your bottom line up. Fleet+ empowers you to set
                                    competitive rates and optimize profits, ensuring that every
                                    shipment contributes to the growth and success of your business.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-20 pb-44 sm:pb-96 w-full">
                    <button className={`px-10 py-3 bg-[#00255E] text-white rounded-md font-medium`}>
                        Book a demo
                    </button>
                </div>
            </Reimagine>
            <Better
                url={BetterImg}
                className="pt-20 sm:pt-56 pb-14 bg-[#00255E] text-center overflow-x-hidden"
            >
                <p className="text-[#03B5D1] text-sm font-bold sm:mb-10">WHAT WE ARE ABOUT</p>
                <p className="text-3xl sm:text-5xl font-bold pt-4 sm:py-4 text-[#FFF] sm:leading-3">
                    A better world.
                </p>
                <p className="text-3xl sm:text-5xl font-bold pt-0 py-4 sm:pt-4 text-[#B3F00D]">
                    Easier Logistics.
                </p>
                <p className="text-sm py-2 text-[#FFF]/50 w-[90%] sm:w-2/5 m-auto">
                    At Fleet+, we believe in the power of collaboration to transform the world of
                    freight and logistics. Our solution is designed to bring together freight
                    forwarders, shippers, and logistics operators,creating a seamless ecosystem that
                    drives efficiency, transparency, and growth.
                </p>
                <Link
                    to={"/about"}
                    className="flex items-center m-auto w-max pt-6 pb-20 select-none	cursor-pointer"
                >
                    <p className="text-md text-[#FFF] m-auto">Learn more about us</p>
                    <img src={ArrowImgWhite} alt="Fleet+" className="h-4 ml-4 mb-1" />
                </Link>
                <img src={BetterCountriesImg} alt="Fleet+ countries" className="h-20 m-auto" />
            </Better>
            <div className="pb-44 relative w-full overflow-hidden">
                <div className="w-[89vw] pt-20 pb-10 px-[10px] sm:px-[26px] m-auto">
                    <p className="text-[#03B5D1] text-sm w-1/2 uppercase font-bold relative z-20">
                        USE CASES
                    </p>
                    <p className="text-5xl font-bold pt-4">Case Study Headline</p>
                </div>
                <div className="w-[89vw] px-[10px] sm:px-[26px] m-auto">
                    <Slider className="w-full sm:w-[calc(140%)]" {...settings}>
                        <div className="w-1/2 pr-0 sm:p-4 sm:pr-8 h-full">
                            <div className="shadow bg-white rounded-[12px] p-4 h-full">
                                <p className="text-[#03B5D1] text-xs mb-4 uppercase font-bold relative z-20">
                                    Case Study
                                </p>
                                <p className="text-black text-xl mb-4 font-bold relative z-20">
                                    Streamlining Operations with Fleet+ for "Global Logistics
                                    Solutions Inc."
                                </p>
                                <p className="text-[#888F9C] text-sm relative z-20">
                                    Global Logistics Solutions Inc. is a multinational freight and
                                    logistics company with a diverse range of clients. handles
                                    complex international shipments involving multiple carriers and
                                    modes of transport. Manual paperwork and disconnected systems
                                    lead to delays, errors, and frustrated customers. Visibility and
                                    tracking are limited, making it difficult to monitor shipments
                                    and respond to inquiries.
                                </p>
                                <p className="text-[#03B5D1] text-xl mt-4 mb-2">
                                    Global Logistics Solutions Inc.
                                </p>
                            </div>
                        </div>
                        <div className="w-1/2 p-4 pr-8 h-full">
                            <div className="shadow bg-white rounded-[12px] p-4 h-full">
                                <p className="text-[#03B5D1] text-xs mb-4 uppercase font-bold relative z-20">
                                    Case Study
                                </p>
                                <p className="text-black text-xl mb-4 font-bold relative z-20">
                                    Enhancing Collaboration with Fleet+ for "Swift Transport
                                    Services"
                                </p>
                                <p className="text-[#888F9C] text-sm relative z-20">
                                    Swift Transport Services is a regional freight and logistics
                                    company specializing in time-sensitive deliveries. The Company
                                    deals with a complex mess of paperwork across different
                                    transportation modes - sea, rail, and air. Manual document
                                    handling led to errors, delays, and missed deadlines. Tracking
                                    shipments across various carriers was a logistical nightmare.
                                </p>
                                <p className="text-[#03B5D1] text-xl mt-4 mb-2">
                                    Swift Transport Services
                                </p>
                            </div>
                        </div>
                        <div className="w-1/2 p-4 pr-8 h-full">
                            <div className="shadow bg-white rounded-[12px] p-4 h-full">
                                <p className="text-[#03B5D1] text-xs mb-4 uppercase font-bold relative z-20">
                                    Case Study
                                </p>
                                <p className="text-black text-xl mb-4 font-bold relative z-20">
                                    Optimizing Routes and Resources with Fleet+ for "Fast Cargo
                                    Solutions"
                                </p>
                                <p className="text-[#888F9C] text-sm relative z-20">
                                    Fast Cargo Solutions is a national freight and logistics company
                                    focusing on expedited deliveries. The Company manages complex
                                    international shipments, facing challenges with document
                                    management, communication gaps, and visibility across multiple
                                    modes of transport.
                                </p>
                                <p className="text-[#03B5D1] text-xl mt-4 mb-2">
                                    Fast Cargo Solutions
                                </p>
                            </div>
                        </div>
                        <div className="w-1/2 p-4 pr-8 h-full">
                            <div className="shadow bg-white rounded-[12px] p-4 h-full">
                                <p className="text-[#03B5D1] text-xs mb-4 uppercase font-bold relative z-20">
                                    Case Study
                                </p>
                                <p className="text-black text-xl mb-4 font-bold relative z-20">
                                    Global Cargo: Enhancing International Trade Visibility and
                                    Compliance
                                </p>
                                <p className="text-[#888F9C] text-sm relative z-20">
                                    Global Cargo specializes in international freight forwarding.
                                    They face challenges with complex documentation, customs
                                    clearance delays, and a lack of real-time visibility into
                                    shipment progress.
                                </p>
                                <p className="text-[#03B5D1] text-xl mt-4 mb-2">
                                    Global cargo solutions
                                </p>
                            </div>
                        </div>
                        <div className="w-1/2 p-4 pr-8 h-full">
                            <div className="shadow bg-white rounded-[12px] p-4 h-full">
                                <p className="text-[#03B5D1] text-xs mb-4 uppercase font-bold relative z-20">
                                    Case Study
                                </p>
                                <p className="text-black text-xl mb-4 font-bold relative z-20">
                                    Swift Logistics
                                </p>
                                <p className="text-[#888F9C] text-sm relative z-20">
                                    Swift Logistics, a mid-sized freight company, faced challenges
                                    in optimizing route planning, reducing operational costs, and
                                    enhancing overall efficiency.
                                </p>
                                <p className="text-[#03B5D1] text-xl mt-4 mb-2">Swift Logistics</p>
                            </div>
                        </div>
                        <div className="w-1/2 p-4 pr-8 h-full">
                            <div className="shadow bg-white rounded-[12px] p-4 h-full">
                                <p className="text-[#03B5D1] text-xs mb-4 uppercase font-bold relative z-20">
                                    Case Study
                                </p>
                                <p className="text-black text-xl mb-4 font-bold relative z-20">
                                    Global Express Deliveries
                                </p>
                                <p className="text-[#888F9C] text-sm relative z-20">
                                    Global Express Shipping, a large international freight company,
                                    faced challenges in managing a vast and diverse fleet, ensuring
                                    compliance, and meeting stringent delivery timelines.
                                </p>
                                <p className="text-[#03B5D1] text-xl mt-4 mb-2">
                                    Global Express Deliveries
                                </p>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
            <div className="experience px-10 pt-28 pb-32 relative bg-[#F8F8F8] text-center overflow-x-hidden">
                <p className="text-3xl sm:text-5xl font-bold py-4 text-[#000918] sm:leading-3">
                    Experience the next level of
                </p>
                <p className="text-3xl sm:text-5xl font-bold pt-4 pb-10 text-[#03B5D1]">
                    logistics solutions
                </p>
                <div className="text-center">
                    <Link to="/register">
                        <button
                            className={`w-full sm:w-auto py-3 px-8 mb-4 sm:mb-0 border border-[#00255E] bg-[#00255E] text-[#FFF] rounded-md font-medium`}
                        >
                            Get Started for free
                        </button>
                    </Link>
                    <a href="https://calendly.com/fleetplus-demo/30min">
                        <button
                            className={`w-full sm:w-auto py-3 px-8 border border-[#00255E] bg-transparent text-[#00255E] sm:ml-4 rounded-md font-medium`}
                        >
                            Book a demo
                        </button>
                    </a>
                </div>
            </div>
            <LandingFooter2 />
        </>
    );
};

const Hero = styled.div`
    background-image: url(${(props) => props.url});
    background-size: cover;
    background-position: center;
`;

const ImagineImage = styled.div`
    background-image: url(${(props) => props.url});
    background-size: cover;
    background-position: center;
`;

const Reimagine = styled.div`
    background-image: url(${(props) => props.url});
    background-size: 100% auto;
    background-position: center bottom -100px;
    background-repeat: no-repeat;

    @media (max-width: 360px) {
        background-position: center bottom;
    }
`;

const Better = styled.div`
    background-image: url(${(props) => props.url});
    @media (max-width: 360px) {
        background-image: none;
    }
    background-size: 100% auto;
    background-position: center bottom;
    background-repeat: no-repeat;
`;

export default Home;
