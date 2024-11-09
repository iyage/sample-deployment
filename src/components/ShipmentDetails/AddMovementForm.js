/* eslint-disable react-hooks/exhaustive-deps */
import { shipmentActions } from "actions";
// import { ShipIcon } from "assets/arts";
import LocationSearchInput from "components/common/AutocompleteInput";
import Loader from "components/common/Loader";
import SelectInput from "components/common/SelectInput";
import scrollVertical from "helpers/scrollVertical";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { oceanCarriers } from "variables/oceanCarriers";

const AddMovementForm = ({ closeForm, shipmentId, isActive = true }) => {
    const [active, setActive] = useState(0);
    const [partner, setPartner] = useState("");
    const [oceanCarrier, setOceanCarrier] = useState(null);
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [resetLocations, setResetLocations] = useState(false);
    const dispatch = useDispatch();
    const { mvmPartners, mvmPartnersLoading, createMovement, createMovementLoading } = useSelector(
        (state) => state.shipment
    );
    const movementFormRef = useRef();

    const addMovement = (evt) => {
        evt.preventDefault();
        const waybillNumber = document.getElementById("waybillNum")?.value;
        const billOfLading = document.getElementById("billOfLading")?.value;
        const containerNumber = document.getElementById("containerNumber")?.value;

        const _reqData = {
            shipmentId,
            origin: origin?.origin,
            destination: destination?.destination,
            channel: "web",
            movementType: active === 1 ? "ocean" : active === 2 ? "land" : "air",
        };

        const reqData = partner ? { ..._reqData, partner } : _reqData;

        dispatch(
            shipmentActions.createMovement(
                active === 1
                    ? { ...reqData, carrierNumber: oceanCarrier, billOfLading, containerNumber }
                    : active === 2
                    ? reqData
                    : { ...reqData, waybillNumber }
            )
        );
    };

    useEffect(() => {
        if (isActive) {
            setResetLocations(false);
        }

        if (isActive && !mvmPartners) {
            dispatch(shipmentActions.fetchMovementPartners(shipmentId));
        }
    }, [isActive, mvmPartners, shipmentId]);

    useEffect(() => {
        if (createMovement) {
            scrollVertical(document.getElementById("mvms"));
            closeForm(false);
            movementFormRef.current.reset();
            setOceanCarrier("");
            setPartner("");
            setResetLocations(true);
        }
    }, [createMovement, closeForm]);

    return (
        <>
            <div
                className={`absolute left-0 top-0 ${
                    isActive ? "z-[1000] 800:z-[19] w-screen h-screen 800:h-[calc(100vh-72px)]" : ""
                }`}
            />
            <form
                ref={movementFormRef}
                className={`fixed 800:absolute right-0 max-800:bottom-0 800:top-0 bg-white w-full 800:w-[420px] border border-t-0 h-full 800:h-[calc(100vh-72px)] overflow-hidden z-20 rounded-sm transition-transform ease-in-out duration-300 ${
                    isActive
                        ? "max-800:translate-y-0 800:translate-x-0"
                        : "max-800:translate-y-[110%] 800:translate-x-[110%]"
                } shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]`}
                onSubmit={addMovement}
            >
                <h3 className="px-[18px] font-rocGroteskBold py-4 border-b text-lg">
                    Add a movement
                </h3>

                <div className="px-4">
                    <p className="text-sm font-rocGroteskMedium mt-4">Movement Type</p>

                    {/* TABS */}
                    <div className="grid grid-cols-3 border rounded mt-1">
                        <div
                            className={`flex items-center h-9 text-sm font-rocGroteskMedium justify-center border-r cursor-pointer transition-colors duration-300 hover:bg-mvx-light-blue ${
                                !active && "border border-gun-metal bg-mvx-light-blue rounded-l"
                            }`}
                            onClick={() => setActive(0)}
                        >
                            <span className="material-icons text-[15px] font-normal mr-[10px]">
                                flight_takeoff
                            </span>
                            Air
                        </div>
                        <div
                            className={`flex items-center h-9 text-sm font-rocGroteskMedium justify-center border-r cursor-pointer transition-colors duration-300 hover:bg-mvx-light-blue ${
                                active === 1 && "border border-gun-metal bg-mvx-light-blue"
                            }`}
                            onClick={() => setActive(1)}
                        >
                            {/* <ShipIcon className="text-[15px] mr-[10px] font-normal" /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687262179/Web%20App/dashboard/ship_exk2il.svg"
                                }
                                alt="Ship Icon"
                                className="text-[15px] mr-[10px] font-normal"
                            />
                            Sea
                        </div>
                        <div
                            className={`flex items-center h-9 text-sm font-rocGroteskMedium justify-center cursor-pointer transition-colors duration-300 hover:bg-mvx-light-blue ${
                                active === 2 &&
                                "border border-gun-metal bg-mvx-light-blue rounded-r"
                            }`}
                            onClick={() => setActive(2)}
                        >
                            <span className="material-icons text-[15px] font-normal mr-[10px]">
                                local_shipping
                            </span>
                            Land
                        </div>
                    </div>

                    {/* INPUTS */}
                    <div className={`h-[calc(100vh-315px)] overflow-y-auto mt-[18px]`}>
                        {!active && (
                            <>
                                <p className="text-sm font-rocGroteskMedium">Air Waybill Number</p>
                                <input
                                    className="border rounded p-3 mt-1 w-full text-sm text-gun-metal font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:!text-sm"
                                    placeholder="Enter waybill number"
                                    required
                                    id="waybillNum"
                                />
                            </>
                        )}

                        {active === 1 && (
                            <>
                                <>
                                    <p className="text-sm font-rocGroteskMedium">
                                        Bill of Lading Number
                                    </p>
                                    <input
                                        className="border rounded p-3 mt-1 w-full text-sm text-gun-metal font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:!text-sm"
                                        placeholder="Enter bill of lading number"
                                        required
                                        id="billOfLading"
                                    />
                                </>
                                <>
                                    <p className="text-sm font-rocGroteskMedium mt-[18px]">
                                        Ocean Carrier
                                    </p>
                                    <SelectInput
                                        value={oceanCarrier}
                                        isRequired
                                        name="oceanCarrier"
                                        className="bg-white rounded mt-1"
                                        dropdownClassName={"rounded"}
                                        handleChange={(_, value) => setOceanCarrier(value)}
                                        dropdownOptions={oceanCarriers.map((carrier) => ({
                                            label:
                                                carrier["Full Name"]?.toUpperCase() ||
                                                carrier["Carrier Name"]?.toUpperCase(),
                                            value: carrier.SCAC,
                                        }))}
                                        placeholder={"Select a carrier"}
                                    />
                                </>
                                <>
                                    <p className="text-sm font-rocGroteskMedium mt-[18px]">
                                        Container Number
                                    </p>
                                    <input
                                        className="border rounded p-3 mt-1 w-full text-sm text-gun-metal font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:!text-sm"
                                        placeholder="Enter container number"
                                        required
                                        id="containerNumber"
                                    />
                                </>
                            </>
                        )}

                        {/* {active === 2 && (
                        <>
                            <p className="text-sm font-rocGroteskMedium">Truck partner</p>

                            <SelectInput
                                value={truckingPartner}
                                isRequired
                                name="truckingPartner"
                                className="bg-white rounded mt-1"
                                dropdownClassName={"rounded"}
                                handleChange={(_, value) => setTruckingPartner(value)}
                                dropdownOptions={[
                                    {
                                        label: "Trucking Partner 1",
                                        value: "Trucking Partner 1",
                                    },
                                    {
                                        label: "Trucking Partner 2",
                                        value: "Trucking Partner 2",
                                    },
                                ]}
                                placeholder={"Select trucking partner"}
                            />
                        </>
                    )} */}

                        <>
                            <p className="text-sm font-rocGroteskMedium mt-[18px]">
                                Select a Partner
                            </p>

                            <SelectInput
                                value={partner}
                                name="partner"
                                className="bg-white rounded mt-1"
                                dropdownClassName={"rounded"}
                                handleChange={(_, value) => setPartner(value)}
                                dropdownOptions={mvmPartners?.map((partner) => ({
                                    label: partner?.profile?.businessName || "",
                                    value: partner._id,
                                    icon: (
                                        <img
                                            className="h-8 w-8 rounded-full border object-cover"
                                            src={partner?.profile?.logo || ""}
                                            alt={partner?.profile?.businessName || ""}
                                        />
                                    ),
                                }))}
                                placeholder={` ${
                                    mvmPartnersLoading ? "Loading..." : "Select a partner"
                                }`}
                            />
                        </>

                        <>
                            <p className="text-sm font-rocGroteskMedium mt-[18px]">Origin</p>
                            <LocationSearchInput
                                setData={setOrigin}
                                placeholder="Select origin location"
                                name={"origin"}
                                classNames={"rounded mt-1"}
                                dropdownClassName={"rounded"}
                                resetLocation={resetLocations}
                            />
                        </>

                        <>
                            <p className="text-sm font-rocGroteskMedium mt-[18px]">Destination</p>
                            <LocationSearchInput
                                setData={setDestination}
                                placeholder="Select destination location"
                                name={"destination"}
                                classNames={"rounded mt-1"}
                                dropdownClassName={"rounded"}
                                resetLocation={resetLocations}
                            />
                        </>
                    </div>
                </div>
                {/* BUTTONS */}
                <div className="flex font-rocGroteskMedium text-sm border-t pt-4 pb-3 px-4 absolute bottom-0 w-full justify-between bg-white">
                    <button
                        className="py-3 text-gun-metal bg-white border rounded-sm basis-[48%] disabled:bg-mvx-light-blue"
                        type="button"
                        disabled={mvmPartnersLoading || createMovementLoading}
                        onClick={() => closeForm(false)}
                    >
                        Close
                    </button>
                    <button
                        className="py-3 rounded-sm basis-[48%] bg-pacific-cyan disabled:bg-pacific-cyan/80"
                        disabled={mvmPartnersLoading || createMovementLoading}
                    >
                        {createMovementLoading ? <Loader color={"white"} /> : "Add movement"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default AddMovementForm;
