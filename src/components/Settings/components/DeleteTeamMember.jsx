import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "components/common/Button";
import CustomToast from "components/common/CustomToast";
import Modal from "components/common/Modals/Modal";
import { settingsConstant } from "constants/settingsConstants";
import React from "react";
import toast from "react-hot-toast";
import { settingsService } from "services/settingsService";

const DeleteTeamMember = ({ show, onClose, member }) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (id) => settingsService.deleteTeamMember(id),
        onSuccess: () => {
            toast.custom((t) => (
                <CustomToast message="Team member removed successfully" type="success" t={t} />
            ));
            queryClient.invalidateQueries([settingsConstant.FETCH_TEAM_MEMBERS]);
            onClose?.();
        },
    });
    return (
        <Modal show={show} onClose={() => onClose?.()}>
            <div className="w-[420px] shadow-modalShadow rounded-lg bg-white">
                <div className="py-8 px-10">
                    <h1 className="text-center text-midnight-black mb-3 font-rocGroteskBold text-xl">
                        Remove Team Member?
                    </h1>

                    <h2 className="text-center text-sm text-midnight-black font-rocGrotesk">
                        Are you sure you want to remove {member?.fullName || "--"}? You won’t be
                        able to undo this action
                    </h2>
                </div>
                <div className="grid grid-cols-2 w-full border-t border-neutral-n2-30">
                    <button
                        className="bg-white w-full text-xs font-rocGroteskMedium text-mvx-black text-center py-[18px] border-r border-x-neutral-n2-30 rounded-t-none rounded-r-none"
                        onClick={onClose}
                    >
                        NO, CANCEL
                    </button>
                    <Button
                        isLoading={isPending}
                        onClick={() => mutate(member?._id)}
                        title="REMOVE MEMBER"
                        className="rounded-t-none rounded-l-none bg-neutral-n-20 text-xs font-rocGroteskMedium text-midnight-black"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default DeleteTeamMember;
