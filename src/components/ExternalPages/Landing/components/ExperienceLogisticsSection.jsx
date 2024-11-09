import Button from "components/common/Button";
import React from "react";
import { useNavigate } from "react-router-dom";

const ExperienceLogisticsSection = () => {
    const navigate = useNavigate();
    return (
        <div className="lg:w-[89vw]  mx-auto w-full px-6 lg:px-[26px] py-16 lg:py-[120px]">
            <h1 className="font-rocGroteskBold text-[40px] lg:text-5xl text-center leading-tight">
                Experience the next level of <br />
                <span className="text-[#03B5D1]">logistics solutions</span>
            </h1>

            <div className="flex items-center gap-4 justify-center mt-10">
                <Button
                    className="font-inter text-sm lg:text-lg text-white py-3 rounded-lg lg:!w-[270px] font-semibold bg-[#00255E]"
                    onClick={() => navigate("/register")}
                >
                    Get Started for free
                </Button>

                <Button
                    className="font-inter text-sm lg:text-lg text-[#00255E] py-3 rounded-lg lg:!w-[240px] font-semibold bg-white border-[#00255E] border"
                    onClick={() =>
                        window.open("https://calendly.com/fleetplus-demo/30min", "_blank")
                    }
                >
                    Book a demo
                </Button>
            </div>
        </div>
    );
};

export default ExperienceLogisticsSection;
