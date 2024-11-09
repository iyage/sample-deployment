/* eslint-disable no-unused-vars */
import React from "react";
import CreateQuoteNav from "./components/CreateQuoteNav";
import useRouteQuery from "hooks/useRouteQuery";
import { useFormik } from "formik";

const CreateQuotesNew = () => {
    const { searchParams } = useRouteQuery();
    const tab = searchParams.get("tab") ?? "";

    return (
        <div className="w-full min-h-screen relative">
            <CreateQuoteNav />

            <div className="h-full fixed left-0 top-0 bg-white shadow-quoteSidebarShadow w-[276px] z-30 pt-[90px]">
                <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-n-30">
                    <h1 className="font-rocGroteskBold text-[18px]">Feedback</h1>
                </div>
            </div>
            <div className="w-full px-[312px] pt-[120px] h-full bg-mvx-light-blue">
                <div className="h-full rounded-lg bg-white shadow-quoteSidebarShadow p-8"></div>
            </div>
            <div className="h-full fixed right-0 top-0 bg-white shadow-quoteSidebarShadow w-[276px] z-30 pt-[90px]">
                <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-n-30">
                    <h1 className="font-rocGroteskBold text-[18px]">Version History</h1>

                    <div className="rounded-full h-7 w-7 bg-mvx-light-blue"></div>
                </div>
            </div>
        </div>
    );
};

export default CreateQuotesNew;
