import Skeleton from "components/common/Skeleton";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";

const DetailsSection = ({ loading, movements, className }) => {
    const navigate = useNavigate("");
    const params = useParams();
    return (
        <div className={`py-9 px-6 basis-[500px] ${className}`}>
            {loading ? (
                <>
                    <Skeleton className={"!bg-[#F4F5F7] w-[120px] h-[19px] !rounded-none"} />
                    <Skeleton
                        className={"!bg-[#F4F5F7] w-[210px] h-[12px] mt-[9px] mb-6 !rounded-none"}
                    />
                </>
            ) : (
                <h4 className="font-rocGroteskBold">
                    Movement List
                    <span className="block text-[#6B778C] text-sm font-rocGroteskMedium">
                        Other Parcels in this Shipment
                    </span>
                </h4>
            )}

            <div className="mt-5 mb-[18px] max-lg:w-full lg:mb-10 border min-h-min max-h-[180px] lg:max-h-[50%] overflow-y-auto">
                {loading ? (
                    <MovementsLoader />
                ) : (
                    <>
                        {movements?.map((mvm, idx) => (
                            <div
                                key={mvm._id}
                                className={`flex justify-between items-center cursor-pointer pt-3 pb-[14px] px-6 group transition-all duration-300 hover:bg-mvx-black/5 ${
                                    idx && "border-t"
                                }`}
                                onClick={() =>
                                    navigate(`/tracking/${params?.shipmentId}/${mvm._id}`)
                                }
                            >
                                <p className="font-rocGroteskMedium text-sm">
                                    MO{mvm.mvxid}
                                    <span className="block text-[#6B778C] text-sm font-medium mt-1">
                                        Created On: {moment(mvm.createdAt).format("dddd, MMMM DD")}{" "}
                                        at {moment(mvm.createdAt).format("LT")}
                                    </span>
                                </p>
                                <span className="material-icons group-hover:translate-x-1 transition-transform ">
                                    navigate_next
                                </span>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* <h4 className="font-rocGroteskBold">Shipment details</h4> */}
        </div>
    );
};

const MovementsLoader = () => {
    return (
        <>
            {[323, 23, 243, 3534, 3].map((load, idx) => (
                <div
                    className={`py-[18px] px-6 ${idx && "border-t"} ${
                        load === 3 && "!pb-[-100px]"
                    }`}
                    key={load}
                >
                    <Skeleton className={"!bg-[#F4F5F7] w-[90px] h-[15px] !rounded-none"} />
                    <Skeleton
                        className={"!bg-[#F4F5F7] w-[85%] lg:w-[330px] h-[11px] mt-3 !rounded-none"}
                    />
                </div>
            ))}
        </>
    );
};

export default DetailsSection;
