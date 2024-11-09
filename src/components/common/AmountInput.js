/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import formatCurrency from "helpers/formatCurrency";
import { getCurrencyFromCurrencyCode } from "helpers";

const AmountInput = ({
    label,
    handleCurrenyChange,
    handleValueChange,
    name,
    amountValue,
    currencyValue,
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
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(dropdownOptions?.[0]?.labelIcon);
    // const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState(
        currencyValue ? currencyValue?.toUpperCase() : dropdownOptions?.[0]?.value?.toUpperCase()
    );
    const customDropdown = document.getElementById("custom-select");
    const selectedCurrency = dropdownOptions?.find(
        (item) => item.value?.toLowerCase() === currencyValue?.toLowerCase()
    );
    const ref = useRef(null);

    const handleAmountChange = (event) => {
        handleValueChange?.(event.target.value?.replace(/,/g, ""));
        handleCurrenyChange?.(currency);
        // setAmount(event.target.value.replace(/,/g, ""));
    };

    const handleSelect = (label, value, icon) => {
        handleCurrenyChange?.(value);
        const selected = dropdownOptions?.find(
            (item) => item?.value === value && item?.label === label
        );
        setSelectedIcon(icon);
        setCurrency(selected?.value?.toUpperCase());

        setOpen(false);
    };

    useEffect(() => {
        setCurrency(currencyValue);
        setSelectedIcon(selectedCurrency?.labelIcon);
    }, [currencyValue]);

    useEffect(() => {
        if (searchLoading) {
            setOpen(false);
        }
    }, [searchLoading]);

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
        <div className="w-full">
            {Boolean(label) && (
                <p className={`text-sm mb-1 font-rocGroteskMedium ${labelClassName}`}>{label}</p>
            )}
            <div className="relative">
                <div
                    className={`flex justify-between cursor-pointer rounded items-center border ${
                        isFocused ? "border-[1.5px] border-gun-metal" : "border-gray-200"
                    } pr-3 outline-0 w-full h-[48px] text-sm font-rocGrotesk font-medium ${className}`}
                >
                    <div className="w-[80%] h-full flex items-center pl-3 gap-1">
                        <span>{getCurrencyFromCurrencyCode(currency)}</span>
                        <input
                            className={`w-full outline-0 h-full max-475:pl-3 py-3 bg-transparent font-rocGroteskMedium text-gun-metal focus:border-0 placeholder:text-[13px] placeholder:!font-rocGroteskMedium`}
                            placeholder={placeholder}
                            type={"text"}
                            value={formatCurrency(
                                String(amountValue),
                                String(amountValue)?.includes(".")
                            )}
                            id={id}
                            onChange={handleAmountChange}
                            onInput={handleInputChange}
                            pattern={"^[0-9,.]+$"}
                            required={isRequired}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    </div>
                    <div
                        onClick={() => setOpen(!open)}
                        className="flex items-center w-fit gap-2 pl-2"
                    >
                        {selectedIcon && currency && (
                            <span className="w-full h-full">{selectedIcon}</span>
                        )}
                        <span className="text-sm font-rocGroteskMedium text-mvx-neutral">
                            {currency}
                        </span>
                        <span className="material-icons text-base mt-[-2px]">
                            keyboard_arrow_down
                        </span>
                    </div>
                </div>

                {open &&
                    (!searchLoading && dropdownOptions && dropdownOptions?.length > 0 ? (
                        <div
                            ref={ref}
                            className={`py-2 bg-white absolute top-[101%] w-full h-fit z-[999] overflow-auto border ${dropdownClassName}`}
                            id="custom-select"
                        >
                            {dropdownOptions.map((option, idx) => {
                                return (
                                    <div
                                        key={idx}
                                        onClick={() =>
                                            handleSelect(
                                                option?.label,
                                                option?.value,
                                                option?.labelIcon
                                            )
                                        }
                                        className={`flex items-center px-4 justify-between hover:bg-mvx-light-blue ${
                                            currency?.toLowerCase() ===
                                                option?.value?.toLowerCase() &&
                                            "bg-mvx-light-blue " +
                                                activeOptionItemContainerClassName
                                        } cursor-pointer ${optionItemContainerClassName}`}
                                    >
                                        <div className="flex gap-4 items-center py-3">
                                            {option?.dropdownIcon && (
                                                <span>{option?.dropdownIcon}</span>
                                            )}
                                            <div>
                                                <p className="text-sm font-rocGroteskMedium ">
                                                    {option?.label}
                                                </p>
                                                <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                                    {option?.subText}
                                                </p>
                                            </div>
                                        </div>
                                        {currency?.toLowerCase() ===
                                            option?.value?.toLowerCase() && (
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

export default AmountInput;
