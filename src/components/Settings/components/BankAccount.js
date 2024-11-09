import Dropdown from "components/common/Dropdown";
import React, { useEffect, useState } from "react";
import usFlag from "assets/images/dashboard/round_us_flag.svg";
import ukFlag from "assets/images/dashboard/round_uk_flag.svg";
import ngFlag from "assets/images/dashboard/round_ng_flag.svg";
import eurFlag from "assets/images/dashboard/round_eur_flag.svg";
import SelectInput from "components/common/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/common/Loader";
import _ from "lodash";
import { authActions, paymentActions } from "actions";
import ModalContainer from "components/common/ModalContainer";
import { getFromStorage } from "helpers";
import WalletBalance from "./WalletBalance";
import WalletLogs from "./WalletLogs";

const BankAccount = ({ setActiveMobileSection }) => {
    const [allAccounts, setAllAccounts] = useState(true);
    const [bankForm, setBankForm] = useState(false);
    const user = getFromStorage("tradeAlly-user");
    const [deleteAcctModal, setDeleteAcctModal] = useState(false);
    const [bankDetails, setBankDetails] = useState(false);
    const [selectedBank, setSelectedBank] = useState({});
    const [copied, setCopied] = useState(false);
    const [bankInfo, setBankInfo] = useState({
        currency: "",
        iban: "",
        sortCode: "",
        bankName: "",
        acctNum: "",
        acctName: "",
    });
    const [banks, setBanks] = useState([]);
    const { ffProfile, ffProfileLoading } = useSelector((state) => state.auth);
    const {
        fetchingBanksSuccess,
        resolveBankDetailsSuccess,
        addBankAcctSuccess,
        addBankAcctLoading,
        deletingBankAcct,
        deletingBankAcctSuccess,
    } = useSelector((state) => state.payment);

    const dispatch = useDispatch();

    const canAddAccount = () => {
        const validateNGNAcct = Object.values({
            bankCode: bankInfo.bankName.split(".")?.[1],
            accountNumber: bankInfo.acctNum,
            bankName: bankInfo.bankName.split(".")?.[0],
            accountName: bankInfo.acctName,
            currency: bankInfo.currency,
        }).map((value) => Boolean(value));

        const validateOtherAcct = Object.values({
            accountName: bankInfo.acctName,
            iban: bankInfo.iban,
            accountNumber: bankInfo.acctNum,
            bankName: bankInfo.bankName.split(".")?.[0],
            bankCode: bankInfo.sortCode,
            currency: bankInfo.currency,
        }).map((value) => Boolean(value));

        return bankInfo.currency.toLowerCase() === "ngn"
            ? validateNGNAcct
            : [...validateOtherAcct, Boolean(resolveBankDetailsSuccess)];
    };

    const handleInputChange = (name, value) => {
        setBankInfo((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const body =
            bankInfo.currency.toLowerCase() === "ngn"
                ? {
                      bankCode: bankInfo.bankName.split(".")?.[1],
                      accountNumber: bankInfo.acctNum,
                      bankName: bankInfo.bankName.split(".")?.[0],
                      accountName: bankInfo.acctName,
                      currency: bankInfo.currency,
                  }
                : {
                      accountName: bankInfo.acctName,
                      iban: bankInfo.iban,
                      accountNumber: bankInfo.acctNum,
                      bankName: bankInfo.bankName.split(".")?.[0],
                      sortCode: bankInfo.sortCode,
                      bankCode: bankInfo.sortCode,
                      bic: resolveBankDetailsSuccess?.bankDetails?.bic,
                      branchName:
                          resolveBankDetailsSuccess?.bankDetails?.branchName ??
                          bankInfo.bankName.split(".")?.[0],
                      branchCode: resolveBankDetailsSuccess?.bankDetails?.branchCode,
                      country: resolveBankDetailsSuccess?.bankDetails?.country,
                      countryIso: resolveBankDetailsSuccess?.bankDetails?.countryIso,
                      address: resolveBankDetailsSuccess?.bankDetails?.address,
                      currency: bankInfo.currency,
                  };

        return dispatch(paymentActions.addBankAcct(body));
    };

    useEffect(() => {
        if (Boolean(ffProfile)) {
            const data = ffProfile?.result?.profile?.banks?.filter(
                (item) => item?.deleted === false
            );
            setBanks(data);
        }
    }, [ffProfile]);

    useEffect(() => {
        if (bankInfo.currency?.toLowerCase() === "ngn" && !fetchingBanksSuccess) {
            dispatch(paymentActions.getBanks());
        }
    }, [bankInfo.currency, dispatch, fetchingBanksSuccess]);

    useEffect(() => {
        if (Boolean(resolveBankDetailsSuccess) && bankInfo.currency?.toLowerCase() === "ngn") {
            setBankInfo((prev) => ({
                ...prev,
                acctName: resolveBankDetailsSuccess?.bankDetails?.account_name,
            }));
        }
    }, [resolveBankDetailsSuccess, bankInfo.currency]);

    useEffect(() => {
        if (Boolean(deletingBankAcctSuccess)) {
            setDeleteAcctModal(false);
            setAllAccounts(true);
            setBankDetails(false);

            const banksCopy = [...banks];
            const deletedAcctIdx = banksCopy?.findIndex((bank) => bank?._id === selectedBank?._id);

            if (deletedAcctIdx !== -1) {
                banksCopy.splice(deletedAcctIdx, 1);
                setBanks(banksCopy);
            }
        }
    }, [deletingBankAcctSuccess, banks, selectedBank?._id]);

    useEffect(() => {
        if (Boolean(addBankAcctSuccess)) {
            setAllAccounts(true);
            setBankForm(false);
            setBankInfo({
                currency: "",
                iban: "",
                sortCode: "",
                bankName: "",
                acctNum: "",
                acctName: "",
            });
            dispatch(authActions.fetchFreightForwarderProfile(user?._id));
            // setBanks((prev) => {
            //     return [...prev, addBankAcctSuccess?.bank];
            // });
        }
    }, [addBankAcctSuccess, dispatch, user?._id]);

    if (ffProfileLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <WalletBalance />
            {allAccounts && (
                <div className="max-sm:px-5 mt-10">
                    <div className="mb-6">
                        {/* <p className="text-[20px] font-rocGroteskBold mb-1">Bank accounts</p> */}
                        <div className="max-sm:flex max-sm:gap-4">
                            <span
                                onClick={() => setActiveMobileSection(false)}
                                className="material-icons-outlined max-sm:block hidden text-lg font-semibold "
                            >
                                arrow_back
                            </span>
                            <p className="text-[22px] font-rocGroteskBold mb-1">Bank accounts</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 max-sm:grid-cols-2 max-lg:grid-cols-3">
                        {banks?.map((bank) => {
                            return (
                                <div
                                    key={bank?._id}
                                    onClick={() => {
                                        setSelectedBank(bank);
                                        setAllAccounts(false);
                                        setBankDetails(true);
                                    }}
                                    className="p-4 rounded cursor-pointer w-[188px] max-lg:w-[178px] bg-mvx-light-blue"
                                >
                                    <img
                                        src={
                                            bank?.currency?.toLowerCase() === "ngn"
                                                ? ngFlag
                                                : bank?.currency?.toLowerCase() === "usd"
                                                ? usFlag
                                                : bank?.currency?.toLowerCase() === "gbp"
                                                ? ukFlag
                                                : eurFlag
                                        }
                                        alt="flag"
                                        className="w-9 h-9 rounded-full bg-gray-400 mb-[42px]"
                                    />
                                    <div className="mb-3">
                                        <p className="text-base font-rocGroteskMedium text-gun-metal ">
                                            {bank?.accountNumber}
                                        </p>
                                        <p className="text-sm font-rocGroteskMedium text-mvx-neutral ">
                                            {_.truncate(bank?.accountName, {
                                                length: 18,
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="py-[3px] px-[10px] bg-[#EBECF0] rounded-xl flex items-center justify-center">
                                            <p className="text-xs text-gun-metal font-rocGroteskMedium">
                                                {bank?.currency}
                                            </p>
                                        </div>
                                        <div onClick={(e) => e.stopPropagation()} className="w-fit">
                                            <Dropdown
                                                value={""}
                                                dropdown={
                                                    <span
                                                        onClick={() => setSelectedBank(bank)}
                                                        className="material-icons text-base"
                                                    >
                                                        more_vert
                                                    </span>
                                                }
                                                dropdownContainerClasses={
                                                    "left-[-155px] top-[50px] !w-[188px] shadow-dropdownShadow rounded"
                                                }
                                                dropdownItemsClasses={"last:text-[#FF0000]"}
                                                name={"bank option"}
                                                dropdownOptions={[
                                                    {
                                                        label: "Copy details",
                                                        value: "Copy details",
                                                        action: () => {
                                                            navigator.clipboard.writeText(
                                                                `${
                                                                    selectedBank?.iban
                                                                        ? "IBAN: " +
                                                                          selectedBank?.iban +
                                                                          ", "
                                                                        : ""
                                                                }${
                                                                    selectedBank?.branchCode
                                                                        ? "Sort Code: " +
                                                                          selectedBank.branchCode +
                                                                          ", "
                                                                        : ""
                                                                } Bank Name: ${
                                                                    selectedBank.bankName
                                                                }, Account Number: ${
                                                                    selectedBank.accountNumber
                                                                }, Account Name: ${
                                                                    selectedBank.accountName
                                                                }`
                                                            );
                                                        },
                                                    },
                                                    {
                                                        label: "Delete account",
                                                        value: "Delete account",
                                                        action: () => setDeleteAcctModal(true),
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div
                            onClick={() => {
                                setAllAccounts(false);
                                setBankForm(true);
                            }}
                            className="p-4 rounded cursor-pointer w-[188px] max-lg:w-[178px] bg-mvx-light-blue"
                        >
                            <div className="w-9 h-9 text-2xl font-rocGroteskMedium rounded-full bg-[#DFE1E6] mb-[42px] flex justify-center items-center text-mvx-neutral">
                                +
                            </div>
                            <div className="mb-3">
                                <p className="text-base font-rocGroteskMedium text-gun-metal ">
                                    Add new account
                                </p>
                                <p className="text-sm font-rocGroteskMedium text-mvx-neutral ">
                                    Click to add account
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <WalletLogs />
            {bankForm && (
                <div className="w-[80%] max-sm:w-full max-sm:px-5">
                    <p
                        onClick={() => {
                            setAllAccounts(true);
                            setBankInfo({
                                currency: "",
                                iban: "",
                                sortCode: "",
                                bankName: "",
                                acctNum: "",
                                acctName: "",
                            });
                            setBankForm(false);
                        }}
                        className="flex items-center w-fit gap-1 mb-6 cursor-pointer"
                    >
                        <span className="material-icons-outlined text-lg font-semibold ">
                            arrow_back
                        </span>
                        <span className="text-sm font-rocGroteskMedium underline">Go back</span>
                    </p>
                    <p className="text-[20px] font-rocGroteskBold text-gun-metal mb-[35px]">
                        Add a new bank account
                    </p>
                    <div className="flex gap-14 w-full">
                        <form onSubmit={handleSubmit} className="w-[55%] max-sm:w-full mb-12">
                            <div className="mb-6">
                                <SelectInput
                                    value={bankInfo.currency}
                                    name="currency"
                                    placeholder={"Preferred currency"}
                                    handleChange={(name, value) => {
                                        // handleInputChange(name, value)
                                        setBankInfo({
                                            currency: value,
                                            iban: "",
                                            sortCode: "",
                                            bankName: "",
                                            acctNum: "",
                                            acctName: "",
                                        });
                                    }}
                                    label="Currency type"
                                    isRequired={true}
                                    dropdownOptions={[
                                        {
                                            label: "Great Britain Pounds (GBP)",
                                            value: "GBP",
                                            icon: (
                                                <img
                                                    src={ukFlag}
                                                    alt="us flag"
                                                    className="w-5 h-5 rounded-full bg-gray-400"
                                                />
                                            ),
                                        },
                                        {
                                            label: "United States Dollar (USD)",
                                            value: "USD",
                                            icon: (
                                                <img
                                                    src={usFlag}
                                                    alt="us flag"
                                                    className="w-5 h-5 rounded-full bg-gray-400"
                                                />
                                            ),
                                        },
                                        {
                                            label: "European Euro (EUR)",
                                            value: "EUR",
                                            icon: (
                                                <img
                                                    src={eurFlag}
                                                    alt="us flag"
                                                    className="w-5 h-5 rounded-full bg-gray-400"
                                                />
                                            ),
                                        },
                                        {
                                            label: "Naira (NGN)",
                                            value: "NGN",
                                            icon: (
                                                <img
                                                    src={ngFlag}
                                                    alt="us flag"
                                                    className="w-5 h-5 rounded-full bg-gray-400"
                                                />
                                            ),
                                        },
                                    ]}
                                />
                            </div>
                            {bankInfo.currency.toLowerCase() !== "ngn" && (
                                <>
                                    <div className="mb-6">
                                        <p className="text-sm mb-1 font-rocGroteskMedium">
                                            IBAN number
                                        </p>
                                        <input
                                            type="text"
                                            value={bankInfo.iban}
                                            placeholder="AAAA 0000 0000 0000 0000 0000 0000"
                                            className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                            required
                                            name="iban"
                                            onChange={(event) =>
                                                handleInputChange(
                                                    event.target.name,
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-sm mb-1 font-rocGroteskMedium">
                                            Sort code
                                        </p>
                                        <input
                                            type="text"
                                            value={bankInfo.sortCode}
                                            placeholder="Enter sort code"
                                            className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                            required
                                            name="sortCode"
                                            onChange={(event) =>
                                                handleInputChange(
                                                    event.target.name,
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </>
                            )}

                            <div className="mb-6">
                                {bankInfo.currency.toLowerCase() !== "ngn" ? (
                                    <div>
                                        <p className="text-sm mb-1 font-rocGroteskMedium">
                                            Bank name
                                        </p>
                                        <input
                                            type="text"
                                            value={bankInfo.bankName?.split(".")?.[0]}
                                            placeholder="Enter bank name"
                                            className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                            required
                                            name="bankName"
                                            onChange={(event) =>
                                                handleInputChange(
                                                    event.target.name,
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>
                                ) : (
                                    <SelectInput
                                        value={bankInfo.bankName}
                                        name="bankName"
                                        placeholder={"Enter bank name"}
                                        handleChange={(name, value) => {
                                            handleInputChange(name, value);
                                        }}
                                        label="Bank name"
                                        isRequired={true}
                                        dropdownOptions={
                                            !fetchingBanksSuccess
                                                ? [{ label: "Loading...", value: "loading" }]
                                                : fetchingBanksSuccess?.banks?.data?.map(
                                                      (item) => ({
                                                          label: item?.name,
                                                          value: item?.name + "." + item?.code,
                                                      })
                                                  )
                                        }
                                    />
                                )}
                            </div>
                            <div className="mb-6">
                                <p className="text-sm mb-1 font-rocGroteskMedium">Account number</p>
                                <input
                                    type="text"
                                    value={bankInfo.acctNum}
                                    placeholder="Enter account number"
                                    className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                    required
                                    name="acctNum"
                                    onInput={(evt) => {
                                        handleInputChange(evt.target.name, evt.target.value);
                                        if (evt.target.value === "") {
                                            setBankInfo((prev) => ({ ...prev, acctName: "" }));
                                        }
                                        if (
                                            bankInfo.currency.toLowerCase() === "ngn" &&
                                            Boolean(bankInfo.bankName) &&
                                            evt.target.value.length === 10
                                        ) {
                                            dispatch(
                                                paymentActions.resolveBankDetails({
                                                    bankCode: bankInfo.bankName.split(".")[1],
                                                    accountNumber: evt.target.value,
                                                    type: "nuban",
                                                })
                                            );
                                        } else if (
                                            bankInfo.currency.toLowerCase() !== "ngn" &&
                                            Boolean(bankInfo.bankName) &&
                                            Boolean(bankInfo.iban) &&
                                            Boolean(bankInfo.sortCode) &&
                                            evt.target.value.length > 7 &&
                                            evt.target.value.length < 15
                                        ) {
                                            dispatch(
                                                paymentActions.resolveBankDetails({
                                                    bankCode: bankInfo.sortCode,
                                                    accountNumber: evt.target.value,
                                                    type: "iban",
                                                    iban: bankInfo.iban,
                                                })
                                            );
                                        }
                                    }}
                                />
                            </div>
                            <div className="mb-6">
                                <p className="text-sm mb-1 font-rocGroteskMedium">Account name</p>
                                {bankInfo.currency.toLowerCase() === "ngn" ? (
                                    <input
                                        type="text"
                                        value={bankInfo.acctName}
                                        placeholder="Enter account name"
                                        className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                        required
                                        name="acctName"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={bankInfo.acctName}
                                        placeholder="Enter account name"
                                        className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                        required
                                        name="acctName"
                                        onChange={(event) =>
                                            handleInputChange(event.target.name, event.target.value)
                                        }
                                    />
                                )}
                            </div>
                            <div className="flex flex-col max-sm:flex-row-reverse gap-3">
                                <button
                                    className="flex items-center disabled:bg-pacific-cyan/30 justify-center bg-pacific-cyan text-white font-rocGroteskMedium w-full py-3 text-sm rounded"
                                    type={"submit"}
                                    disabled={canAddAccount()?.includes(false)}
                                    // onClick={handleSubmit}
                                >
                                    {addBankAcctLoading ? (
                                        <Loader color={"white"} />
                                    ) : (
                                        "Add account"
                                    )}
                                </button>
                                <button
                                    className="flex items-center justify-center bg-mvx-light-blue text-gun-metal font-rocGroteskMedium w-full py-3 text-sm rounded"
                                    type={"button"}
                                    onClick={() =>
                                        setBankInfo({
                                            currency: "",
                                            iban: "",
                                            sortCode: "",
                                            bankName: "",
                                            acctNum: "",
                                            acctName: "",
                                        })
                                    }
                                >
                                    Clear all field
                                </button>
                            </div>
                        </form>
                        {bankInfo.currency.toLowerCase() !== "ngn" && (
                            <div className="w-[45%] max-sm:hidden">
                                <div className="border rounded p-6 mt-6">
                                    <i className="ri-information-fill text-4xl mb-4"></i>
                                    <p className="font-rocGroteskMedium text-base text-gun-metal mb-2">
                                        What is IBAN Number?
                                    </p>
                                    <p className="font-rocGroteskMedium text-sm text-mvx-neutral mb-2">
                                        An International Bank Account Number or IBAN is used
                                        worldwide to identify individual accounts. it make it easier
                                        to process international payments. You can find your IBAN in
                                        the Internet Bank and on your account statement.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {bankDetails && (
                <div className="w-[80%] max-sm:w-full max-sm:px-5">
                    <p
                        onClick={() => {
                            setAllAccounts(true);
                            setBankDetails(false);
                            setCopied(false);
                        }}
                        className="flex items-center w-fit gap-1 mb-6 cursor-pointer"
                    >
                        <span className="material-icons-outlined text-lg font-semibold ">
                            arrow_back
                        </span>
                        <span className="text-sm font-rocGroteskMedium underline">Go back</span>
                    </p>
                    <div>
                        <img
                            src={
                                selectedBank?.currency?.toLowerCase() === "ngn"
                                    ? ngFlag
                                    : selectedBank?.currency?.toLowerCase() === "usd"
                                    ? usFlag
                                    : selectedBank?.currency?.toLowerCase() === "gbp"
                                    ? ukFlag
                                    : eurFlag
                            }
                            alt="flag"
                            className="w-9 h-9 rounded-full bg-gray-400 mb-4"
                        />
                        <div className="w-full flex justify-between items-end mb-8">
                            <div>
                                <p className="text-2xl font-rocGroteskBold mb-1">
                                    {selectedBank?.accountNumber}
                                </p>
                                <p className="text-sm font-rocGroteskMedium mb-3">
                                    {selectedBank?.address ?? ""}
                                </p>
                                <div className="w-fit py-[3px] px-[10px] bg-mvx-light-blue rounded-[20px] flex items-center justify-center gap-1">
                                    <p className="text-sm text-gun-metal font-rocGroteskMedium">
                                        {selectedBank?.currency}
                                    </p>
                                    <i className="ri-arrow-down-s-line mt-[-1px]"></i>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <div
                                    onClick={() => {
                                        setCopied(true);
                                        navigator?.clipboard?.writeText(
                                            `${
                                                selectedBank?.iban
                                                    ? "IBAN: " + selectedBank?.iban + ", "
                                                    : ""
                                            }${
                                                selectedBank?.branchCode
                                                    ? "Sort Code: " + selectedBank.branchCode + ", "
                                                    : ""
                                            } Bank Name: ${
                                                selectedBank.bankName
                                            }, Account Number: ${
                                                selectedBank.accountNumber
                                            }, Account Name: ${selectedBank.accountName}`
                                        );
                                    }}
                                    className="flex flex-col items-center cursor-pointer"
                                >
                                    <div className="mb-2 w-11 h-11 rounded-full flex items-center justify-center bg-mvx-light-blue">
                                        <i className="ri-file-copy-2-fill text-xl"></i>
                                    </div>
                                    <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                        {copied ? "Copied" : "Copy"}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center cursor-pointer">
                                    <div
                                        onClick={() => setDeleteAcctModal(true)}
                                        className="mb-2 w-11 h-11 rounded-full flex items-center justify-center bg-mvx-light-blue"
                                    >
                                        <i className="ri-delete-bin-fill text-xl"></i>
                                    </div>
                                    <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                        Delete
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="mt-8">
                            {selectedBank?.iban && (
                                <div className="flex items-center justify-between mb-6 group cursor-pointer">
                                    <div>
                                        <p className="text-sm font-rocGroteskMedium text-[#6A7987] mb-1">
                                            IBAN Number:
                                        </p>
                                        <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                            {selectedBank?.iban}
                                        </p>
                                    </div>
                                    <div>
                                        <i
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    `${selectedBank?.iban}`
                                                );
                                            }}
                                            className="ri-file-copy-2-fill hidden group-hover:block before:text-mvx-neutral before:content-['\ecd2']"
                                        ></i>
                                    </div>
                                </div>
                            )}

                            {selectedBank?.branchCode && (
                                <div className="flex items-center justify-between mb-6 group cursor-pointer">
                                    <div>
                                        <p className="text-sm font-rocGroteskMedium text-[#6A7987] mb-1">
                                            Sort Code:
                                        </p>
                                        <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                            {selectedBank?.branchCode}
                                        </p>
                                    </div>
                                    <div>
                                        <i
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    `${selectedBank.branchCode}`
                                                );
                                            }}
                                            className="ri-file-copy-2-fill hidden group-hover:block before:text-mvx-neutral before:content-['\ecd2']"
                                        ></i>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-6 group cursor-pointer">
                                <div>
                                    <p className="text-sm font-rocGroteskMedium text-[#6A7987] mb-1">
                                        Bank Name:
                                    </p>
                                    <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                        {selectedBank?.bankName}
                                    </p>
                                </div>
                                <div>
                                    <i
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `${selectedBank.bankName}`
                                            );
                                        }}
                                        className="ri-file-copy-2-fill hidden group-hover:block before:text-mvx-neutral before:content-['\ecd2']"
                                    ></i>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-6 group cursor-pointer">
                                <div>
                                    <p className="text-sm font-rocGroteskMedium text-[#6A7987] mb-1">
                                        Account number:
                                    </p>
                                    <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                        {selectedBank?.accountNumber}
                                    </p>
                                </div>
                                <div>
                                    <i
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `${selectedBank.accountNumber}`
                                            );
                                        }}
                                        className="ri-file-copy-2-fill hidden group-hover:block before:text-mvx-neutral before:content-['\ecd2']"
                                    ></i>
                                </div>
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="text-sm font-rocGroteskMedium text-[#6A7987] mb-1">
                                        Account Name:
                                    </p>
                                    <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                        {selectedBank?.accountName}
                                    </p>
                                </div>
                                <div>
                                    <i
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `${selectedBank.accountName}`
                                            );
                                        }}
                                        className="ri-file-copy-2-fill hidden group-hover:block before:text-mvx-neutral before:content-['\ecd2']"
                                    ></i>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-8 w-1/2">
                            <button
                                className="flex items-center justify-center bg-mvx-light-blue text-gun-metal font-rocGroteskMedium w-full py-3 text-sm rounded"
                                type={"button"}
                                onClick={() => {
                                    setCopied(true);
                                    navigator.clipboard.writeText(
                                        `${
                                            selectedBank?.iban
                                                ? "IBAN: " + selectedBank?.iban + ", "
                                                : ""
                                        }${
                                            selectedBank?.branchCode
                                                ? "Sort Code: " + selectedBank.branchCode + ", "
                                                : ""
                                        } Bank Name: ${selectedBank.bankName}, Account Number: ${
                                            selectedBank.accountNumber
                                        }, Account Name: ${selectedBank.accountName}`
                                    );
                                }}
                            >
                                {copied ? "Copied" : "Copy details"}
                            </button>
                            {/* <button
                                className="flex items-center justify-center bg-gun-metal text-white font-rocGroteskMedium w-full py-3 text-sm rounded"
                                type={"button"}
                            >
                                Set as default
                            </button> */}
                        </div>
                    </div>
                </div>
            )}
            {deleteAcctModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        setDeleteAcctModal(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 pt-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Delete bank account?
                            </p>
                            <p className="text-sm text-center font-rocGroteskRegular text-gun-metal">
                                Are you sure you want to delete this bank account? <br />
                                This action will permanently remove all associated data, including
                                transaction history, and cannot be undone.
                            </p>
                        </div>
                        <div className="flex pt-[42px]">
                            <button
                                type="button"
                                className={`uppercase rounded-t-none rounded-br-none w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border px-3`}
                                onClick={() => {
                                    setDeleteAcctModal(false);
                                }}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    dispatch(paymentActions.deleteBankAcct(selectedBank._id));
                                }}
                                className={`uppercase rounded-t-none rounded-bl-none w-full text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-6 border-y px-3`}
                            >
                                {deletingBankAcct ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">Yes, delete</p>
                                )}
                            </button>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default BankAccount;
