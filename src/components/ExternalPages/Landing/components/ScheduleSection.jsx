import Button from "components/common/Button";
import React from "react";

const ScheduleSection = () => {
    return (
        <div className="w-full grid lg:grid-cols-2">
            <div className="px-10 lg:px-20 flex flex-col bg-[#00255E] py-16 lg:py-5 justify-center">
                <h1 className="text-white font-rocGroteskBold text-[42px] lg:text-6xl leading-tight">
                    Schedule a <br />
                    demo <span className="text-[#B3F00D]">today</span>
                </h1>

                <p className="text-white text-opacity-50 mb-6 lg:mb-10 font-inter text-sm lg:text-xl">
                    At Fleet+, we believe in the power of collaboration <br />
                    to transform the world of freight and logistics.
                </p>

                <Button className="!w-[180px] lg:!w-[300px] rounded-lg bg-white text-[#000918] font-semibold text-sm lg:text-lg py-3">
                    Get Started for free
                </Button>
            </div>

            <div className="bg-[#14366B] lg:pl-[120px] lg:pt-[120px] pt-[65px] pl-[65px] w-full">
                <img src="/img/landing/schedule.png" alt="Schedule" className="w-full" />
            </div>
        </div>
    );
};

export default ScheduleSection;
