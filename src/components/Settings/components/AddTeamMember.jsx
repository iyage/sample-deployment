import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "components/common/Button";
import CustomToast from "components/common/CustomToast";
import InputField from "components/common/InputField";
import Modal from "components/common/Modals/Modal";
import { ModalService } from "components/common/Modals/ModalService";
import SelectInput from "components/common/SelectInput";
import { settingsConstant } from "constants/settingsConstants";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { settingsService } from "services/settingsService";
import countries from "variables/countries";
import { object, string } from "yup";
import AddRoleModal from "./AddRoleModal";

const AddTeamMember = ({ onClose, show, role }) => {
    const { ffProfile } = useSelector((state) => state.auth);
    const parentId = ffProfile?.result?.parentId || ffProfile?.result?._id;
    const [phoneExt, setPhoneExt] = useState("");

    const { isLoading: rolesLoading, data } = useQuery({
        queryFn: () => settingsService.getRoles(parentId),
        queryKey: [settingsConstant.FETCH_ROLES, parentId],
    });
    const roles = data?.data.data || [];

    const { isPending, mutate } = useMutation({
        mutationFn: (data) => settingsService.addTeamMember(data),
    });

    const { isValid, getFieldProps, handleSubmit, values, setFieldValue } = useFormik({
        enableReinitialize: true,
        initialValues: { email: "", fullName: "", role: role ?? "", rawMobile: "" },
        validateOnMount: true,
        validationSchema: object({
            email: string().required(),
            fullName: string().required(),
            role: string().required(),
            rawMobile: string().required(),
        }),
        onSubmit: (values) => {
            mutate(
                { ...values, mobile: phoneExt + values.rawMobile, mobileExtension: phoneExt },
                {
                    onSuccess: () => {
                        onClose?.();
                        toast.custom((t) => (
                            <CustomToast
                                t={t}
                                message="Team Member Invited Successfully"
                                type="success"
                            />
                        ));
                    },
                }
            );
        },
    });

    return (
        <Modal show={show} onClose={() => onClose?.()}>
            <form className="w-[420px] bg-white shadow-modalShadow rounded">
                <div className="p-6">
                    <p className="text-lg font-rocGroteskBold text-gun-metal">
                        Invite your team members
                    </p>
                    <p className="text-sm font-rocGroteskMedium text-mvx-neutral mb-6">
                        Add other members of your team to your workspace.
                    </p>

                    <div className="space-y-6">
                        <InputField
                            label="Full name"
                            placeholder="Team member’s full name"
                            {...getFieldProps("fullName")}
                        />
                        <InputField
                            label="Email address"
                            placeholder="name@example.com"
                            {...getFieldProps("email")}
                        />
                        <div>
                            <p className="text-[13px] mb-2 relative text-mvx-black font-rocGroteskMedium">
                                Role
                            </p>
                            <SelectInput
                                searchLoading={rolesLoading}
                                value={values?.role}
                                isRequired={true}
                                name="role"
                                placeholder={"Select Role"}
                                className="rounded-sm !h-[48px]"
                                handleChange={(_, value) => setFieldValue("role", value, true)}
                                dropdownOptions={[
                                    ...roles?.map((r) => ({
                                        value: r?._id,
                                        label: r?.name,
                                    })),
                                    {
                                        value: null,
                                        label: "Create New Role",
                                        isDefault: true,
                                        icon: (
                                            <span className="material-icons text-gun-metal text-2xl">
                                                add_circle
                                            </span>
                                        ),
                                        handleClick: () => {
                                            onClose?.();
                                            ModalService.open({
                                                modal: AddRoleModal,
                                                props: { fromInvite: true },
                                            });
                                        },
                                    },
                                ]}
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] font-rocGroteskMedium mb-2">
                                Phone number
                            </label>
                            <div className="grid grid-cols-[105px_calc(100%-105px)] 475:grid-cols-[110px_calc(100%-110px)]">
                                <SelectInput
                                    value={phoneExt}
                                    name="phoneExt"
                                    placeholder={"+000"}
                                    handleChange={(_, value) => setPhoneExt(value)}
                                    isRequired={true}
                                    className="bg-mvx-light-blue !h-[48px] !rounded-l !rounded-r-none !border-r-0"
                                    dropdownOptions={countries
                                        .filter((data) => Boolean(data?.codes[0]))
                                        .sort((p1, p2) =>
                                            p1.codes[0] > p2.codes[0]
                                                ? 1
                                                : p1.codes[0] < p2.codes[0]
                                                ? -1
                                                : 0
                                        )
                                        .map((item) => ({
                                            label: item.codes[0]?.replace(" ", ""),
                                            value: item.codes[0]?.replace(" ", ""),
                                        }))}
                                />

                                <input
                                    id="mobile"
                                    placeholder="(000) 000-0000"
                                    className="border-y border-r h-[48px] rounded-r border-l-0 px-3 py-3 placeholder:!text-[13px] placeholder:!font-rocGroteskMedium text-sm font-rocGroteskMedium"
                                    required
                                    minLength={10}
                                    pattern={"^[0-9]+$"}
                                    title="must be a valid phone number"
                                    {...getFieldProps("rawMobile")}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 border-t uppercase items-start h-[56px]">
                    <button
                        className="bg-white w-full text-xs font-rocGroteskMedium text-gun-metal h-full border-r rounded-r-none"
                        type={"button"}
                        onClick={() => onClose?.()}
                    >
                        CLOSE
                    </button>
                    <Button
                        disabled={!isValid || !phoneExt}
                        isLoading={isPending}
                        className="bg-mvx-light-blue text-[13px] font-rocGroteskMedium text-gun-metal h-full rounded-r-none"
                        title="ADD TEAM MEMBER"
                        onClick={handleSubmit}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default AddTeamMember;
