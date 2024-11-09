import Dropdown from "components/common/Dropdown";
import ModalContainer from "components/common/ModalContainer";
import SelectInput from "components/common/SelectInput";
import React, { useState } from "react";

const ShipmentDetails = ({ formData, setFormThreeData, isContainer, setIsContainer, mode }) => {
    const [activeContainerAccordionId, setActiveContainerAccordionId] = useState(0);
    const [activeNonContainerAccordionId, setActiveNonContainerAccordionId] = useState(0);
    const [isExpanded, setIsExpanded] = useState(true);
    const [modalIsOpen, setIsModalOpen] = useState(false);
    const [selectedAccordionId, setSelectedAccordionId] = useState(null);

    const addNonContainerAccordion = () => {
        setFormThreeData((prev) => {
            return {
                ...prev,
                nonContainerData: [
                    ...prev.nonContainerData,
                    {
                        packageType: "",
                        palletType: "",
                        dimensionUnit: "cm",
                        containerUnitNo: "1",
                        length: "",
                        width: "",
                        height: "",
                        weight: "",
                        weightUnit: "kg",
                    },
                ],
            };
        });
    };

    const addContainerAccordion = () => {
        setFormThreeData((prev) => {
            return {
                ...prev,
                containerData: [
                    ...prev.containerData,
                    {
                        containerType: "",
                        unit: "ft",
                        quantity: "1",
                    },
                ],
            };
        });
    };

    const removeNonContainerAccordion = (index) => {
        setFormThreeData((prev) => {
            const item = [...prev.nonContainerData];
            item.splice(index, 1);
            return {
                ...prev,
                nonContainerData: item,
            };
        });
    };

    const removeContainerAccordion = (index) => {
        setFormThreeData((prev) => {
            const item = [...prev.containerData];
            item.splice(index, 1);
            return {
                ...prev,
                containerData: item,
            };
        });
    };

    const handleNonContainerItemChange = (event, index, name, value) => {
        setFormThreeData((prev) => {
            const container = [...prev.nonContainerData];
            container[index] = {
                ...prev.nonContainerData[index],
                [event?.target?.name ? event.target.name : name]: event?.target?.value
                    ? event.target.value
                    : value,
            };
            return {
                ...prev,
                nonContainerData: container,
            };
        });
    };

    const handleContainerItemChange = (event, index, name, value) => {
        setFormThreeData((prev) => {
            const nonContainer = [...prev.containerData];
            nonContainer[index] = {
                ...prev.containerData[index],
                [name && value ? name : event.target.name]:
                    name && value ? value : event.target.value,
            };
            return {
                ...prev,
                containerData: nonContainer,
            };
        });
    };

    return (
        <div>
            <>
                <div className="mb-8">
                    <h3 className="font-rocGroteskBold text-[22px] text-gun-metal mb-2">
                        Shipment Details
                    </h3>
                    <p className="text-gun-metal font-rocGroteskMedium text-sm">
                        Enter pick-up and drop-off details
                    </p>
                </div>
                <div className={`h-full`}>
                    <div className="mb-9">
                        <div className="flex bg-[#F4F5F7] my-4 text-[13px] w-full max-sm:w-full h-10 text-[#6B778C] rounded items-center">
                            {mode !== "air" && (
                                <button
                                    type="button"
                                    className={`basis-[49%]
                                 ml-1 h-[83%] text-gun-metal rounded transition-all duration-[400ms] ${
                                     isContainer && "bg-white shadow-md text-gun-metal"
                                 }`}
                                    onClick={() => setIsContainer(true)}
                                >
                                    Container
                                </button>
                            )}

                            <button
                                type="button"
                                className={`${
                                    mode === "air" ? "basis-[100%]" : "basis-[49%]"
                                } mr-1 h-[83%] rounded text-gun-metal transition-all duration-[400ms] ${
                                    (!isContainer || mode === "air") && "bg-white shadow-md"
                                }`}
                                onClick={() => setIsContainer(false)}
                            >
                                Non-Container
                            </button>
                        </div>
                    </div>
                    <div className="mb-6 flex flex-col gap-4">
                        {(isContainer && mode !== "air"
                            ? formData.containerData
                            : formData.nonContainerData
                        ).map((_, idx) => {
                            return isContainer && mode !== "air" ? (
                                <div key={idx} className="py-4 px-8 max-sm:p-4 border rounded">
                                    <div
                                        className={`flex ${
                                            isExpanded &&
                                            activeContainerAccordionId === idx &&
                                            "mb-6"
                                        } justify-between font-rocGroteskMedium text-sm items-center cursor-pointer`}
                                        onClick={() => {
                                            setActiveContainerAccordionId(idx);
                                            setIsExpanded(
                                                activeContainerAccordionId === idx
                                                    ? !isExpanded
                                                    : true
                                            );
                                        }}
                                    >
                                        <p className="w-[20%]">Item {idx + 1}</p>
                                        <p
                                            className={`${
                                                idx === 0 && "ml-[-52px]"
                                            } max-sm:hidden w-[60%] text-center`}
                                        >
                                            {formData?.containerData?.[idx]?.containerType
                                                ? formData?.containerData?.[idx]?.quantity +
                                                  " x " +
                                                  formData?.containerData?.[idx]?.containerType
                                                : ""}
                                        </p>
                                        <p className="flex items-center gap-8 max-sm:gap-4">
                                            {idx > 0 && (
                                                <i
                                                    className="ri-delete-bin-5-fill text-lg"
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        setSelectedAccordionId(idx);
                                                        setIsModalOpen(true);
                                                    }}
                                                ></i>
                                            )}

                                            <span
                                                className={`material-icons ${
                                                    isExpanded &&
                                                    activeContainerAccordionId === idx &&
                                                    "rotate-180"
                                                }`}
                                            >
                                                keyboard_arrow_down
                                            </span>
                                        </p>
                                    </div>

                                    <div
                                        className={`${
                                            isExpanded && activeContainerAccordionId === idx
                                                ? "h-full"
                                                : "h-0 overflow-hidden"
                                        }`}
                                    >
                                        <div className="flex-col max-sm:flex-col mb-6">
                                            <div className="w-full max-sm:w-full mb-6">
                                                <div className="w-full">
                                                    <p className="text-sm mb-1 font-rocGroteskMedium">
                                                        Container type (per unit)
                                                    </p>
                                                    <div className="flex items-center">
                                                        <button
                                                            type="button"
                                                            className={`border hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                                                formData.containerData[idx]
                                                                    .containerType === "40ft"
                                                                    ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                                                    : "text-mvx-neutral bg-white"
                                                            }  w-full px-4 py-3 flex h-[50px] items-center rounded-r-none justify-center`}
                                                            onClick={() =>
                                                                handleContainerItemChange(
                                                                    null,
                                                                    idx,
                                                                    "containerType",
                                                                    "40ft"
                                                                )
                                                            }
                                                        >
                                                            <p className="text-sm font-rocGroteskMedium whitespace-nowrap">
                                                                40ft
                                                            </p>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`border hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                                                formData.containerData[idx]
                                                                    .containerType === "20ft"
                                                                    ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                                                    : "text-mvx-neutral bg-white"
                                                            }  w-full px-4 py-3 flex h-[50px] items-center rounded-l-none justify-center`}
                                                            onClick={() =>
                                                                handleContainerItemChange(
                                                                    null,
                                                                    idx,
                                                                    "containerType",
                                                                    "20ft"
                                                                )
                                                            }
                                                        >
                                                            <p className="text-sm font-rocGroteskMedium whitespace-nowrap">
                                                                20ft
                                                            </p>
                                                        </button>

                                                        <input
                                                            required
                                                            value={
                                                                formData?.containerData?.[idx]
                                                                    ?.containerType
                                                            }
                                                            className="absolute z-[-10] opacity-0"
                                                            // onChange={() => console.log("sample")}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full max-sm:w-full">
                                                <div className="w-full">
                                                    <p className="text-sm mb-1 font-rocGroteskMedium">
                                                        Number of units
                                                    </p>
                                                    <div className="flex gap-3 items-center">
                                                        <input
                                                            type="text"
                                                            placeholder="1"
                                                            className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                            name="quantity"
                                                            value={
                                                                formData.containerData[idx].quantity
                                                            }
                                                            onChange={(event) =>
                                                                handleContainerItemChange(
                                                                    event,
                                                                    idx
                                                                )
                                                            }
                                                            pattern={"^[0-9]+$"}
                                                            title="must be digits"
                                                            required
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                setFormThreeData((prev) => {
                                                                    const container = [
                                                                        ...prev.containerData,
                                                                    ];
                                                                    container[idx] = {
                                                                        ...prev.containerData[idx],
                                                                        quantity:
                                                                            Number(
                                                                                prev.containerData[
                                                                                    idx
                                                                                ].quantity
                                                                            ) > 1
                                                                                ? String(
                                                                                      Number(
                                                                                          prev
                                                                                              .containerData[
                                                                                              idx
                                                                                          ].quantity
                                                                                      ) - 1
                                                                                  )
                                                                                : "1",
                                                                    };
                                                                    return {
                                                                        ...prev,
                                                                        containerData: container,
                                                                    };
                                                                });
                                                            }}
                                                            type="button"
                                                            className="border rounded bg-white px-4 py-3 flex h-[48px] items-center justify-center "
                                                        >
                                                            <span className="material-icons text-base">
                                                                remove
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setFormThreeData((prev) => {
                                                                    const container = [
                                                                        ...prev.containerData,
                                                                    ];
                                                                    container[idx] = {
                                                                        ...prev.containerData[idx],
                                                                        quantity: String(
                                                                            Number(
                                                                                prev.containerData[
                                                                                    idx
                                                                                ].quantity
                                                                            ) + 1
                                                                        ),
                                                                    };
                                                                    return {
                                                                        ...prev,
                                                                        containerData: container,
                                                                    };
                                                                });
                                                            }}
                                                            type="button"
                                                            className="border bg-white rounded px-4 py-3 flex h-[48px] items-center justify-center "
                                                        >
                                                            <span className="material-icons text-base">
                                                                add
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div key={idx} className="py-4 px-8 max-sm:p-4 border rounded">
                                    <div
                                        className={`flex ${
                                            isExpanded &&
                                            activeNonContainerAccordionId === idx &&
                                            "mb-6"
                                        } justify-between font-rocGroteskMedium text-sm items-center cursor-pointer`}
                                        onClick={() => {
                                            setIsExpanded(
                                                activeNonContainerAccordionId === idx
                                                    ? !isExpanded
                                                    : true
                                            );
                                            setActiveNonContainerAccordionId(idx);
                                        }}
                                    >
                                        <p className="w-[20%]">Item {idx + 1}</p>
                                        <p
                                            className={`${
                                                idx === 0 && "ml-[-52px]"
                                            } max-sm:hidden w-[60%] text-center`}
                                        >
                                            {formData?.nonContainerData?.[idx]?.containerUnitNo}{" "}
                                            {formData?.nonContainerData?.[idx]?.packageType}{" "}
                                            {formData?.nonContainerData?.[idx]?.length ||
                                            formData?.nonContainerData?.[idx]?.height ||
                                            formData?.nonContainerData?.[idx]?.width ||
                                            formData?.nonContainerData?.[idx]?.weight
                                                ? `• Unit dimensions ${formData?.nonContainerData?.[idx]?.length}×${formData?.nonContainerData?.[idx]?.width}×${formData?.nonContainerData?.[idx]?.height} ${formData?.nonContainerData?.[idx]?.dimensionUnit} ${formData?.nonContainerData?.[idx]?.weight} ${formData?.nonContainerData?.[idx]?.weightUnit}`
                                                : ""}
                                        </p>
                                        <p className="flex items-center gap-8 max-sm:gap-4">
                                            {idx > 0 && (
                                                <i
                                                    className="ri-delete-bin-5-fill text-lg"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedAccordionId(idx);
                                                        setIsModalOpen(true);
                                                    }}
                                                ></i>
                                            )}

                                            <span
                                                className={`material-icons ${
                                                    isExpanded &&
                                                    activeNonContainerAccordionId === idx &&
                                                    "rotate-180"
                                                }`}
                                            >
                                                keyboard_arrow_down
                                            </span>
                                        </p>
                                    </div>

                                    <div
                                        className={`${
                                            isExpanded && activeNonContainerAccordionId === idx
                                                ? "h-full"
                                                : "h-0 overflow-hidden"
                                        }`}
                                    >
                                        <div className="flex-col max-sm:flex-col gap-6 mb-6">
                                            <SelectInput
                                                value={formData.nonContainerData[idx].packageType}
                                                name="packageType"
                                                isRequired={true}
                                                placeholder={"Select package type"}
                                                handleChange={(name, value) =>
                                                    handleNonContainerItemChange(
                                                        null,
                                                        idx,
                                                        name,
                                                        value
                                                    )
                                                }
                                                label="Package type"
                                                className={"mb-6 !h-[48px]"}
                                                dropdownOptions={[
                                                    {
                                                        label: "Pallets",
                                                        value: "Pallets",
                                                        icon: (
                                                            <span className="material-icons">
                                                                pallet
                                                            </span>
                                                        ),
                                                    },
                                                    {
                                                        label: "Crates/Boxes",
                                                        value: "Crates/Boxes",
                                                        icon: (
                                                            <span className="material-icons">
                                                                takeout_dining
                                                            </span>
                                                        ),
                                                    },
                                                ]}
                                            />
                                            <div className="w-full mb-6">
                                                <p className="text-sm mb-1 font-rocGroteskMedium">
                                                    Number of units
                                                </p>
                                                <div className="flex gap-3 items-center">
                                                    <input
                                                        type="text"
                                                        placeholder="1"
                                                        name="containerUnitNo"
                                                        value={
                                                            formData.nonContainerData[idx]
                                                                .containerUnitNo
                                                        }
                                                        onChange={(event) => {
                                                            handleNonContainerItemChange(
                                                                event,
                                                                idx
                                                            );
                                                        }}
                                                        required
                                                        pattern={"^[0-9]+$"}
                                                        title="must be digits"
                                                        className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="border rounded bg-white px-4 py-3 flex h-[48px] items-center justify-center "
                                                        onClick={() => {
                                                            setFormThreeData((prev) => {
                                                                const container = [
                                                                    ...prev.nonContainerData,
                                                                ];
                                                                container[idx] = {
                                                                    ...prev.nonContainerData[idx],
                                                                    containerUnitNo:
                                                                        Number(
                                                                            prev.nonContainerData[
                                                                                idx
                                                                            ].containerUnitNo
                                                                        ) > 1
                                                                            ? String(
                                                                                  Number(
                                                                                      prev
                                                                                          .nonContainerData[
                                                                                          idx
                                                                                      ]
                                                                                          .containerUnitNo
                                                                                  ) - 1
                                                                              )
                                                                            : "1",
                                                                };
                                                                return {
                                                                    ...prev,
                                                                    nonContainerData: container,
                                                                };
                                                            });
                                                        }}
                                                    >
                                                        <span className="material-icons text-base">
                                                            remove
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="border rounded bg-white px-4 py-3 flex h-[48px] items-center justify-center "
                                                        onClick={() => {
                                                            setFormThreeData((prev) => {
                                                                const container = [
                                                                    ...prev.nonContainerData,
                                                                ];
                                                                container[idx] = {
                                                                    ...prev.nonContainerData[idx],
                                                                    containerUnitNo: String(
                                                                        Number(
                                                                            prev.nonContainerData[
                                                                                idx
                                                                            ].containerUnitNo
                                                                        ) + 1
                                                                    ),
                                                                };
                                                                return {
                                                                    ...prev,
                                                                    nonContainerData: container,
                                                                };
                                                            });
                                                        }}
                                                    >
                                                        <span className="material-icons text-base">
                                                            add
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-6 flex-col max-sm:flex-col items-center gap-6">
                                            <div className="w-full max-sm:w-full mb-6">
                                                <div className="w-full">
                                                    <p className="text-sm mb-1 font-rocGroteskMedium">
                                                        Dimensions (per unit)
                                                    </p>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="text"
                                                            placeholder="L"
                                                            className="border rounded-bl rounded-tl border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                            name="length"
                                                            pattern={"^\\d+(\\.\\d+)?\\d*$"}
                                                            title="must be valid digits"
                                                            value={
                                                                formData.nonContainerData[idx]
                                                                    .length
                                                            }
                                                            onChange={(event) =>
                                                                handleNonContainerItemChange(
                                                                    event,
                                                                    idx
                                                                )
                                                            }
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="W"
                                                            className="border border-gray-200 border-x-0 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                            name="width"
                                                            pattern={"^\\d+(\\.\\d+)?\\d*$"}
                                                            title="must be valid digits"
                                                            value={
                                                                formData.nonContainerData[idx].width
                                                            }
                                                            onChange={(event) =>
                                                                handleNonContainerItemChange(
                                                                    event,
                                                                    idx
                                                                )
                                                            }
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="H"
                                                            className="border border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                            name="height"
                                                            pattern={"^\\d+(\\.\\d+)?\\d*$"}
                                                            title="must be valid digits"
                                                            value={
                                                                formData.nonContainerData[idx]
                                                                    .height
                                                            }
                                                            onChange={(event) =>
                                                                handleNonContainerItemChange(
                                                                    event,
                                                                    idx
                                                                )
                                                            }
                                                        />
                                                        <Dropdown
                                                            value={
                                                                formData.nonContainerData[idx]
                                                                    .dimensionUnit
                                                            }
                                                            name="dimensionUnit"
                                                            handleChange={(name, value) =>
                                                                handleNonContainerItemChange(
                                                                    null,
                                                                    idx,
                                                                    name,
                                                                    value
                                                                )
                                                            }
                                                            className="rounded-br rounded-tr !h-[48px] border-l-0"
                                                            dropdownOptions={[
                                                                {
                                                                    label: "CM",
                                                                    value: "cm",
                                                                },
                                                                {
                                                                    label: "IN",
                                                                    value: "in",
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full max-sm:w-full">
                                                <div className="w-full">
                                                    <p className="text-sm mb-1 font-rocGroteskMedium">
                                                        Weight (per unit)
                                                    </p>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="text"
                                                            placeholder="1"
                                                            className="border rounded-tl rounded-bl border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                            name="weight"
                                                            required
                                                            pattern={"^\\d+(\\.\\d+)?\\d*$"}
                                                            title="must be valid digits"
                                                            value={
                                                                formData.nonContainerData[idx]
                                                                    .weight
                                                            }
                                                            onChange={(event) =>
                                                                handleNonContainerItemChange(
                                                                    event,
                                                                    idx
                                                                )
                                                            }
                                                        />
                                                        <Dropdown
                                                            value={
                                                                formData.nonContainerData[idx]
                                                                    .weightUnit
                                                            }
                                                            name="weightUnit"
                                                            handleChange={(name, value) =>
                                                                handleNonContainerItemChange(
                                                                    null,
                                                                    idx,
                                                                    name,
                                                                    value
                                                                )
                                                            }
                                                            className="rounded-br rounded-tr !h-[48px] border-l-0"
                                                            dropdownOptions={[
                                                                {
                                                                    label: "KG",
                                                                    value: "kg",
                                                                },
                                                                {
                                                                    label: "LB",
                                                                    value: "lb",
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p
                        onClick={() => {
                            return isContainer && mode !== "air"
                                ? addContainerAccordion()
                                : addNonContainerAccordion();
                        }}
                        className="text-sm w-fit font-rocGroteskMedium cursor-pointer flex items-center gap-2"
                    >
                        <span className="material-icons text-lg">add</span>
                        <span>Add another package</span>
                    </p>
                </div>
            </>
            {modalIsOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => setIsModalOpen(false)}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-4 font-rocGroteskBold text-gun-metal">
                                Delete Package
                            </p>
                            <p className="text-sm text-center font-rocGroteskMedium text-gun-metal">
                                Deleting this package will remove it from the shipment and cannot be
                                undone. Do you want to proceed with the deletion
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
                                onClick={() => setIsModalOpen(false)}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                className={`uppercase rounded-br-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border-y px-3`}
                                onClick={() => {
                                    if (isContainer && mode !== "air") {
                                        removeContainerAccordion(selectedAccordionId);
                                    } else {
                                        removeNonContainerAccordion(selectedAccordionId);
                                    }
                                    setIsModalOpen(false);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default ShipmentDetails;
