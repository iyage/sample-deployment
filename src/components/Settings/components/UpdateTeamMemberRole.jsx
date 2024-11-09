import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "components/common/Button";
import InputField from "components/common/InputField";
import Modal from "components/common/Modals/Modal";
import { ModalService } from "components/common/Modals/ModalService";
import SelectInput from "components/common/SelectInput";
import { settingsConstant } from "constants/settingsConstants";
import { useFormik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { settingsService } from "services/settingsService";
import AddRoleModal from "./AddRoleModal";
import toast from "react-hot-toast";
import CustomToast from "components/common/CustomToast";

const UpdateTeamMemberRole = ({ show, onClose, member }) => {
    const queryClient = useQueryClient();
    const { ffProfile } = useSelector((state) => state.auth);
    const parentId = ffProfile?.result?.parentId || ffProfile?.result?._id;
    const { isLoading: rolesLoading, data } = useQuery({
        queryFn: () => settingsService.getRoles(parentId),
        queryKey: [settingsConstant.FETCH_ROLES, parentId],
    });
    const roles = data?.data.data || [];

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => settingsService.updateTeamMember(member?._id, data),
        onSuccess: () => {
            toast.custom((t) => <CustomToast message="Team member updated" type="success" t={t} />);
            queryClient.invalidateQueries([settingsConstant.FETCH_TEAM_MEMBERS]);
            onClose?.();
        },
    });

    const { getFieldProps, handleSubmit, values, setFieldValue, dirty } = useFormik({
        initialValues: {
            email: member?.email || "",
            fullName: member?.fullName || "",
            role: member?.role?._id || "",
        },
        onSubmit: ({ role }) => {
            mutate({ role });
        },
        enableReinitialize: true,
        validateOnMount: true,
    });

    return (
        <Modal show={show} onClose={() => onClose?.()}>
            <div className="w-[420px] bg-white shadow-modalShadow rounded-lg">
                <div className="p-6">
                    <p className="text-lg font-rocGroteskBold text-gun-metal">
                        Update your team member
                    </p>
                    <p className="text-sm font-rocGroteskMedium text-mvx-neutral mb-6">
                        Make changes to your team member's permissions
                    </p>

                    <div className="space-y-6">
                        <InputField
                            disabled
                            label="Full name"
                            placeholder="Team member’s full name"
                            {...getFieldProps("fullName")}
                        />
                        <InputField
                            disabled
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
                        disabled={!dirty}
                        isLoading={isPending}
                        className="bg-mvx-light-blue text-[13px] font-rocGroteskMedium text-gun-metal h-full rounded-r-none"
                        title="UPDATE TEAM MEMBER"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default UpdateTeamMemberRole;
