import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "components/common/Button";
import CustomToast from "components/common/CustomToast";
import InputField from "components/common/InputField";
import Loader from "components/common/Loader";
import Modal from "components/common/Modals/Modal";
import { ModalService } from "components/common/Modals/ModalService";
import Switch from "components/common/Switch";
import { settingsConstant } from "constants/settingsConstants";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { settingsService } from "services/settingsService";
import { object, string } from "yup";
import AddTeamMember from "./AddTeamMember";

const AddRoleModal = ({ onClose, show, role, fromInvite }) => {
    const [permissions, setPermissions] = useState({});
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: [settingsConstant.FETCH_ROLE],
        queryFn: () => settingsService.getRole({ roleName: "Admin" }),
    });
    const { isPending: creating, mutate: create } = useMutation({
        mutationFn: (data) => settingsService.createRole(data),
        onSuccess: (res) => {
            queryClient.invalidateQueries([settingsConstant.FETCH_ROLES]);
            if (fromInvite) {
                const targetRole = res?.data?.data?._id;
                ModalService.open({ modal: AddTeamMember, props: { role: targetRole } });
            }
            toast.custom((t) => (
                <CustomToast t={t} message={"Role created successfully"} type="success" />
            ));
            onClose?.();
        },
    });

    const { isPending: updating, mutate: update } = useMutation({
        mutationFn: (data) => settingsService.updateRole(role?._id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries([settingsConstant.FETCH_ROLES]);
            toast.custom((t) => (
                <CustomToast t={t} message={"Role updated successfully"} type="success" />
            ));
            onClose?.();
        },
    });

    const { isValid, getFieldProps, handleSubmit } = useFormik({
        enableReinitialize: true,
        validateOnMount: true,
        validationSchema: object({
            name: string().required("Name is required"),
            description: string().required("Description is required"),
        }),
        initialValues: {
            name: role?.name || "",
            description: role?.description || "",
        },
        onSubmit: (values) => {
            if (role) {
                update({ ...values, permissions });
            } else {
                create({ ...values, permissions });
            }
        },
    });

    useEffect(() => {
        if (!role && !!data) {
            setPermissions(
                Object.keys(data?.data?.permissions)?.reduce((obj, item) => {
                    obj[item] = [];
                    return obj;
                }, {})
            );
        }

        if (role) {
            setPermissions(role?.permissions || {});
        }
    }, [data, role]);

    const updatePermissionObject = (key, value) => {
        const updatedPerm = { ...permissions };
        if (updatedPerm[key]?.includes(value)) {
            updatedPerm[key] = updatedPerm[key]?.filter((item) => item !== value);
        } else {
            updatedPerm[key]?.push(value);
        }
        setPermissions(updatedPerm);
    };

    return (
        <Modal show={show} onClose={() => onClose?.()}>
            <div className="w-[420px] mx-auto bg-white shadow-modalShadow rounded max-h-[90vh] overflow-y-scroll">
                <div className="p-6">
                    <h1 className="font-rocGroteskBold text-lg text-midnight-black">
                        {role?._id ? "Edit Role" : "Create Role"}
                    </h1>
                    <p className="font-rocGroteskMedium text-sm text-neutral-n2-200 mt-1">
                        Add a custom role to your team.
                    </p>

                    <div className="mt-6">
                        <InputField
                            title="Role Title"
                            label="Role Title"
                            placeholder="Title of role"
                            className="rounded"
                            {...getFieldProps("name")}
                        />
                    </div>

                    <div className="mt-6">
                        <h2 className="text-sm font-rocGroteskMedium text-midnight-black mb-2">
                            Description
                        </h2>
                        <textarea
                            className="resize-none border w-full h-[96px] p-3 text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                            placeholder="Brief summary of what role entails"
                            {...getFieldProps("description")}
                        />
                    </div>

                    <div className="mt-6">
                        <p className="text-sm font-rocGroteskMedium text-midnight-black mb-3">
                            Permissions
                        </p>

                        {isLoading ? (
                            <Loader className="my-6" />
                        ) : (
                            <div className="space-y-3 max-h-[calc(100vh-600px)] overflow-y-scroll pr-4 pl-1">
                                {Object?.entries(data?.data?.permissions)?.map(
                                    ([feature, perms]) => (
                                        <div key={feature}>
                                            <h1 className="capitalize text-sm font-rocGroteskMedium">
                                                {String(feature).toLowerCase()}
                                            </h1>

                                            <div className="space-y-2 mt-2">
                                                {perms?.map((perm) => (
                                                    <div
                                                        key={perm}
                                                        onClick={() => {
                                                            updatePermissionObject(feature, perm);
                                                        }}
                                                        className="flex items-center justify-between cursor-pointer"
                                                    >
                                                        <h1 className="capitalize text-sm font-rocGroteskMedium text-neutral-n-300">
                                                            Can {perm}
                                                        </h1>

                                                        <Switch
                                                            value={permissions[feature]?.includes(
                                                                perm
                                                            )}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 border-t uppercase items-stretch h-[56px]">
                    <button
                        className="bg-white w-full text-[13px] font-rocGroteskMedium text-gun-metal"
                        onClick={onClose}
                    >
                        CLOSE
                    </button>

                    <Button
                        disabled={!isValid}
                        isLoading={creating || updating}
                        className="bg-mvx-light-blue text-[13px] font-rocGroteskMedium text-gun-metal"
                        title={role?._id ? "EDIT ROLE" : "CREATE ROLE"}
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default AddRoleModal;
