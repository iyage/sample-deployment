import classNames from "classnames";
import Avatar from "components/common/Avatar";
import useRouteQuery from "hooks/useRouteQuery";
import moment from "moment";
import React from "react";
import { IoMdClose } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import Menu from "components/common/Menu";

const VersionHistoryBar = ({ logs = [] }) => {
    const { set } = useRouteQuery();
    return (
        <div className="h-full fixed right-0 top-0 bg-white shadow-quoteSidebarShadow w-[276px] z-30 pt-[90px]">
            <div className="flex items-center justify-between p-4 border-b border-neutral-n-40">
                <h1 className="font-rocGroteskBold text-lg">Version History</h1>
                <div
                    className="flex items-center justify-center w-7 h-7 bg-neutral-n-20 rounded-full cursor-pointer"
                    onClick={() => set("tab", "")}
                >
                    <IoMdClose size="14px" color="#142837" />
                </div>
            </div>
            <div className="h-full overflow-y-auto">
                {logs?.map((l) => (
                    <div
                        key={l?._id}
                        className={classNames(
                            "px-4 py-4 gap-x-4 grid grid-cols-[8px_1fr_20px] cursor-pointer h-auto"
                        )}
                    >
                        <div className="flex flex-col gap-1.5 h-full">
                            <div className={classNames("w-2 h-2 bg-neutral-n-40 flex-shrink-0")} />
                            <div className="w-[3px] h-full bg-neutral-n-40 flex-shrink-0 py-1 mx-auto"></div>
                        </div>

                        <div className="">
                            <p className="text-gun-metal font-rocGroteskMedium text-sm">
                                {moment(l?.changedAt).format("ddd, d MMM YYYY | hh:mma")}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                <Avatar
                                    src=""
                                    name={l?.updatedBy?.fullName}
                                    h="20px"
                                    bgColor="#000000"
                                    fontSize="text-[8px]"
                                    fontWeight="font-rocGroteskMedium"
                                />

                                <p className="text-xs font-rocGroteskMedium text-neutral-n-200">
                                    {`${l?.updatedBy?.fullName ?? ""}`}
                                </p>
                            </div>
                        </div>

                        <div>
                            <BsThreeDotsVertical />
                        </div>

                        <Menu />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VersionHistoryBar;
