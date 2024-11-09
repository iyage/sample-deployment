import formatCurrency from "helpers/formatCurrency";
import { useEffect, useState } from "react";

const PackageContainerList = ({ list, goodsDetails, isContainers }) => {
    return (
        <>
            {list.map((data, idx) => (
                <ListItems
                    key={data._id}
                    data={data}
                    isContainers={isContainers}
                    moreThanOneItem={list.length > 1}
                    idx={idx}
                />
            ))}

            <p className="font-rocGroteskMedium mt-8 mb-2">Goods Details</p>
            <>
                <p className="font-rocGroteskMedium text-sm">
                    Value of Goods:{" "}
                    <span className="text-mvx-neutral">
                        {goodsDetails.value.currency}
                        {formatCurrency(goodsDetails.value.amount)}
                    </span>
                </p>
                <p className="font-rocGroteskMedium text-sm mt-[10px]">
                    Description:{" "}
                    <span className="text-mvx-neutral">{goodsDetails.description}</span>
                </p>
                <p className="font-rocGroteskMedium text-sm mt-[10px]">
                    Status of readiness:{" "}
                    <span className="text-mvx-neutral">{goodsDetails.goodsStatus}</span>
                </p>
            </>
        </>
    );
};

const ListItems = ({ data, isContainers, moreThanOneItem, idx }) => {
    const [isActive, setIsActive] = useState(false);
    const [clicked, setClicked] = useState(false);

    const toggleAccordion = () => {
        if (!idx && !clicked) {
            setIsActive(false);
            setClicked(true);
            return;
        }
        setIsActive((prev) => !prev);
    };

    useEffect(() => {
        if (!moreThanOneItem) {
            return setIsActive(true);
        }

        if (!clicked && !idx) {
            return setIsActive(true);
        }
    }, [moreThanOneItem, clicked, idx]);

    return (
        <>
            <p
                className={`font-rocGroteskBold py-[14px] flex justify-between items-center ${
                    !isActive && "border-b"
                } ${moreThanOneItem && "cursor-pointer"}`}
                onClick={() => {
                    moreThanOneItem && toggleAccordion();
                }}
            >
                <span className="pointer-events-none">
                    {isContainers ? "Container" : "Package"} {moreThanOneItem ? idx + 1 : ""}
                </span>

                {moreThanOneItem && (
                    <span
                        className={`material-icons pointer-events-none transition-all duration-300 ${
                            isActive ? "rotate-180" : "rotate-0"
                        }`}
                    >
                        expand_more
                    </span>
                )}
            </p>

            {isContainers ? (
                <div className={`${isActive ? "block" : "hidden"} pb-3 pt-1`}>
                    <p className="font-rocGroteskMedium text-sm">
                        Container type:{" "}
                        <span className="text-mvx-neutral">{data.containerType}</span>
                    </p>
                    <p className="font-rocGroteskMedium text-sm mt-[10px]">
                        Unit: <span className="text-mvx-neutral">{data.unit}</span>
                    </p>{" "}
                    <p className="font-rocGroteskMedium text-sm mt-[10px]">
                        Quantity: <span className="text-mvx-neutral">{data.quantity}</span>
                    </p>
                </div>
            ) : (
                <div className={` ${isActive ? "block" : "hidden"} pb-3 pt-1`}>
                    <p className="font-rocGroteskMedium text-sm">
                        Package type: <span className="text-mvx-neutral">{data.packageType}</span>
                    </p>
                    <p className="font-rocGroteskMedium text-sm mt-[10px]">
                        Number of units: <span className="text-mvx-neutral">{data.units}</span>
                    </p>{" "}
                    <p className="font-rocGroteskMedium text-sm mt-[10px]">
                        Dimensions (per unit):{" "}
                        <span className="text-mvx-neutral">
                            Length: {data.length.value}
                            {data.length.unit} x Width: {data.width.value}
                            {data.width.unit} x Height: {data.height.value}
                            {data.height.unit}
                        </span>
                    </p>{" "}
                    <p className="font-rocGroteskMedium text-sm mt-[10px]">
                        Weight (per unit):{" "}
                        <span className="text-mvx-neutral">
                            {data.weight.value}
                            {data.weight.unit}
                        </span>
                    </p>
                </div>
            )}
        </>
    );
};

export default PackageContainerList;
