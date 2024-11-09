import classNames from "classnames";
import useRouteQuery from "hooks/useRouteQuery";
import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const buttons = [
    { icon: "/img/historyIcon.svg", title: "history" },
    { icon: "/img/notification.svg", title: "notification" },
    { icon: "/img/chatIcon.svg", title: "chat" },
];

const CreateQuoteNav = () => {
    const { searchParams, setURLQuery } = useRouteQuery();
    const tab = searchParams.get("tab") ?? "";
    const switchTab = (t) => setURLQuery({ tab: t });
    const navigate = useNavigate();
    return (
        <nav className="flex justify-between bg-white items-center px-3 475:px-6 pt-[13px] pb-[15px] fixed top-0 z-40 shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.03)] w-full">
            <div className="flex items-center gap-4">
                <img
                    src="/img/quoteicon.svg"
                    alt="Quote Icon"
                    className="w-[40px] h-[40px] object-contain"
                />

                <div>
                    <h1 className="font-bold font-rocGroteskBold text-[18px] text-gun-metal">
                        Create Quote
                    </h1>
                    <h2 className="text-mvx-neutral font-medium font-rocGroteskMedium">
                        Last Edited: 7:24am, 27th September, 2023
                    </h2>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {buttons?.map((b) => (
                    <div
                        className={classNames(
                            "w-[40px] h-[40px] flex items-center rounded-full  justify-center text-green-400 cursor-pointer",
                            {
                                "bg-pacific-cyan text-white": tab === b?.title,
                                "bg-mvx-light-blue": tab !== b?.title,
                            }
                        )}
                        key={b?.title}
                        onClick={() => switchTab(b?.title)}
                    >
                        <img src={b?.icon} alt={b?.title} className="w-[20px] h-[20px]" />
                    </div>
                ))}
                <div
                    className={classNames(
                        "w-[40px] h-[40px] flex items-center rounded-full  justify-center text-green-400 cursor-pointer bg-mvx-light-blue"
                    )}
                    onClick={() => navigate(-1)}
                >
                    <RiCloseFill className="text-gun-metal text-2xl" />
                </div>
            </div>
        </nav>
    );
};

export default CreateQuoteNav;
