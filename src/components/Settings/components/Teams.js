/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Dropdown from "components/common/Dropdown";
import Loader from "components/common/Loader";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "actions";
import { capitalize, truncate } from "lodash";
import { ModalService } from "components/common/Modals/ModalService";
import AddTeamMember from "./AddTeamMember";
import { useInfiniteQuery } from "@tanstack/react-query";
import { settingsConstant } from "constants/settingsConstants";
import { settingsService } from "services/settingsService";
import DropdownMenu from "components/common/DropdownMenu";
import { HiDotsVertical } from "react-icons/hi";
import { useIntersectionObserver } from "usehooks-ts";
import UpdateTeamMemberRole from "./UpdateTeamMemberRole";
import DeleteTeamMember from "./DeleteTeamMember";

const Teams = ({ setActiveMobileSection }) => {
    const bottom = useRef(null);
    const entry = useIntersectionObserver(bottom, {});
    const isVisible = !!entry?.isIntersecting;
    const [currentPage, setCurrentPage] = useState(1);
    const [team, setTeam] = useState([]);
    const [pagination, setPagination] = useState({});
    const [selectedMemberId, setSelectedMemberId] = useState(null);

    const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: [settingsConstant.FETCH_TEAM_MEMBERS],
        queryFn: ({ pageParam = 1 }) => settingsService.fetchTeamMembers(pageParam),
        getNextPageParam: (lastPage, pages) => {
            const no_of_pages = lastPage?.data?.pagination?.number_of_pages;
            const nextPage = no_of_pages > pages.length ? pages.length + 1 : undefined;
            return nextPage;
        },
    });
    const teamCount = data?.pages?.at(0)?.data?.count || "-";
    const isEmpty = !data?.pages?.at(0)?.data?.data?.length;
    const dispatch = useDispatch();
    const [updateDeleteModal, setUpdateDeleteModal] = useState();
    const [clickType, setClickType] = useState();

    function getInitials(str) {
        return str
            .split(" ")
            .map((word) => word.charAt(0))
            .join(" ");
    }

    const removeMember = (id) => {
        dispatch(authActions.removeTeamMember(id));
    };
    const updateStatus = (id) => {};

    useEffect(() => {
        if (isVisible && hasNextPage) {
            fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    return (
        <>
            <div className="page">
                <div className="flex justify-between mb-6 items-center">
                    <div className="">
                        <p className="text-[22px] font-rocGroteskBold mb-1 max-sm:flex">
                            <span
                                onClick={() => setActiveMobileSection(false)}
                                className="material-icons-outlined max-sm:block hidden text-lg font-semibold mr-2 sm:hidden"
                            >
                                arrow_back
                            </span>
                            All Teams Members
                        </p>
                        <p className="text-sm font-rocGroteskMedium max-sm:text-mvx-gray">
                            Add and Manage your team member - {teamCount} team(s) member(s)
                        </p>
                    </div>
                    <div className="max-900:absolute left-0 bottom-5 sm:bottom-0 max-900:w-full max-sm:px-5">
                        {!isEmpty && (
                            <button
                                className="flex items-center justify-center gap-2 bg-pacific-cyan 900:bg-pacific-cyan text-white font-rocGroteskMedium w-full py-2 text-sm rounded"
                                onClick={() =>
                                    ModalService.open({ modal: AddTeamMember, props: {} })
                                }
                            >
                                Add team member
                            </button>
                        )}
                    </div>
                </div>

                {isLoading && (
                    <>
                        <Loader size={12} className={"mt-16 mb-7"} />
                    </>
                )}

                {!isLoading && (
                    <>
                        {isEmpty ? (
                            <>
                                <img
                                    src={
                                        "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687263741/Web%20App/dashboard/emptyTeamMembers_kpvv57.svg"
                                    }
                                    alt="Empty Team Members Icon"
                                    className="mx-auto mt-10 mb-[18px]"
                                />
                                <p className="text-lg font-rocGroteskBold mb-1 text-center">
                                    Invite your Team Members
                                </p>
                                <p className="text-sm w-[230px] mx-auto text-center mt-2 mb-6">
                                    Add other members of your team to your workspace.
                                </p>
                                <button
                                    className="text-sm block !mx-auto"
                                    onClick={() =>
                                        ModalService.open({ modal: AddTeamMember, props: {} })
                                    }
                                >
                                    <span className="text-white !text-xl mr-[10px] !translate-y-1">
                                        +
                                    </span>
                                    Set up your team
                                </button>
                            </>
                        ) : (
                            <div className="page border border-neutral-n2-40 rounded mb-5">
                                <div className="w-full grid items-center grid-cols-[1fr_1fr_200px_80px] gap-3 p-3 text-xs font-rocGroteskMedium uppercase [&>*]:text-mvx-gray border-b border-neutral-n2-40">
                                    <h1>Team Member</h1>
                                    <h1>Role</h1>
                                    <h1>Phone Number</h1>
                                    <h1 className="text-center">Action</h1>
                                </div>
                                <div className="page-scroll">
                                    {data?.pages?.map((items, i) => (
                                        <React.Fragment key={i}>
                                            {items?.data?.data?.map((member) => (
                                                <div
                                                    key={member?._id}
                                                    className="py-4 px-3 grid items-center grid-cols-[1fr_1fr_200px_80px] w-full border-b border-neutral-n2-40 last:border-b-0"
                                                >
                                                    <div>
                                                        <h1 className="font-rocGroteskMedium text-sm text-midnight-black">
                                                            {member?.fullName}
                                                        </h1>
                                                        <h2 className="font-rocGroteskMedium text-mvx-gray text-sm">
                                                            {member?.email}
                                                        </h2>
                                                    </div>
                                                    <div className="w-full">
                                                        <h1 className="font-rocGroteskMedium text-sm text-midnight-black">
                                                            {member?.role?.name}
                                                        </h1>
                                                        <h2 className="font-rocGroteskMedium text-mvx-gray text-xs truncate w-full max-w-[250px]">
                                                            {member?.role?.description}
                                                        </h2>
                                                    </div>
                                                    <h3 className="text-midnight-black text-sm font-rocGroteskMedium">
                                                        {member?.mobile}
                                                    </h3>
                                                    <div className="w-full flex items-center justify-center">
                                                        <DropdownMenu
                                                            icon={
                                                                <HiDotsVertical className="w-4 h-4 fill-[#000918] cursor-pointer" />
                                                            }
                                                            options={[
                                                                {
                                                                    label: "Change Role",
                                                                    action: () => {
                                                                        ModalService.open({
                                                                            modal: UpdateTeamMemberRole,
                                                                            props: { member },
                                                                        });
                                                                    },
                                                                    className:
                                                                        "px-4 py-2 hover:bg-[#F6F7FB] w-full font-rocGroteskMedium text-sm text-midnight-black cursor-pointer",
                                                                },
                                                                {
                                                                    label: "Remove Team Member",
                                                                    action: () => {
                                                                        ModalService.open({
                                                                            modal: DeleteTeamMember,
                                                                            props: { member },
                                                                        });
                                                                    },
                                                                    className:
                                                                        "px-4 py-2 hover:bg-[#FFE7E7] w-full font-rocGroteskMedium text-[#FF0000] text-sm cursor-pointer",
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                    <div ref={bottom} className="" />
                                    {(isLoading || isFetchingNextPage) && (
                                        <div className="flex w-full my-5 justify-center">
                                            <Loader color={"gun-metal"} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Teams;
