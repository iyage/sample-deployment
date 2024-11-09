import React from "react";
import SelectField from "./SelectField";
import formatCurrency from "helpers/formatCurrency";
import classNames from "classnames";

const AmountInputWithCurrencySelect = ({
    amountValue,
    amountOnChange,
    currencyValue,
    currencyOnChange,
    allowedCurrencies,
    label,
    error,
}) => {
    const handleAmountChange = (event) => {
        amountOnChange?.(event.target.value?.replace(/,/g, ""));
    };
    return (
        <div>
            {label && (
                <label className="mb-1 text-sm font-rocGroteskMedium text-midnight-black">
                    {label}
                </label>
            )}
            <div className="flex items-center h-[52px] w-full border rounded bg-white border-neutral-n2-30">
                <div className="w-[90px] h-full">
                    <SelectField
                        placeholder="Select Currency"
                        triggerClassName="bg-[#FBFCFF] pl-3 pr-1 h-full"
                        conatinerClassName="w-[90px]"
                        value={currencyValue}
                        onValueChange={(v) => currencyOnChange?.(v)}
                        items={allowedCurrencies}
                    />
                </div>
                <input
                    placeholder="0.00"
                    value={formatCurrency(amountValue, true)}
                    onChange={(e) => handleAmountChange(e)}
                    pattern={"^[0-9,.]+$"}
                    type="text"
                    className="w-full h-full rounded text-sm font-rocGroteskMedium placeholder:text-neutral-n-200 text-midnight-black px-4"
                />
            </div>
            {error && (
                <span className={classNames(`text-red-600 text-[12px] font-rocGroteskRegular`)}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default AmountInputWithCurrencySelect;
