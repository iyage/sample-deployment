import React from "react";
import LandingNav2 from "./components/LandingNav2";
import ContactInput from "./components/ContactInput";
import Button from "components/common/Button";
import ScheduleSection from "./components/ScheduleSection";
import LandingFooter2 from "./components/LandingFooter2";

const sections = [
    {
        name: "Phone Numbers",
        icon: "/img/landing/phone.svg",
        child: (
            <div>
                <h1 className="text-white text-opacity-70">+1 512 514 6221</h1>
                <h1 className="text-white text-opacity-70">+1 512 514 6221</h1>
            </div>
        ),
    },
    {
        name: "Email Addresses",
        icon: "/img/landing/mail.svg",
        child: (
            <div>
                <h1 className="text-white text-opacity-70">hello@fleetplus.io</h1>
            </div>
        ),
    },
    {
        name: "Austin Office",
        icon: "/img/landing/location-pin.svg",
        child: (
            <div>
                <h1 className="text-white text-opacity-70 text-center">
                    7000 North Mopac <br /> Expressway,Austin, TX, <br />
                    78731T: +1 512 514 6221
                </h1>
            </div>
        ),
    },
    {
        name: "Nigerian Office",
        icon: "/img/landing/location-pin.svg",
        child: (
            <div>
                <h1 className="text-white text-opacity-70 text-center">
                    19 Dr. S Ezekuse <br />
                    Close,Lekki Phase 1, Lagos
                </h1>
            </div>
        ),
    },
];

const ContactUsPage = () => {
    return (
        <div className="w-full">
            <LandingNav2 />

            <div className="pt-[150px] pb-14">
                <h1 className="text-center text-[#000918] text-[40px] lg:text-[50px] font-rocGroteskBold">
                    Get in touch{" "}
                    <span className="text-[#03B5D1]">
                        <br className="lg:hidden" />
                        with us
                    </span>
                </h1>
                <h2 className="text-center text-[#888F9C] lg:mt-0 mt-2 lg:text-base text-sm">
                    Thank you for your interest in Fleet+.
                </h2>
            </div>

            <div className="bg-[#F8F8F8] py-20 lg:px-0 px-10">
                <div className="lg:w-[89vw] mx-auto lg:px-[26px] gap-10 grid lg:grid-cols-2 items-start">
                    <div className="rounded-2xl bg-white shadow-[0px_4px_32px_0px_rgba(0,0,0,0.06),0px_0px_4px_0px_rgba(0,0,0,0.04)] px-6 lg:px-10 py-10 lg:py-16 space-y-7">
                        <ContactInput label="Name" placeholder="Your full name..." name="name" />
                        <ContactInput
                            label="Company Name"
                            placeholder="Your company's name..."
                            name="name"
                        />
                        <ContactInput
                            label="Work Email"
                            placeholder="Your work email..."
                            name="name"
                        />
                        <ContactInput
                            label="Phone Number"
                            placeholder="Your phone number..."
                            name="name"
                        />
                        <div>
                            <h1 className="font-rocGroteskBold text-base lg:text-xl text-[#000918] mb-3">
                                Leave a message
                            </h1>

                            <textarea
                                placeholder="Enter message ..."
                                className="w-full py-4 px-4 lg:px-7 h-[140px] resize-none border border-[#00255E33] rounded-lg bg-[#F8F8F8] placeholder-[#888F9C] lg:text-base text-sm"
                            />
                        </div>

                        <p className="font-rocGroteskMedium text-sm lg:text-xl text-[#AAA]">
                            For more details, please see our{" "}
                            <span className="text-[#03B5D1]">privacy policy.</span>
                        </p>

                        <div>
                            <Button className="w-full lg:!w-[160px] bg-[#B3F00D] text-[#000918] font-semibold py-2">
                                Continue
                            </Button>
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-10 w-full max-w-[640px]">
                        {sections?.map((s) => (
                            <div
                                className="rounded-2xl bg-[#00255E] p-10 flex flex-col items-center"
                                key={s?.name}
                            >
                                <div className="rounded-full flex items-center justify-center w-24 h-24 bg-[#03B5D110]">
                                    <img src={s?.icon} alt={s?.name} className="w-[50px]" />
                                </div>
                                <h1 className="my-3 text-white font-rocGroteskBold text-2xl">
                                    {s?.name}
                                </h1>
                                {s?.child}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ScheduleSection />
            <LandingFooter2 />
        </div>
    );
};

export default ContactUsPage;
