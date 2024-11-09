/* eslint-disable react-hooks/exhaustive-deps */
import { appActions } from "actions/appActions";
// import { UpDownIcon } from "assets/arts";
import Dropdown from "components/common/Dropdown";
import Loader from "components/common/Loader";
import ModalContainer from "components/common/ModalContainer";
import SelectInput from "components/common/SelectInput";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useDispatch, useSelector } from "react-redux";
import countries from "variables/countries";
import { regionNames } from "helpers";
import useScreenSize from "hooks/useScreenSize";

const ShipmentPreferences = ({ ffProfile, ffProfileLoading, setActiveMobileSection }) => {
    const [step, setStep] = useState(0);
    const [isTradeLanes, setIsTradeLanes] = useState();
    const { updateBusinessProfileLoading } = useSelector((state) => state.app);
    const screenSize = useScreenSize();

    return (
        <>
            {!step && (
                <>
                    <p className="text-[22px] mb-7 font-rocGroteskBold flex max-sm:px-5">
                        <span
                            onClick={() => setActiveMobileSection(false)}
                            className="material-icons-outlined max-sm:block hidden text-lg font-semibold mr-2 sm:hidden"
                        >
                            arrow_back
                        </span>
                        Shipment preference
                    </p>
                    <div className="flex justify-between items-center text-sm pb-6 border-b max-sm:px-5">
                        <div
                            className="sm:basis-[50%] max-sm:cursor-pointer"
                            onClick={() => {
                                if (screenSize < 640) {
                                    setIsTradeLanes(true);
                                    setStep(1);
                                }
                            }}
                        >
                            <span className="font-rocGroteskBold block mb-[6px]">Trade Lane</span>
                            <span className="leading-[20px] font-rocGroteskMedium text-mvx-gray">
                                Select the countries you ship to so that we can direct the right
                                customers to you on Fleet+.
                            </span>
                        </div>
                        <p
                            id="lane"
                            className="underline font-rocGroteskMedium cursor-pointer max-sm:hidden"
                            onClick={() => {
                                setIsTradeLanes(true);
                                setStep(1);
                            }}
                        >
                            Edit
                        </p>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-6 max-sm:px-5">
                        <div className="sm:basis-[50%] max-sm:cursor-pointer">
                            <span
                                className="font-rocGroteskBold block mb-[6px]"
                                onClick={() => {
                                    if (screenSize < 640) {
                                        setIsTradeLanes(false);
                                        setStep(1);
                                    }
                                }}
                            >
                                Shipment Mode
                            </span>
                            <span className="leading-[20px] font-rocGroteskMedium text-mvx-gray">
                                Select the specific shipment mode you offer so that we can direct
                                the right customers to you.
                            </span>
                        </div>
                        <p
                            className="underline font-rocGroteskMedium cursor-pointer max-sm:hidden"
                            onClick={() => {
                                setIsTradeLanes(false);
                                setStep(1);
                            }}
                        >
                            Edit
                        </p>
                    </div>
                </>
            )}

            {!!step && (
                <>
                    {!isTradeLanes && (
                        <ShipmentMode
                            goBack={() => {
                                setStep(0);
                            }}
                            ffProfile={ffProfile?.result}
                        />
                    )}

                    {isTradeLanes && (
                        <TradeLanes
                            goBack={() => {
                                setStep(0);
                            }}
                            ffProfile={ffProfile?.result}
                            profileLoading={ffProfileLoading}
                            updateLoading={updateBusinessProfileLoading}
                        />
                    )}
                </>
            )}
        </>
    );
};

