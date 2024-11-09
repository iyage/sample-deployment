import classNames from "classnames";
import { ErrorMessage } from "formik";
import React from "react";

const InputField = ({ title, label, type, name, error, className, ctx = false, ...props }) => {
    return (
        <div>
            {label && (
                <label
                    className="text-sm font-rocGroteskMedium text-gun-metal cursor-pointer"
                    htmlFor={title ?? label}
                >
                    {label}
                </label>
            )}
            <div className="flex w-full">
                <input
                    type={type ?? "text"}
                    name={name}
                    id={title ?? label}
                    className={classNames(
                        "border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue",
                        { "cursor-not-allowed": !!props?.disabled },
                        className
                    )}
                    {...props}
                />
            </div>

            {ctx && (
                <ErrorMessage name={name}>
                    {(msg) => (
                        <span className="text-red-600 text-[12px] font-rocGroteskRegular">
                            {msg}
                        </span>
                    )}
                </ErrorMessage>
            )}
            {error && (
                <span className={classNames(`text-red-600 text-[12px] font-rocGroteskRegular`)}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default InputField;
