import { rateActions } from "actions";
import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PortInput = ({ portValue, handleSelection, required, handleSelectCountry }) => {
    const [searchPort, setSearchPort] = useState({ origin: portValue, destination: "" });
    const [dropdown, setDropdown] = useState(false);
    const [port, setPort] = useState({
        origin: "",
        destination: "",
    });
    const dispatch = useDispatch();
    const ref = useRef();

    const { getPortsLoading, getPortsSuccess } = useSelector((state) => state.rate);

    useEffect(() => {
        if (Boolean(port.origin)) {
            dispatch(rateActions.fetchPorts(port.origin));
        } else if (Boolean(port.destination)) {
            dispatch(rateActions.fetchPorts(port.destination));
        } else {
            dispatch(rateActions.fetchPorts("united"));
        }
    }, [dispatch, port.destination, port.origin]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target) && dropdown) {
                setDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, dropdown]);

    return (
        <div ref={ref} className=" w-full relative">
            <div onClick={() => setDropdown(true)}>
                <input
                    value={searchPort?.origin}
                    type="text"
                    className="border bg-white cursor-pointer rounded outline-0 w-full h-[48px] px-4 py-3 text-sm font-rocGroteskMedium placeholder:text-mvx-neutral placeholder:font-rocGroteskMedium"
                    placeholder="Enter origin"
                    name="origin"
                    required={required}
                    onInput={debounce((evt) => {
                        setPort((prev) => ({ ...prev, origin: evt.target.value }));
                    }, 800)}
                    onChange={(e) => setSearchPort((prev) => ({ ...prev, origin: e.target.value }))}
                />
            </div>

            {dropdown && (
                <div className="absolute z-10 overflow-hidden  w-full bg-white rounded shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_4px_32px_rgba(0,0,0,0.06)]">
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
                                            setDropdown(false);
                                            handleSelection?.(value.portName, value.portCode);
                                            handleSelectCountry?.(value);
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
                                No Port Found
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortInput;