const ShipmentMode = ({ goBack, ffProfile }) => {
    const [oceanMode, setOceanMode] = useState(() => ffProfile?.profile?.mode?.includes("ocean"));
    const [airMode, setAirMode] = useState(() => ffProfile?.profile?.mode?.includes("air"));
    const [haulageMode, setHaulageMode] = useState(() =>
        ffProfile?.profile?.mode?.includes("haulage")
    );
    const [clicked, setClicked] = useState();
    const dispatch = useDispatch();

    const updateShipmentModes = debounce(() => {
        setClicked(false);
        const newArr = [];
        if (oceanMode) newArr.push("ocean");
        if (airMode) newArr.push("air");
        if (haulageMode) newArr.push("haulage");
        dispatch(appActions.updateBusinessProfile({ mode: newArr }));
    }, 1000);

    useEffect(() => {
        clicked && updateShipmentModes();
    }, [airMode, oceanMode, haulageMode, clicked]);

    return (
        <>
            <span
                className="flex items-center cursor-pointer text-[13px] w-max mb-3 max-sm:hidden"
                onClick={goBack}
            >
                <span className="material-icons text-lg mr-[3px] font-medium">arrow_back</span>
                <span className="underline">Go back</span>
            </span>

            <p className="text-[22px] font-rocGroteskBold flex max-sm:px-5">
                <span
                    onClick={goBack}
                    className="material-icons-outlined max-sm:block hidden text-lg font-semibold mr-2 sm:hidden"
                >
                    arrow_back
                </span>
                Shipment Mode
            </p>
            <p className="text-mvx-gray font-rocGroteskMedium text-sm max-sm:px-5">
                Choose the mode of shipment services you offer
            </p>

            <div
                className={`sm:flex mt-7 max-sm:px-5 max-sm:[&>*]:!w-full max-sm:[&>*]:!mb-6  max-sm:[&>*]:!pt-[22px] max-sm:[&>*]:!pb-6`}
            >
                <div
                    className={`rounded w-[200px] pb-[18px] mx-[2px] pt-4 px-[14px] outline outline-1 outline-[#DFE1E6] cursor-pointer mr-4 transition-transform duration-300 active:scale-[.8] ${
                        airMode
                            ? "outline-2 !outline-gun-metal bg-mvx-light-blue/50"
                            : "[&>*]:!text-[#7A869A] [&_path]:!fill-[#7A869A]"
                    }`}
                    onClick={() => {
                        setAirMode(!airMode);
                        setClicked(true);
                    }}
                >
                    {/* <FlightIcon className="w-[28px] h-[28px] mb-1" /> */}
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687263058/Web%20App/dashboard/Flight_jukgjm.svg"
                        }
                        alt="Flight Icon"
                        className="w-[28px] h-[28px] mb-1"
                    />
                    <p className="text-sm font-rocGroteskMedium">Air Freight</p>
                </div>
                <div
                    className={`rounded w-[200px] pb-[18px] pt-4 px-[14px] outline outline-1 outline-[#DFE1E6] mx-[2px] cursor-pointer mr-4 transition-transform duration-300 active:scale-[.8] ${
                        oceanMode
                            ? "outline-2 !outline-gun-metal bg-mvx-light-blue/50"
                            : "[&>*]:!text-[#7A869A] [&_path]:!fill-[#7A869A]"
                    }`}
                    onClick={() => {
                        setOceanMode(!oceanMode);
                        setClicked(true);
                    }}
                >
                    {/* <ShipIcon className="w-[28px] h-[28px] mb-1" /> */}
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687262179/Web%20App/dashboard/ship_exk2il.svg"
                        }
                        alt="Ship Icon"
                        className="w-[28px] h-[28px] mb-1"
                    />
                    <p className="text-sm font-rocGroteskMedium">Sea Freight</p>
                </div>
                <div
                    className={`rounded w-[200px] pb-[18px] pt-4 px-[14px] mx-[2px] outline outline-1 outline-[#DFE1E6] cursor-pointer mr-4 transition-transform duration-300 active:scale-[.8] ${
                        haulageMode
                            ? "outline-2 !outline-gun-metal bg-mvx-light-blue/50"
                            : "[&>*]:!text-[#7A869A] [&_path]:!fill-[#7A869A]"
                    }`}
                    onClick={() => {
                        setHaulageMode(!haulageMode);
                        setClicked(true);
                    }}
                >
                    {/* <BusIcon className="w-[28px] h-[28px] mb-1" /> */}
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687263163/Web%20App/dashboard/Bus_ftk60z.svg"
                        }
                        alt="Bus Icon"
                        className="w-[28px] h-[28px] mb-1"
                    />
                    <p className="text-sm font-rocGroteskMedium">Haulage</p>
                </div>
            </div>
        </>
    );
};

