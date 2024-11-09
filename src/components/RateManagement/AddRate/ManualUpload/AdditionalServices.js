import Loader from "components/common/Loader";
import React from "react";

const AdditionalServices = ({
    setActiveStep,
    additionalServices,
    setAdditionalServices,
    handleAddRate,
    loading,
    editMode,
}) => {
    const handleClick = (name) => {
        setAdditionalServices((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    return (
        <div className="w-full">
            {!editMode && (
                <p className="text-[22px] font-rocGroteskBold mb-6">Additonal services</p>
            )}
            <div>
                <div className="w-full mb-8 flex flex-col gap-2">
                    <div className={`w-full p-4 flex gap-1 justify-between`}>
                        <div>
                            <p className="text-[15px] font-rocGroteskMedium mb-1">
                                Customs clearance
                            </p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Do you need customs clearance?
                            </p>
                        </div>
                        <div>
                            {additionalServices?.customs ? (
                                <i
                                    onClick={() => handleClick("customs")}
                                    className="ri-radio-button-fill text-xl cursor-pointer"
                                ></i>
                            ) : (
                                <i
                                    onClick={() => handleClick("customs")}
                                    className="ri-checkbox-blank-circle-line cursor-pointer text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"
                                ></i>
                            )}
                        </div>
                    </div>
                    <hr />
                    <div className={`w-full p-4 flex gap-1 justify-between`}>
                        <div>
                            <p className="text-[15px] font-rocGroteskMedium mb-1">Insurance</p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Do you need Insurance?
                            </p>
                        </div>
                        <div>
                            {additionalServices?.insurance ? (
                                <i
                                    onClick={() => handleClick("insurance")}
                                    className="ri-radio-button-fill text-xl cursor-pointer"
                                ></i>
                            ) : (
                                <i
                                    onClick={() => handleClick("insurance")}
                                    className="ri-checkbox-blank-circle-line cursor-pointer text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"
                                ></i>
                            )}
                        </div>
                    </div>
                    <hr />
                    <div className={`w-full p-4 flex gap-1 justify-between`}>
                        <div>
                            <p className="text-[15px] font-rocGroteskMedium mb-1">
                                Inspection service
                            </p>
                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                Do you need Inspection service?
                            </p>
                        </div>
                        <div>
                            {additionalServices?.inspection ? (
                                <i
                                    onClick={() => handleClick("inspection")}
                                    className="ri-radio-button-fill text-xl cursor-pointer"
                                ></i>
                            ) : (
                                <i
                                    onClick={() => handleClick("inspection")}
                                    className="ri-checkbox-blank-circle-line cursor-pointer text-xl before:content-['\eb7d'] before:text-[#DFE1E6]"
                                ></i>
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
                            type={"button"}
                            onClick={handleAddRate}
                        >
                            {loading ? <Loader size={4} color={"white"} /> : "Finish"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdditionalServices;
