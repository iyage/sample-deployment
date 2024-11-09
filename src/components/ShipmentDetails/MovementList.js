// import { ShareLineIcon } from "assets/arts";
import Skeleton from "components/common/Skeleton";

const MovementList = ({
    selectedMovement,
    loading,
    FFmovements,
    setMovementForm,
    setSelectedMovement,
    latestLocationData,
    setPopover,
}) => {
    return (
        <>
            {loading ? (
                <MovementsLoader />
            ) : (
                <>
                    {FFmovements?.length ? (
                        <>
                            <div className="px-5 lg:px-12 pt-6 overflow-y-auto">
                                <h3 className="font-rocGroteskMedium flex items-center justify-between">
                                    Movements{" "}
                                    <p
                                        className="flex items-center cursor-pointer text-[13px] underline"
                                        onClick={() => setMovementForm(true)}
                                    >
                                        Add new movement
                                    </p>
                                </h3>

                                <div
                                    className="mt-5 mb-[18px] border max-h-[185px] overflow-y-auto"
                                    id="mvms"
                                >
                                    {FFmovements.map((mvm, idx) => (
                                        <div
                                            className={`flex justify-between items-center cursor-pointer pt-3 pb-[14px] px-3 group ${
                                                idx && "border-t"
                                            } ${
                                                mvm._id === selectedMovement?._id
                                                    ? "bg-mvx-black/5"
                                                    : "transition-all duration-300 hover:bg-mvx-black/5"
                                            }`}
                                            key={mvm._id + idx}
                                            onClick={() => {
                                                setSelectedMovement(mvm);
                                                setPopover(true);
                                            }}
                                        >
                                            <p className="font-rocGroteskMedium text-sm">
                                                Movement ID: TA {mvm.mvxid}
                                                <span className="block text-[#6B778C] text-sm font-medium mt-[2px]">
                                                    Current Location:{" "}
                                                    {mvm._id === selectedMovement?._id
                                                        ? latestLocationData?.textAddress
                                                        : mvm.origin?.address}
                                                </span>
                                            </p>
                                            <span className="material-icons group-hover:translate-x-1 transition-transform">
                                                navigate_next
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <span
                                className="material-icons bg-pacific-cyan text-white text-[22px] rounded-full h-[35px] w-[35px] grid place-items-center mt-5 mb-7 mx-auto cursor-pointer"
                                onClick={() => setMovementForm(true)}
                            >
                                add
                            </span>
                        </>
                    ) : (
                        <div className="px-5 800:px-12 pt-6 mb-7">
                            <h3 className="font-rocGroteskMedium">Movements</h3>
                            <div className="flex flex-col items-center mt-3 800:mt-9 text-center max-800:bg-mvx-light-blue max-800:rounded max-800:py-6">
                                {/* <ShareLineIcon className="h-[29px] w-[29px]" /> */}
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687262560/Web%20App/dashboard/share_hsb2il.svg"
                                    }
                                    alt="Share Line Icon"
                                    className="h-[29px] w-[29px]"
                                />
                                <p className="font-rocGroteskMedium text-[15px] mt-2">
                                    No Movement Detected
                                </p>
                                <p className="text-[13px] font-rocGroteskMedium mt-1 mb-[22px] text-mvx-neutral">
                                    No movements for this shipments yet.
                                </p>
                                <button
                                    className="flex items-center text-sm rounded-sm font-rocGroteskMedium 800:py-2 px-7 bg-pacific-cyan max-800:text-gun-metal "
                                    onClick={() => setMovementForm(true)}
                                >
                                    <i className="ri-add-line 800:hidden text-gun-metal text-lg" />
                                    Add more movement
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

const MovementsLoader = () => (
    <div className="px-12 pt-7 overflow-y-auto">
        <div className="flex justify-between">
            <Skeleton className={"h-[15px] w-[110px]"} />
            <Skeleton className={"h-3 w-[140px]"} />
        </div>
        <div className="mt-5 mb-[18px] border">
            {[323, 23].map((load, idx) => (
                <div
                    className={`py-[18px] px-6 ${idx && "border-t"} ${
                        load === 3 && "!pb-[-100px]"
                    }`}
                    key={load + idx}
                >
                    <Skeleton className={"w-[40%] h-[15px] !rounded-none"} />
                    <Skeleton className={"w-[87%] lg:w-[330px] h-[11px] mt-3 !rounded-none"} />
                </div>
            ))}
        </div>
        <Skeleton className={"h-[38px] w-[38px] mt-5 mb-7 mx-auto !rounded-full"} />
    </div>
);

export default MovementList;