const TradeLanes = ({ goBack, ffProfile, profileLoading, updateLoading }) => {
    const [tradeLanes, setTradeLanes] = useState(() => ffProfile?.profile?.tradeLanes);
    const [reversed, setReversed] = useState();
    const [countryFrom, setCountryFrom] = useState();
    const [countryTo, setCountryTo] = useState();
    const dispatch = useDispatch();
    const [deleteLaneModal, setDeleteLaneModal] = useState();
    const [clickType, setClickType] = useState();
    const screenSize = useScreenSize();

    const swapTradeLanes = () => {
        const countryFromHolder = countryFrom;
        setCountryFrom(countryTo ?? "");
        setCountryTo(countryFromHolder ?? "");
    };

    const addTradeLanes = (evt) => {
        evt.preventDefault();
        setClickType();
        const newLane = { from: countryFrom, to: countryTo };
        dispatch(
            appActions.updateBusinessProfile({
                tradeLanes: tradeLanes?.length
                    ? reversed
                        ? [
                              newLane,
                              ...tradeLanes
                                  .map((lane) => ({
                                      from: lane.from,
                                      to: lane.to,
                                      active: lane.active,
                                  }))
                                  .reverse(),
                          ]
                        : [
                              ...tradeLanes.map((lane) => ({
                                  from: lane.from,
                                  to: lane.to,
                                  active: lane.active,
                              })),
                              newLane,
                          ]
                    : [newLane],
            })
        );
    };

    const deleteLane = (id) => {
        dispatch(
            appActions.updateBusinessProfile({
                tradeLanes: [
                    ...tradeLanes
                        .map(
                            (lane) =>
                                lane._id !== id && {
                                    from: lane.from,
                                    to: lane.to,
                                    active: lane.active,
                                }
                        )
                        .filter((lane) => lane),
                ],
            })
        );
    };

    const updateStatus = (id) => {
        dispatch(
            appActions.updateBusinessProfile({
                tradeLanes: [
                    ...tradeLanes.map((lane) =>
                        lane._id === id
                            ? { from: lane.from, to: lane.to, active: !lane.active }
                            : { from: lane.from, to: lane.to, active: lane.active }
                    ),
                ],
            })
        );
    };

    const renderLanes = () =>
        tradeLanes?.map(({ _id, from, to, active }, idx) => (
            <tr
                className={`grid items-center border-t py-4 px-5 grid-cols-[100px_300px_240px_minmax(150px,auto)] text-sm font-rocGroteskMedium`}
                key={_id}
            >
                <td>
                    {idx < 9 && 0}
                    {idx + 1}
                </td>
                <td className="flex items-center">
                    <ReactCountryFlag
                        countryCode={from}
                        svg
                        style={{
                            borderRadius: "100%",
                            width: "19px",
                            height: "16px",
                        }}
                    />
                    <span className="mx-2">{regionNames.of(from)}</span>
                    <span className="material-icons text-sm font-normal ml-auto mr-[90px]">
                        arrow_forward
                    </span>
                </td>
                <td className="flex items-center">
                    <ReactCountryFlag
                        countryCode={to}
                        svg
                        style={{
                            borderRadius: "100%",
                            width: "19px",
                            height: "16px",
                        }}
                    />
                    <span className="mx-2">{regionNames.of(to)}</span>
                </td>
                <td className="flex items-center">
                    <span
                        className={`rounded-full h-[7px] w-[7px] ${
                            active ? "bg-pacific-cyan" : "bg-red-600"
                        } mr-[6px]`}
                    />

                    <span className="mr-auto">{active ? "Active" : "Inactive"}</span>

                    <Dropdown
                        dropdown={<span className="material-icons text-xl">more_vert</span>}
                        dropdownContainerClasses={
                            "right-2 !top-6 !bg-white !w-[170px] !rounded !shadow-[0px_8px_24px_-6px_rgba(0,0,0,0.16),0px_0px_1px_rgba(0,0,0,0.4)]"
                        }
                        dropdownClassName={"!w-max rounded ml-[18px] !border-0 !py-1"}
                        dropdownItemsClasses={"last:text-[#FF0000]"}
                        dropdownOptions={[
                            {
                                label: !active ? "Set to active" : "Set to inactive",
                                value: "inactivate",
                                action: () => {
                                    setClickType("status");
                                    setDeleteLaneModal(_id);
                                },
                            },
                            {
                                label: "Delete",
                                value: "delete",
                                action: () => {
                                    setClickType("delete");
                                    setDeleteLaneModal(_id);
                                },
                            },
                        ]}
                    />
                </td>
            </tr>
        ));

    useEffect(() => {
        if (!updateLoading) {
            setCountryFrom("");
            setCountryTo("");
            setTradeLanes(ffProfile?.profile?.tradeLanes);
            setDeleteLaneModal(false);
        }
    }, [updateLoading, ffProfile]);

    return (
        <>
            <span
                className="flex items-center cursor-pointer text-[13px] w-max mb-3 max-sm:hidden"
                onClick={goBack}
            >
                <span className="material-icons text-lg mr-[3px] font-medium">arrow_back</span>
                <span className="underline">Go back</span>
            </span>

            <p className="text-[22px] font-rocGroteskBold flex max-sm:px-5">
                <span
                    onClick={goBack}
                    className="material-icons-outlined max-sm:block hidden text-lg font-semibold mr-2 sm:hidden"
                >
                    arrow_back
                </span>
                Set your Trade Lanes
            </p>
            <p className="text-mvx-gray font-rocGroteskMedium text-sm max-sm:px-5">
                Select the countries you wish to render your service to.
            </p>

            <form className="flex mt-7 max-900:flex-col max-sm:px-5" onSubmit={addTradeLanes}>
                <div className="flex-1">
                    <p className="text-sm mb-1 font-rocGroteskMedium">From</p>
                    <SelectInput
                        className={"!h-[44px]"}
                        value={countryFrom}
                        name={"Country From"}
                        placeholder={"Select a country"}
                        handleChange={(_, value) => setCountryFrom(value)}
                        isRequired={true}
                        dropdownOptions={countries.map(({ name, abbreviation }) => ({
                            label: name,
                            value: abbreviation,
                            icon: (
                                <ReactCountryFlag
                                    countryCode={abbreviation}
                                    svg
                                    style={{
                                        borderRadius: "100%",
                                        width: "19px",
                                        height: "16px",
                                    }}
                                />
                            ),
                        }))}
                    />
                </div>
                {/* <SwapIcon
                    className="basis-[42px] h-[37px] max-900:rotate-90 self-center translate-y-2 mx-5 cursor-pointer rounded-full px-[6px] transition-colors hover:bg-mvx-light-blue"
                    onClick={swapTradeLanes}
                /> */}
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687263206/Web%20App/dashboard/swap_rwdywb.svg"
                    }
                    alt="Swap Icon"
                    onClick={swapTradeLanes}
                    className="basis-[42px] h-[37px] max-900:rotate-90 self-center translate-y-2 mx-5 cursor-pointer rounded-full px-[6px] transition-colors hover:bg-mvx-light-blue"
                />
                <div className="flex-1">
                    <p className="text-sm mb-1 font-rocGroteskMedium">To</p>
                    <SelectInput
                        className={"!h-[44px]"}
                        value={countryTo}
                        name={"Country To"}
                        placeholder={"Select a country"}
                        handleChange={(_, value) => setCountryTo(value)}
                        isRequired={true}
                        dropdownOptions={countries.map(({ name, abbreviation }) => ({
                            label: name,
                            value: abbreviation,
                            icon: (
                                <ReactCountryFlag
                                    countryCode={abbreviation}
                                    svg
                                    style={{
                                        borderRadius: "100%",
                                        width: "19px",
                                        height: "16px",
                                    }}
                                />
                            ),
                        }))}
                    />
                </div>
                <button
                    className="font-rocGroteskRegular rounded max-900:mt-6 text-sm py-3 self-end ml-4 max-900:w-[200px] max-475:w-[160px] 900:basis-[155px] xl:basis-[213px] disabled:bg-pacific-cyan/90 bg-pacific-cyan"
                    disabled={updateLoading && !clickType}
                >
                    {updateLoading && !clickType ? <Loader color={"white"} /> : "Add Trade Lanes"}
                </button>
            </form>

            <div className="my-9 pb-12 max-sm:px-5 w-full">
                <p className="text-[15px] font-rocGroteskMedium mb-3">
                    All Trade Lanes ({tradeLanes?.length ? `${tradeLanes.length}` : ""})
                </p>

                <div className="w-full overflow-x-auto">
                    {screenSize >= 900 ? (
                        <table className="w-full">
                            <thead className="w-full">
                                <tr className="w-full grid bg-mvx-light-blue border border-b-0 items-center py-3 px-5 rounded-t-md grid-cols-[100px_300px_240px_minmax(150px,auto)] [&_*]:text-mvx-gray text-xs font-rocGroteskMedium">
                                    <td>
                                        <span
                                            className="flex items-center cursor-pointer w-max"
                                            onClick={() => {
                                                setReversed(!reversed);
                                            }}
                                        >
                                            NO{" "}
                                            {/* <UpDownIcon className="w-[18px] h-[18px] -translate-y-[.4px]" /> */}
                                            <img
                                                src={
                                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687263592/Web%20App/dashboard/up-down_iyuayc.svg"
                                                }
                                                alt="up down Icon"
                                                className="w-[18px] h-[18px] -translate-y-[.4px]"
                                            />
                                        </span>
                                    </td>
                                    <td>ORIGIN</td>
                                    <td>DESTINATION</td>
                                    <td>STATUS</td>
                                </tr>
                            </thead>
                            <tbody
                                className={`border border-t-0 rounded-b-md ${
                                    ((profileLoading && !ffProfile) ||
                                        (!profileLoading && !tradeLanes?.length)) &&
                                    "py-7 text-center"
                                }`}
                            >
                                {profileLoading ? (
                                    <>
                                        {tradeLanes?.length ? (
                                            <>
                                                {reversed ? renderLanes().reverse() : renderLanes()}
                                            </>
                                        ) : (
                                            <Loader size={7} />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {tradeLanes?.length
                                            ? reversed
                                                ? renderLanes().reverse()
                                                : renderLanes()
                                            : "No Trade lanes available"}
                                    </>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <div
                            className={`border rounded-md ${
                                ((profileLoading && !ffProfile) ||
                                    (!profileLoading && !tradeLanes?.length)) &&
                                "py-7 text-center"
                            }`}
                        >
                            <div>
                                {profileLoading ? (
                                    <>
                                        <Loader size={7} />
                                        {/* {tradeLanes?.length ? <>Lanes here</> : <Loader size={7} />} */}
                                    </>
                                ) : (
                                    <>
                                        {tradeLanes?.length ? (
                                            <>
                                                {tradeLanes?.map(
                                                    ({ _id, from, to, active }, idx) => (
                                                        <div
                                                            className={`${
                                                                idx && "border-t"
                                                            } px-4 pb-4 pt-3`}
                                                            key={_id}
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <ReactCountryFlag
                                                                        countryCode={from}
                                                                        svg
                                                                        style={{
                                                                            borderRadius: "100%",
                                                                            width: "22px",
                                                                            height: "22px",
                                                                        }}
                                                                    />
                                                                    <ReactCountryFlag
                                                                        countryCode={to}
                                                                        svg
                                                                        style={{
                                                                            borderRadius: "100%",
                                                                            border: "2px solid white",
                                                                            width: "26px",
                                                                            height: "26px",
                                                                            marginLeft: "-7px",
                                                                        }}
                                                                    />
                                                                </div>
                                                                <Dropdown
                                                                    dropdown={
                                                                        <span className="material-icons text-xl">
                                                                            more_vert
                                                                        </span>
                                                                    }
                                                                    dropdownContainerClasses={
                                                                        "right-2 !top-6 !bg-white !w-[170px] !rounded !shadow-[0px_8px_24px_-6px_rgba(0,0,0,0.16),0px_0px_1px_rgba(0,0,0,0.4)]"
                                                                    }
                                                                    dropdownClassName={
                                                                        "!w-max rounded ml-[18px] !border-0 !py-1"
                                                                    }
                                                                    dropdownItemsClasses={
                                                                        "last:text-[#FF0000]"
                                                                    }
                                                                    dropdownOptions={[
                                                                        {
                                                                            label: !active
                                                                                ? "Set to active"
                                                                                : "Set to inactive",
                                                                            value: "inactivate",
                                                                            action: () => {
                                                                                setClickType(
                                                                                    "status"
                                                                                );
                                                                                setDeleteLaneModal(
                                                                                    _id
                                                                                );
                                                                            },
                                                                        },
                                                                        {
                                                                            label: "Delete",
                                                                            value: "delete",
                                                                            action: () => {
                                                                                setClickType(
                                                                                    "delete"
                                                                                );
                                                                                setDeleteLaneModal(
                                                                                    _id
                                                                                );
                                                                            },
                                                                        },
                                                                    ]}
                                                                />
                                                            </div>
                                                            <div className="flex justify-between items-center text-sm mt-2">
                                                                <span className="text-xs 375:text-sm">
                                                                    {regionNames.of(from)}
                                                                </span>
                                                                <i className="ri-arrow-right-line text-base mx-1 self-center" />
                                                                <span className="mr-auto">
                                                                    {regionNames.of(to)}
                                                                </span>

                                                                <span className="flex items-center text-xs text-mvx-gray">
                                                                    <span
                                                                        className={`rounded-full h-[7px] w-[7px] ${
                                                                            active
                                                                                ? "bg-pacific-cyan"
                                                                                : "bg-red-600"
                                                                        } mr-[6px]`}
                                                                    />
                                                                    {active ? "Active" : "Inactive"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            "No Trade lanes available"
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {deleteLaneModal && (
                <ModalContainer>
                    <div className="bg-white rounded-lg overflow-hidden [&*]:font-rocGrotesk max-sm:fixed bottom-0 left-0 w-screen sm:w-[420px]">
                        <p className="text-[20px] text-center mt-6 mb-2 font-rocGroteskBold px-6">
                            {clickType === "delete"
                                ? "Delete Trade Lane?"
                                : "Update Trade Lane Status?"}
                        </p>
                        <p className="text-sm text-center px-6 mb-7 leading-[20px]">
                            Are you sure you want to{" "}
                            {clickType === "delete"
                                ? "delete this trade lane?"
                                : "update this trade lane status?"}
                            {clickType === "delete" &&
                                " This will be permanently remove it from your service"}
                        </p>
                        <div
                            className={`flex border-t-2 ${updateLoading && "pointer-events-none"}`}
                        >
                            <button
                                type="button"
                                className={`w-full rounded-none border-r text-mvx-neutral text-xs font-medium flex items-center justify-center bg-white py-5 px-3 transition-colors hover:bg-mvx-blue/[.02]`}
                                onClick={() => setDeleteLaneModal(false)}
                            >
                                NO
                            </button>
                            <button
                                onClick={() =>
                                    clickType === "delete"
                                        ? deleteLane(deleteLaneModal)
                                        : updateStatus(deleteLaneModal)
                                }
                                className={`w-full rounded-none border-l text-mvx-neutral  text-xs font-medium flex items-center justify-center bg-white py-5 px-3 transition-colors bg-mvx-blue/5`}
                            >
                                {updateLoading && clickType ? (
                                    <Loader color="gun-metal" size={4} />
                                ) : (
                                    <>{clickType === "delete" ? "YES, DELETE" : "YES UPDATE"}</>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </>
    );
};

export default ShipmentPreferences;
