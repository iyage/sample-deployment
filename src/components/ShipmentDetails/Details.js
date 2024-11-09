import Loader from "components/common/Loader";
import Skeleton from "components/common/Skeleton";
import formatCurrency from "helpers/formatCurrency";
import useScreenSize from "hooks/useScreenSize";
import React, { useEffect, useState } from "react";

const Details = ({ loading, ffShipment }) => {
    const screenSize = useScreenSize();
    const smallScreen = screenSize < 640;

    return (
        <div className="mt-5 max-900:pb-14 800:overflow-y-auto 800:h-[268px]">
            {/* Packages */}
            {loading ? (
                <>{smallScreen ? <Loader /> : <PackageContainerLoader />}</>
            ) : (
                <>
                    {ffShipment?.packageType === "non-containers" ? (
                        <>
                            {ffShipment?.packages.map((pkg, idx) => (
                                <PackageContainer
                                    key={pkg._id + idx}
                                    pkg={pkg}
                                    idx={idx}
                                    moreThanOne={ffShipment.packages.length > 1}
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            {ffShipment?.containers.map((container, idx) => (
                                <PackageContainer
                                    key={container._id + idx}
                                    pkg={container}
                                    idx={idx}
                                    moreThanOne={ffShipment.containers.length > 1}
                                />
                            ))}
                        </>
                    )}
                </>
            )}

            {/* Goods details */}
            {loading ? (
                <>{smallScreen ? <></> : <GoodsDetailsLoader />}</>
            ) : (
                <div className="max-sm:shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                    <p className="flex justify-between items-center mt-7 font-rocGroteskMedium sm:bg-mvx-light-blue px-4 py-3 sm:border sm:border-b-0 rounded-t">
                        Goods Details
                        {/* <span className="material-icons">expand_less</span> */}
                    </p>
                    <div className="border border-t-0 rounded-b py-3 max-sm:px-4">
                        {smallScreen ? (
                            <>
                                {" "}
                                <span className="flex justify-between font-rocGroteskMedium text-sm">
                                    <span className="text-mvx-neutral">Value of Goods</span>
                                    <span>
                                        {ffShipment?.goodsDetails.value.currency}{" "}
                                        {formatCurrency(ffShipment?.goodsDetails.value.amount)}
                                    </span>
                                </span>
                                <span className="flex justify-between font-rocGroteskMedium text-sm pt-3">
                                    <span className="text-mvx-neutral">Status of readiness</span>
                                    <span>{ffShipment?.goodsDetails.goodsStatus}</span>
                                </span>
                                <span className="flex justify-between font-rocGroteskMedium text-sm pt-3 mb-2">
                                    <span className="text-mvx-neutral">Description</span>
                                    <span> {ffShipment?.goodsDetails.description}</span>
                                </span>
                            </>
                        ) : (
                            <>
                                {" "}
                                <div className="flex px-4 border-b pb-3 text-sm">
                                    <p className="font-rocGroteskMedium border-r pr-6">
                                        Value of Goods
                                        <span className="block text-mvx-neutral mt-[2px]">
                                            {ffShipment?.goodsDetails.value.currency}{" "}
                                            {formatCurrency(ffShipment?.goodsDetails.value.amount)}
                                        </span>
                                    </p>
                                    <p className="font-rocGroteskMedium pl-6">
                                        Status of readiness
                                        <span className="block text-mvx-neutral mt-[2px]">
                                            {ffShipment?.goodsDetails.goodsStatus}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex px-4 pt-3 text-sm">
                                    <p className="font-rocGroteskMedium">
                                        Description
                                        <span className="block text-mvx-neutral mt-[2px]">
                                            {ffShipment?.goodsDetails.description}
                                        </span>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const PackageContainer = ({ isContainer, pkg, idx, moreThanOne }) => {
    const [isActive, setIsActive] = useState(false);
    const [clicked, setClicked] = useState(false);
    const screenSize = useScreenSize();
    const smallScreen = screenSize < 640;

    const toggleAccordion = () => {
        if (!idx && !clicked) {
            setIsActive(false);
            setClicked(true);
            return;
        }
        setIsActive((prev) => !prev);
    };

    useEffect(() => {
        if (!moreThanOne) {
            return setIsActive(true);
        }

        if (!clicked && !idx) {
            return setIsActive(true);
        }
    }, [moreThanOne, clicked, idx]);

    return (
        <div className="max-sm:shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
            <p
                className={`flex justify-between items-center font-rocGroteskMedium sm:bg-mvx-light-blue px-4 py-3 cursor-pointer sm:border border-b-0 rounded-t ${
                    !moreThanOne && "pointer-events-none"
                } ${idx && "mt-[21px]"}  ${!isActive && "sm:!border-b rounded-b"}`}
                onClick={() => {
                    moreThanOne && toggleAccordion();
                }}
            >
                {isContainer ? "Container" : "Package"} {moreThanOne && idx + 1}
                {moreThanOne && (
                    <span
                        className={`material-icons pointer-events-none transition-all duration-300 ${
                            isActive ? "rotate-180" : "rotate-0"
                        }`}
                    >
                        expand_less
                    </span>
                )}
            </p>
            {isContainer ? (
                <div
                    className={`${
                        isActive ? "block" : "hidden"
                    } sm:border border-t-0 rounded-b py-3`}
                >
                    <div className="flex px-4 text-sm">
                        {smallScreen ? (
                            <>
                                <span className="flex justify-between font-rocGroteskMedium text-sm">
                                    <span className="text-mvx-neutral">Cargo Type</span>
                                    <span>Container</span>
                                </span>
                                <span className="flex justify-between font-rocGroteskMedium text-sm pt-3">
                                    <span className="text-mvx-neutral">Container Type</span>
                                    <span> {pkg?.containerType}</span>
                                </span>
                                <span className="flex justify-between font-rocGroteskMedium text-sm pt-3">
                                    <span className="text-mvx-neutral">Unit</span>
                                    <span>{pkg?.unit}</span>
                                </span>
                                <span className="flex justify-between font-rocGroteskMedium text-sm pt-3 mb-0.5">
                                    <span className="text-mvx-neutral">Quantity</span>
                                    <span>{pkg?.quantity}</span>
                                </span>
                            </>
                        ) : (
                            <>
                                <p className="font-rocGroteskMedium border-r pr-6">
                                    Cargo Type
                                    <span className="block text-mvx-neutral mt-[2px]">
                                        Container
                                    </span>
                                </p>
                                <p className="font-rocGroteskMedium border-r px-6">
                                    Container Type
                                    <span className="block text-mvx-neutral mt-[2px]">
                                        {pkg?.containerType}
                                    </span>
                                </p>
                                <p className="font-rocGroteskMedium border-r px-6">
                                    Unit
                                    <span className="block text-mvx-neutral mt-[2px]">
                                        {pkg?.unit}
                                    </span>
                                </p>
                                <p className="font-rocGroteskMedium pl-6">
                                    Quantity
                                    <span className="block text-mvx-neutral mt-[2px]">
                                        {pkg?.quantity}
                                    </span>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div
                    className={`${
                        isActive ? "block" : "hidden"
                    } sm:border border-t-0 rounded-b py-3`}
                >
                    {smallScreen ? (
                        <>
                            <span className="flex justify-between font-rocGroteskMedium px-4 text-sm">
                                <span className="text-mvx-neutral">Cargo Type</span>
                                <span>Package</span>
                            </span>
                            <span className="flex justify-between font-rocGroteskMedium px-4 text-sm pt-3">
                                <span className="text-mvx-neutral"> Package type</span>
                                <span>{pkg?.packageType}</span>
                            </span>
                            <span className="flex justify-between font-rocGroteskMedium px-4 text-sm pt-3">
                                <span className="text-mvx-neutral">Number of units</span>
                                <span>{pkg?.units}</span>
                            </span>
                            <span className="flex justify-between font-rocGroteskMedium px-4 text-sm pt-3">
                                <span className="text-mvx-neutral">Pallet type</span>
                                <span>{pkg?.palletType}</span>
                            </span>
                            <span className="flex justify-between font-rocGroteskMedium px-4 text-[15px] pt-4">
                                Dimensions (per unit)
                            </span>
                            <span className="flex justify-between font-rocGroteskMedium px-4 text-sm pt-3">
                                <span className="text-mvx-neutral">Length</span>
                                <span>
                                    {pkg?.length?.value} {pkg?.length?.unit}
                                </span>
                            </span>
                            <span className="flex justify-between font-rocGroteskMedium px-4 text-sm pt-3">
                                <span className="text-mvx-neutral">Width</span>
                                <span>
                                    {pkg?.width?.value} {pkg?.width?.unit}
                                </span>
                            </span>
                            <span className="flex justify-between font-rocGroteskMedium px-4 text-sm pt-3">
                                <span className="text-mvx-neutral">Height</span>
                                <span>
                                    {pkg?.height?.value} {pkg?.height?.unit}
                                </span>
                            </span>
                            <span className="flex justify-between font-rocGroteskMedium px-4 text-sm pt-3 mb-0.5">
                                <span className="text-mvx-neutral">Weight</span>
                                <span>
                                    {pkg?.weight?.value} {pkg?.weight?.unit}
                                </span>
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="flex px-4 border-b pb-3 text-sm">
                                <p className="font-rocGroteskMedium border-r pr-6">
                                    Cargo Type
                                    <span className="block text-mvx-neutral mt-[2px]">Package</span>
                                </p>
                                <p className="font-rocGroteskMedium border-r px-6">
                                    Package type
                                    <span className="block text-mvx-neutral mt-[2px]">
                                        {pkg?.packageType}
                                    </span>
                                </p>
                                <p className="font-rocGroteskMedium border-r px-6">
                                    Number of units
                                    <span className="block text-mvx-neutral mt-[2px]">
                                        {pkg?.units}
                                    </span>
                                </p>
                                <p className="font-rocGroteskMedium pl-6">
                                    Pallet type
                                    <span className="block text-mvx-neutral mt-[2px]">
                                        {pkg?.palletType}
                                    </span>
                                </p>
                            </div>
                            <div className="flex px-4 pt-3 text-sm">
                                <p className="font-rocGroteskMedium border-r pr-6">
                                    Dimensions (per unit)
                                    <span className="block text-mvx-neutral mt-[2px]">
                                        Length: {pkg?.length?.value}
                                        {pkg?.length?.unit} | Width: {pkg?.width?.value}
                                        {pkg?.width?.unit} | Height: {pkg?.height?.value}
                                        {pkg?.height?.unit}
                                    </span>
                                </p>
                                <p className="font-rocGroteskMedium pl-6">
                                    Weight (per unit)
                                    <span className="block text-mvx-neutral mt-[2px]">
                                        {pkg?.weight?.value} {pkg?.weight?.unit}
                                    </span>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export const PackageContainerLoader = ({ isContainer }) => (
    <>
        {isContainer ? (
            <>
                <Skeleton className={"h-[49px] border border-b-0 rounded-t !bg-mvx-light-blue"} />

                <div className="border border-t-0 rounded-b py-3">
                    <div className="flex px-4">
                        <Skeleton
                            className={"h-[28px] my-[7px] mr-3 basis-[17%] !bg-mvx-light-blue"}
                        />
                        <Skeleton
                            className={"h-[28px] mx-3 my-[7px] basis-[15%] !bg-mvx-light-blue"}
                        />
                        <Skeleton
                            className={"h-[28px] mx-3 my-[7px] basis-[20%] !bg-mvx-light-blue"}
                        />
                        <Skeleton
                            className={"h-[28px] ml-3 my-[7px] basis-[18%] !bg-mvx-light-blue"}
                        />
                    </div>
                </div>
            </>
        ) : (
            <>
                <Skeleton className={"h-[49px] border border-b-0 rounded-t !bg-mvx-light-blue"} />
                <div className="border border-t-0 rounded-b py-3">
                    <div className="flex px-4 border-b pb-3">
                        <Skeleton
                            className={"h-[28px] my-[7px] mr-3 basis-[17%] !bg-mvx-light-blue"}
                        />
                        <Skeleton
                            className={"h-[28px] mx-3 my-[7px] basis-[15%] !bg-mvx-light-blue"}
                        />
                        <Skeleton
                            className={"h-[28px] mx-3 my-[7px] basis-[20%] !bg-mvx-light-blue"}
                        />
                        <Skeleton
                            className={"h-[28px] ml-3 my-[7px] basis-[18%] !bg-mvx-light-blue"}
                        />
                    </div>
                    <div className="flex px-4 pt-3 text-sm">
                        <Skeleton
                            className={"h-[28px] mr-3 my-[7px] basis-[30%] !bg-mvx-light-blue"}
                        />
                        <Skeleton
                            className={"h-[28px] ml-3 my-[7px] basis-[20%] !bg-mvx-light-blue"}
                        />
                    </div>
                </div>
            </>
        )}
    </>
);

const GoodsDetailsLoader = () => (
    <>
        <Skeleton className={"h-[49px] border border-b-0 rounded-t !bg-mvx-light-blue mt-8"} />
        <div className="border border-t-0 rounded-b py-3">
            <div className="flex px-4 border-b pb-3">
                <Skeleton className={"h-[28px] my-[7px] mr-3 basis-[19%] !bg-mvx-light-blue"} />
                <Skeleton className={"h-[28px] mx-3 my-[7px] basis-[15%] !bg-mvx-light-blue"} />
            </div>
            <div className="flex px-4 pt-3 text-sm">
                <Skeleton className={"h-[28px] mr-3 my-[7px] basis-[32%] !bg-mvx-light-blue"} />
            </div>
        </div>
    </>
);

export default Details;
