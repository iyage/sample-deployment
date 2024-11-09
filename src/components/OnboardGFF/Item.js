import SelectInput from "components/common/SelectInput";
import formatCurrency from "helpers/formatCurrency";

const Item = ({
    item,
    setItems,
    index,
    isLast,
    isRequired,
    selectedCurrency,
    setSelectedCurrency,
}) => {
    const updateValue = (type, value) => {
        setItems((prev) => {
            const updateObj = {
                name: type === "name" ? value : item.name,
                price: type === "price" ? value : item.price,
                currency: type === "currency" ? value : item.currency,
            };
            prev[index] = updateObj;

            if (type === "currency") {
                setSelectedCurrency(value);
            }
            return prev.length > 1 ? [...prev] : [updateObj];
        });
    };

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            {
                name: "",
                price: "",
                currency: selectedCurrency,
            },
        ]);
    };

    const deleteItem = () => {
        setItems((prev) => {
            prev[index] = null;
            return prev.filter((item) => item);
        });
    };

    return (
        <>
            <div className={`border ${index ? "mt-7" : "mt-4"}`}>
                <div className="text-xs font-rocGroteskBold bg-mvx-light-blue grid grid-cols-[1fr_90px_90px] 400:grid-cols-[1fr_90px_120px]">
                    <p className="py-[6px] pl-3">ITEM</p>
                    <p className="text-center py-[6px] border-x border-x-[#DFE1E6]">CURRENCY</p>
                    <p className="text-center py-[6px]">AMOUNT</p>
                </div>
                <div className="text-xs font-rocGroteskMedium grid grid-cols-[1fr_90px_90px] 400:grid-cols-[1fr_90px_120px]">
                    <input
                        value={item.name}
                        className="px-3 outline-0 w-full h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                        onChange={(evt) => updateValue("name", evt.target.value)}
                        required={Boolean(isRequired)}
                    />
                    {/* <>{item.currency}</> */}
                    <SelectInput
                        value={item.currency}
                        isRequired={Boolean(isRequired)}
                        className={"border-x border-y-0 cursor-pointer h-[45px]"}
                        name="currency"
                        handleChange={(_, value) => updateValue("currency", value)}
                        dropdownOptions={["USD", "NGN", "GBP", "EUR"].map((curr) => ({
                            label: curr,
                            value: curr,
                        }))}
                    />

                    <div className="flex pr-1">
                        <input
                            value={formatCurrency(item.price)}
                            className={`pl-3 outline-0 w-full h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium ${
                                index ? "pr-[6px]" : "pr-2"
                            }`}
                            required={Boolean(isRequired)}
                            pattern={"^[0-9,]+$"}
                            title="Amount can only be number(s)"
                            onChange={(evt) =>
                                updateValue("price", evt.target.value.replace(/,/g, ""))
                            }
                        />

                        {index ? (
                            <span
                                className="material-icons text-[18px] !text-mvx-neutral cursor-pointer self-center transition-colors hover:!text-red-500"
                                onClick={deleteItem}
                            >
                                delete_forever
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>

            {isLast ? (
                <p
                    className="flex items-center cursor-pointer w-max font-rocGroteskMedium text-xs mt-2 ml-[3px] group transition-colors hover:text-pacific-cyan"
                    onClick={addItem}
                >
                    <span className="material-icons text-sm mr-1 transition-colors group-hover:text-pacific-cyan">
                        add
                    </span>
                    Add new item
                </p>
            ) : null}
        </>
    );
};

export default Item;
