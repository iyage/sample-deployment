import { useQuery } from "@tanstack/react-query";
import { ModalService } from "components/common/Modals/ModalService";
import Skeleton from "components/common/Skeleton";
import { settingsConstant } from "constants/settingsConstants";
import { getCurrencyFromCurrencyCode } from "helpers";
import React, { useState } from "react";
import { settingsService } from "services/settingsService";
import FundWalletModal from "./FundWalletModal";
import formatCurrency from "helpers/formatCurrency";

const WalletBalance = () => {
    const [showBalance, setShowBalance] = useState(false);
    const { data, isLoading } = useQuery({
        queryKey: [settingsConstant.FETCH_WALLET],
        queryFn: () => settingsService.getWallet("NGN"),
    });
    const walletActions = [
        { title: "Send", icon: "/icons/send.svg", action: () => {} },
        { title: "Withdraw", icon: "/icons/send.svg", action: () => {} },
        {
            title: "Fund wallet",
            icon: "/icons/card_receive.svg",
            action: () => {
                ModalService.open({
                    modal: FundWalletModal,
                    props: {
                        walletId: data?.data?.wallet?._id || "",
                    },
                });
            },
        },
    ];

    return (
        <section className="bg-midnight-black py-8 px-10 rounded-2xl flex items-center justify-between">
            <div className="">
                <div className="flex items-center gap-2 mb-7">
                    <img src="/icons/wallet.svg" alt="Wallet" className="w-5 h-5" />
                    <p className="text-white font-rocGrotesk -mb-0.5">WALLET</p>
                    <img
                        src="/icons/eye.svg"
                        alt="Eye"
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => setShowBalance(!showBalance)}
                    />
                </div>

                <Skeleton dataLoaded={!isLoading} className="w-[250px] h-8 bg-midnight-black">
                    {showBalance ? (
                        <p className="text-white font-rocGroteskBold text-[48px]">
                            <span className="text-white font-rocGroteskBold text-3xl">
                                {getCurrencyFromCurrencyCode("ngn")}
                            </span>
                            {formatCurrency(data?.data?.wallet?.balance, true)}
                        </p>
                    ) : (
                        <p className="text-white font-rocGroteskBold text-[48px]">*******</p>
                    )}
                </Skeleton>
            </div>

            <div className="flex gap-8 items-center">
                {walletActions?.map((w) => (
                    <div key={w?.title} className="cursor-pointer" onClick={() => w?.action?.()}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white mb-4 mx-auto">
                            <img src={w?.icon} alt={w?.title} className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-white font-rocGrotesk text-center">{w?.title}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WalletBalance;
