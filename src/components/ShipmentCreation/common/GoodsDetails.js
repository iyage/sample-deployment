import SelectInput from "components/common/SelectInput";
import formatCurrency from "helpers/formatCurrency";
import usFlag from "assets/images/dashboard/round_us_flag.svg";
import ukFlag from "assets/images/dashboard/round_uk_flag.svg";
import ngFlag from "assets/images/dashboard/round_ng_flag.svg";
import eurFlag from "assets/images/dashboard/round_eur_flag.svg";
import React from "react";

const GoodsDetails = ({ handleInputChange, formData }) => {
    return (
        <div>
            <div className="mb-8">
                <h3 className="font-rocGroteskBold text-[22px] text-gun-metal mb-2">
                    Goods Details
                </h3>
                <p className="text-gun-metal font-rocGroteskMedium text-sm">
                    Tell us a bit about the goods
                </p>
            </div>
            <div className="mb-4">
                <div className="mb-6">
                    <SelectInput
                        value={formData.currency}
                        name="currency"
                        placeholder={"Preferred currency"}
                        handleChange={handleInputChange}
                        label="Commercial invoice value"
                        className={"rounded-b-none !h-[48px]"}
                        isRequired={true}
                        dropdownOptions={[
                            {
                                label: "Great Britain Pounds (GBP)",
                                value: "GBP",
                                icon: (
                                    <img
                                        src={ukFlag}
                                        alt="us flag"
                                        className="w-5 h-5 rounded-full bg-gray-400"
                                    />
                                ),
                            },
                            {
                                label: "United States Dollar (USD)",
                                value: "USD",
                                icon: (
                                    <img
                                        src={usFlag}
                                        alt="us flag"
                                        className="w-5 h-5 rounded-full bg-gray-400"
                                    />
                                ),
                            },
                            {
                                label: "European Euro (EUR)",
                                value: "EUR",
                                icon: (
                                    <img
                                        src={eurFlag}
                                        alt="us flag"
                                        className="w-5 h-5 rounded-full bg-gray-400"
                                    />
                                ),
                            },
                            {
                                label: "Naira (NGN)",
                                value: "NGN",
                                icon: (
                                    <img
                                        src={ngFlag}
                                        alt="us flag"
                                        className="w-5 h-5 rounded-full bg-gray-400"
                                    />
                                ),
                            },
                        ]}
                    />
                    <input
                        type="text"
                        placeholder="Amount"
                        className="border border-t-0 rounded-b border-gray-200 py-3 mb-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                        required
                        value={formatCurrency(
                            formData.amount,
                            String(formData.amount)?.includes(".")
                        )}
                        name="amount"
                        onChange={(event) =>
                            handleInputChange(
                                event.target.name,
                                event.target.value.replace(/,/g, "")
                            )
                        }
                        pattern={"^[.,0-9]+$"}
                        title="must be digits"
                    />
                    <p className="font-rocGroteskMedium text-xs text-mvx-neutral">
                        This is the total value {"("}amount{")"} of what you are shipping
                    </p>
                </div>
                <div className="mb-6">
                    <p className="text-sm mb-1 font-rocGroteskMedium">What are you shipping?</p>
                    <textarea
                        placeholder="Describe your goods"
                        rows="5"
                        className="border border-gray-200 resize-none py-3 px-4 outline-0 w-full text-sm font-rocGroteskMedium placeholder:text-sm placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                        required
                        value={formData.description}
                        name="description"
                        onChange={(event) =>
                            handleInputChange(event.target.name, event.target.value)
                        }
                    />
                </div>
                <div className="">
                    <SelectInput
                        label="Are your goods ready?"
                        value={formData.areGoodsReady}
                        name="areGoodsReady"
                        isRequired={true}
                        placeholder={"Are your goods ready"}
                        className="!h-[48px]"
                        handleChange={handleInputChange}
                        dropdownOptions={[
                            {
                                label: "Yes, they are ready now",
                                value: "Yes, they are ready now",
                            },
                            {
                                label: "They will be ready by next week",
                                value: "They will be ready by next week",
                            },
                            {
                                label: "They will be ready in two weeks",
                                value: "They will be ready in two weeks",
                            },
                            {
                                label: "They will be ready in more than two weeks",
                                value: "They will be ready in more than two weeks",
                            },
                        ]}
                    />
                </div>
            </div>
            <div className="py-4 px-6 w-full bg-mvx-light-blue rounded">
                <p className="text-gun-metal text-sm font-rocGroteskMedium">
                    Please note that rates are subject to change if your goods are not gated-in
                    before that date. This means that today’s rate might not be valid when your
                    goods are ready.
                </p>
            </div>
        </div>
    );
};

export default GoodsDetails;
