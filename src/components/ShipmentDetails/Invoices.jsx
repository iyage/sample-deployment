import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import Skeleton from "components/common/Skeleton";
import config from "config/config";
import { shipmentConstants } from "constants";
import { getCurrencyFromCurrencyCode } from "helpers";
import { formatMoneyDisplay } from "helpers/formatMoney";
import React from "react";
import { MdArrowOutward } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { paymnentService } from "services";
import DropdownMenu from "components/common/DropdownMenu";
import { useCopyToClipboard } from "react-use";
import toast from "react-hot-toast";
import CustomToast from "components/common/CustomToast";
import useModal from "components/common/Modals/ModalProvider";

const ShipmentInvoices = () => {
    const { shipmentId } = useParams();
    const { openModal } = useModal();
    const [, copyToClipboard] = useCopyToClipboard();
    const { data, isLoading } = useQuery({
        queryKey: [shipmentId, shipmentConstants.FETCH_SHIPMENT_INVOICES],
        queryFn: () => paymnentService.fetchInvoices({ invoiceType: "shipment", shipmentId }),
    });
    const invoices = data?.data?.data || [];

    return (
        <Skeleton dataLoaded={!isLoading} className="w-full mt-3 h-5/6 min-h-[200px]">
            <div className="pb-5">
                {!invoices?.length ? (
                    <div className="pt-16 flex flex-col items-center text-center">
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687262310/Web%20App/dashboard/fileLeft_jjyp4y.svg"
                            }
                            alt="File Filled Icon"
                            className="h-[29px] w-[29px]"
                        />
                        <p className="font-rocGroteskMedium mt-3">No invoices here</p>
                        <p className="text-[13px] font-rocGroteskMedium mt-1">
                            You have no invoices to show here
                        </p>
                    </div>
                ) : (
                    <div className="w-full pt-6 h-full">
                        <div className="border border-neutral-n-40 rounded">
                            <div className="w-full grid grid-cols-[50px_minmax(200px,_1fr)_100px_90px_150px_30px] py-3 px-6 gap-6 border-b border-neutral-n-40">
                                <p className="uppercase font-rocGroteskMedium text-neutral-n-200 text-xs">
                                    #
                                </p>
                                <p className="uppercase font-rocGroteskMedium text-neutral-n-200 text-xs">
                                    NOTE
                                </p>
                                <p className="uppercase font-rocGroteskMedium text-neutral-n-200 text-xs">
                                    Amount
                                </p>
                                <p className="uppercase font-rocGroteskMedium text-neutral-n-200 text-xs">
                                    Status
                                </p>
                                <p className="uppercase font-rocGroteskMedium text-neutral-n-200 text-xs">
                                    View
                                </p>
                                <p className="uppercase font-rocGroteskMedium text-neutral-n-200 text-xs"></p>
                            </div>
                            <div className="max-h-[250px] overflow-y-auto divide-y divide-neutral-n-40 mt-0">
                                {invoices?.map((inv) => (
                                    <div
                                        className="w-full grid grid-cols-[50px_minmax(200px,_1fr)_100px_90px_150px_30px] py-3 px-6 gap-6"
                                        key={inv?._id}
                                    >
                                        <p className="truncate text-sm text-midnight-black font-rocGroteskMedium">
                                            {inv?.mvxid || "---"}
                                        </p>
                                        <p className="truncate text-sm text-midnight-black font-rocGroteskMedium">
                                            {inv?.note || "---"}
                                        </p>
                                        <p className="truncate text-sm text-midnight-black font-rocGroteskMedium">
                                            {`${getCurrencyFromCurrencyCode(
                                                inv?.amount?.currency
                                            )}${formatMoneyDisplay(inv?.amount?.value)}`}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={classNames("w-1.5 h-1.5 rounded-full", {
                                                    "bg-[#FF5C58]": [
                                                        "pending",
                                                        "cancelled",
                                                    ]?.includes(inv?.paymentStatus),
                                                    "bg-[#01B4D2]": [
                                                        "paid",
                                                        "payout-completed",
                                                    ]?.includes(inv?.paymentStatus),
                                                })}
                                            />

                                            <p className="truncate text-sm text-midnight-black font-rocGroteskMedium capitalize">
                                                {inv?.paymentStatus}
                                            </p>
                                        </div>
                                        <a
                                            className="flex items-center gap-1 cursor-pointer"
                                            href={`${config?.BASE_URL}/payment/${inv?._id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <p className="text-sm text-midnight-black font-rocGroteskMedium underline">
                                                View payment link
                                            </p>
                                            <MdArrowOutward className="fill-[#000918] w-4 h-4" />
                                        </a>
                                        <div className="flex items-center justify-center">
                                            <div className="w-7 h-7 rounded-full hover:bg-[#F6F7FB] flex items-center justify-center cursor-pointer">
                                                <DropdownMenu
                                                    icon={
                                                        <HiDotsVertical className="w-3 h-3 fill-[#000918]" />
                                                    }
                                                    options={[
                                                        {
                                                            label: "View Link",
                                                            action: () =>
                                                                window.open(
                                                                    `${config?.BASE_URL}/payment/${inv?._id}`,
                                                                    "_blank"
                                                                ),
                                                            className:
                                                                "px-4 py-2 hover:bg-[#F6F7FB] w-full font-rocGroteskMedium text-sm text-midnight-black",
                                                        },
                                                        {
                                                            label: "Copy Link",
                                                            action: () => {
                                                                copyToClipboard(
                                                                    `${config?.BASE_URL}/payment/${inv?._id}`
                                                                );
                                                                toast.custom((t) => (
                                                                    <CustomToast
                                                                        t={t}
                                                                        message={
                                                                            "Payment Link Copied"
                                                                        }
                                                                        type="success"
                                                                    />
                                                                ));
                                                            },
                                                            className:
                                                                "px-4 py-2 hover:bg-[#F6F7FB] w-full font-rocGroteskMedium text-sm text-midnight-black",
                                                        },
                                                        {
                                                            label: "Cancel Link",
                                                            action: () =>
                                                                openModal("cancel_invoice", {
                                                                    invoiceId: inv?._id,
                                                                    invoiceNo: inv?.mvxid,
                                                                }),
                                                            hide: [
                                                                "paid",
                                                                "payout-completed",
                                                                "cancelled",
                                                            ]?.includes(inv?.paymentStatus),
                                                            className:
                                                                "px-4 py-2 hover:bg-[#FFE7E7] w-full font-rocGroteskMedium text-[#FF0000] text-sm",
                                                        },
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Skeleton>
    );
};

export default ShipmentInvoices;
