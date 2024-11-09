import ModalContainer from "components/common/ModalContainer";
import SelectInput from "components/common/SelectInput";
import moment from "moment";
import React, { useState, memo, useRef } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import Loader from "components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { shipmentActions, trackingActions } from "actions";
import { firebaseService } from "services/firebaseService";
import { useEffect } from "react";

function StatusUpdate({ shipment }) {
    const dispatch = useDispatch();
    const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
    const [status, setStatus] = useState({
        message: "",
        statusOption: "",
    });
    const [statusAttachments, setStatusAttachments] = useState([]);
    const [documentUploading, setDocumentUploading] = useState(false);

    const { sendShipmentStatusLoading } = useSelector((state) => state.shipment);

    const handleUpload = (fileName, file) => {
        setDocumentUploading(true);

        firebaseService.uploadFile(`relayApp/${fileName}`, file, (url) => {
            setStatusAttachments((prev) => [
                ...prev,
                {
                    name: fileName,
                    file: url !== "error" ? url : "",
                    type: file?.type,
                },
            ]);
            setDocumentUploading(false);
            setIsStatusUpdateModalOpen(false);
            dispatch(trackingActions.fetchTrackingShipment(shipment._id));
            dispatch(
                trackingActions.fetchTrackingShipmentsBySearch("", shipment?.currentStatus, {}, 1)
            );
        });
    };

    const prevLoadingRef = useRef();
    useEffect(() => {
        prevLoadingRef.current = sendShipmentStatusLoading;
    }, [sendShipmentStatusLoading]);
    const prevLoading = prevLoadingRef.current;

    useEffect(() => {
        if (prevLoading && !sendShipmentStatusLoading && shipment) {
            setIsStatusUpdateModalOpen(false);
            dispatch(trackingActions.fetchTrackingShipment(shipment._id));
        }
    }, [sendShipmentStatusLoading, prevLoading, dispatch, shipment]);
    return (
        <div className="mt-[24px] h-full font-rocGroteskMedium flex flex-col">
            {shipment?.shippingStatus?.length ? (
                shipment?.shippingStatus.map((stats, idx) => (
                    <div className="flex w-full flex-grow " key={stats._id + idx}>
                        <div className="mr-[24px] w-[8px] flex flex-col justify-start items-center">
                            <div className="w-[8px] h-[8px] rounded-[50%] bg-gun-metal"></div>
                            <div className="w-[2px] h-full bg-gun-metal font-rocGroteskMedium text-gun-metal pb-[24px] border-t border-gun-metal"></div>
                        </div>

                        <div>
                            <div>
                                <p className="mb-[6px]">
                                    {stats.status}
                                    {stats.reason && ", " + stats.reason}
                                </p>
                                <p className="text-mvx-neutral mb-[12px]">
                                    {" "}
                                    {moment(stats.time).format("ddd, Do MMM YYYY LT")}
                                </p>
                            </div>

                            <div className=" mb-[32px]">
                                <button
                                    className="underline bg-transparent text-left text-gun-metal p-0"
                                    onClick={() => setIsStatusUpdateModalOpen(true)}
                                >
                                    {" "}
                                    Send update{" "}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="pt-12 flex flex-col items-center text-center max-800:pb-14">
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687262463/Web%20App/dashboard/message-cancel_lczuc6.svg"
                        }
                        alt="Message Canceled Icon"
                        className="h-[29px] w-[29px]"
                    />
                    <p className="font-rocGroteskMedium mt-3">No Shipment update</p>
                    <p className="text-[13px] font-rocGroteskMedium mt-1">
                        No update is currently available for your shipment yet.
                    </p>
                    <button
                        className="underline bg-transparent text-left text-gun-metal p-0"
                        onClick={() => setIsStatusUpdateModalOpen(true)}
                    >
                        {" "}
                        Send update{" "}
                    </button>
                </div>
            )}

            {isStatusUpdateModalOpen && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-[95%]"
                    closeModal={() => {
                        setIsStatusUpdateModalOpen(false);
                        setStatus({
                            message: "",
                            statusOption: "",
                        });
                        setStatusAttachments([]);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                What's the status of the shipment?
                            </p>
                            <div>
                                <SelectInput
                                    value={status.statusOption}
                                    name="statusOption"
                                    placeholder={"Select Status"}
                                    handleChange={(name, value) =>
                                        setStatus((prev) => ({ ...prev, statusOption: value }))
                                    }
                                    dropdownOptions={[
                                        {
                                            label: "Shipment is live",
                                            value: "Shipment is live",
                                        },
                                        {
                                            label: "Shipment is now in transit",
                                            value: "Shipment is now in transit",
                                        },
                                        {
                                            label: "Shipment delivered",
                                            value: "Shipment delivered",
                                        },
                                        {
                                            label: "Shipment ready for pickup",
                                            value: "Shipment ready for pickup",
                                        },
                                        {
                                            label: "Shipment picked up",
                                            value: "Shipment picked up",
                                        },
                                        {
                                            label: "Export clearance",
                                            value: "Export clearance",
                                        },
                                        {
                                            label: "Documentation in progress",
                                            value: "Documentation in progress",
                                        },
                                        {
                                            label: "Shipment department origin",
                                            value: "Shipment department origin",
                                        },
                                        {
                                            label: "Customs Examination in progress",
                                            value: "Customs Examination in progress",
                                        },
                                        {
                                            label: "Customs query",
                                            value: "Customs query",
                                        },
                                        {
                                            label: "Customs query resolved",
                                            value: "Customs query resolved",
                                        },
                                        {
                                            label: "Customs release and exit",
                                            value: "Customs release and exit",
                                        },
                                        {
                                            label: "Shipment released",
                                            value: "Shipment released",
                                        },
                                        {
                                            label: "Truck on queue for loading",
                                            value: "Truck on queue for loading",
                                        },
                                        {
                                            label: "Shipment loaded",
                                            value: "Shipment loaded",
                                        },
                                    ]}
                                />
                                <div className="border rounded mt-4">
                                    <textarea
                                        className="appearance-none rounded outline-0 !border-0 w-full text-[13px] font-rocGroteskMedium placeholder:font-rocGroteskMedium p-3 resize-none leading-5"
                                        rows={"3"}
                                        value={status.message}
                                        onChange={(evt) =>
                                            setStatus((prev) => ({
                                                ...prev,
                                                message: evt.target.value,
                                            }))
                                        }
                                        placeholder={"Type a message"}
                                    />
                                    <div className="p-3">
                                        <div className="mb-3 flex flex-wrap gap-2">
                                            {statusAttachments.map((item, idx) => {
                                                return item?.type?.includes("image") ? (
                                                    <div key={idx} className="relative">
                                                        <img
                                                            src={item.file}
                                                            alt={item.name}
                                                            className="w-[52px] h-[52px] rounded"
                                                        />
                                                        <div
                                                            onClick={() => {
                                                                const attachments = [
                                                                    ...statusAttachments,
                                                                ];
                                                                attachments.splice(idx, 1);
                                                                setStatusAttachments(attachments);
                                                            }}
                                                            className="absolute top-[-6px] right-[-6px] cursor-pointer w-5 h-5 bg-mvx-light-blue border-white border-2 rounded-full flex items-center justify-center"
                                                        >
                                                            <span className="material-icons text-sm text-mvx-neutral">
                                                                close
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : item?.type?.includes("application") ? (
                                                    <div key={idx} className="relative">
                                                        <div className="py-2 px-[10px] border rounded">
                                                            <p className="text-xs text-gun-metal mb-1 font-rocGroteskMedium">
                                                                {_.truncate(item?.name, {
                                                                    length: 20,
                                                                })}
                                                            </p>
                                                            <p className="text-xs text-mvx-neutral uppercase font-rocGroteskMedium">
                                                                Document
                                                            </p>
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                const attachments = [
                                                                    ...statusAttachments,
                                                                ];
                                                                attachments.splice(idx, 1);
                                                                setStatusAttachments(attachments);
                                                            }}
                                                            className="absolute top-[-6px] right-[-6px] cursor-pointer w-5 h-5 bg-mvx-light-blue border-white border-2 rounded-full flex items-center justify-center"
                                                        >
                                                            <span className="material-icons text-sm text-mvx-neutral">
                                                                close
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                        {documentUploading ? (
                                            <div className="flex w-fit justify-start">
                                                <Loader color={"gun-metal"} />
                                            </div>
                                        ) : (
                                            <div className="flex relative">
                                                <div className="w-6 h-6 cursor-pointer rounded-full bg-mvx-light-blue flex items-center justify-center">
                                                    <span className="material-icons text-base text-mvx-neutral">
                                                        add
                                                    </span>
                                                </div>
                                                <input
                                                    className="absolute w-6 h-6 opacity-0 cursor-pointer left-0"
                                                    type={"file"}
                                                    onChange={(evt) => {
                                                        handleUpload(
                                                            evt.target.files[0].name,
                                                            evt.target.files[0]
                                                        );
                                                    }}
                                                    accept={
                                                        "image/*, .pdf, .doc, .docx, .ppt, .xlsx, .xltx, .xlm, .xls, .cts, .xlr, .csv, .mp3, .ogg"
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase w-full rounded-bl-lg text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
                                onClick={() => {
                                    setIsStatusUpdateModalOpen(false);
                                    setStatus({
                                        message: "",
                                        statusOption: "",
                                    });
                                    setStatusAttachments([]);
                                }}
                            >
                                close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const data = {
                                        shipmentId: shipment?._id,
                                        message: status.statusOption,
                                        media: statusAttachments.map((fileInfo) => ({
                                            filename: fileInfo?.name,
                                            content: fileInfo?.file,
                                        })),
                                        additionalInfo: status.message,
                                    };
                                    dispatch(shipmentActions.sendShipmentStatusUpdate(data));
                                }}
                                disabled={documentUploading}
                                className={`uppercase w-full rounded-br-lg text-gun-metal text-xs font-rocGroteskMedium flex items-center justify-center bg-[#FAFBFC] py-5 border-y px-3`}
                            >
                                {sendShipmentStatusLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">Send update</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
}

export default memo(StatusUpdate);
