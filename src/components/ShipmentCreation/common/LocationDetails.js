import LocationSearchInput from "components/common/AutocompleteInput";
import SelectInput from "components/common/SelectInput";
import React from "react";
import countries from "variables/countries";
import { incoterms } from "variables/incoterms";

const LocationDetails = ({ handleInputChange, formData, address, setAddress, mode }) => {
    return (
        <div>
            <div className="mb-8">
                <h3 className="font-rocGroteskBold text-[22px] text-gun-metal mb-2">
                    Origin and Destination Details
                </h3>
                <p className="text-gun-metal font-rocGroteskMedium text-sm">
                    Enter pick-up and drop-off details
                </p>
            </div>
            <div>
                <div className="mb-6">
                    <SelectInput
                        value={formData.serviceType}
                        name="serviceType"
                        placeholder={"Select type"}
                        handleChange={handleInputChange}
                        label="Service type"
                        isRequired={true}
                        className="!h-[48px]"
                        dropdownOptions={[
                            {
                                label: "Import",
                                value: "import",
                            },
                            {
                                label: "Export",
                                value: "export",
                            },
                        ]}
                    />
                </div>
                <div className="mb-6">
                    <p className="text-sm mb-1 font-rocGroteskMedium">Pick-up address</p>
                    <LocationSearchInput
                        setData={setAddress}
                        savedAddress={address?.pickupAddress ? address?.pickupAddress?.address : ""}
                        placeholder="Enter pickup address"
                        classNames={"!h-[48px]"}
                        name={"pickupAddress"}
                    />
                </div>
                <div className="mb-6">
                    <SelectInput
                        value={formData.countryOfSupply}
                        name="countryOfSupply"
                        placeholder={"Enter shipment origin"}
                        handleChange={handleInputChange}
                        label="Country of supply"
                        isRequired={true}
                        className="!h-[48px]"
                        dropdownOptions={countries.map((item) => ({
                            label: item.name,
                            value: item.abbreviation,
                        }))}
                    />
                </div>
                <div className="mb-6">
                    <p className="text-sm mb-1 font-rocGroteskMedium">Port of loading</p>
                    <LocationSearchInput
                        setData={setAddress}
                        savedAddress={address?.portOfLoading ? address?.portOfLoading?.address : ""}
                        placeholder="Enter port of loading"
                        classNames={"!h-[48px]"}
                        name={"portOfLoading"}
                    />
                </div>
                <div className="mb-6">
                    <p className="text-sm mb-1 font-rocGroteskMedium">Delivery address</p>
                    <LocationSearchInput
                        setData={setAddress}
                        savedAddress={
                            address?.destinationAddress ? address?.destinationAddress?.address : ""
                        }
                        placeholder="Enter shipment destination"
                        classNames={"!h-[48px]"}
                        name={"destinationAddress"}
                    />
                </div>
                {mode !== "air" && (
                    <div className="mb-6">
                        <SelectInput
                            value={formData.loadType}
                            name="loadType"
                            placeholder={"Select load type"}
                            handleChange={handleInputChange}
                            label="Load type"
                            className={"!h-[48px]"}
                            isRequired={true}
                            dropdownOptions={[
                                {
                                    label: "Full Container Load (FCL)",
                                    value: "Full Container Load (FCL)",
                                },
                                {
                                    label: "Low Container Load (LCL)",
                                    value: "Low Container Load (LCL)",
                                },
                            ]}
                        />
                    </div>
                )}

                <div className="mb-6">
                    <SelectInput
                        value={formData.incoterms}
                        name="incoterms"
                        placeholder={"Select incoterms type"}
                        handleChange={handleInputChange}
                        label="Incoterms type"
                        className={"!h-[48px]"}
                        isRequired={true}
                        dropdownOptions={incoterms.map((item) => ({
                            label: item.label,
                            value: item.value,
                        }))}
                    />
                </div>
            </div>
        </div>
    );
};

export default LocationDetails;
