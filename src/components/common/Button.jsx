import classNames from "classnames";
import React from "react";
import Loader from "./Loader";

const Button = ({ isLoading, disabled, className, title, onClick, children }) => {
    return (
        <button
            className={classNames(
                "w-full flex items-center justify-center",
                {
                    "cursor-wait opacity-60": isLoading,
                    "cursor-not-allowed opacity-60": disabled,
                },
                className
            )}
            disabled={disabled}
            onClick={onClick}
        >
            {isLoading ? <Loader /> : children || <>{title ?? ""}</>}
        </button>
    );
};

export default Button;
