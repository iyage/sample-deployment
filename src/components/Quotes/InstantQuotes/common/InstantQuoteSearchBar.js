import { rateActions } from "actions";
import CustomCalendar from "components/common/CalendarComp.js/Calendar";
// import SelectInput from "components/common/SelectInput";
import { debounce, truncate } from "lodash";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const InstantQuoteSearchBar = ({
    customSearchData,
    setCustomSearchData,
    showDoubleView,
    value,
    onSetDate,
    onSearch,
}) => {
    const [customSearchProp, setCustomSearchProp] = useState({
        isPortOfOriginOpen: false,
        isPortOfDestinationOpen: false,
        isLoadTypeOpen: false,
        isDateOpen: false,
    });

    const [port, setPort] = useState({
        origin: "",
        destination: "",
    });

    const [searchPort, setSearchPort] = useState({
        origin: "",
        destination: "",
    });

    const [loadType, setLoadType] = useState({
        "20ftCargoHover": false,
        "40ftCargoHover": false,
        looseCargoHover: false,
    });

    const [loadTypeClick, setLoadTypeClick] = useState({
        "20ftCargo": false,
        "40ftCargo": false,
        looseCargo: false,
    });
    const { getPortsLoading, getPortsSuccess } = useSelector((state) => state.rate);

    const ref = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                ref.current &&
                !ref.current.contains(event.target) &&
                (customSearchProp.isDateOpen ||
                    customSearchProp.isLoadTypeOpen ||
                    customSearchProp.isPortOfDestinationOpen ||
                    customSearchProp.isPortOfOriginOpen)
            ) {
                setCustomSearchProp({
                    isPortOfOriginOpen: false,
                    isPortOfDestinationOpen: false,
                    isLoadTypeOpen: false,
                    isDateOpen: false,
                });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [
        ref,
        customSearchProp.isDateOpen,
        customSearchProp.isLoadTypeOpen,
        customSearchProp.isPortOfDestinationOpen,
        customSearchProp.isPortOfOriginOpen,
    ]);

    useEffect(() => {
        if (Boolean(port.origin)) {
            dispatch(rateActions.fetchPorts(port.origin));
        } else if (Boolean(port.destination)) {
            dispatch(rateActions.fetchPorts(port.destination));
        } else {
            dispatch(rateActions.fetchPorts("united"));
        }
    }, [dispatch, port.destination, port.origin]);

    return (
        <div className="w-full">
            <div
                ref={ref}
                className={`relative ${
                    customSearchProp.isPortOfOriginOpen ||
                    customSearchProp.isPortOfDestinationOpen ||
                    customSearchProp.isLoadTypeOpen ||
                    customSearchProp.isDateOpen
                        ? "bg-mvx-light-blue"
                        : "bg-white"
                } w-full h-[66px] transition-all border shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)] rounded-[40px] grid grid-cols-[1fr_1fr_0.7fr_0.8fr] items-center`}
            >
                <div
                    onClick={() => {
                        setCustomSearchProp(() => {
                            return {
                                isPortOfOriginOpen: true,
                                isPortOfDestinationOpen: false,
                                isLoadTypeOpen: false,
                                isDateOpen: false,
                            };
                        });
                        document.getElementById("portOfOrigin").focus();
                    }}
                    className={`relative pl-8 pr-4 border-r ${
                        customSearchProp.isPortOfOriginOpen
                            ? "bg-white rounded-[40px] scale-105 h-full shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_4px_32px_rgba(0,0,0,0.06)]"
                            : "hover:bg-[#EBECF0] hover:rounded-[40px] hover:h-full "
                    }  cursor-pointer flex items-center`}
                >
                    <div className="flex justify-between items-center w-full">
                        <div className="w-[80%]">
                            <p className="text-xs font-rocGroteskMedium mb-[1px]">Port of Origin</p>
                            <input
                                value={truncate(
                                    searchPort.origin || customSearchData.originPortName,
                                    {
                                        length: 34,
                                    }
                                )}
                                type="text"
                                className="border-0 bg-transparent cursor-pointer rounded focus:!border-0 outline-0 w-full h-[20px] text-sm font-rocGroteskMedium placeholder:text-mvx-neutral placeholder:font-rocGroteskMedium"
                                placeholder="Enter origin"
                                name="portOfOrigin"
                                required
                                id="portOfOrigin"
                                onInput={debounce((evt) => {
                                    setPort((prev) => ({ ...prev, origin: evt.target.value }));
                                }, 800)}
                                onChange={(e) =>
                                    setSearchPort((prev) => ({ ...prev, origin: e.target.value }))
                                }
                            />
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setCustomSearchProp((prev) => {
                                    return {
                                        ...prev,
                                        isPortOfOriginOpen: false,
                                    };
                                });
                            }}
                            className={`${
                                customSearchProp.isPortOfOriginOpen ? "flex" : "hidden"
                            } w-6 h-6 rounded-full justify-center items-center bg-mvx-light-blue cursor-pointer`}
                        >
                            <i className="ri-close-fill"></i>
                        </div>
                    </div>
                    {customSearchProp.isPortOfOriginOpen && (
                        <div className="absolute z-10 top-[75px] overflow-hidden left-[-3px] w-[567px] bg-white rounded-2xl shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_4px_32px_rgba(0,0,0,0.06)]">
                            <div className="px-6 pt-6">
                                <p className="text-sm font-rocGroteskBold mb-4">Ports</p>
                            </div>
                            <div className="pb-3 w-full max-h-[275px] overflow-y-auto">
                                {getPortsLoading ? (
                                    <p className="text-sm text-center pl-6 font-rocGroteskMedium">
                                        Loading ports...
                                    </p>
                                ) : getPortsSuccess?.ports && getPortsSuccess?.ports?.length > 0 ? (
                                    getPortsSuccess?.ports?.map((value) => {
                                        return (
                                            <div
                                                key={value?._id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCustomSearchProp({
                                                        isPortOfOriginOpen: false,
                                                        isPortOfDestinationOpen: false,
                                                        isLoadTypeOpen: false,
                                                        isDateOpen: false,
                                                    });
                                                    setCustomSearchData((prev) => ({
                                                        ...prev,
                                                        portOfOrigin: value.portCode,
                                                        originPortName: value.portName,
                                                    }));
                                                    setSearchPort((prev) => ({
                                                        ...prev,
                                                        origin: value.portName,
                                                    }));
                                                    setPort({
                                                        origin: "",
                                                        destination: "",
                                                    });
                                                }}
                                                className="flex items-center gap-6 hover:bg-mvx-light-blue py-3 px-6 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4 w-[48%]">
                                                    <div className="w-9 h-9 rounded-full bg-[#EBECF0] flex items-center justify-center px-4">
                                                        <i className="ri-map-pin-2-fill"></i>
                                                    </div>
                                                    <div className="">
                                                        <p className="text-sm text-mvx-neutral mb-[2px]">
                                                            {value.portName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <i className="ri-arrow-right-line"></i>
                                                </div>
                                                <div className=" w-[45%]">
                                                    <p className="text-sm text-mvx-neutral mb-[2px]">
                                                        {value.country_long}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-center pl-6 font-rocGroteskMedium">
                                        Loading ports...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div
                    onClick={() => {
                        setCustomSearchProp(() => {
                            return {
                                isPortOfOriginOpen: false,
                                isPortOfDestinationOpen: true,
                                isLoadTypeOpen: false,
                                isDateOpen: false,
                            };
                        });
                        document.getElementById("portOfDestination").focus();
                    }}
                    className={`relative pl-6 pr-4 border-r ${
                        customSearchProp.isPortOfDestinationOpen
                            ? "bg-white rounded-[40px] scale-105 h-full shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_4px_32px_rgba(0,0,0,0.06)]"
                            : "hover:bg-[#EBECF0] hover:rounded-[40px] hover:h-full "
                    } cursor-pointer flex items-center`}
                >
                    <div className="flex justify-between items-center w-full">
                        <div className="w-[80%]">
                            <p className="text-xs font-rocGroteskMedium mb-[1px]">
                                Port of Destination
                            </p>
                            <input
                                value={truncate(
                                    searchPort.destination || customSearchData.destinationPortName,
                                    {
                                        length: 34,
                                    }
                                )}
                                type="text"
                                className="border-0 bg-transparent cursor-pointer rounded focus:!border-0 outline-0 w-full h-[20px] text-sm font-rocGroteskMedium placeholder:text-mvx-neutral placeholder:font-rocGroteskMedium"
                                placeholder="Enter destination"
                                name="portOfDestination"
                                id="portOfDestination"
                                required
                                onInput={debounce((evt) => {
                                    setPort((prev) => ({ ...prev, destination: evt.target.value }));
                                }, 800)}
                                onChange={(e) =>
                                    setSearchPort((prev) => ({
                                        ...prev,
                                        destination: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setCustomSearchProp((prev) => {
                                    return {
                                        ...prev,
                                        isPortOfDestinationOpen: false,
                                    };
                                });
                            }}
                            className={`${
                                customSearchProp.isPortOfDestinationOpen ? "flex" : "hidden"
                            } w-6 h-6 rounded-full justify-center items-center bg-mvx-light-blue cursor-pointer`}
                        >
                            <i className="ri-close-fill"></i>
                        </div>
                    </div>

                    {customSearchProp.isPortOfDestinationOpen && (
                        <div className="absolute z-10 top-[75px] overflow-hidden left-[-3px] w-[567px] bg-white rounded-2xl shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_4px_32px_rgba(0,0,0,0.06)]">
                            <div className="px-6 pt-6">
                                <p className="text-sm font-rocGroteskBold mb-4">Ports</p>
                            </div>
                            <div className="pb-3 w-full max-h-[275px] overflow-y-auto">
                                {getPortsLoading ? (
                                    <p className="text-sm text-center pl-6 font-rocGroteskMedium">
                                        Loading ports...
                                    </p>
                                ) : getPortsSuccess?.ports && getPortsSuccess?.ports?.length > 0 ? (
                                    getPortsSuccess?.ports?.map((value) => {
                                        return (
                                            <div
                                                key={value?._id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCustomSearchProp({
                                                        isPortOfOriginOpen: false,
                                                        isPortOfDestinationOpen: false,
                                                        isLoadTypeOpen: false,
                                                        isDateOpen: false,
                                                    });
                                                    setCustomSearchData((prev) => ({
                                                        ...prev,
                                                        portOfDestination: value.portCode,
                                                        destinationPortName: value.portName,
                                                    }));
                                                    setSearchPort((prev) => ({
                                                        ...prev,
                                                        destination: value.portName,
                                                    }));
                                                    setPort({
                                                        origin: "",
                                                        destination: "",
                                                    });
                                                }}
                                                className="flex items-center gap-6 hover:bg-mvx-light-blue py-3 px-6 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4 w-[48%]">
                                                    <div className="w-9 h-9 rounded-full bg-[#EBECF0] flex items-center justify-center px-4">
                                                        <i className="ri-map-pin-2-fill"></i>
                                                    </div>
                                                    <div className="">
                                                        <p className="text-sm text-mvx-neutral mb-[2px]">
                                                            {value.portName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <i className="ri-arrow-right-line"></i>
                                                </div>
                                                <div className=" w-[45%]">
                                                    <p className="text-sm text-mvx-neutral mb-[2px]">
                                                        {value.country_long}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-center pl-6 font-rocGroteskMedium">
                                        Loading ports...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div
                    onClick={() => {
                        setCustomSearchProp(() => {
                            return {
                                isPortOfOriginOpen: false,
                                isPortOfDestinationOpen: false,
                                isLoadTypeOpen: true,
                                isDateOpen: false,
                            };
                        });
                    }}
                    className={`relative pl-6 pr-4 border-r  ${
                        customSearchProp.isLoadTypeOpen
                            ? "bg-white rounded-[40px] scale-105 h-full shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_4px_32px_rgba(0,0,0,0.06)]"
                            : "hover:bg-[#EBECF0] hover:rounded-[40px] hover:h-full"
                    } cursor-pointer flex items-center`}
                >
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <p className="text-xs font-rocGroteskMedium mb-[1px]">Load Type</p>
                            <p className="text-sm text-mvx-neutral font-rocGroteskMedium">
                                {customSearchData.loadType.type
                                    ? customSearchData.loadType.type
                                    : "Select load type"}
                            </p>
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setCustomSearchProp((prev) => {
                                    return {
                                        ...prev,
                                        isLoadTypeOpen: false,
                                    };
                                });
                            }}
                            className={`${
                                customSearchProp.isLoadTypeOpen ? "flex" : "hidden"
                            } w-6 h-6 rounded-full justify-center items-center bg-mvx-light-blue cursor-pointer`}
                        >
                            <i className="ri-close-fill"></i>
                        </div>
                    </div>

                    {customSearchProp.isLoadTypeOpen && (
                        <div className="absolute top-[75px] left-[-3px] w-[447px] bg-white rounded-2xl shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_4px_32px_rgba(0,0,0,0.06)]">
                            <div>
                                <div className="px-6 pt-6">
                                    <p className="text-sm font-rocGroteskBold mb-4">Load type</p>
                                </div>
                                <div className="pb-3 px-6 flex gap-2.5">
                                    <div
                                        onMouseEnter={() => {
                                            setLoadType((prev) => ({
                                                ...prev,
                                                "20ftCargoHover": true,
                                            }));
                                        }}
                                        onMouseLeave={() => {
                                            setLoadType((prev) => ({
                                                ...prev,
                                                "20ftCargoHover": false,
                                            }));
                                        }}
                                        onClick={() => {
                                            setLoadTypeClick({
                                                "20ftCargo": true,
                                                "40ftCargo": false,
                                                looseCargo: false,
                                            });
                                            setCustomSearchData((prev) => ({
                                                ...prev,
                                                loadType: {
                                                    ...prev.loadType,
                                                    type: "20",
                                                },
                                            }));
                                        }}
                                        className={`flex items-center justify-center w-[126px] h-[120px] rounded-lg  hover:text-gun-metal hover:bg-mvx-light-blue hover:border-[2px] hover:border-gun-metal ${
                                            loadTypeClick["20ftCargo"]
                                                ? "text-gun-metal bg-mvx-light-blue border-[2px] border-gun-metal"
                                                : "text-mvx-neutral bg-white border-[1.5px]"
                                        } `}
                                    >
                                        <div className="items-center flex flex-col">
                                            <svg
                                                width="40"
                                                height="40"
                                                viewBox="0 0 40 40"
                                                fill={`${
                                                    loadType["20ftCargoHover"] ||
                                                    loadTypeClick["20ftCargo"]
                                                        ? "#142837"
                                                        : "#6B778C"
                                                }`}
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M38 9V7C38 6.45312 37.5468 6 37 6H3C2.45312 6 2 6.45312 2 7V9C2 9.54688 2.45312 10 3 10V30C2.45312 30 2 30.4532 2 31V33C2 33.5468 2.45312 34 3 34H37C37.5468 34 38 33.5468 38 33V31C38 30.4532 37.5468 30 37 30V10C37.5468 10 38 9.54688 38 9ZM9 30H7V10H9V30ZM15 30H13V10H15V30ZM21 30H19V10H21V30ZM27 30H25V10H27V30ZM33 30H31V10H33V30Z"
                                                    fill={`${
                                                        loadType["20ftCargoHover"] ||
                                                        loadTypeClick["20ftCargo"]
                                                            ? "#142837"
                                                            : "#6B778C"
                                                    }`}
                                                />
                                            </svg>

                                            <p
                                                className={`text-inherit text-sm font-rocGroteskMedium text-center`}
                                            >
                                                20FT
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        onMouseEnter={() => {
                                            setLoadType((prev) => ({
                                                ...prev,
                                                "40ftCargoHover": true,
                                            }));
                                        }}
                                        onMouseLeave={() => {
                                            setLoadType((prev) => ({
                                                ...prev,
                                                "40ftCargoHover": false,
                                            }));
                                        }}
                                        onClick={() => {
                                            setLoadTypeClick({
                                                "20ftCargo": false,
                                                "40ftCargo": true,
                                                looseCargo: false,
                                            });
                                            setCustomSearchData((prev) => ({
                                                ...prev,
                                                loadType: {
                                                    ...prev.loadType,
                                                    type: "40",
                                                },
                                            }));
                                        }}
                                        className={`flex items-center justify-center w-[126px] h-[120px] rounded-lg  hover:text-gun-metal hover:bg-mvx-light-blue hover:border-[2px] hover:border-gun-metal ${
                                            loadTypeClick["40ftCargo"]
                                                ? "text-gun-metal bg-mvx-light-blue border-[2px] border-gun-metal"
                                                : "text-mvx-neutral bg-white border-[1.5px]"
                                        } `}
                                    >
                                        <div
                                            className={`text-inherit items-center flex flex-col text-sm font-rocGroteskMedium `}
                                        >
                                            <svg
                                                width="74"
                                                height="42"
                                                viewBox="0 0 74 42"
                                                fill={`${
                                                    loadType["40ftCargoHover"] ||
                                                    loadTypeClick["40ftCargo"]
                                                        ? "#142837"
                                                        : "none"
                                                }`}
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M43 10V8C43 7.45312 42.5468 7 42 7H8C7.45312 7 7 7.45312 7 8V10C7 10.5469 7.45312 11 8 11V31C7.45312 31 7 31.4532 7 32V34C7 34.5468 7.45312 35 8 35H42C42.5468 35 43 34.5468 43 34V32C43 31.4532 42.5468 31 42 31V11C42.5468 11 43 10.5469 43 10ZM14 31H12V11H14V31ZM20 31H18V11H20V31ZM26 31H24V11H26V31ZM32 31H30V11H32V31ZM38 31H36V11H38V31Z"
                                                    fill={`${
                                                        loadType["40ftCargoHover"] ||
                                                        loadTypeClick["40ftCargo"]
                                                            ? "#142837"
                                                            : "#6B778C"
                                                    }`}
                                                />
                                                <path
                                                    d="M67 10V8C67 7.45312 66.5468 7 66 7H32C31.4531 7 31 7.45312 31 8V10C31 10.5469 31.4531 11 32 11V31C31.4531 31 31 31.4532 31 32V34C31 34.5468 31.4531 35 32 35H66C66.5468 35 67 34.5468 67 34V32C67 31.4532 66.5468 31 66 31V11C66.5468 11 67 10.5469 67 10ZM38 31H36V11H38V31ZM44 31H42V11H44V31ZM50 31H48V11H50V31ZM56 31H54V11H56V31ZM62 31H60V11H62V31Z"
                                                    fill={`${
                                                        loadType["40ftCargoHover"] ||
                                                        loadTypeClick["40ftCargo"]
                                                            ? "#142837"
                                                            : "#6B778C"
                                                    }`}
                                                />
                                            </svg>
                                            <p
                                                className={`text-inherit text-sm font-rocGroteskMedium text-center`}
                                            >
                                                40FT
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        onMouseEnter={() => {
                                            setLoadType((prev) => ({
                                                ...prev,
                                                looseCargoHover: true,
                                            }));
                                        }}
                                        onMouseLeave={() => {
                                            setLoadType((prev) => ({
                                                ...prev,
                                                looseCargoHover: false,
                                            }));
                                        }}
                                        onClick={() => {
                                            setLoadTypeClick({
                                                "20ftCargo": false,
                                                "40ftCargo": false,
                                                looseCargo: true,
                                            });
                                            setCustomSearchData((prev) => ({
                                                ...prev,
                                                loadType: {
                                                    ...prev.loadType,
                                                    type: "noncontainers",
                                                },
                                            }));
                                        }}
                                        className={`flex items-center justify-center w-[126px] h-[120px] rounded-lg  hover:text-gun-metal hover:bg-mvx-light-blue hover:border-[2px] hover:border-gun-metal ${
                                            loadTypeClick.looseCargo
                                                ? "text-gun-metal bg-mvx-light-blue border-[2px] border-gun-metal"
                                                : "text-mvx-neutral bg-white border-[1.5px]"
                                        } `}
                                    >
                                        <div
                                            className={`text-inherit text-sm items-center flex flex-col font-rocGroteskMedium`}
                                        >
                                            <svg
                                                width="39"
                                                height="38"
                                                viewBox="0 0 39 38"
                                                fill={`${
                                                    loadType.looseCargoHover ||
                                                    loadTypeClick.looseCargo
                                                        ? "#142837"
                                                        : "none"
                                                }`}
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M4.65625 20.7812H17.125C17.2825 20.7812 17.4335 20.8438 17.5448 20.9552C17.6562 21.0665 17.7188 21.2175 17.7188 21.375V33.8438C17.7188 34.0012 17.6562 34.1522 17.5448 34.2636C17.4335 34.3749 17.2825 34.4375 17.125 34.4375H4.65625C4.49878 34.4375 4.34776 34.3749 4.23641 34.2636C4.12506 34.1522 4.0625 34.0012 4.0625 33.8438V21.375C4.0625 21.2175 4.12506 21.0665 4.23641 20.9552C4.34776 20.8438 4.49878 20.7812 4.65625 20.7812ZM21.875 20.7812H34.3438C34.5012 20.7812 34.6522 20.8438 34.7636 20.9552C34.8749 21.0665 34.9375 21.2175 34.9375 21.375V33.8438C34.9375 34.0012 34.8749 34.1522 34.7636 34.2636C34.6522 34.3749 34.5012 34.4375 34.3438 34.4375H21.875C21.7175 34.4375 21.5665 34.3749 21.4552 34.2636C21.3438 34.1522 21.2812 34.0012 21.2812 33.8438V21.375C21.2812 21.2175 21.3438 21.0665 21.4552 20.9552C21.5665 20.8438 21.7175 20.7812 21.875 20.7812ZM13.2656 3.5625H25.7344C25.8918 3.5625 26.0429 3.62506 26.1542 3.73641C26.2656 3.84776 26.3281 3.99878 26.3281 4.15625V16.625C26.3281 16.7825 26.2656 16.9335 26.1542 17.0448C26.0429 17.1562 25.8918 17.2188 25.7344 17.2188H13.2656C13.1082 17.2188 12.9571 17.1562 12.8458 17.0448C12.7344 16.9335 12.6719 16.7825 12.6719 16.625V4.15625C12.6719 3.99878 12.7344 3.84776 12.8458 3.73641C12.9571 3.62506 13.1082 3.5625 13.2656 3.5625Z"
                                                    fill={`${
                                                        loadType.looseCargoHover ||
                                                        loadTypeClick.looseCargo
                                                            ? "#142837"
                                                            : "#6B778C"
                                                    }`}
                                                />
                                            </svg>
                                            <p
                                                className={`text-inherit text-sm font-rocGroteskMedium text-center`}
                                            >
                                                Loose cargo
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    onClick={() => {
                        setCustomSearchProp(() => {
                            return {
                                isPortOfOriginOpen: false,
                                isPortOfDestinationOpen: false,
                                isLoadTypeOpen: false,
                                isDateOpen: true,
                            };
                        });
                    }}
                    className={`flex items-center justify-between pr-[9px] ${
                        customSearchProp.isDateOpen
                            ? "bg-white rounded-[40px] scale-105 scale-x-110 h-full shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_4px_32px_rgba(0,0,0,0.06)]"
                            : "hover:bg-[#EBECF0] hover:rounded-[40px] hover:h-full "
                    } cursor-pointer`}
                >
                    <div className="flex items-center w-full justify-between">
                        <div className="pl-6 pr-4 ">
                            <p className="text-xs font-rocGroteskMedium mb-[1px]">Ready date</p>
                            <p className="text-sm text-mvx-neutral font-rocGroteskMedium">
                                {value ? moment(value).format("YYYY-MM-DD") : "Add date"}
                            </p>
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setCustomSearchProp((prev) => {
                                    return {
                                        ...prev,
                                        isDateOpen: false,
                                    };
                                });
                            }}
                            className={`${
                                customSearchProp.isDateOpen ? "flex" : "hidden"
                            } w-6 h-6 rounded-full justify-center items-center bg-mvx-light-blue cursor-pointer`}
                        >
                            <i className="ri-close-fill"></i>
                        </div>
                        <button
                            type="button"
                            disabled={
                                !Boolean(customSearchData.portOfOrigin) ||
                                !Boolean(customSearchData.portOfDestination) ||
                                !Boolean(customSearchData.loadType.type) ||
                                // !Boolean(customSearchData.loadType.mode) ||
                                !Boolean(value)
                            }
                            onClick={(e) => {
                                e.stopPropagation();
                                onSearch();
                            }}
                            className={`${
                                customSearchProp.isDateOpen ? "w-auto pr-6 pl-4" : "w-12"
                            } h-12 rounded-full flex items-center gap-2 justify-center bg-pacific-cyan`}
                        >
                            <i className="ri-search-line before:content-['\f0d1'] before:text-white text-base"></i>
                            <span
                                className={`${
                                    customSearchProp.isDateOpen ? "w-fit" : "w-[0px] hidden"
                                } text-white text-sm transition-all font-rocGroteskMedium`}
                            >
                                Search
                            </span>
                        </button>
                    </div>
                    {customSearchProp.isDateOpen && (
                        <div className="absolute top-[75px] left-[-51%] w-fit px-[28px] pt-8 pb-11 bg-white rounded-2xl shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_4px_32px_rgba(0,0,0,0.06)]">
                            <CustomCalendar
                                showDoubleView={showDoubleView}
                                value={value}
                                onChange={onSetDate}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstantQuoteSearchBar;
