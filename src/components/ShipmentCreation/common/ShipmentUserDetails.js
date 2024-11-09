import LocationSearchInput from "components/common/AutocompleteInput";
import InputField from "components/common/InputField";
import SelectInput from "components/common/SelectInput";
import React from "react";
import ReactCountryFlag from "react-country-flag";
import countries from "variables/countries";

const ShipmentUserDetails = ({ handleCustomInputChange, formData, address, setAddress }) => {
    return (
        <div>
            <div className="mb-8">
                <h3 className="font-rocGroteskBold text-[22px] text-gun-metal mb-2">
                    Who is This Shipment for?
                </h3>
                <p className="text-gun-metal font-rocGroteskMedium text-sm">
                    Please provide more details customer details
                </p>
            </div>
            <div>
                <div className="mb-6">
                    <p className="text-sm mb-1 font-rocGroteskMedium">Full name</p>
                    <input
                        type="text"
                        value={formData?.fullName}
                        placeholder="Enter full name"
                        className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                        required
                        name="fullName"
                        onChange={(event) =>
                            handleCustomInputChange(event.target.name, event.target.value)
                        }
                    />
                </div>
                <div className="mb-6">
                    <p className="text-sm mb-1 font-rocGroteskMedium">Email Address</p>
                    <input
                        type="email"
                        value={formData?.email}
                        placeholder="Enter email address"
                        className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                        required
                        name="email"
                        title="Please input valid email address"
                        onChange={(event) =>
                            handleCustomInputChange(event.target.name, event.target.value)
                        }
                    />
                </div>
                <div className="mb-6">
                    <p className="text-sm mb-1 font-rocGroteskMedium">Address</p>
                    <LocationSearchInput
                        setData={setAddress}
                        savedAddress={
                            address?.shipperAddress ? address?.shipperAddress?.address : ""
                        }
                        placeholder="Enter address"
                        classNames={"!h-[48px]"}
                        name={"shipperAddress"}
                    />
                </div>
                <div className="mb-6 ">
                    <p className="text-sm mb-1 font-rocGroteskMedium">Phone number</p>
                    <div className="flex items-center">
                        <div className="w-[30%]">
                            <SelectInput
                                value={formData?.region}
                                name="region"
                                placeholder={"Ext"}
                                handleChange={handleCustomInputChange}
                                isRequired={true}
                                className={"rounded-br-none rounded-tr-none bg-[#FAFBFC] !h-[48px]"}
                                dropdownOptions={countries
                                    .filter((data) => Boolean(data?.codes[0]))
                                    .sort((p1, p2) =>
                                        p1.codes[0] > p2.codes[0]
                                            ? 1
                                            : p1.codes[0] < p2.codes[0]
                                            ? -1
                                            : 0
                                    )
                                    .map((item) => ({
                                        label: item.codes[0].replace(" ", ""),
                                        value: item.codes[0].replace(" ", ""),
                                        icon: <ReactCountryFlag countryCode={item?.abbreviation} />,
                                    }))}
                            />
                        </div>

                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            className="border border-l-0 border-gray-200 rounded-br rounded-tr py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                            required
                            pattern={"^[0-9]+$"}
                            value={formData?.phoneNo}
                            title="must be digits"
                            name="phoneNo"
                            onChange={(event) =>
                                handleCustomInputChange(event.target.name, event.target.value)
                            }
                        />
                    </div>
                </div>
                <div className="w-full mb-6">
                    <InputField
                        value={formData?.reference}
                        name="reference"
                        label="Custom Reference"
                        onChange={(event) => {
                            handleCustomInputChange(event.target.name, event.target.value);
                        }}
                    />
                </div>
                <div className="w-full mb-6">
                    <p className="text-sm mb-1 font-rocGroteskMedium">Service mode</p>
                    <div className="flex relative">
                        <button
                            type="button"
                            className={`border hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                formData?.serviceMode === "air"
                                    ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                    : "text-mvx-neutral bg-white"
                            }  w-full rounded-r-none px-4 py-3 flex h-[50px] items-center justify-center`}
                            onClick={() => handleCustomInputChange("serviceMode", "air")}
                        >
                            <p className="text-sm font-rocGroteskMedium whitespace-nowrap flex items-center gap-2">
                                <span className={`material-icons text-xl text-inherit`}>
                                    flight_takeoff
                                </span>{" "}
                                <span>Air</span>
                            </p>
                        </button>
                        <button
                            type="button"
                            className={`border border-x-0 hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                formData?.serviceMode === "ocean"
                                    ? "text-mvx-black bg-mvx-light-blue !border-[1.5px] border-mvx-black"
                                    : "text-mvx-neutral bg-white"
                            }  w-full rounded-r-none rounded-l-none px-4 py-3 flex h-[50px] items-center justify-center`}
                            onClick={() => handleCustomInputChange("serviceMode", "ocean")}
                        >
                            <p className="text-sm font-rocGroteskMedium whitespace-nowrap flex items-center gap-2">
                                <span className={`material-icons text-xl text-inherit`}>
                                    directions_boat
                                </span>{" "}
                                <span>Sea</span>
                            </p>
                        </button>
                        <button
                            type="button"
                            className={`border hover:border-mvx-black hover:border-[1.5px] hover:bg-mvx-light-blue hover:text-mvx-black ${
                                formData?.serviceMode === "land"
                                    ? "text-mvx-black bg-mvx-light-blue border-[1.5px] border-mvx-black"
                                    : "text-mvx-neutral bg-white"
                            }  w-full rounded-l-none px-4 py-3 flex h-[50px] items-center justify-center`}
                            onClick={() => handleCustomInputChange("serviceMode", "land")}
                        >
                            <p className="text-sm font-rocGroteskMedium whitespace-nowrap flex items-center gap-2">
                                <span className={`material-icons text-xl text-inherit`}>
                                    local_shipping
                                </span>{" "}
                                <span>Land</span>
                            </p>
                        </button>
                        <input
                            required
                            value={formData?.serviceMode}
                            className="absolute z-[-10] "
                            // onChange={() => console.log("sample")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentUserDetails;
