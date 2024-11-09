import React from "react";

const MovementType = ({ setActiveStep, movementType, setMovementType, editMode }) => {
    return (
        <div className="w-full">
            {!editMode && <p className="text-[22px] font-rocGroteskBold mb-6">Movement type</p>}
            <div>
                <div className="w-full mb-8 flex flex-col gap-4 relative">
                    <input
                        name="movementType"
                        defaultValue={movementType}
                        required
                        className="opacity-0 absolute"
                    />
                    <div
                        onClick={() => setMovementType("door-to-door")}
                        className={`w-full p-4 rounded border-[1.5px] hover:border-gun-metal cursor-pointer ${
                            movementType === "door-to-door" && "border-gun-metal"
                        } flex gap-1 justify-between`}
                    >
                        <div>
                            <p className="text-[15px] font-rocGroteskMedium mb-1">
                                Door-to-Door Shipping
                            </p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Goods are transported from the sender's location to the recipient's
                                location.
                            </p>
                        </div>
                        <div>
                            {movementType === "door-to-door" ? (
                                <i className="ri-radio-button-fill text-xl"></i>
                            ) : (
                                <i className="ri-checkbox-blank-circle-line text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                            )}
                        </div>
                    </div>
                    <div
                        onClick={() => setMovementType("door-to-port")}
                        className={`w-full p-4 rounded border-[1.5px] hover:border-gun-metal cursor-pointer ${
                            movementType === "door-to-port" && "border-gun-metal"
                        } flex gap-1 justify-between`}
                    >
                        <div>
                            <p className="text-[15px] font-rocGroteskMedium mb-1">
                                Door-to-Port Shipping
                            </p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Goods are transported from the sender's location to a specified
                                port.
                            </p>
                        </div>
                        <div>
                            {movementType === "door-to-port" ? (
                                <i className="ri-radio-button-fill text-xl"></i>
                            ) : (
                                <i className="ri-checkbox-blank-circle-line text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                            )}
                        </div>
                    </div>
                    <div
                        onClick={() => setMovementType("port-to-port")}
                        className={`w-full p-4 rounded border-[1.5px] hover:border-gun-metal cursor-pointer ${
                            movementType === "port-to-port" && "border-gun-metal"
                        } flex gap-1 justify-between`}
                    >
                        <div>
                            <p className="text-[15px] font-rocGroteskMedium mb-1">
                                Port-to-Port Shipping
                            </p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Goods are transported between two specified ports
                            </p>
                        </div>
                        <div>
                            {movementType === "port-to-port" ? (
                                <i className="ri-radio-button-fill text-xl"></i>
                            ) : (
                                <i className="ri-checkbox-blank-circle-line text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                            )}
                        </div>
                    </div>
                    <div
                        onClick={() => setMovementType("port-to-door")}
                        className={`w-full p-4 rounded border-[1.5px] hover:border-gun-metal cursor-pointer ${
                            movementType === "port-to-door" && "border-gun-metal"
                        } flex gap-1 justify-between`}
                    >
                        <div>
                            <p className="text-[15px] font-rocGroteskMedium mb-1">
                                Port-to-Door Shipping
                            </p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Goods are transported from the sender's location to the recipient's
                                location.
                            </p>
                        </div>
                        <div>
                            {movementType === "port-to-door" ? (
                                <i className="ri-radio-button-fill text-xl"></i>
                            ) : (
                                <i className="ri-checkbox-blank-circle-line text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"></i>
                            )}
                        </div>
                    </div>
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

export default MovementType;
