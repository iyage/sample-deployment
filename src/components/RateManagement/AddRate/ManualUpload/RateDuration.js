import CustomCalendar from "components/common/CalendarComp.js/Calendar";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";

const RateDuration = ({ setActiveStep, dateRange, setDate, terms, setTerms, editMode }) => {
    const [openCalendar, setOpenCalendar] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref?.current && !ref?.current?.contains(event.target) && openCalendar) {
                setOpenCalendar(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, openCalendar]);

    return (
        <div className="w-full">
            {!editMode && (
                <p className="text-[22px] font-rocGroteskBold mb-6">
                    How long is this rate valid for?
                </p>
            )}
            <div>
                <div>
                    <div className="mb-4">
                        <p className="text-sm mb-1 font-rocGroteskMedium">Rate validity period</p>
                        <div ref={ref} className="relative">
                            <input
                                name="dateRange"
                                value={dateRange?.[1]}
                                required
                                className="opacity-0 absolute"
                            />
                            <div
                                onClick={() => setOpenCalendar(true)}
                                className="h-[48px] w-full pl-3 pr-2 rounded border flex items-center justify-between cursor-pointer"
                            >
                                <p>
                                    {dateRange?.[0] ? (
                                        <span className="text-sm font-rocGroteskMedium text-gun-metal">
                                            {moment(dateRange?.[0]).format("MMM DD, YYYY") +
                                                " - " +
                                                moment(dateRange?.[1]).format("MMM DD, YYYY")}
                                        </span>
                                    ) : (
                                        <span className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                            Jan 20, 2023 - Feb 09, 2023
                                        </span>
                                    )}
                                </p>
                                <i className="ri-calendar-line before:content-['\eb27'] text-xl before:text-mvx-neutral"></i>
                            </div>
                            {openCalendar && (
                                <div className="absolute top-[55px] left-[-4%] w-fit px-[28px] z-10 pt-8 pb-11 bg-white rounded-2xl shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_4px_32px_rgba(0,0,0,0.06)]">
                                    <CustomCalendar
                                        showDoubleView={true}
                                        value={dateRange}
                                        onChange={setDate}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mb-8">
                        <p className="text-sm mb-1 font-rocGroteskMedium">Terms and Conditions</p>

                        <div className="relative">
                            <input
                                name="terms"
                                value={terms}
                                required
                                className="opacity-0 absolute"
                            />
                            {/* <Editor
                                apiKey={process.env.REACT_APP_TINYMICE_API}
                                value={terms}
                                onEditorChange={(newValue, editor) => setTerms(newValue)}
                                initialValue={initialEditorValue}
                                init={{
                                    height: 300,
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
                        </div>
                    </div>
                </div>

                {!editMode && (
                    <div className="flex items-center justify-between">
                        <p
                            className="text-sm font-rocGroteskMedium cursor-pointer"
                            onClick={() => setActiveStep((prev) => prev - 1)}
                        >
                            Back
                        </p>

                        <button
                            className="flex items-center justify-center text-white bg-pacific-cyan font-rocGroteskMedium w-fit py-3 px-6 text-sm rounded"
                            type={"submit"}
                        >
                            Continue
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RateDuration;
