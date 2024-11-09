import Button from "components/common/Button";
import React from "react";

const FooterSubscribe = () => {
    return (
        <div className="lg:mt-[100px] lg:h-[600px] min-h-[500px] footer-subscribe bg-[#00255E] mt-16">
            <h1 className="text-center pt-[150px] lg:pt-[250px] text-[40px] lg:text-[65px] font-rocGroteskBold text-white leading-tight">
                Stay in the know of trends in <br />
                <span className="text-[#B3F00D]">the logistics sector</span>
            </h1>
            <div className="px-10">
                <div className="max-w-[600px] mx-auto flex items-stretch border-2 border-white mt-6 lg:mt-10 rounded-lg h-[50px]">
                    <input
                        type="text"
                        className="w-full bg-transparent h-full px-4 lg:px-6 font-inter text-sm lg:text-lg font-semibold"
                        placeholder="Your email address..."
                    />
                    <Button className="!w-[110px] lg:!w-[180px] bg-white flex-shrink-0 text-[#000918] font-inter text-sm lg:text-lg font-semibold !rounded-none">
                        Subscribe
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FooterSubscribe;
