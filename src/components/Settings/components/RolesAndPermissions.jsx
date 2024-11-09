import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import Button from "components/common/Button";
import Loader from "components/common/Loader";
import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import { useSelector } from "react-redux";
import { settingsService } from "services/settingsService";
import DropdownMenu from "components/common/DropdownMenu";
import { settingsConstant } from "constants/settingsConstants";
import { ModalService } from "components/common/Modals/ModalService";
import AddRoleModal from "./AddRoleModal";
import DeleteRoleModal from "./DeleteRoleModal";

const RolesAndPermissions = () => {
    const { ffProfile } = useSelector((state) => state.auth);
    const parentId = ffProfile?.result?.parentId || ffProfile?.result?._id;
    const { isLoading, data } = useQuery({
        queryFn: () => settingsService.getRoles(parentId),
        queryKey: [settingsConstant.FETCH_ROLES, parentId],
    });
    const roles = data?.data.data || [];

    return (
        <div className="page">
            <div className="w-full flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-midnight-black font-rocGroteskBold text-xl">
                        Roles and Permissions
                    </h1>
                    <p className="mt-1 text-neutral-n2-200 font-rocGroteskMedium text-sm">
                        Manage what your team can see or do
                    </p>
                </div>

                <Button
                    onClick={() => ModalService.open({ modal: AddRoleModal, props: {} })}
                    title="Add Role"
                    className="!w-[108px] h-[40px] text-white font-rocGroteskMedium text-sm bg-pacific-cyan"
                />
            </div>

            {isLoading ? (
                <Loader size={12} className={"mt-32 mb-7"} />
            ) : (
                <div className="border rounded page mb-5">
                    <section className="grid w-full grid-cols-[1fr_80px] px-3 py-3 border-b border-neutral-n2-40">
                        <h2 className="text-sm uppercase text-neutral-n2-200 font-rocGroteskMedium">
                            Team Role
                        </h2>
                        <h2 className="text-sm uppercase text-neutral-n2-200 font-rocGroteskMedium">
                            Action
                        </h2>
                    </section>

                    <div className="page-scroll">
                        {roles?.map((role, i) => (
                            <div
                                key={role?.id}
                                className={classNames("py-4 px-4 grid grid-cols-[1fr_80px]", {
                                    "border-t": i !== 0,
                                })}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-neutral-n2-20 flex items-center justify-center">
                                        <img src="/icons/briefcase.svg" alt="briefcase" />
                                    </div>

                                    <div>
                                        <h1 className="text-midnight-black text-sm font-rocGroteskMedium mb-1">
                                            {role?.name}
                                        </h1>
                                        <h2 className="w-full truncate max-w-[500px] text-neutral-n2-200 font-rocGroteskMedium text-xs">
                                            {role?.description}
                                        </h2>
                                    </div>
                                </div>
                                <div className="w-7 h-full flex items-center justify-end">
                                    {!role?.isDefault && (
                                        <DropdownMenu
                                            icon={
                                                <HiDotsVertical className="w-4 h-4 fill-[#000918] cursor-pointer" />
                                            }
                                            options={[
                                                {
                                                    label: "Edit Role",
                                                    action: () => {
                                                        ModalService.open({
                                                            modal: AddRoleModal,
                                                            props: { role },
                                                        });
                                                    },
                                                    className:
                                                        "px-4 py-2 hover:bg-[#F6F7FB] w-full font-rocGroteskMedium text-sm text-midnight-black cursor-pointer",
                                                },
                                                {
                                                    label: "Delete Role",
                                                    action: () => {
                                                        ModalService.open({
                                                            modal: DeleteRoleModal,
                                                            props: { role },
                                                        });
                                                    },
                                                    className:
                                                        "px-4 py-2 hover:bg-[#FFE7E7] w-full font-rocGroteskMedium text-[#FF0000] text-sm cursor-pointer",
                                                },
                                            ]}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesAndPermissions;
