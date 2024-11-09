import React from "react";

const LoadType = ({ setActiveStep, loadType, setLoadType, editMode }) => {
    return (
        <div className="w-full">
            {!editMode && <p className="text-[22px] font-rocGroteskBold mb-6">Load Type</p>}
            <div>
                <div className="w-full mb-8 flex flex-col gap-2 relative">
                    <input
                        name="loadType"
                        value={loadType?.type}
                        required
                        className="opacity-0 absolute"
                    />
                    <input
                        name="contentType"
                        value={loadType?.content?.type}
                        required
                        className="opacity-0 absolute"
                    />
                    <input
                        name="measurement"
                        value={loadType?.content?.measurement}
                        required
                        className="opacity-0 absolute"
                    />
                    <div className={`w-full p-4 flex gap-1 justify-between`}>
                        <div>
                            <p className="text-[15px] font-rocGroteskMedium mb-1">Container</p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Select the container size for your rate
                            </p>
                        </div>
                        <div
                            className="w-fit h-[22px]"
                            onClick={() =>
                                setLoadType((prev) => ({
                                    type: "container",
                                    content: {
                                        type:
                                            prev?.content?.type !== "20" ||
                                            prev?.content?.type !== "40"
                                                ? ""
                                                : prev?.content?.type,
                                        measurement:
                                            prev?.content?.measurement !== "20" ||
                                            prev?.content?.measurement !== "40"
                                                ? ""
                                                : prev?.content?.measurement,
                                    },
                                }))
                            }
                        >
                            {loadType?.type === "container" ? (
                                <i className="ri-radio-button-fill text-xl cursor-pointer"></i>
                            ) : (
                                <i className="ri-checkbox-blank-circle-line cursor-pointer text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                            )}
                        </div>
                    </div>
                    <hr />
                    {loadType?.type === "container" && (
                        <div className="mb-8">
                            <div className="w-full flex flex-col gap-2">
                                <div className={`w-full p-4 flex gap-1 justify-between`}>
                                    <div>
                                        <p className="text-[15px] font-rocGroteskMedium">
                                            20ft Container
                                        </p>
                                    </div>
                                    <div
                                        className="w-fit h-[22px]"
                                        onClick={() => {
                                            setLoadType((prev) => ({
                                                type: "container",
                                                content: {
                                                    type: "20",
                                                    measurement: "20",
                                                },
                                            }));
                                        }}
                                    >
                                        {loadType?.type === "container" &&
                                        loadType?.content?.type === "20" ? (
                                            <i className="ri-radio-button-fill text-xl cursor-pointer"></i>
                                        ) : (
                                            <i className="ri-checkbox-blank-circle-line cursor-pointer text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                                        )}
                                    </div>
                                </div>
                                <hr />
                                <div className={`w-full p-4 flex gap-1 justify-between`}>
                                    <div>
                                        <p className="text-[15px] font-rocGroteskMedium mb-1">
                                            40ft Container
                                        </p>
                                    </div>
                                    <div
                                        className="w-fit h-[22px]"
                                        onClick={() => {
                                            setLoadType((prev) => ({
                                                type: "container",
                                                content: {
                                                    type: "40",
                                                    measurement: "40",
                                                },
                                            }));
                                        }}
                                    >
                                        {loadType?.type === "container" &&
                                        loadType?.content?.type === "40" ? (
                                            <i className="ri-radio-button-fill text-xl cursor-pointer"></i>
                                        ) : (
                                            <i className="ri-checkbox-blank-circle-line cursor-pointer text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    )}

                    <div className={`w-full p-4 flex gap-1 justify-between`}>
                        <div>
                            <p className="text-[15px] font-rocGroteskMedium mb-1">Loose Cargo</p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Loose cargo transportation rates are charged per kilogram (KG) of
                                weight.
                            </p>
                        </div>
                        <div
                            className="w-fit h-[22px]"
                            onClick={() =>
                                setLoadType((prev) => ({
                                    type: "noncontainers",
                                    content: {
                                        type:
                                            prev?.content?.type === "20" ||
                                            prev?.content?.type === "40"
                                                ? ""
                                                : prev?.content?.type,
                                        measurement:
                                            prev?.content?.measurement === "20" ||
                                            prev?.content?.measurement === "40"
                                                ? ""
                                                : prev?.content?.measurement,
                                    },
                                }))
                            }
                        >
                            {loadType?.type === "noncontainers" ? (
                                <i className="ri-radio-button-fill text-xl cursor-pointer"></i>
                            ) : (
                                <i className="ri-checkbox-blank-circle-line cursor-pointer text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                            )}
                        </div>
                    </div>
                    {loadType?.type === "noncontainers" && (
                        <div className="mb-8">
                            <hr />
                            <div className="w-full flex flex-col gap-2 mt-2">
                                <div className=" p-4">
                                    <p className="text-sm font-rocGroteskBold">Package type</p>
                                </div>
                                <div className={`w-full p-4 flex gap-1 justify-between`}>
                                    <div>
                                        <p className="text-[15px] font-rocGroteskMedium">
                                            Crates/Boxes
                                        </p>
                                    </div>
                                    <div
                                        className="w-fit h-[22px]"
                                        onClick={() =>
                                            setLoadType((prev) => ({
                                                type: "noncontainers",
                                                content: {
                                                    ...prev?.content,
                                                    type: "Crates/Boxes",
                                                },
                                            }))
                                        }
                                    >
                                        {loadType?.type === "noncontainers" &&
                                        loadType?.content?.type === "Crates/Boxes" ? (
                                            <i className="ri-radio-button-fill text-xl cursor-pointer"></i>
                                        ) : (
                                            <i className="ri-checkbox-blank-circle-line cursor-pointer text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                                        )}
                                    </div>
                                </div>
                                <hr />
                                <div className={`w-full p-4 flex gap-1 justify-between`}>
                                    <div>
                                        <p className="text-[15px] font-rocGroteskMedium mb-1">
                                            Pallets
                                        </p>
                                    </div>
                                    <div
                                        className="w-fit h-[22px]"
                                        onClick={() =>
                                            setLoadType((prev) => ({
                                                type: "noncontainers",
                                                content: {
                                                    ...prev?.content,
                                                    type: "Pallets",
                                                },
                                            }))
                                        }
                                    >
                                        {loadType?.type === "noncontainers" &&
                                        loadType?.content?.type === "Pallets" ? (
                                            <i className="ri-radio-button-fill text-xl cursor-pointer"></i>
                                        ) : (
                                            <i className="ri-checkbox-blank-circle-line cursor-pointer text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="w-full flex flex-col gap-2 mt-2">
                                <div className="p-4">
                                    <p className="text-sm font-rocGroteskBold">
                                        Unit of measurements
                                    </p>
                                </div>
                                <div className={`w-full p-4 flex gap-1 justify-between`}>
                                    <div>
                                        <p className="text-[15px] font-rocGroteskMedium">
                                            Pound (lbs)
                                        </p>
                                    </div>
                                    <div
                                        className="w-fit h-[22px]"
                                        onClick={() =>
                                            setLoadType((prev) => ({
                                                type: "noncontainers",
                                                content: {
                                                    ...prev?.content,
                                                    measurement: "lbs",
                                                },
                                            }))
                                        }
                                    >
                                        {loadType?.type === "noncontainers" &&
                                        loadType?.content?.measurement === "lbs" ? (
                                            <i className="ri-radio-button-fill text-xl cursor-pointer"></i>
                                        ) : (
                                            <i className="ri-checkbox-blank-circle-line cursor-pointer text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                                        )}
                                    </div>
                                </div>
                                <hr />
                                <div className={`w-full p-4 flex gap-1 justify-between`}>
                                    <div>
                                        <p className="text-[15px] font-rocGroteskMedium mb-1">
                                            Kilogram (KG)
                                        </p>
                                    </div>
                                    <div
                                        className="w-fit h-[22px]"
                                        onClick={() =>
                                            setLoadType((prev) => ({
                                                type: "noncontainers",
                                                content: {
                                                    ...prev?.content,
                                                    measurement: "kg",
                                                },
                                            }))
                                        }
                                    >
                                        {loadType?.type === "noncontainers" &&
                                        loadType?.content?.measurement === "kg" ? (
                                            <i className="ri-radio-button-fill text-xl cursor-pointer"></i>
                                        ) : (
                                            <i className="ri-checkbox-blank-circle-line cursor-pointer text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
                            type={"submit"}
                            // onClick={() => setActiveStep((prev) => prev + 1)}
                        >
                            Continue
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoadType;
