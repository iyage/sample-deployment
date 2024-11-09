import { FormikProvider } from "formik";
import React from "react";

const FormWrapper = ({ children, form, className, formId }) => {
    return (
        <FormikProvider value={form}>
            <form className={className} onSubmit={form.handleSubmit} id={formId}>
                {children}
            </form>
        </FormikProvider>
    );
};

export default FormWrapper;
