import React from "react";
import ScheduleSection from "./components/ScheduleSection";
import ExperienceLogisticsSection from "./components/ExperienceLogisticsSection";
import LandingNav2 from "./components/LandingNav2";
import Button from "components/common/Button";
import { useNavigate } from "react-router-dom";
import LandingFooter2 from "./components/LandingFooter2";

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div>
            <LandingNav2 />
            <div className="lg:h-[85vh] w-full min-h-[500px] lg:min-h-[650px] lg:max-h-[850px] about-us-hero">
                <video
                    autoPlay
                    muted
                    loop
                    id="about-us-hero"
                    playsInline
                    className="absolute top-0 left-0 z-[4] h-full object-cover w-full"
                >
                    <source
                        src="https://res.cloudinary.com/dwp6wpymz/video/upload/v1706226505/About_Us_Video_ombhmd.mp4"
                        type="video/mp4"
                    />
                    Video not supported
                </video>
                <div className="absolute top-0 left-0 h-full w-full about-us-hero-sub z-[5]" />
                <div className="relative z-10">
                    <h1 className="text-center pt-[100px] lg:pt-[150px] text-[40px] lg:text-[75px] font-rocGroteskBold text-white leading-tight">
                        A better world. <br />
                        <span className="text-[#B3F00D]">Easier Logistics.</span>
                    </h1>
                    <p className="text-center text-white font-inter text-sm lg:text-xl font-medium mt-2 lg:mt-0">
                        Seamless logistics, optimised operations, increased <br />
                        profit, and a sustainable future with Fleet+.
                    </p>
                    <div className="flex items-center justify-center mt-10 gap-4">
                        <Button
                            onClick={() => navigate("/register")}
                            className="!w-[177px] lg:!w-[284px] text-[#000918] py-3 rounded-lg bg-[#B3F00D] font-semibold font-inter text-sm lg:text-lg border-2 border-[#B3F00D]"
                        >
                            Get Started for free
                        </Button>
                        <Button
                            onClick={() =>
                                window.open("https://calendly.com/fleetplus-demo/30min", "_blank")
                            }
                            className="!w-[156px] lg:!w-[248px] text-white font-semibold font-inter text-sm lg:text-lg py-3 bg-transparent border-2 border-white"
                        >
                            Schedule Demo
                        </Button>
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 lg:w-[89vw] mx-auto lg:px-[26px] gap-5 lg:gap-10 py-20 items-start px-6">
                <div className="py-10">
                    <h1 className="text-[#03B5D1] font-bold font-inter text-xl mb-4">METRICS</h1>
                    <p className="font-rocGroteskBold text-[40px] lg:text-[60px] leading-tight">
                        Our impact <br />
                        in numbers
                    </p>
                    <p className="mt-1 text-[#888F9C] font-medium text-sm lg:text-lg font-inter">
                        At Fleet+, we believe in the power of collaboration to transform the world
                        of freight and logistics. Our solution is designed to bring together freight
                        forwarders, shippers, and logistics operators,creating a seamless ecosystem
                        that drives efficiency, transparency, and growth.
                    </p>
                    <div className="flex items-center mt-4 lg:mt-8 gap-1">
                        <h2 className="font-inter font-semibold text-lg lg:text-2xl text-[#00255E]">
                            Get Started for free
                        </h2>

                        <img
                            src="/img/landing/arrow-right.svg"
                            alt="Arrow"
                            className="lg:w-6 lg:h-5 w-3 h-3"
                        />
                    </div>
                </div>

                <div>
                    <img src="/img/landing/metrics.png" alt="Metrics" />
                </div>
            </div>

            <div className="bg-[#F8F8F8]">
                <div className="lg:w-[89vw] mx-auto lg:px-[26px] px-6 py-[60px] lg:py-[120px]">
                    <h1 className="text-[#03B5D1] text-lg lg:text-2xl font-inter text-center font-bold tracking-[2px]">
                        WHY FLEET+?
                    </h1>
                    <h2 className="mt-4 mb-3 text-[#000918] font-rocGroteskBold text-center text-[42px] lg:text-[75px]">
                        Solutions just <br className="lg:hidden" />
                        for you
                    </h2>
                    <p className="text-center text-[#888F9C] text-sm lg:text-xl font-inter leading-relaxed">
                        Our intelligent matching algorithm ensures you find the perfect freight
                        <br className="lg:block hidden" />
                        solutions that meet your specific shipping requirements.
                    </p>

                    <div className="space-y-6 lg:space-y-10 lg:mt-20 mt-10">
                        <div className="shadow-[0px_4px_32px_0px_rgba(0,0,0,0.06),0px_0px_4px_0px_rgba(0,0,0,0.04)] rounded-3xl bg-white px-6 lg:px-10 py-6 grid lg:grid-cols-2 gap-4 lg:gap-10">
                            <div>
                                <img
                                    src="/img/landing/simplify.png"
                                    alt="Simplifying Freigh Forwarding"
                                    className="w-full"
                                />
                            </div>
                            <div className="self-center">
                                <h1 className="font-rocGroteskMedium text-lg lg:text-3xl text-[#000918]">
                                    Simplifying Freight Forwarding
                                </h1>
                                <p className="mt-1 lg:mt-3 lg:text-base text-sm font-medium font-inter text-[#888F9C]">
                                    Fleet+ works towards a future where the complexities of freight
                                    forwarding are simplified from initiation to completion of every
                                    shipment. We are committed to creating an ecosystem that
                                    minimizes hurdles, streamlines processes, and sets a new
                                    standard for operational simplicity.
                                </p>
                            </div>
                        </div>

                        <div className="shadow-[0px_4px_32px_0px_rgba(0,0,0,0.06),0px_0px_4px_0px_rgba(0,0,0,0.04)] rounded-3xl bg-white px-6 lg:px-10 py-6 grid lg:grid-cols-2 gap-4 lg:gap-10">
                            <div className="self-center order-3">
                                <h1 className="font-rocGroteskMedium text-lg lg:text-3xl text-[#000918]">
                                    Creating an Easier Global Experience
                                </h1>
                                <p className="mt-1 lg:mt-3 lg:text-base text-sm font-medium font-inter text-[#888F9C]">
                                    We are dedicated to crafting an experience that transcends
                                    borders and time zones. Fleet+ is designed to empower freight
                                    forwarders globally, offering an intuitive and user-friendly
                                    platform that fosters collaboration, efficiency, and
                                    unparalleled ease of use.
                                </p>
                            </div>
                            <div className="order-1 lg:order-4">
                                <img
                                    src="/img/landing/easier-global-experience.png"
                                    alt="Simplifying Freigh Forwarding"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="shadow-[0px_4px_32px_0px_rgba(0,0,0,0.06),0px_0px_4px_0px_rgba(0,0,0,0.04)] rounded-3xl bg-white px-6 lg:px-10 py-6 grid lg:grid-cols-2 gap-4 lg:gap-10">
                            <div>
                                <img
                                    src="/img/landing/marketplace-product.png"
                                    alt="Simplifying Freigh Forwarding"
                                    className="w-full"
                                />
                            </div>
                            <div className="self-center">
                                <h1 className="font-rocGroteskMedium text-lg lg:text-3xl text-[#000918]">
                                    Becoming the Number One Freight Marketplace Product
                                </h1>
                                <p className="mt-1 lg:mt-3 lg:text-base text-sm font-medium font-inter text-[#888F9C]">
                                    Fleet+ aspires to be the foremost choice for freight managers
                                    and logistics experts seeking cutting-edge SaaS solutions. We
                                    are driven to consistently innovate, adapt, and provide
                                    unparalleled value, ultimately earning our place as the leader
                                    in the Freight SaaS landscape. Together, we envision a future
                                    where freight forwarding is not just a process but a seamless
                                    experience, and Fleet+ is at the forefront of this vision.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ScheduleSection />
            <ExperienceLogisticsSection />
            <LandingFooter2 />
        </div>
    );
};

export default AboutUs;
