/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useSelector } from "react-redux";
import { regionNames } from "helpers";
import Dropdown from "components/common/Dropdown";
import SelectInput from "components/common/SelectInput";
import countries from "variables/countries";
// import { UpDownIcon } from "assets/arts";
import Loader from "components/common/Loader";
import ModalContainer from "components/common/ModalContainer";

const TradeLanes = ({ tradeLanes, setTradeLanes }) => {
    const [activeItem, setActiveItem] = useState(false);
    const [reversed, setReversed] = useState();
    const [countryFrom, setCountryFrom] = useState();
    const [countryTo, setCountryTo] = useState();
    const [deleteLaneModal, setDeleteLaneModal] = useState();
    const [clickType, setClickType] = useState();
    const { ffProfile, ffProfileLoading } = useSelector((state) => state.auth);

    const swapTradeLanes = () => {
        const countryFromHolder = countryFrom;
        setCountryFrom(countryTo ?? "");
        setCountryTo(countryFromHolder ?? "");
    };

    const deleteLane = (id) => {
        const tradeLanesCopy = [...tradeLanes];
        setTradeLanes(() => {
            return tradeLanesCopy
                .map(
                    (lane, idx) =>
                        idx !== id && {
                            from: lane.from,
                            to: lane.to,
                            active: lane.active,
                        }
                )
                .filter((lane) => lane);
        });
        setDeleteLaneModal(false);
    };

    const updateStatus = (id) => {
        const tradeLanesCopy = [...tradeLanes];
        const lanes = tradeLanesCopy.map((lane, idx) => {
            const countryLane =
                idx === id
                    ? { from: lane.from, to: lane.to, active: !lane.active }
                    : { from: lane.from, to: lane.to, active: lane.active };

            return countryLane;
        });

        setTradeLanes(lanes);
        setDeleteLaneModal(false);
    };

    const renderLanes = () =>
        tradeLanes?.map(({ _id, from, to, active }, idx) => (
            <>
                <div
                    className={`max-sm:hidden grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr] items-center border-t py-4 px-5 text-sm font-rocGroteskMedium`}
                    key={idx}
                >
                    <span>
                        {idx < 9 && 0}
                        {idx + 1}
                    </span>
                    <span className="flex items-center">
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
                    </span>
                    <div className="flex justify-center">
                        <span className="material-icons text-sm font-normal">arrow_forward</span>
                    </div>

                    <span className="flex items-center">
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
                    </span>
                    <p className="flex items-center">
                        <span
                            className={`rounded-full h-[7px] w-[7px] ${
                                active ? "bg-pacific-cyan" : "bg-red-600"
                            } mr-[6px]`}
                        />

                        <span className="mr-auto">{active ? "Active" : "Inactive"}</span>
                    </p>

                    <div className="flex justify-center">
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
                                        setActiveItem(idx);
                                        setDeleteLaneModal(true);
                                    },
                                },
                                {
                                    label: "Delete",
                                    value: "delete",
                                    action: () => {
                                        setClickType("delete");
                                        setActiveItem(idx);
                                        setDeleteLaneModal(true);
                                    },
                                },
                            ]}
                        />
                    </div>
                </div>
                <div className="hidden p-4 border-t max-sm:rounded max-sm:block">
                    <div className="flex justify-between mb-3">
                        <div className="flex relative">
                            <div className="">
                                <ReactCountryFlag
                                    countryCode={from}
                                    svg
                                    style={{
                                        borderRadius: "100%",
                                        width: "19px",
                                        height: "16px",
                                    }}
                                />
                            </div>
                            <div className="left-[65%] w-[22px] h-[18px] rounded-full z-10 absolute">
                                <ReactCountryFlag
                                    countryCode={to}
                                    svg
                                    style={{
                                        borderRadius: "100%",
                                        border: "solid #fff 1.5px",
                                        width: "20.5px",
                                        height: "17.5px",
                                    }}
                                />
                            </div>
                        </div>
                        <div>
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
                                            setActiveItem(idx);
                                            setDeleteLaneModal(true);
                                        },
                                    },
                                    {
                                        label: "Delete",
                                        value: "delete",
                                        action: () => {
                                            setClickType("delete");
                                            setActiveItem(idx);
                                            setDeleteLaneModal(true);
                                        },
                                    },
                                ]}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">{regionNames.of(from)}</span>
                            <span className="material-icons text-sm font-normal">
                                arrow_forward
                            </span>
                            <span className="text-sm">{regionNames.of(to)}</span>
                        </div>
                        <div>
                            <p className="flex items-center">
                                <span
                                    className={`rounded-full h-[7px] w-[7px] ${
                                        active ? "bg-pacific-cyan" : "bg-red-600"
                                    } mr-[6px]`}
                                />

                                <span className="mr-auto text-sm">
                                    {active ? "Active" : "Inactive"}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </>
        ));

    useEffect(() => {
        setTradeLanes(
            tradeLanes?.length > 0 ? tradeLanes : ffProfile?.result?.profile?.tradeLanes ?? []
        );
    }, [ffProfile?.result, tradeLanes]);

    return (
        <>
            <p className="text-[22px] font-rocGroteskBold">Set your Trade Lanes</p>
            <p className="text-mvx-gray font-rocGroteskMedium text-sm">
                Select the countries you wish to render your service to.
            </p>

            <div className="flex mt-7 max-sm:flex-col max-sm:gap-4 ">
                <div className="basis-[50%]">
                    <p className="text-sm mb-1 font-rocGroteskMedium">From</p>
                    <SelectInput
                        className={"!h-[44px]"}
                        value={countryFrom}
                        name={"Country From"}
                        placeholder={"Select a country"}
                        handleChange={(_, value) => setCountryFrom(value)}
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
                    className="basis-[42px] max-sm:w-[35px] max-sm:rotate-90 h-[37px] self-center translate-y-2 mx-5 cursor-pointer rounded-full px-[6px] transition-colors hover:bg-mvx-light-blue"
                    onClick={swapTradeLanes}
                /> */}
                <img
                    src={
                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687263206/Web%20App/dashboard/swap_rwdywb.svg"
                    }
                    alt="Swap Icon"
                    onClick={swapTradeLanes}
                    className="basis-[42px] max-sm:w-[35px] max-sm:rotate-90 h-[37px] self-center translate-y-2 mx-5 cursor-pointer rounded-full px-[6px] transition-colors hover:bg-mvx-light-blue"
                />

                <div className="basis-[50%]">
                    <p className="text-sm mb-1 font-rocGroteskMedium">To</p>
                    <SelectInput
                        className={"!h-[44px]"}
                        value={countryTo}
                        name={"Country To"}
                        placeholder={"Select a country"}
                        handleChange={(_, value) => setCountryTo(value)}
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
                    className="font-rocGroteskRegular whitespace-nowrap text-sm py-3 px-7 self-end ml-4 basis-[213px] max-sm:basis-[100%] max-sm:w-full bg-gun-metal disabled:bg-gun-metal/45"
                    disabled={!countryFrom && !countryTo}
                    type="button"
                    onClick={() => {
                        setTradeLanes((prev) => {
                            return [
                                ...prev,
                                {
                                    from: countryFrom,
                                    to: countryTo,
                                    active: true,
                                },
                            ];
                        });
                        setCountryFrom("");
                        setCountryTo("");
                    }}
                >
                    Add Trade Lanes
                </button>
            </div>

            <div className="my-9 pb-12">
                <p className="text-[15px] font-rocGroteskMedium mb-3">All Trade Lanes</p>

                <div>
                    <div className="max-sm:hidden grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr] bg-mvx-light-blue border border-b-0 items-center py-3 px-5 rounded-t-md  [&_*]:text-mvx-gray text-xs font-rocGroteskMedium">
                        <div>
                            <span
                                className="flex items-center cursor-pointer w-max"
                                onClick={() => {
                                    setReversed(!reversed);
                                }}
                            >
                                NO
                                {/* <UpDownIcon className="w-[18px] h-[18px] -translate-y-[.4px]" /> */}
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687263592/Web%20App/dashboard/up-down_iyuayc.svg"
                                    }
                                    alt="up down Icon"
                                    className="w-[18px] h-[18px] -translate-y-[.4px]"
                                />
                            </span>
                        </div>
                        <span>ORIGIN</span>
                        <span></span>
                        <span>DESTINATION</span>
                        <span>STATUS</span>
                    </div>

                    <div
                        className={`border border-t-0 max-sm:rounded rounded-b-md ${
                            ((ffProfileLoading && !ffProfile) ||
                                (!ffProfileLoading && !tradeLanes?.length)) &&
                            "py-7 text-center"
                        }`}
                    >
                        {ffProfileLoading ? (
                            <>
                                {tradeLanes?.length ? (
                                    <>{reversed ? renderLanes().reverse() : renderLanes()}</>
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
                    </div>
                </div>
                <div>
                    <div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>

            {deleteLaneModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        setDeleteLaneModal(false);
                    }}
                >
                    <div className="bg-white rounded-lg overflow-hidden [&*]:font-rocGrotesk ">
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
                        <div className={`flex border-t-2`}>
                            <button
                                type="button"
                                className={`w-full rounded-none border-r text-mvx-neutral text-xs font-medium flex items-center justify-center bg-white py-5 px-3 transition-colors hover:bg-mvx-blue/[.02]`}
                                onClick={() => setDeleteLaneModal(false)}
                            >
                                NO
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    clickType === "delete"
                                        ? deleteLane(activeItem)
                                        : updateStatus(activeItem)
                                }
                                className={`w-full rounded-none border-l text-mvx-neutral  text-xs font-medium flex items-center justify-center bg-white py-5 px-3 transition-colors bg-mvx-blue/5`}
                            >
                                {clickType === "delete" ? "YES, DELETE" : "YES UPDATE"}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </>
    );
};

export default TradeLanes;
