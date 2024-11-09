import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const [value, setValue] = useState("");
    const navigate = useNavigate();

    return (
        <nav className="flex justify-between items-center h-[65px] border-b border-[#DFE1E6] pl-10 pr-5 max-sm:px-5 w-full">
            <Link to={"/"} className="font-rocGroteskMedium text-[20px] max-sm:hidden">
                Fleet+
            </Link>

            <form
                onSubmit={() => navigate(`/tracking/${value}`)}
                className="w-3/6 relative max-sm:w-full max-lg:hidden max-sm:block"
            >
                <input
                    required
                    value={value}
                    type={"text"}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={"Enter your tracking number"}
                    className="placeholder:text-sm placeholder:font-rocGroteskMedium placeholder:text-mvx-black font-rocGroteskMedium text-sm h-[50px] w-full bg-white py-4 pl-6 border"
                />
                <button className="flex bg-pacific-cyan text-sm items-center absolute right-6 top-[17%] py-1 font-rocGroteskMedium">
                    <span className="material-icons !text-white text-base mr-1">search</span>
                    Track
                </button>
            </form>

            <p className="text-sm font-rocGroteskMedium max-lg:hidden invisible">
                Need help?{" "}
                <a href={"mailto:hello@fleetplus.io"} className="underline font-rocGroteskMedium">
                    Contact Support
                </a>
            </p>

            <span className="material-icons ml-auto hidden max-lg:block max-sm:hidden">menu</span>
        </nav>
    );
};

export default Navbar;
