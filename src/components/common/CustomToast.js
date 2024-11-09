import React from "react";

const CustomToast = ({ t, message, type }) => (
    <div
        className={`bg-white px-6 py-4 shadow rounded-full flex fixed z-[10000] ${
            t.visible ? "animate-enter" : "animate-leave"
        }`}
    >
        {type === "error" ? (
            <span className="material-icons mr-4 text-[#CC0000]">cancel</span>
        ) : type === "warning" ? (
            <span className="material-icons mr-4 text-[#FFCC00]">
                announcement
            </span>
        ) : (
            <span className="material-icons mr-4 text-mvx-blue">
                check_circle
            </span>
        )}
        {message}
    </div>
);

export default CustomToast;
