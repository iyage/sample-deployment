import classNames from "classnames";
import React from "react";

const getInitials = (name) => {
    const [firstName, lastName] = name.split(" ");
    return firstName && lastName
        ? `${firstName.charAt(0)}${lastName.charAt(0)}`
        : firstName.charAt(0);
};

const Avatar = ({ name, bgColor, h, src, fontSize, fontWeight }) => {
    if (!src) {
        return (
            <div
                className={classNames(
                    `w-[${h}] h-[${h}] text-white rounded-full flex-shrink-0 flex items-center justify-center bg-[${bgColor}]`
                )}
            >
                <h2 className={classNames(`${fontSize} ${fontWeight} text-white`)}>
                    {getInitials(name) ?? ""}
                </h2>
            </div>
        );
    }
    return <div></div>;
};

export default Avatar;
