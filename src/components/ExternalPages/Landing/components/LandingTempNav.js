// import { LogoIcon } from "assets/arts";
import { Link, useNavigate } from "react-router-dom";

const LandingTempNav = () => {
    const navigate = useNavigate();
    return (
        <>
            <nav className="flex justify-between items-center px-3 400:px-4 sm:px-16 1100:px-[70px] xl:px-[176px] h-[80px] bg-gun-metal 520:flex">
                {/* <LogoIcon className="cursor-pointer" onClick={() => navigate("/")} /> */}
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687260185/Web%20App/tradeAllyLogo_wxr5s2.svg"
                    }
                    alt="Logo Icon"
                    className="cursor-pointer"
                    onClick={() => navigate("/")}
                />

                <Link
                    to="/waitlist"
                    className="py-2 px-6 text-sm font-rocGroteskMedium rounded bg-[#16C6A4] text-gun-metal max-sm:hidden"
                >
                    Join the waitlist
                </Link>
            </nav>
        </>
    );
};

export default LandingTempNav;
