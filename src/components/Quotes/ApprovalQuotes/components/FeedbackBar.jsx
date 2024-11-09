import Avatar from "components/common/Avatar";
import moment from "moment";
import React from "react";

const FeedbackBar = ({ feedback = [] }) => {
    if (!feedback?.length) {
        return (
            <div className="h-full fixed left-0 top-0 bg-white shadow-quoteSidebarShadow w-[276px] z-30 pt-[90px]"></div>
        );
    }

    return (
        <div className="h-full fixed left-0 top-0 bg-white shadow-quoteSidebarShadow w-[276px] z-30 pt-[90px]">
            <div className="flex items-center justify-between px-8 py-4 border-b border-neutral-n-40">
                <h1 className="font-gilroyBold text-sm uppercase">Feedback</h1>
            </div>

            {feedback?.map((f) => (
                <div key={f?._id} className="px-8 py-3 border-b border-neutral-n-40 w-full">
                    {f?.status === "rejected" ? (
                        <div className="rounded py-1.5 flex items-center gap-[6px] px-2 bg-[#FFE6E6] max-w-[80px]">
                            <div className="w-[6px] h-[6px] bg-[#FF0000] rounded-full flex-shrink-0" />
                            <h3 className="text-xs text-neutral-n-600 font-rocGroteskMedium">
                                Rejected
                            </h3>
                        </div>
                    ) : (
                        <div className="rounded py-1.5 flex items-center gap-[6px] px-2 bg-[#E6FAFF] max-w-[90px]">
                            <div className="w-[6px] h-[6px] bg-[#00C6FA] rounded-full" />
                            <h3 className="text-xs text-neutral-n-600 font-rocGroteskMedium">
                                Approved
                            </h3>
                        </div>
                    )}

                    <div className="mt-2 p-2 rounded-lg bg-neutral-n-20 space-y-[10px]">
                        <p className="text-gun-metal font-rocGroteskMedium text-sm">{f?.message}</p>

                        <p className="text-xs text-neutral-n-200 font-rocGrotesk">
                            {moment(f?.changedAt).format("ddd, d MMM YYYY | hh:mma")}
                        </p>
                    </div>

                    <div className="mt-2 flex items-center gap-1">
                        <Avatar
                            src=""
                            name={f?.updatedBy?.fullName}
                            h="20px"
                            bgColor="#000000"
                            fontSize="text-[8px]"
                            fontWeight="font-rocGroteskMedium"
                        />

                        <p className="text-xs font-rocGroteskBold text-neutral-n-200">
                            by {`${f?.updatedBy?.fullName ?? ""}`}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeedbackBar;
