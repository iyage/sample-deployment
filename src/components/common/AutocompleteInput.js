/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const LocationSearchInput = ({
    bg,
    border,
    name,
    setData,
    savedAddress,
    placeholder,
    classNames,
    dropdownClassName,
    resetLocation,
}) => {
    const [address, setAddress] = useState("");

    const handleChange = (address) => {
        setAddress(address);
        if (address === "") {
            setData((prev) => ({
                ...prev,
                [name]: {},
            }));
        }
    };

    const handleSelect = (address) => {
        setAddress(address);
        geocodeByAddress(address)
            .then((results) => {
                setData((data) => ({
                    ...data,
                    [name]: { address, details: results },
                }));

                return getLatLng(results[0]);
            })
            .then((latLng) => {
                setData((data) => ({
                    ...data,
                    [name]: { ...data[name], ...latLng },
                }));
            })
            .catch((error) => console.error("Error", error));
    };

    useEffect(() => {
        if (savedAddress) {
            setAddress(savedAddress);
            handleSelect(savedAddress);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedAddress]);

    useEffect(() => {
        if (resetLocation) {
            setAddress("");
        }
    }, [resetLocation]);

    return (
        <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="w-full relative">
                    <input
                        {...getInputProps({
                            placeholder: placeholder,
                            className: "location-search-input ",
                        })}
                        required
                        className={`border border-gray-200 py-3 px-4 rounded outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral ${classNames}`}
                    />
                    {(loading || suggestions?.length > 0) && (
                        <div
                            className={`absolute top-full z-[200] border bg-white w-full min-h-[170px] text-[13px] ${dropdownClassName}`}
                        >
                            {loading && (
                                <div className="text-center h-[150px] flex items-center justify-center">
                                    Loading...
                                </div>
                            )}
                            {!loading &&
                                suggestions?.map((suggestion, index) => {
                                    const className = suggestion.active
                                        ? "suggestion-item--active"
                                        : "suggestion-item";
                                    const style = suggestion.active
                                        ? {
                                              backgroundColor: "#fafafa",
                                              cursor: "pointer",
                                          }
                                        : {
                                              backgroundColor: "#ffffff",
                                              cursor: "pointer",
                                          };
                                    return (
                                        <div
                                            key={index}
                                            {...getSuggestionItemProps(suggestion, {
                                                className: `${className} font-rocGroteskMedium p-2`,
                                                style,
                                            })}
                                        >
                                            <span>{suggestion.description}</span>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            )}
        </PlacesAutocomplete>
    );
};

export default LocationSearchInput;
