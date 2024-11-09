import PortInput from "components/common/PortInput";
import React from "react";

const RouteDetail = ({ address, setAddress, setActiveSection, editMode, setCountry }) => {
    const handleOriginPortSelection = (name, code) => {
        setAddress((prev) => {
            return {
                ...prev,
                originName: name,
                originCode: code,
            };
        });
    };

    const handleDestinatinPortSelection = (name, code) => {
        setAddress((prev) => {
            return {
                ...prev,
                destinationName: name,
                destinationCode: code,
            };
        });
    };

    const handleSelectOriginCountry = (data) => {
        setCountry?.((prev) => ({
            ...prev,
            origin: data?.country,
        }));
    };

    const handleSelectDestinationCountry = (data) => {
        setCountry?.((prev) => ({
            ...prev,
            destination: data?.country,
        }));
    };

    return (
        <div className="w-full">
            {!editMode && <p className="text-[22px] font-rocGroteskBold mb-6">Route details</p>}
            <div>
                <div className="w-full mb-4">
                    <p className="text-sm mb-1 font-rocGroteskMedium">Origin</p>
                    <PortInput
                        portValue={address?.originName}
                        handleSelection={handleOriginPortSelection}
                        handleSelectCountry={handleSelectOriginCountry}
                        required={true}
                    />
                </div>
                <div className="w-full mb-8">
                    <p className="text-sm mb-1 font-rocGroteskMedium">Destination</p>
                    <PortInput
                        portValue={address?.destinationName}
                        handleSelection={handleDestinatinPortSelection}
                        handleSelectCountry={handleSelectDestinationCountry}
                        required={true}
                    />
                </div>
                {!editMode && (
                    <div className="flex items-center justify-between">
                        <p
                            className="text-sm font-rocGroteskMedium cursor-pointer"
                            onClick={() => setActiveSection(0)}
                        >
                            Back
                        </p>

                        <button
                            className="flex items-center justify-center text-white bg-pacific-cyan font-rocGroteskMedium w-fit py-3 px-6 text-sm rounded"
                            type={"submit"}
                        >
                            Continue
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteDetail;
