import NavOne from "components/common/NavOne";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SearchTrackingNo = () => {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const { ffid } = useParams();

    return (
        <div>
            <NavOne />
            <div className="mt-[75px]">
                <div className="flex justify-center mb-8">
                    <div className="border-b border-b-2 border-mvx-black">
                        <p className="px-5 py-4 text-mvx-black font-rocGroteskMedium text-sm">
                            Track a shipment
                        </p>
                    </div>
                    <div
                        className="cursor-pointer"
                        onClick={() => navigate(`/request-quote/${ffid}`)}
                    >
                        <p className="px-5 py-4 text-mvx-neutral font-rocGroteskMedium text-sm">
                            Request a quote
                        </p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <form
                        onSubmit={() => navigate(`/tracking/${value}`)}
                        className="w-3/5 relative max-sm:w-[90%]"
                    >
                        <input
                            required
                            value={value}
                            type={"text"}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={"Enter your tracking number"}
                            className="placeholder:text-sm placeholder:font-rocGroteskMedium placeholder:text-mvx-black font-rocGroteskMedium text-sm h-[60px] w-full bg-white py-4 pl-6 pr-[135px] shadow-[0px_0px_5px_rgba(0,0,0,0.05),0px_25px_35px_rgba(0,0,0,0.03)]"
                        />
                        <button className="flex text-sm items-center absolute right-6 top-[17%] py-2 font-rocGroteskMedium">
                            <span className="material-icons !text-white text-base mr-1">
                                search
                            </span>
                            Track
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SearchTrackingNo;
