import ProductInput from "components/common/ProductInput";
import SelectInput from "components/common/SelectInput";
import React from "react";

const CargoDetails = ({ setActiveStep, cargDetails, setCargDetails, editMode }) => {
    return (
        <div className="w-full">
            {!editMode && <p className="text-[22px] font-rocGroteskBold mb-6">Cargo details</p>}
            <div>
                <div className="w-full mb-4">
                    <p className="text-sm mb-1 font-rocGroteskMedium">Product</p>
                    <ProductInput
                        productValue={cargDetails?.product}
                        handleSelection={(name, code) => {
                            setCargDetails((prev) => {
                                return {
                                    ...prev,
                                    product: name,
                                    productCode: code,
                                };
                            });
                        }}
                        required={true}
                    />
                </div>
                <div className="w-full mb-4">
                    <SelectInput
                        value={cargDetails?.serviceType}
                        name="serviceType"
                        placeholder={"Service type"}
                        handleChange={(name, value) => {
                            setCargDetails((prev) => ({ ...prev, serviceType: value }));
                        }}
                        label="Service type"
                        isRequired={true}
                        dropdownOptions={[
                            {
                                label: "Export",
                                value: "export",
                            },
                            {
                                label: "Import",
                                value: "import",
                            },
                        ]}
                    />
                </div>
                <div className="w-full mb-8">
                    <SelectInput
                        value={cargDetails?.movementMode}
                        name="movementMode"
                        placeholder={"Mode of movement"}
                        handleChange={(name, value) => {
                            setCargDetails((prev) => ({ ...prev, movementMode: value }));
                        }}
                        label="Mode of movement"
                        isRequired={true}
                        dropdownOptions={[
                            {
                                label: "Air Frieght",
                                value: "air",
                            },
                            {
                                label: "Land Frieght",
                                value: "land",
                            },
                            {
                                label: "Ocean Frieght",
                                value: "ocean",
                            },
                        ]}
                    />
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

export default CargoDetails;
