import React, { useEffect, useRef, useState } from "react";

const Dropdown = ({
    label,
    handleChange,
    name,
    value,
    disabled,
    placeholder,
    dropdownOptions,
    dropdown,
    dropdownTriggerClassName,
    dropdownContainerClasses,
    dropdownItemsClasses,
    className,
    dropdownClassName,
}) => {
    const [open, setOpen] = useState(false);
    const selectedOption = dropdownOptions?.find((item) => item.value === value);
    const ref = useRef(null);

    const handleSelect = (value) => {
        handleChange?.(name, value);
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target) && open) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, open]);

    return (
        <div className="relative">
            {dropdown ? (
                <div
                    onClick={() => (disabled ? null : setOpen(!open))}
                    className={`w-fit cursor-pointer ${dropdownTriggerClassName}`}
                >
                    {dropdown}
                </div>
            ) : (
                <div
                    onClick={() => (disabled ? null : setOpen(!open))}
                    className={`flex gap-2.5 justify-between cursor-pointer items-center border border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium bg-mvx-light-blue ${className}`}
                >
                    <p className="text-mvx-neutral">
                        {Boolean(value) ? (
                            <span className="flex items-center">
                                {selectedOption?.icon && (
                                    <> {selectedOption?.icon}&nbsp;&nbsp;&nbsp; </>
                                )}
                                {selectedOption?.label}
                            </span>
                        ) : (
                            placeholder
                        )}
                    </p>
                    <span className="material-icons">arrow_drop_down</span>
                </div>
            )}

            {open &&
                (dropdownOptions && dropdownOptions?.length > 0 ? (
                    <div
                        ref={ref}
                        className={`${
                            dropdown ? "min-w-max" : ""
                        } py-2 bg-white absolute top-[101%] w-full h-auto max-h-64 z-20 overflow-auto border ${dropdownContainerClasses} ${dropdownClassName}`}
                    >
                        {dropdownOptions.map((option, idx) => {
                            return option.customChild ? (
                                <div key={idx}>{option.customChild}</div>
                            ) : (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        if (option?.action && !option?.disabled) {
                                            option.action?.();
                                        }
                                        if (!option?.disabled) {
                                            handleSelect(option?.value);
                                        }
                                    }}
                                    className={`flex items-center px-4 justify-between hover:bg-mvx-light-blue ${
                                        selectedOption?.value === option?.value &&
                                        "bg-mvx-light-blue"
                                    } ${
                                        option?.disabled && "opacity-40"
                                    } cursor-pointer py-3 ${dropdownItemsClasses}`}
                                >
                                    <p
                                        className={`text-sm flex gap-3  items-center font-rocGroteskMedium text-inherit`}
                                    >
                                        {option?.icon && <span>{option?.icon}</span>}{" "}
                                        <span className="text-inherit">{option?.label}</span>
                                    </p>
                                    {selectedOption?.value === option?.value && (
                                        <span className="material-icons text-mvx-black text-base">
                                            done
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div
                        className={`py-2 bg-white absolute top-[101%] w-full h-auto max-h-64 z-20 overflow-auto border ${dropdownClassName}`}
                        id="custom-dropdown"
                    >
                        <div className="flex px-4 justify-between hover:bg-mvx-light-blue cursor-pointer">
                            <p className="text-sm flex gap-3 py-3 items-center font-rocGroteskMedium">
                                <span>No Data</span>
                            </p>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default Dropdown;
