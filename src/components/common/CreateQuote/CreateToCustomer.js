/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/common/Loader";
import { shipmentActions } from "actions";
import { Link } from "react-router-dom";

const CreateToCustomer = ({
    searchShipment,
    isPendingShipmentsLoading,
    shipments,
    selectedId,
    setSelectedId,
    searched,
    setSearched,
    hideCreateNewShipment,
    setSelectedMvxId,
}) => {
    const { ffProfile } = useSelector((state) => state.auth);
    const searchRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(shipmentActions.fetchPendingShipments("pending", 1));
    }, []);

    return (
        <div className="border rounded mx-[22px]">
            <input
                className="placeholder:text-[13px] text-sm py-2 px-3 w-full font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                placeholder="Search for shipments... E.g TA37353"
                ref={searchRef}
                onInput={_.debounce((evt) => {
                    searchShipment(evt.target.value);
                }, 800)}
                pattern="^[tT][aA]\s?\d+$"
                title="Shipment id must should start Ta 000123"
            />
            <div
                className={`border-y ${
                    (isPendingShipmentsLoading || shipments.length === 0) &&
                    "h-[277px] grid place-items-center"
                }`}
            >
                {isPendingShipmentsLoading ? (
                    <Loader size={7} />
                ) : (
                    <>
                        {shipments.length ? (
                            <>
                                {shipments.map((ship, idx) => (
                                    <Shipment
                                        shipment={ship}
                                        selectedId={selectedId}
                                        setId={() => {
                                            setSelectedId((prev) =>
                                                ship._id === prev ? "" : ship._id
                                            );
                                            setSelectedMvxId?.((prev) =>
                                                ship.mvxid === prev ? "" : ship.mvxid
                                            );
                                        }}
                                        isLast={idx === 3}
                                        key={ship._id}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className="w-max">
                                <p className="text-sm text-center">
                                    No shipment{!searched && "s"}{" "}
                                    {searched ? "found." : "available."}
                                </p>
                                {searched && (
                                    <button
                                        className="rounded mt-2 text-sm"
                                        onClick={() => {
                                            searchRef.current.value = "";
                                            dispatch(
                                                shipmentActions.fetchPendingShipments("pending", 1)
                                            );
                                            setSearched(false);
                                        }}
                                    >
                                        Load Shipments
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            {!hideCreateNewShipment && (
                <Link
                    to={`/dashboard/shipment-creation/${ffProfile?.result?._id}`}
                    className={`flex items-center pt-[6px] pb-[5px] px-3 text-[13px] bg-mvx-blue/[0.02] group ${
                        isPendingShipmentsLoading && "pointer-events-none"
                    }`}
                >
                    You can also{" "}
                    <span className="font-semibold ml-[3px]"> create a new shipment</span>{" "}
                    <span className="material-icons font-medium text-lg ml-1 translate-y-[-.6px] transition-transform duration-300 group-hover:translate-x-1">
                        arrow_forward
                    </span>
                </Link>
            )}
        </div>
    );
};

const Shipment = ({ shipment, selectedId, setId, isLast }) => {
    const isThisSelected = selectedId === shipment._id;

    const cutString = (string) => {
        const arrStr = string.trim().split(" ");

        if (arrStr.length > 5) {
            arrStr.splice(5);
            const lastWord = arrStr[arrStr.length - 1];
            const popularWordBreaks = [",", ".", "?", "!", ";", ":"];
            if (popularWordBreaks.includes(lastWord.slice(-1))) {
                arrStr[arrStr.length - 1] = lastWord.slice(0, -1);
            }
            return arrStr.join(" ") + "...";
        } else {
            return arrStr.join(" ");
        }
    };

    return (
        <div
            className={`min-h-[60px] pt-2 flex items-center px-3 cursor-pointer transition-colors duration-300 hover:bg-mvx-blue/[.03] ${
                isLast && "pb-2"
            } ${isThisSelected & "bg-mvx-blue/[.03]"}`}
        >
            <span className="material-icons rounded-full bg-mvx-black/[.03] text-xl font-medium text-mvx-black/50 h-[35px] w-[35px] grid place-items-center">
                flight_takeoff
            </span>
            <p className="text-sm ml-3 mr-4 flex-1">
                <b>TA {shipment.mvxid}</b>
                <span className="block mt-[3px] text-mvx-neutral capitalize">
                    {cutString(shipment.destination.address.toLowerCase())}
                </span>
            </p>
            <button
                className={`rounded text-sm px-0 py-1 text-center font-medium pb-[3px] basis-[85px] ${
                    isThisSelected && "bg-white text-gun-metal border font-medium"
                }`}
                onClick={setId}
            >
                {isThisSelected ? "Selected" : "Select"}
            </button>
        </div>
    );
};

export default CreateToCustomer;
