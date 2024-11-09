import React from "react";

const Switch = ({ value, onClick, className }) => {
    return (
        <label className="switch relative inline-block w-[38px] h-[25px]">
            <span
                className={`slider round absolute ${value && "before:translate-x-[24px]"} ${
                    value
                        ? "bg-pacific-cyan before:border-pacific-cyan before:bg-white before:content-['✔'] before:flex before:justify-center before:items-center before:text-[13px] before:text-pacific-cyan text-pacific-cyan"
                        : "bg-[#DFE1E6] before:border-[#DFE1E6] before:bg-mvx-light-blue"
                } cursor-pointer top-0 left-0 right-0 bottom-0 duration-[.3s] rounded-[34px] before:absolute before:h-[23.5px] before:w-[23.5px] before:border  ${
                    value ? "before:left-[-9px]" : "before:left-0"
                } before:bottom-[1px] before:duration-[.4s]  before:rounded-[50%]`}
            ></span>
        </label>
    );
};

export default Switch;
