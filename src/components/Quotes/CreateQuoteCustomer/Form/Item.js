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
                vat: type === "vat" ? value : item.vat,
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
                <div className="text-xs font-rocGrotesk font-semibold bg-mvx-light-blue grid grid-cols-[1fr_90px_90px_90px] 400:grid-cols-[1fr_90px_120px_90px]">
                    <p className="py-[6px] pl-3">ITEM</p>
                    <p className="text-center py-[6px] border-x border-x-[#DFE1E6]">CURRENCY</p>
                    <p className="text-center py-[6px] border-r">AMOUNT</p>
                    <p className="text-center py-[6px]">VAT(7.5%)</p>
                </div>
                <div className="text-xs font-rocGrotesk font-medium grid grid-cols-[1fr_90px_90px_90px] 400:grid-cols-[1fr_90px_120px_90px]">
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

                    <div className="flex items-center border-r">
                        <input
                            value={formatCurrency(
                                String(item.price),
                                String(item.price)?.includes(".")
                            )}
                            className={`pl-3 outline-0 w-full h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium ${
                                index ? "pr-[6px]" : "pr-2"
                            }`}
                            required={Boolean(isRequired)}
                            pattern={"^[0-9,.]+$"}
                            title="Amount can only be number(s)"
                            onChange={(evt) =>
                                updateValue("price", evt.target.value.replace(/,/g, ""))
                            }
                        />
                    </div>

                    <div className="flex justify-center relative pr-1">
                        <input
                            value={item.vat ?? false}
                            type="checkbox"
                            checked={item.vat}
                            className={`pl-3 outline-0 text-sm text-green-600 font-rocGroteskMedium placeholder:font-rocGroteskMedium ${
                                index ? "pr-[6px]" : "pr-2"
                            }`}
                            required={false}
                            onChange={(evt) => {
                                console.log("evt.target.value", !item?.vat);
                                updateValue("vat", !item?.vat);
                            }}
                        />

                        {index ? (
                            <span
                                className="absolute right-[4px] material-icons text-[18px] !text-mvx-neutral cursor-pointer self-center transition-colors hover:!text-red-500"
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
                    className="flex items-center cursor-pointer w-max font-rocGrotesk font-medium text-xs mt-2 ml-[3px] group transition-colors hover:text-pacific-cyan"
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
