import React from "react";

const ContactInput = ({ label, name, placeholder }) => {
    return (
        <div>
            <h1 className="font-rocGroteskBold text-base lg:text-xl text-[#000918] mb-3">
                {label}
            </h1>
            <input
                type="text"
                className="w-full py-4 px-4 lg:px-7 border border-[#00255E33] rounded-lg bg-[#F8F8F8] placeholder-[#888F9C] text-sm lg:text-base"
                placeholder={placeholder}
            />
        </div>
    );
};

export default ContactInput;
