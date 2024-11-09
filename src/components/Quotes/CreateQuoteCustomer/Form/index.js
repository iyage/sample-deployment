/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { regionNames } from "helpers";
import Item from "./Item";
import { capitalize } from "lodash";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { flattenDeep } from "lodash";
import Loader from "components/common/Loader";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";

const Form = ({
    ffShipment,
    ffShipmentLoading,
    formLoading,
    setReqData,
    setStep,
    instantQuoteData,
    itemObjType,
    selectedCurrency,
    setSelectedCurrency,
    customCharges,
    setCustomCharges,
    exportCharges,
    setExportCharges,
    importCharges,
    setImportCharges,
    EXWCharges,
    setEXWCharges,
    dueDate,
    setDueDate,
    terms,
    setTerms,
    errorMessage,
    setErrorMessage,
}) => {
    const { shipmentId } = useParams();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [toggleStates, setToggleState] = useState({
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
    });

    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));

    const toggleAccordion = (idx) => {
        setToggleState((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    const getTransportCharges = () => {
        if (instantQuoteData) {
            const allTransportChanges = instantQuoteData?.charges?.map((charge) => {
                const splitChargeName = charge?.name?.split("-");
                if (
                    splitChargeName?.[0]?.toLowerCase() === "origin" ||
                    splitChargeName?.[0]?.toLowerCase() === "destination" ||
                    splitChargeName?.[0]?.toLowerCase() === "freight"
                ) {
                    return charge?.charges;
                }
                return [];
            });

            return flattenDeep(allTransportChanges);
        }
    };

    const itemHasValue = (listObj) => {
        const allCharges = [...customCharges, ...exportCharges, ...importCharges, ...EXWCharges];
        const allChargesBoolean = allCharges?.map((value) => Boolean(value?.name && value?.price));
        // return Boolean(Object.values(listObj).join(""));
        return !allChargesBoolean?.includes(true);
    };

    const isItemsListValid = (list) => {
        return list
            .map((obj) => {
                const requiredSections = Object.keys(obj).filter(
                    (key) => key !== "currency" && key !== "vat"
                );
                return requiredSections.map((key) => obj[key]).join("");
            })
            .filter((list) => list).length;
    };

    const isDateFromTomorrow = (event) => {
        const selectedDate = event.target.value;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().slice(0, 10);
        if (selectedDate < tomorrowString) {
            setErrorMessage("Please choose a date starting from tomorrow.");
            setDueDate("");
        } else {
            setDueDate(selectedDate);
            setErrorMessage("");
        }
    };

    const createQuote = (evt) => {
        evt.preventDefault();
        const nonIsFilled = Object.values(toggleStates).filter((bool) => bool).length;
        if (!nonIsFilled) {
            setToggleState((prev) => ({ ...prev, 0: true }));
            return;
        }
        if (dueDate) {
            setReqData({
                shipmentId: ffShipment?._id,
                importCharges: isItemsListValid(importCharges) ? importCharges : undefined,
                exportCharges: isItemsListValid(exportCharges) ? exportCharges : undefined,
                customCharges: isItemsListValid(customCharges) ? customCharges : undefined,
                exwCharges: isItemsListValid(EXWCharges) ? EXWCharges : undefined,
                dueDate,
                terms: terms ? terms : undefined,
                // template: false,
                // templateName: null,
                // file: {
                //     filename: null,
                //     path: null,
                // },
            });
            setStep(1);
        }
    };

    const ffLogo = ffShipment?.freightForwarder?.profile?.logo;

    useEffect(() => {
        if (Boolean(instantQuoteData)) {
            const transportCharges = getTransportCharges()?.map((charge) => ({
                name: charge?.description,
                price: charge?.amount,
                currency: charge?.currency,
            }));

            const InstantQuoteCustomCharges = instantQuoteData?.charges?.filter(
                (charge) => charge?.name?.toLowerCase() === "documentation-charges"
            );
            const AllInstantQuoteCustomCharges = InstantQuoteCustomCharges?.[0]?.charges?.map(
                (charge) => ({
                    name: charge?.description,
                    price: charge?.amount,
                    currency: charge?.currency,
                })
            );

            setDueDate(moment(instantQuoteData?.validity?.to).format("YYYY-MM-DD"));
            setCustomCharges(
                AllInstantQuoteCustomCharges?.length > 0
                    ? AllInstantQuoteCustomCharges
                    : [itemObjType]
            );
            if (instantQuoteData?.serviceType?.toLowerCase() === "import") {
                setImportCharges(transportCharges?.length > 0 ? transportCharges : [itemObjType]);
            } else {
                setExportCharges(transportCharges?.length > 0 ? transportCharges : [itemObjType]);
            }
        }
    }, [instantQuoteData]);

    if (formLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={8} />
            </div>
        );
    }

    return (
        <form
            className={`w-full 475:basis-full lg:basis-[450px] 1100:basis-[60%] mr-auto text-sm ${
                ffShipmentLoading && "pointer-events-none"
            }`}
            onSubmit={createQuote}
        >
            <div className="flex justify-between items-center mb-3">
                <div>
                    <img
                        src={
                            ffLogo ||
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687530057/Web%20App/dashboard/stockImg_q4r4wc.png"
                        }
                        alt="Stock"
                        className={` ${
                            ffLogo &&
                            "max-475:h-[80px] max-475:w-[80px] h-[148px] w-[148px] rounded-md border-2 border-dotted object-cover object-top"
                        }`}
                    />
                    {/* <span
                        className="block underline font-semibold cursor-pointer text-sm text-center mt-2 mb-1"
                        onClick={() => document.getElementById("logo-picker").click()}
                    >
                        Upload your logo
                    </span> */}
                    <input id="logo-picker" type={"file"} hidden accept=".png,.jpg,.jpeg" />
                    {/* <span className="block text-xs text-center">JPG, PNG. 1MB Max</span> */}
                </div>
                <p className="max-475:w-[calc(100%-100px)] 475:w-[150px] 520:w-[200px] text-sm 520:text-base">
                    {ffShipment?.freightForwarder?.profile?.businessAddress?.address}
                    <Link
                        to={`/dashboard/shipment/${shipmentId}`}
                        className="text-sm mt-2 underline font-medium text-mvx-neutral flex items-center lg:hidden"
                    >
                        View shipment details
                    </Link>
                </p>
            </div>
            <>
                <FormTitle
                    title={"Date"}
                    toggleAccordion={toggleAccordion}
                    toggleStates={toggleStates}
                    index={0}
                />
                {toggleStates[0] && (
                    <div className={`grid grid-cols-2 mb-1 gap-x-[3%] pt-7 max-800:relative`}>
                        <label
                            className="text-sm font-rocGrotesk font-medium basis-[46%] cursor-pointer"
                            htmlFor="issueDate"
                        >
                            Issued date
                            <input
                                value={new Date().toISOString().slice(0, 10)}
                                type={"date"}
                                name="issueDate"
                                id="issueDate"
                                className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                placeholder="Select issued date"
                                disabled
                            />
                        </label>
                        <label
                            className="text-sm font-rocGrotesk font-medium cursor-pointer 800:relative"
                            htmlFor="dueDate"
                        >
                            Due date
                            <input
                                type={"date"}
                                id="dueDate"
                                value={dueDate}
                                className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                placeholder="Select due date"
                                disabled={Boolean(instantQuoteData)}
                                required
                                onChange={isDateFromTomorrow}
                            />
                            <span
                                className={`text-red-600 text-[13px] w-max font-rocGroteskRegular max-330:-translate-x-3 translate-y-1 ${
                                    errorMessage ? "absolute left-0 -bottom-[18px]" : "hidden"
                                }`}
                            >
                                {errorMessage}
                            </span>
                        </label>
                    </div>
                )}
            </>
            <>
                <FormTitle
                    title={"Trip Details"}
                    toggleAccordion={toggleAccordion}
                    toggleStates={toggleStates}
                    index={1}
                />
                {toggleStates[1] && (
                    <div className="grid grid-cols-2 gap-y-5 gap-x-[3%] mt-7 mb-4">
                        <div>
                            <p className="text-sm font-rocGrotesk font-medium">Country of Supply</p>
                            <input
                                value={
                                    ffShipment?.origin?.country
                                        ? regionNames.of(ffShipment.origin.country)
                                        : ""
                                }
                                className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                disabled
                            />
                        </div>

                        <div>
                            <p className="text-sm font-FrocGrotesk font-medium">Port of Loading</p>
                            <input
                                value={ffShipment?.portOfLoading?.address}
                                className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                disabled
                            />
                        </div>

                        <div>
                            <p className="text-sm font-rocGrotesk font-medium">Delivery Address</p>
                            <input
                                value={ffShipment?.destination?.address}
                                className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                disabled
                            />
                        </div>
                        <div>
                            <p className="text-sm font-rocGrotesk font-medium">Load Type</p>
                            <input
                                value={ffShipment?.loadType}
                                className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                disabled
                            />
                        </div>
                        <div>
                            <p className="text-sm font-rocGrotesk font-medium">Incoterms</p>
                            <input
                                value={ffShipment?.incoterms}
                                className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                disabled
                            />
                        </div>
                        <div>
                            <p className="text-sm font-rocGrotesk font-medium">Mode of Dispatch</p>
                            <input
                                value={
                                    ffShipment?.serviceMode
                                        ? capitalize(ffShipment?.serviceMode)
                                        : ""
                                }
                                className="border mt-1 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium disabled:bg-mvx-light-blue"
                                disabled
                            />
                        </div>
                    </div>
                )}
            </>

            <>
                <FormTitle
                    title={"Enter Customs Charges"}
                    toggleAccordion={toggleAccordion}
                    toggleStates={toggleStates}
                    index={2}
                />

                {toggleStates[2] && (
                    <>
                        {customCharges.map((charge, index) => (
                            <Item
                                key={index}
                                item={charge}
                                setItems={setCustomCharges}
                                index={index}
                                isLast={customCharges.length - 1 === index}
                                isRequired={itemHasValue(charge)}
                                selectedCurrency={selectedCurrency}
                                setSelectedCurrency={setSelectedCurrency}
                            />
                        ))}
                    </>
                )}
            </>

            <>
                <FormTitle
                    title={"Enter Export Charges"}
                    toggleAccordion={toggleAccordion}
                    toggleStates={toggleStates}
                    index={3}
                />
                {toggleStates[3] && (
                    <>
                        {exportCharges.map((charge, index) => (
                            <Item
                                key={index}
                                item={charge}
                                setItems={setExportCharges}
                                index={index}
                                isLast={exportCharges.length - 1 === index}
                                isRequired={itemHasValue(charge)}
                                selectedCurrency={selectedCurrency}
                                setSelectedCurrency={setSelectedCurrency}
                            />
                        ))}
                    </>
                )}
            </>

            <>
                <FormTitle
                    title={"Add Import Charges"}
                    toggleAccordion={toggleAccordion}
                    toggleStates={toggleStates}
                    index={4}
                />
                {toggleStates[4] && (
                    <>
                        {" "}
                        {importCharges.map((charge, index) => (
                            <Item
                                key={index}
                                item={charge}
                                setItems={setImportCharges}
                                index={index}
                                isLast={importCharges.length - 1 === index}
                                isRequired={itemHasValue(charge)}
                                selectedCurrency={selectedCurrency}
                                setSelectedCurrency={setSelectedCurrency}
                            />
                        ))}
                    </>
                )}
            </>

            <>
                <FormTitle
                    title={"Add EXW Charges"}
                    toggleAccordion={toggleAccordion}
                    toggleStates={toggleStates}
                    index={5}
                />
                {toggleStates[5] && (
                    <>
                        {EXWCharges.map((charge, index) => (
                            <Item
                                key={index}
                                item={charge}
                                setItems={setEXWCharges}
                                index={index}
                                isLast={EXWCharges.length - 1 === index}
                                isRequired={itemHasValue(charge)}
                                selectedCurrency={selectedCurrency}
                                setSelectedCurrency={setSelectedCurrency}
                            />
                        ))}
                    </>
                )}
            </>

            <FormTitle
                title={"Terms and Conditions"}
                toggleAccordion={toggleAccordion}
                toggleStates={toggleStates}
                index={6}
            />

            {toggleStates[6] && (
                <>
                    <p className="text-sm font-rocGrotesk font-medium mt-5 mb-1">
                        Conditions & Notes (Optional)
                    </p>

                    {/* <Editor
                        apiKey={process.env.REACT_APP_TINYMICE_API}
                        value={terms}
                        onEditorChange={(newValue, editor) => {
                            setTerms(newValue);
                        }}
                        initialValue=""
                        init={{
                            height: 400,
                            menubar: false,
                            plugins: [
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                            ],
                            selector: "textarea",
                            resize: false,

                            toolbar:
                                "undo redo | casechange blocks | bold italic underline link backcolor | " +
                                "alignleft aligncenter alignright alignjustify | " +
                                "bullist numlist checklist outdent indent | removeformat",
                            content_style:
                                "body { font-family:rocGrotesk,Helvetica,Arial,sans-serif; font-size:14px; }",
                        }}
                    /> */}

                    <Editor
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="border"
                        onEditorStateChange={(e) => {
                            setTerms(draftToHtml(convertToRaw(e.getCurrentContent())));
                            setEditorState(e);
                        }}
                        editorStyle={{ minHeight: "300px", maxHeight: "500px" }}
                    />
                </>
            )}
            <button className="hidden" id={"qt-Btn"}></button>
        </form>
    );
};

const FormTitle = ({ title, index, toggleAccordion, toggleStates }) => (
    <p
        className={`flex justify-between items-center text-sm font-rocGrotesk font-medium bg-mvx-light-blue py-2 px-3 cursor-pointer ${
            index && `${toggleStates[index] ? "mt-7" : "mt-9"}`
        }`}
        onClick={() => toggleAccordion(index)}
    >
        {title}{" "}
        <span className="material-icons !text-lg font-semibold fill-mvx-black transition-all duration-300">
            {toggleStates[index] ? "remove" : "add"}
        </span>
    </p>
);

export default Form;
