import InputField from "components/common/InputField";
import SelectInput from "components/common/SelectInput";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { regionNames } from "helpers";
import React from "react";
import CollapsibleForm from "./CollapsibleForm";
import { capitalize } from "lodash";
import moment from "moment";
import formatCurrency from "helpers/formatCurrency";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { RiDeleteBinFill } from "react-icons/ri";

const QuoteForm = ({ quote, handleSubmit }) => {
    const shipment = quote?.shipment || {};
    const freightForwarder = shipment?.freightForwarder || {};

    const form = useFormik({
        initialValues: {
            shipmentId: quote?.shipment?._id || "",
            exwCharges: quote?.exwCharges || [],
            importCharges: quote?.importCharges || [],
            exportCharges: quote?.exportCharges || [],
            customCharges: quote?.exportCharges || [],
        },
        enableReinitialize: true,
        validateOnMount: true,
        onSubmit: () => handleSubmit?.(),
    });

    const chargeItem = {
        name: "",
        price: 0,
        currency: "NGN",
        vat: false,
    };
    const charges = [
        {
            title: "Enter Customs Charges",
            name: "customCharges",
            items: form?.values?.customCharges?.length ? form?.values?.customCharges : [chargeItem],
        },
        {
            title: "Enter Export Charges",
            name: "exportCharges",
            items: form?.values?.exportCharges?.length ? form?.values?.exportCharges : [chargeItem],
        },
        {
            title: "Enter Import Charges",
            name: "importCharges",
            items: form?.values?.importCharges?.length ? form?.values?.importCharges : [chargeItem],
        },
        {
            title: "Enter EXW Charges",
            name: "exwCharges",
            items: form?.values?.exwCharges?.length ? form?.values?.exwCharges : [chargeItem],
        },
    ];
    const tripDetails = [
        {
            label: "Country of Supply",
            value: shipment?.origin?.country ? regionNames.of(shipment.origin.country) : "",
            placeholder: "Enter country of supply",
        },
        {
            label: "Port of Loading",
            value: shipment?.portOfLoading?.address ?? "",
            placeholder: "Enter port of loading",
        },
        {
            label: "Delivery Address",
            value: shipment?.destination?.address ?? "",
            placeholder: "Enter delivery address",
        },
        {
            label: "Load Type",
            value: shipment?.loadType ?? "",
            placeholder: "Load Type",
        },
        {
            label: "Incoterms",
            value: shipment?.incoterms ?? "",
            placeholder: "Incoterms",
        },
        {
            label: "Mode of Dispatch",
            value: shipment?.serviceMode ? capitalize(shipment?.serviceMode) : "",
            placeholder: "Enter Mode of Dispatch",
        },
    ];

    return (
        <FormikProvider value={form}>
            <form className="bg-white rounded-lg shadow-quoteSidebarShadow p-12 space-y-12">
                <div className="flex items-start justify-between gap-3">
                    <img
                        src={
                            freightForwarder?.profile?.logo ||
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687530057/Web%20App/dashboard/stockImg_q4r4wc.png"
                        }
                        alt="Stock"
                        className={` ${
                            freightForwarder?.profile?.logo &&
                            "max-475:h-[80px] max-475:w-[80px] h-[148px] w-[148px] rounded-md border-2 border-dotted object-cover object-top"
                        }`}
                    />

                    <div className="max-w-[200px] space-y-1 self-center">
                        <h1 className="text-sm text-neutral-n-200 font-rocGroteskMedium text-right">
                            {freightForwarder?.profile?.businessName || ""}
                        </h1>
                        <h1 className="text-sm text-neutral-n-200 font-rocGroteskMedium text-right">
                            {freightForwarder?.profile?.businessAddress?.address || ""}
                        </h1>
                    </div>
                </div>
                <CollapsibleForm title="Date">
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            title="issueDate"
                            label="Issued Date"
                            disabled
                            value={moment().format("YYYY-MM-DD")}
                        />
                        <InputField
                            title="dueDate"
                            label="Due Date"
                            min={moment().format("YYYY-MM-DD")}
                            type="date"
                            value={
                                form.values?.dueDate || moment().add(1, "week").format("YYYY-MM-DD")
                            }
                            onChange={(e) => form.setFieldValue("dueDate", e?.target?.value)}
                        />
                    </div>
                </CollapsibleForm>

                <CollapsibleForm title="Trip details">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                        {tripDetails?.map((t) => (
                            <InputField
                                key={t?.label}
                                title={t?.label}
                                label={t?.label}
                                value={t?.value}
                                disabled
                            />
                        ))}
                    </div>
                </CollapsibleForm>

                {charges?.map((c) => (
                    <CollapsibleForm key={c?.title} title={c?.title}>
                        <FieldArray name={c?.name}>
                            {({ push, remove }) => {
                                return (
                                    <div className="space-y-4">
                                        {c?.items?.map((item, index) => (
                                            <div key={index}>
                                                <div className="grid grid-cols-[1fr_100px_100px_60px_48px] bg-neutral-n-20 border border-neutral-n-40 rounded-t text-sm text-gun-metal font-rocGroteskMedium">
                                                    <h2 className="px-4 py-2">Items</h2>
                                                    <h2 className="py-2 border-x border-neutral-n-40 px-4">
                                                        Currency
                                                    </h2>
                                                    <h2 className="py-2 border-r border-neutral-n-40 pl-4">
                                                        Amount
                                                    </h2>
                                                    <h2 className="py-2 pl-4 border-r border-neutral-n-40">
                                                        VAT
                                                    </h2>
                                                </div>
                                                <div className="grid grid-cols-[1fr_100px_100px_60px_48px] rounded-b border-b border-neutral-n-40 border-x">
                                                    <InputField
                                                        className="!px-3 outline-0 w-full !h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium !border-none"
                                                        {...form.getFieldProps(
                                                            `${c?.name}.${index}.name`
                                                        )}
                                                    />
                                                    <SelectInput
                                                        value={
                                                            form?.values?.[c?.name]?.at(index)
                                                                ?.currency || item?.currency
                                                        }
                                                        isRequired
                                                        className={
                                                            "border-x border-y-0 cursor-pointer h-[45px] rounded-none"
                                                        }
                                                        name="currency"
                                                        handleChange={(_, value) =>
                                                            form.setFieldValue(
                                                                `${c?.name}.${index}.currency`,
                                                                value
                                                            )
                                                        }
                                                        dropdownOptions={[
                                                            "USD",
                                                            "NGN",
                                                            "GBP",
                                                            "EUR",
                                                        ].map((curr) => ({
                                                            label: curr,
                                                            value: curr,
                                                        }))}
                                                    />
                                                    <div>
                                                        <input
                                                            value={formatCurrency(
                                                                String(item.price),
                                                                String(item.price)?.includes(".")
                                                            )}
                                                            className={`pl-3 outline-0 w-full h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium pr-2`}
                                                            required
                                                            pattern={"^[0-9,.]+$"}
                                                            title="Amount can only be number(s)"
                                                            onChange={(evt) =>
                                                                form.setFieldValue(
                                                                    `${c?.name}.${index}.price`,
                                                                    evt.target.value.replace(
                                                                        /,/g,
                                                                        ""
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="border-x flex items-center justify-center">
                                                        <input
                                                            value={item.vat ?? false}
                                                            type="checkbox"
                                                            checked={item.vat}
                                                            className={`pl-3 outline-0 text-sm text-green-600 font-rocGroteskMedium placeholder:font-rocGroteskMedium ${
                                                                index ? "pr-[6px]" : "pr-2"
                                                            }`}
                                                            required={false}
                                                            onChange={(evt) => {
                                                                // updateValue(
                                                                //     "vat",
                                                                //     !item?.vat
                                                                // );
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-center">
                                                        <RiDeleteBin5Fill
                                                            className="h-4 w-4 cursor-pointer"
                                                            style={{ color: "red" }}
                                                        />
                                                        <RiDeleteBinFill className="h-4 w-4 cursor-pointer text-red-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }}
                        </FieldArray>
                    </CollapsibleForm>
                ))}
            </form>
        </FormikProvider>
    );
};

export default QuoteForm;
