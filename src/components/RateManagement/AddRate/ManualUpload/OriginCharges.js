import AmountInput from "components/common/AmountInput";
import React from "react";
import { currencies } from "variables/currencies";

const OriginCharges = ({
    setActiveStep,
    originCharges,
    setOriginCharges,
    currency,
    setCurrency,
    editMode,
}) => {
    const handleChange = (id, name, value) => {
        const chargesCopy = [...originCharges];

        if (name === "label") {
            chargesCopy[id].label = value;
        }
        if (name === "amount") {
            chargesCopy[id].amount = value;
        }
        if (name === "currency") {
            setCurrency(value);
        }

        setOriginCharges(chargesCopy);
    };

    const addCharge = () => {
        setOriginCharges((prevState) => {
            return [
                ...prevState,
                {
                    label: "",
                    amount: "",
                    currency: currency,
                    default: false,
                },
            ];
        });
    };

    return (
        <div className="w-full">
            {!editMode && <p className="text-[22px] font-rocGroteskBold mb-6">Origin charges</p>}
            <div>
                {originCharges?.map((charge, idx) => {
                    return (
                        <div className="mb-4" key={charge?.label + idx}>
                            {charge.default ? (
                                <p className="text-sm mb-1 font-rocGroteskMedium">
                                    {charge?.label}
                                </p>
                            ) : (
                                <input
                                    className={`w-full outline-0 h-full pl-3 py-3 bg-white border-x border-t rounded-t rounded-b-none text-sm font-rocGroteskMedium text-gun-metal placeholder:text-[13px] placeholder:!font-rocGroteskMedium`}
                                    placeholder={"Enter name of charge"}
                                    type={"text"}
                                    autoFocus="autoFocus"
                                    value={charge.label}
                                    onChange={(evt) => handleChange(idx, "label", evt.target.value)}
                                    required={true}
                                />
                            )}
                            <div>
                                <AmountInput
                                    amountValue={charge.amount}
                                    currencyValue={currency}
                                    placeholder={"0.00"}
                                    handleCurrenyChange={(value) => {
                                        handleChange(idx, "currency", value);
                                    }}
                                    className={`!rounded-br !rounded-bl ${
                                        Boolean(charge?.label) ? "!rounded" : "!rounded-t-none"
                                    } `}
                                    handleValueChange={(value) => {
                                        handleChange(idx, "amount", value);
                                    }}
                                    isRequired={false}
                                    dropdownOptions={currencies}
                                />
                            </div>
                        </div>
                    );
                })}

                <div onClick={addCharge} className="flex items-center gap-1 cursor-pointer mb-8">
                    <i className="ri-add-line text-base mt-[-2px]"></i>
                    <span className="underline text-sm font-rocGroteskMedium">
                        Add more charges
                    </span>
                </div>
                {!editMode && (
                    <div className="flex items-center justify-between">
                        <p
                            className="text-sm font-rocGroteskMedium cursor-pointer"
                            onClick={() => setActiveStep((prev) => prev - 1)}
                        >
                            Back
                        </p>

                        <button
                            className="flex items-center justify-center text-white bg-pacific-cyan font-rocGroteskMedium w-fit py-3 px-6 text-sm rounded"
                            type={"button"}
                            onClick={() => setActiveStep((prev) => prev + 1)}
                        >
                            Continue
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OriginCharges;
