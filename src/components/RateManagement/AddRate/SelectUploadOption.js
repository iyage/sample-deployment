import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SelectUploadOption = ({ setActiveSection }) => {
    const [selecteOption, setSelectedOption] = useState("");
    const navigate = useNavigate();

    return (
        <div className="w-full px-[104px] max-lg:px-10 max-sm:px-0 py-[72px] relative">
            <div className="w-[55%] pr-[40px] max-sm:px-4 max-lg:w-[78%] max-sm:w-full">
                <div className="mb-6">
                    <p className="text-2xl font-rocGroteskBold mb-2">
                        Upload your shipping rate on <br /> Fleet+ and keep track of it
                    </p>
                    <p className="pr-[99px] max-sm:pr-0 text-sm font-rocGroteskMedium text-mvx-neutral">
                        Add rates gotten outside of the Fleet+ platform to track all of your rate in
                        one place. These rate will be listing our instant quote section
                    </p>
                </div>
                <div className="flex items-center gap-4 mb-8 w-full max-sm:flex-col">
                    <div
                        onClick={() => setSelectedOption("auto")}
                        className={`p-6 rounded-[6px] border-[1.5px] w-1/2 max-sm:w-full hover:border-solid ${
                            selecteOption === "auto"
                                ? "border-solid border-gun-metal"
                                : "border-dashed border-mvx-neutral"
                        } cursor-pointer`}
                    >
                        <div className="mb-3">
                            <i className="ri-file-upload-line text-4xl"></i>
                        </div>
                        <div>
                            <p className="text-sm font-rocGroteskMedium mb-[2px]">Bulk upload</p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Automatically upload all your rates
                            </p>
                        </div>
                    </div>
                    <div
                        onClick={() => setSelectedOption("manual")}
                        className={`p-6 rounded-[6px] border-[1.5px] w-1/2 max-sm:w-full hover:border-solid ${
                            selecteOption === "manual"
                                ? "border-solid border-gun-metal"
                                : "border-dashed border-mvx-neutral"
                        } cursor-pointer`}
                    >
                        <div className="mb-3">
                            <i className="ri-keyboard-box-line text-4xl"></i>
                        </div>
                        <div>
                            <p className="text-sm font-rocGroteskMedium mb-[2px]">Single upload</p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Manually input your rate details
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between max-sm:hidden">
                    <p
                        onClick={() => navigate("/dashboard/rate-management")}
                        className="text-sm font-rocGroteskMedium cursor-pointer"
                    >
                        Back
                    </p>

                    <button
                        className="flex items-center justify-center text-white bg-pacific-cyan font-rocGroteskMedium w-fit py-3 px-6 text-sm rounded "
                        type={"button"}
                        onClick={() =>
                            Boolean(selecteOption) &&
                            setActiveSection(selecteOption === "auto" ? 1 : 2)
                        }
                    >
                        Continue
                    </button>
                </div>
            </div>
            <div className="fixed bottom-0 w-full hidden max-sm:flex gap-2.5 bg-white border-t-[2px] border-mvx-light-blue py-4 px-6 items-center justify-between">
                <p
                    onClick={() => navigate("/dashboard/rate-management")}
                    className="text-sm underline font-rocGroteskMedium cursor-pointer"
                >
                    Back
                </p>
                <button
                    className="flex items-center justify-center text-white bg-pacific-cyan font-rocGroteskMedium w-fit py-3 px-6 text-sm rounded "
                    type={"button"}
                    onClick={() =>
                        Boolean(selecteOption) && setActiveSection(selecteOption === "auto" ? 1 : 2)
                    }
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default SelectUploadOption;
