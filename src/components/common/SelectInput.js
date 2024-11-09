/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import EllipsisLoader from "./EllipsisLoader";

const SelectInput = ({
    label,
    handleChange,
    name,
    value,
    placeholder,
    dropdownOptions,
    isRequired,
    className,
    id,
    labelClassName,
    dropdownClassName,
    optionItemClassName,
    optionItemContainerClassName,
    activeOptionItemContainerClassName,
    activeOptionItemClassName,
    setDropdownHeight,
    searchLoading,
    handleInputChange,
}) => {
    const [open, setOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [filter, setfilter] = useState("");
    const customDropdown = document.getElementById("custom-select");
    const selectedOption = dropdownOptions?.find(
        (item) => item.value === value && item?.label.includes(filter)
    );

    const ref = useRef(null);
    const toggleRef = useRef(null);

    const filteredOptions = isTyping
        ? dropdownOptions?.filter((item) => {
              return (
                  item?.label?.toLowerCase().includes(filter.toLowerCase()) ||
                  item?.value?.toLowerCase().includes(filter.toLowerCase()) ||
                  item?.isDefault
              );
          })
        : dropdownOptions;

    const handleFilterChange = (event) => {
        setIsTyping(true);
        setOpen(true);
        handleChange?.(name, "");
        setSelectedIcon(null);
        setfilter(event.target.value);
    };

    const handleSelect = (label, value, icon) => {
        handleChange?.(name, value);
        const selected = dropdownOptions?.find(
            (item) => item?.value === value && item?.label === label
        );
        setSelectedIcon(icon);
        setfilter(selected?.label);
        setIsTyping(false);
        setOpen(false);
    };

    useEffect(() => {
        setfilter(selectedOption?.label ?? "");
        if (selectedOption?.icon) {
            setSelectedIcon(selectedOption?.icon);
        }
    }, [value]);

    useEffect(() => {
        setfilter(selectedOption?.label ?? "");
    }, [selectedOption]);

    useEffect(() => {
        if (open && setDropdownHeight) {
            setDropdownHeight({
                offsetHeight: customDropdown?.offsetHeight,
                clientHeight: customDropdown?.offsetHeight,
            });
        } else if (!open && setDropdownHeight) {
            setDropdownHeight(null);
        }
    }, [open, setDropdownHeight, customDropdown?.offsetHeight, customDropdown?.offsetHeight]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && event.target !== toggleRef.current) {
                if (!ref.current.contains(event.target)) {
                    setOpen(false);
                }
            }

            if (!event.target) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, open]);

    return (
        <div className="w-full">
            {Boolean(label) && (
                <p className={`text-sm mb-1 font-rocGroteskMedium ${labelClassName}`}>{label}</p>
            )}
            <div className="relative">
                <div
                    onClick={() => setOpen(!open)}
                    className={`flex justify-between cursor-pointer rounded items-center border ${
                        isFocused ? "border-gun-metal" : "border-gray-200"
                    } border-gray-200 pr-2 475:pr-4 outline-0 w-full h-[48px] text-sm font-rocGrotesk font-medium ${className}`}
                >
                    {selectedIcon && filter && (
                        <span className="pl-4 max-475:pl-3 flex-shrink-0">{selectedIcon}</span>
                    )}
                    <input
                        className={`w-full outline-0 h-full max-475:pl-3 py-3 ${
                            selectedIcon ? "pl-2" : "pl-4"
                        } bg-transparent font-rocGroteskMedium text-gun-metal focus:border-0 placeholder:text-[13px] placeholder:!font-rocGroteskMedium`}
                        placeholder={Boolean(value) ? selectedOption?.label : placeholder}
                        type={"text"}
                        value={filter}
                        id={id}
                        onChange={handleFilterChange}
                        onInput={handleInputChange}
                        required={isRequired}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {searchLoading ? (
                        <EllipsisLoader />
                    ) : (
                        <span
                            className="material-icons text-base"
                            ref={toggleRef}
                            onClick={() => setOpen(!open)}
                        >
                            keyboard_arrow_down
                        </span>
                    )}
                </div>
                {open &&
                    (!searchLoading && filteredOptions && filteredOptions?.length > 0 ? (
                        <div
                            ref={ref}
                            className={`py-2 bg-white absolute top-[101%] w-full h-auto max-h-64 z-[999] overflow-auto border ${dropdownClassName}`}
                            id="custom-select"
                        >
                            {filteredOptions.map((option, idx) => {
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            if (option?.handleClick) {
                                                option?.handleClick?.();
                                                setIsTyping(false);
                                                setOpen(false);
                                            } else {
                                                handleSelect(
                                                    option?.label,
                                                    option?.value,
                                                    option?.icon
                                                );
                                            }
                                        }}
                                        className={`flex items-center px-4 justify-between hover:bg-mvx-light-blue ${
                                            selectedOption?.value === option?.value &&
                                            selectedOption?.label === option?.label &&
                                            "bg-mvx-light-blue " +
                                                activeOptionItemContainerClassName
                                        } cursor-pointer ${optionItemContainerClassName}`}
                                    >
                                        <p
                                            className={`text-sm flex gap-3 py-3 items-center font-rocGroteskMedium ${optionItemClassName}`}
                                        >
                                            {option?.icon && <span>{option?.icon}</span>}{" "}
                                            <span>{option?.label}</span>
                                        </p>
                                        {selectedOption?.value === option?.value &&
                                            selectedOption?.label === option?.label && (
                                                <span
                                                    className={`material-icons text-mvx-black text-base ${activeOptionItemClassName}`}
                                                >
                                                    done
                                                </span>
                                            )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            className={`py-2 bg-white absolute top-[101%] w-full h-auto max-h-64 z-[999] overflow-auto border ${dropdownClassName}`}
                            id="custom-select"
                            ref={ref}
                        >
                            <div className="flex px-4 justify-between hover:bg-mvx-light-blue cursor-pointer">
                                <p className="text-sm flex gap-3 py-3 items-center font-rocGrotesk font-medium">
                                    <span>{searchLoading ? "Searching..." : "No Data"}</span>
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default SelectInput;
