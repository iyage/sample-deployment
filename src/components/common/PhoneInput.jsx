import React from "react";
import SelectInput from "./SelectInput";
import ReactCountryFlag from "react-country-flag";
import countries from "variables/countries";
import classNames from "classnames";
import { ErrorMessage } from "formik";

const PhoneInput = ({
    title,
    label,
    name,
    error,
    className,
    phoneExt,
    setPhoneExt,
    ctx = false,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label
                    className="text-sm font-rocGroteskMedium text-gun-metal cursor-pointer"
                    htmlFor={title ?? label}
                >
                    {label}
                </label>
            )}
            <div className="grid grid-cols-[115px_calc(100%-115px)] w-full">
                <SelectInput
                    value={phoneExt}
                    name="phoneExt"
                    placeholder={"+000"}
                    handleChange={(_, value) => setPhoneExt(value)}
                    isRequired={true}
                    className="bg-mvx-light-blue rounded-r-none"
                    dropdownOptions={countries
                        .filter((data) => Boolean(data?.codes[0]))
                        .sort((p1, p2) =>
                            p1.codes[0] > p2.codes[0] ? 1 : p1.codes[0] < p2.codes[0] ? -1 : 0
                        )
                        .map((item) => ({
                            label: item.codes[0]?.replace(" ", ""),
                            value: item.codes[0]?.replace(" ", ""),
                            icon: <ReactCountryFlag countryCode={item?.abbreviation} />,
                        }))}
                />
                <input
                    id="rawMobile"
                    placeholder="(000) 000-0000"
                    className={classNames(
                        "border-y border-r rounded-r border border-l-0 px-[14px] py-3 placeholder:!text-[13px] placeholder:!font-rocGroteskMedium text-sm font-rocGroteskMedium",
                        { "cursor-not-allowed": !!props?.disabled },
                        className
                    )}
                    required
                    minLength={10}
                    pattern={"^[0-9]+$"}
                    title="Must be a valid phone number"
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

export default PhoneInput;
