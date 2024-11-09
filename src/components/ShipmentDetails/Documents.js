// import { FileFilledIcon } from "assets/arts";
import ModalContainer from "components/common/ModalContainer";
import useModal from "components/common/Modals/ModalProvider";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Documents = ({ ffShipment, loading }) => {
    const [PDFModal, setPDFModal] = useState(null);
    const { shipmentId } = useParams();
    const { openModal } = useModal();

    return (
        <>
            <div className="pt-3 flex justify-end">
                <button
                    className="bg-pacific-cyan rounded py-2 px-4 flex items-center justify-center gap-2"
                    onClick={() => openModal("upload-shipment-document", { shipmentId })}
                >
                    <span className="material-icons-outlined text-white text-sm">add</span>
                    <span className="text-sm font-rocGroteskMedium text-white">New file</span>
                </button>
            </div>
            {loading ? (
                <></>
            ) : (
                <>
                    {ffShipment?.document?.length ? (
                        <div
                            className="pt-3 max-800:pb-14 800:overflow-y-auto 800:h-[290px] grid grid-cols-4 gap-x-8 gap-y-6"
                            style={{ gridAutoRows: "minmax(155px, max-content)" }}
                        >
                            {ffShipment.document.map((doc, idx) => (
                                <div
                                    className="border pt-10 pb-9 px-4 rounded cursor-pointer"
                                    style={{
                                        background:
                                            "linear-gradient(-45deg, transparent 60px), #ddd 0 top right",
                                    }}
                                    key={doc._id + idx}
                                    onClick={() => setPDFModal(doc.path)}
                                >
                                    {/* <PDFIcon /> */}
                                    <img
                                        src={
                                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687258778/Web%20App/messaging_link/pdf-document_rvpnl1.svg"
                                        }
                                        alt="pdf icon"
                                    />
                                    <p className="font-rocGroteskMedium text-sm mt-3">
                                        {doc?.filename || `Document ${idx + 1}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="pt-12 flex flex-col items-center text-center max-800:pb-12">
                            {/* <FileFilledIcon className="h-[29px] w-[29px]" /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687262310/Web%20App/dashboard/fileLeft_jjyp4y.svg"
                                }
                                alt="File Filled Icon"
                                className="h-[29px] w-[29px]"
                            />
                            <p className="font-rocGroteskMedium mt-3">No document here</p>
                            <p className="text-[13px] font-rocGroteskMedium mt-1">
                                You have no documents to show here
                            </p>
                        </div>
                    )}
                </>
            )}

            {PDFModal && (
                <ModalContainer showCloseIcon closeModal={() => setPDFModal(null)}>
                    <iframe
                        className="w-[70vw] h-[80vh] rounded-md"
                        src={PDFModal}
                        title={PDFModal}
                    />
                </ModalContainer>
            )}
        </>
    );
};

export default Documents;
