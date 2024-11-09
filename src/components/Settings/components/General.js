import { appActions } from "actions/appActions";
import Loader from "components/common/Loader";
import ModalContainer from "components/common/ModalContainer";
import SelectInput from "components/common/SelectInput";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firebaseService } from "services/firebaseService";
import countries from "variables/countries";
import _ from "lodash";
import LocationSearchInput from "components/common/AutocompleteInput";
import { toast } from "react-hot-toast";
import CustomToast from "components/common/CustomToast";

const General = ({ setActiveMobileSection }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [editModal, setEditModal] = useState({
        open: false,
        editId: null,
    });
    const [uploadingImage, setUploadingimage] = useState(false);
    const [address, setAddress] = useState(false);
    const [uploadedImage, setUploadedImage] = useState({
        businessLogo: {
            name: "",
            url: "",
        },
        profilePic: {
            name: "",
            url: "",
        },
    });
    const [defaultGeneralData, setdefaultGeneralData] = useState({
        businessUrl: "",
        businessLegalName: "",
        businessEmail: "",
        businessLogo: "",
        aboutBusiness: "",
        phoneExt: "",
        phoneNum: "",
        fullPhoneNum: "",
        website: "",
        businessAddress: "",
        fullName: "",
        personalEmail: "",
        profilePic: "",
        department: "",
        role: "",
        jobTitle: "",
    });
    const [generalData, setGeneralData] = useState({
        businessUrl: "",
        businessLegalName: "",
        businessEmail: "",
        businessLogo: "",
        aboutBusiness: "",
        phoneExt: "",
        phoneNum: "",
        fullPhoneNum: "",
        website: "",
        businessAddress: "",
        fullName: "",
        personalEmail: "",
        profilePic: "",
        department: "",
        role: "",
        jobTitle: "",
    });
    const { ffProfile } = useSelector((state) => state.auth);
    const {
        updateBusinessProfileLoading,
        updateBusinessProfile,
        updatePersonalProfile,
        updatePersonalProfileLoading,
    } = useSelector((state) => state.app);
    const dispatch = useDispatch();

    const getModalContent = (tab, editItemNo) => {
        if (tab === 0) {
            switch (editItemNo) {
                case 0:
                    return {
                        type: "url",
                        modalTitle: "Fleet+ business link",
                        inputName: "businessUrl",
                        inputPlaceholder: "",
                        label: "This is your business URL on Fleet+",
                    };

                case 1:
                    return {
                        type: "text",
                        modalTitle: "Business name",
                        inputName: "businessLegalName",
                        inputPlaceholder: "Enter your legal business name",
                        label: "Business legal name",
                    };

                case 2:
                    return {
                        type: "text",
                        modalTitle: "Business email",
                        inputName: "businessEmail",
                        inputPlaceholder: "example@businessname.com",
                        label: "Business email address",
                    };

                case 3:
                    return {
                        type: "image",
                        modalTitle: "Upload image here",
                        inputName: "businessLogo",
                        inputPlaceholder: "example@businessname.com",
                        label: "Please choose a clear photo",
                    };

                case 4:
                    return {
                        type: "textarea",
                        modalTitle: "About business",
                        inputName: "aboutBusiness",
                        inputPlaceholder: "Add text",
                        label: "More information about your business",
                    };

                case 5:
                    return {
                        type: "text",
                        modalTitle: "Website",
                        inputName: "website",
                        inputPlaceholder: "www.fleetplus.io",
                        label: "Official business website",
                    };

                case 6:
                    return {
                        type: "address",
                        modalTitle: "Business Address",
                        inputName: " businessAddress",
                        inputPlaceholder: "Business Address",
                        label: "What's your business address?",
                    };
                default:
                    return {};
            }
        } else {
            switch (editItemNo) {
                case 0:
                    return {
                        type: "text",
                        modalTitle: "Change your name",
                        inputName: "fullName",
                        inputPlaceholder: "August Smith",
                        label: "First and last name",
                    };

                case 1:
                    return {
                        type: "text",
                        modalTitle: "Personal email",
                        inputName: "personalEmail",
                        inputPlaceholder: "example@email.com",
                        label: "Personal email address",
                    };

                case 2:
                    return {
                        type: "phoneNum",
                        modalTitle: "Update phone number",
                        inputName: "phoneNum",
                        inputPlaceholder: "",
                        label: "Phone number",
                    };

                case 3:
                    return {
                        type: "image",
                        modalTitle: "Upload image here",
                        inputName: "profilePic",
                        inputPlaceholder: "example@businessname.com",
                        label: "Please choose a clear photo",
                    };

                case 4:
                    return {
                        type: "text",
                        modalTitle: "Department",
                        inputName: "department",
                        inputPlaceholder: "Finance",
                        label: "What's your department",
                    };

                case 5:
                    return {
                        type: "text",
                        modalTitle: "Role",
                        inputName: "role",
                        inputPlaceholder: "Head of finance",
                        label: "What's your role",
                    };

                case 6:
                    return {
                        type: "text",
                        modalTitle: "Job title",
                        inputName: "jobTitle",
                        inputPlaceholder: "Financial analyst",
                        label: "What's your job title",
                    };

                default:
                    return {};
            }
        }
    };

    const handleInputChange = (name, value) => {
        setGeneralData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleSubmit = () => {
        const body =
            activeTab === 0
                ? {
                      businessName: generalData.businessLegalName,
                      description: generalData.aboutBusiness,
                      logo: uploadedImage.businessLogo.url
                          ? uploadedImage.businessLogo.url
                          : generalData.businessLogo,
                      email: generalData.businessEmail,
                      website: generalData.website,
                      businessAddress: address?.businessAddress,
                  }
                : {
                      fullName: generalData.fullName,
                      email: generalData.personalEmail,
                      rawMobile: generalData.phoneNum,
                      mobileExtension: generalData.phoneExt,
                      mobile: generalData.phoneExt + generalData.phoneNum,
                  };

        const updatedBody = {};

        Object.entries(body)?.forEach(([key, value]) => {
            if (Boolean(value)) {
                updatedBody[key] = value;
            }
        });

        return activeTab === 0
            ? dispatch(appActions.updateBusinessProfile(updatedBody))
            : dispatch(appActions.updatePersonalProfile(updatedBody));
    };

    const handleUpload = (name, fileName, file) => {
        setUploadingimage(true);

        firebaseService.uploadFile(`relayApp/${fileName}`, file, (url) => {
            setUploadedImage((prev) => ({
                ...prev,
                [name]: {
                    name: fileName,
                    url: url !== "error" ? url : "",
                },
            }));
            setUploadingimage(false);
        });
    };

    const isValidUrl = (str) => {
        const pattern = new RegExp(
            "^([a-zA-Z]+:\\/\\/)?" + // protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                "(\\#[-a-z\\d_]*)?$", // fragment locator
            "i"
        );
        return pattern.test(str);
    };

    useEffect(() => {
        setGeneralData((prev) => ({
            ...prev,
            businessUrl: ffProfile?.result?.profile?.url ?? "",
            businessLegalName: ffProfile?.result?.profile?.businessName ?? "",
            businessEmail: ffProfile?.result?.profile?.email ?? "",
            businessLogo: ffProfile?.result?.profile?.logo ?? "",
            aboutBusiness: ffProfile?.result?.profile?.description ?? "",
            phoneExt: ffProfile?.result?.mobileExtension ?? "",
            phoneNum: ffProfile?.result?.rawMobile ?? "",
            fullPhoneNum: ffProfile?.result?.mobile ?? "",
            website: ffProfile?.result?.profile?.website ?? "",
            businessAddress: ffProfile?.result?.profile?.businessAddress ?? "",
            fullName: ffProfile?.result?.fullName ?? "",
            personalEmail: ffProfile?.result?.email ?? "",
            profilePic: ffProfile?.result?.avatar ?? "",
            department: "",
            role: ffProfile?.result?.accountType ?? "",
            jobTitle: "",
        }));
        setdefaultGeneralData({
            businessUrl: ffProfile?.result?.profile?.url ?? "",
            businessLegalName: ffProfile?.result?.profile?.businessName ?? "",
            businessEmail: ffProfile?.result?.profile?.email ?? "",
            businessLogo: ffProfile?.result?.profile?.logo ?? "",
            aboutBusiness: ffProfile?.result?.profile?.description ?? "",
            phoneExt: ffProfile?.result?.mobileExtension ?? "",
            phoneNum: ffProfile?.result?.rawMobile ?? "",
            fullPhoneNum: ffProfile?.result?.mobile ?? "",
            website: ffProfile?.result?.profile?.website ?? "",
            businessAddress: ffProfile?.result?.profile?.businessAddress ?? "",
            fullName: ffProfile?.result?.fullName ?? "",
            personalEmail: ffProfile?.result?.email ?? "",
            profilePic: ffProfile?.result?.avatar ?? "",
            department: "",
            role: ffProfile?.result?.accountType ?? "",
            jobTitle: "",
        });
        setAddress({
            businessAddress: ffProfile?.result?.profile?.businessAddress ?? "",
        });
    }, [ffProfile]);

    useEffect(() => {
        if (updateBusinessProfile) {
            setEditModal(false);
        }
    }, [updateBusinessProfile]);

    useEffect(() => {
        if (updatePersonalProfile) {
            setEditModal(false);
        }
    }, [updatePersonalProfile]);

    const isWebsiteType = getModalContent(activeTab, editModal.editId)?.modalTitle === "Website";

    if (!ffProfile && !updateBusinessProfile && !updatePersonalProfile) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-12">
                <div className="mb-6 max-sm:pl-5 max-sm:flex max-sm:gap-4">
                    <span
                        onClick={() => setActiveMobileSection(false)}
                        className="material-icons-outlined max-sm:block hidden text-lg font-semibold "
                    >
                        arrow_back
                    </span>
                    <p className="text-[22px] font-rocGroteskBold mb-1">General information</p>
                </div>
                <div className="max-sm:px-5">
                    <div className="flex gap-4">
                        <div
                            className={`flex gap-1 items-center
                                                ${activeTab === 0 && "border-b-2 border-gun-metal"}
                                            w-fit py-3 cursor-pointer`}
                            onClick={() => setActiveTab(0)}
                        >
                            <p
                                className={`text-sm capitalize font-rocGroteskMedium ${
                                    activeTab === 0 ? "text-gun-metal" : " text-mvx-neutral"
                                } px-2`}
                            >
                                Business details
                            </p>
                        </div>
                        <div
                            className={`flex gap-1 items-center
                        ${activeTab === 1 && "border-b-2 border-gun-metal"}
                                            w-fit py-3 cursor-pointer`}
                            onClick={() => setActiveTab(1)}
                        >
                            <p
                                className={`text-sm capitalize font-rocGroteskMedium ${
                                    activeTab === 1 ? "text-gun-metal" : " text-mvx-neutral"
                                } px-2`}
                            >
                                Personal details
                            </p>
                        </div>
                    </div>
                    <hr />
                </div>
                {activeTab === 0 && (
                    <div className="border max-sm:border-none py-4 px-5 mt-6">
                        <div className="flex justify-between items-center pb-4">
                            <div className="w-1/3 max-sm:w-1/2">
                                <p className="text-sm font-rocGroteskBold text-gun-metal">
                                    Fleet+ Business URL
                                </p>
                                <p className="max-lg:hidden text-sm font-rocGroteskMedium text-mvx-neutral">
                                    Your business is visible at this address
                                </p>
                                <a
                                    href={`https://fleetplus.io/profile/${ffProfile?.result?._id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm hidden max-lg:block font-rocGroteskMedium text-gun-metal underline"
                                >
                                    https://fleetplus.io/profile/{ffProfile?.result?._id}
                                </a>
                            </div>
                            <div className="w-1/3 max-lg:hidden flex justify-start">
                                <a
                                    href={`https://fleetplus.io/profile/${ffProfile?.result?._id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-rocGroteskMedium text-gun-metal underline"
                                >
                                    https://fleetplus.io/profile/{ffProfile?.result?._id}
                                </a>
                            </div>
                            <div className="w-1/5 flex justify-end">
                                <p
                                    // onClick={() => setEditModal({ open: true, editId: 0 })}
                                    className="text-gun-metal font-rocGroteskMedium text-sm underline px-6 cursor-pointer"
                                ></p>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center py-4">
                            <div className="w-1/3 max-sm:w-1/2">
                                <p className="text-sm font-rocGroteskBold text-gun-metal">
                                    Business legal name
                                </p>
                                <p className="max-lg:hidden text-sm font-rocGroteskMedium text-mvx-neutral">
                                    Appears on quotes, invoices, and more
                                </p>
                                <p className="text-sm hidden max-lg:block font-rocGroteskMedium text-gun-metal">
                                    {generalData?.businessLegalName ? (
                                        generalData?.businessLegalName
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/3 flex justify-start">
                                <p className="text-sm max-lg:hidden font-rocGroteskMedium text-gun-metal">
                                    {generalData?.businessLegalName ? (
                                        generalData?.businessLegalName
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/5 flex justify-end">
                                <p
                                    onClick={() => setEditModal({ open: true, editId: 1 })}
                                    className="text-gun-metal font-rocGroteskMedium text-sm underline px-6 cursor-pointer"
                                >
                                    Edit
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center py-4">
                            <div className="w-1/3 max-sm:w-1/2">
                                <p className="text-sm font-rocGroteskBold text-gun-metal">
                                    Business Email
                                </p>
                                <p className="text-sm max-lg:hidden font-rocGroteskMedium text-mvx-neutral">
                                    The official email of your business.
                                </p>
                                <p className="text-sm hidden max-lg:block font-rocGroteskMedium text-gun-metal">
                                    {generalData?.businessEmail ? (
                                        generalData?.businessEmail
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/3 max-lg:hidden flex justify-start">
                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {generalData?.businessEmail ? (
                                        generalData?.businessEmail
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/5 flex justify-end">
                                <p
                                    onClick={() => setEditModal({ open: true, editId: 2 })}
                                    className="text-gun-metal font-rocGroteskMedium text-sm underline px-6 cursor-pointer"
                                >
                                    Edit
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center py-4">
                            <div className="w-1/3 max-sm:w-1/2">
                                <p className="text-sm font-rocGroteskBold text-gun-metal">
                                    Business Logo
                                </p>
                                <p className="text-sm max-lg:hidden font-rocGroteskMedium text-mvx-neutral">
                                    PNG or JPG no bigger than 500x500px
                                </p>
                                <p className="hidden max-lg:block">
                                    {generalData?.businessLogo || uploadedImage.businessLogo.url ? (
                                        <img
                                            src={
                                                uploadedImage.businessLogo.url
                                                    ? uploadedImage.businessLogo.url
                                                    : generalData?.businessLogo
                                            }
                                            alt="logo"
                                            className="w-11 h-11 rounded-full"
                                        />
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/3 max-lg:hidden flex justify-start">
                                {generalData?.businessLogo || uploadedImage.businessLogo.url ? (
                                    <img
                                        src={
                                            uploadedImage.businessLogo.url
                                                ? uploadedImage.businessLogo.url
                                                : generalData?.businessLogo
                                        }
                                        alt="logo"
                                        className="w-11 h-11 rounded-full"
                                    />
                                ) : (
                                    <span className="material-icons-outlined text-sm">remove</span>
                                )}
                            </div>
                            <div className="w-1/5 flex justify-end">
                                <p
                                    onClick={() => setEditModal({ open: true, editId: 3 })}
                                    className="text-gun-metal font-rocGroteskMedium text-sm underline px-6 cursor-pointer"
                                >
                                    Edit
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center py-4">
                            <div className="w-1/3 max-sm:w-1/2">
                                <p className="text-sm font-rocGroteskBold text-gun-metal">
                                    About business
                                </p>
                                <p className="text-sm max-lg:hidden font-rocGroteskMedium text-mvx-neutral whitespace-nowrap">
                                    More information about your business
                                </p>
                                <p className="text-sm hidden max-lg:block font-rocGroteskMedium text-gun-metal">
                                    {generalData?.aboutBusiness ? (
                                        _.truncate(generalData?.aboutBusiness, {
                                            length: 30,
                                        })
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/3 max-lg:hidden flex justify-start">
                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {generalData?.aboutBusiness ? (
                                        _.truncate(generalData?.aboutBusiness, {
                                            length: 30,
                                        })
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/5 flex justify-end">
                                <p
                                    onClick={() => setEditModal({ open: true, editId: 4 })}
                                    className="text-gun-metal font-rocGroteskMedium text-sm underline px-6 cursor-pointer"
                                >
                                    Edit
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center py-4">
                            <div className="w-1/3 max-sm:w-1/2">
                                <p className="text-sm font-rocGroteskBold text-gun-metal">
                                    Website
                                </p>
                                <p className="text-sm max-lg:hidden font-rocGroteskMedium text-mvx-neutral">
                                    The official website of your business.
                                </p>
                                <p className="text-sm hidden max-lg:block font-rocGroteskMedium text-gun-metal">
                                    {generalData?.website ? (
                                        generalData?.website
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/3 max-lg:hidden flex justify-start">
                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {generalData?.website ? (
                                        generalData?.website
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/5 flex justify-end">
                                <p
                                    onClick={() => setEditModal({ open: true, editId: 5 })}
                                    className="text-gun-metal font-rocGroteskMedium text-sm underline px-6 cursor-pointer"
                                >
                                    Edit
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center pt-4">
                            <div className="w-1/3 max-sm:w-1/2">
                                <p className="text-sm font-rocGroteskBold text-gun-metal">
                                    Business Address
                                </p>
                                <p className="text-sm max-lg:hidden font-rocGroteskMedium text-mvx-neutral">
                                    Where your business is located
                                </p>
                                <p className="text-sm hidden max-lg:block font-rocGroteskMedium text-gun-metal">
                                    {generalData?.businessAddress?.address ? (
                                        address?.businessAddress?.address ||
                                        generalData?.businessAddress?.address
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/3 max-lg:hidden flex justify-start">
                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {generalData?.businessAddress?.address ? (
                                        address?.businessAddress?.address ||
                                        generalData?.businessAddress?.address
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/5 flex justify-end">
                                <p
                                    onClick={() => setEditModal({ open: true, editId: 6 })}
                                    className="text-gun-metal font-rocGroteskMedium text-sm underline px-6 cursor-pointer"
                                >
                                    Edit
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 1 && (
                    <div className="border max-sm:border-none py-4 px-5 mt-6">
                        <div className="flex justify-between items-center pb-4">
                            <div className="w-1/3">
                                <p className="text-sm font-rocGroteskBold text-gun-metal">
                                    Full Name
                                </p>
                                <p className="text-sm max-lg:hidden font-rocGroteskMedium text-mvx-neutral">
                                    Your first and last name
                                </p>
                                <p className="text-sm hidden max-lg:block font-rocGroteskMedium text-gun-metal">
                                    {generalData?.fullName ? (
                                        generalData?.fullName
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/3 max-lg:hidden">
                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {generalData?.fullName ? (
                                        generalData?.fullName
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/5 flex justify-end">
                                <p
                                    onClick={() => setEditModal({ open: true, editId: 0 })}
                                    className="text-gun-metal font-rocGroteskMedium text-sm underline px-6 cursor-pointer"
                                >
                                    Edit
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center py-4">
                            <div className="w-1/3">
                                <p className="text-sm font-rocGroteskBold text-gun-metal">
                                    Email address
                                </p>
                                <p className="text-sm max-lg:hidden font-rocGroteskMedium text-mvx-neutral">
                                    Your work email
                                </p>
                                <p className="text-sm hidden max-lg:block font-rocGroteskMedium text-gun-metal">
                                    {generalData?.personalEmail ? (
                                        generalData?.personalEmail
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/3 max-lg:hidden">
                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {generalData?.personalEmail ? (
                                        generalData?.personalEmail
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/5 flex justify-end"></div>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center py-4">
                            <div className="w-1/3 ">
                                <p className="text-sm font-rocGroteskBold text-gun-metal">
                                    Phone number
                                </p>
                                <p className="text-sm max-lg:hidden font-rocGroteskMedium text-mvx-neutral">
                                    Add a number so Fleet+ can get in touch.
                                </p>
                                <p className="text-sm max-lg:block hidden font-rocGroteskMedium text-gun-metal">
                                    {generalData?.phoneNum ? (
                                        generalData?.phoneExt + generalData?.phoneNum
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/3 max-lg:hidden flex justify-start">
                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {generalData?.phoneNum ? (
                                        generalData?.phoneExt + generalData?.phoneNum
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/5 flex justify-end">
                                <p
                                    onClick={() => setEditModal({ open: true, editId: 2 })}
                                    className="text-gun-metal font-rocGroteskMedium text-sm underline px-6 cursor-pointer"
                                >
                                    Edit
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center pt-4">
                            <div className="w-1/3 ">
                                <p className="text-sm font-rocGroteskBold text-gun-metal">Role</p>
                                <p className="text-sm max-lg:hidden font-rocGroteskMedium text-mvx-neutral">
                                    What your role in your organisation
                                </p>
                                <p className="text-sm hidden max-lg:block font-rocGroteskMedium text-gun-metal">
                                    {generalData?.role ? (
                                        generalData?.role
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="w-1/3 max-lg:hidden">
                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                    {generalData?.role ? (
                                        generalData?.role
                                    ) : (
                                        <span className="material-icons-outlined text-sm">
                                            remove
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="w-1/5 flex justify-end">
                                <p
                                    // onClick={() => setEditModal({ open: true, editId: 5 })}
                                    className="text-gun-metal font-rocGroteskMedium text-sm underline px-6 cursor-pointer"
                                ></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {editModal.open && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        setGeneralData((prev) => {
                            return {
                                ...prev,
                                [getModalContent(activeTab, editModal.editId)?.inputName]:
                                    defaultGeneralData[
                                        getModalContent(activeTab, editModal.editId)?.inputName
                                    ],
                            };
                        });
                        setUploadedImage((prev) => {
                            return {
                                ...prev,
                                [getModalContent(activeTab, editModal.editId)?.inputName]: {
                                    name: "",
                                    url: "",
                                },
                            };
                        });
                        setEditModal({ open: false, editId: null });
                    }}
                >
                    <form
                        onSubmit={() => handleSubmit()}
                        className="bg-white rounded-lg shadow-modalShadow"
                    >
                        {getModalContent(activeTab, editModal.editId)?.type === "image" ? (
                            <div className="px-6 pt-12">
                                {uploadingImage ? (
                                    <Loader color="gun-metal" size={8} />
                                ) : (
                                    <div>
                                        {activeTab === 0 &&
                                        (generalData?.businessLogo ||
                                            uploadedImage?.businessLogo.url) ? (
                                            <div className="relative w-full flex flex-col items-center justify-center">
                                                <p className="text-xl text-gun-metal mb-3 font-rocGroteskBold">
                                                    Image Uploaded!
                                                </p>
                                                <p className="text-base text-gun-metal mb-2 px-6">
                                                    {_.truncate(
                                                        uploadedImage?.businessLogo.name ||
                                                            generalData?.businessLogo,
                                                        {
                                                            length: 40,
                                                        }
                                                    )}
                                                </p>
                                                <p className="text-center text-sm font-rocGroteskMedium text-gun-metal underline cursor-pointer">
                                                    Change Image
                                                </p>
                                                <input
                                                    type={"file"}
                                                    name={
                                                        getModalContent(activeTab, editModal.editId)
                                                            ?.inputName
                                                    }
                                                    onChange={(event) => {
                                                        handleUpload(
                                                            getModalContent(
                                                                activeTab,
                                                                editModal.editId
                                                            )?.inputName,
                                                            event.target.files[0].name,
                                                            event.target.files[0]
                                                        );
                                                    }}
                                                    className="absolute bottom-0 w-[45%] h-[20%] opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    required
                                                />
                                            </div>
                                        ) : activeTab === 1 &&
                                          (generalData.profilePic ||
                                              uploadedImage?.profilePic.url) ? (
                                            <div className="relative w-full flex flex-col items-center justify-center">
                                                <p className="text-xl text-gun-metal mb-3">
                                                    Image Uploaded!
                                                </p>
                                                <p className="text-base text-gun-metal mb-2">
                                                    {_.truncate(
                                                        uploadedImage?.profilePic.name ||
                                                            generalData?.profilePic,
                                                        {
                                                            length: 40,
                                                        }
                                                    )}
                                                </p>
                                                <p className="text-center text-sm font-rocGroteskMedium text-gun-metal underline cursor-pointer">
                                                    Change Image
                                                </p>
                                                <input
                                                    type={"file"}
                                                    name={
                                                        getModalContent(activeTab, editModal.editId)
                                                            ?.inputName
                                                    }
                                                    onChange={(event) => {
                                                        handleUpload(
                                                            getModalContent(
                                                                activeTab,
                                                                editModal.editId
                                                            )?.inputName,
                                                            event.target.files[0].name,
                                                            event.target.files[0]
                                                        );
                                                    }}
                                                    className="absolute bottom-0 w-[45%] h-[20%] opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    required
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex justify-center">
                                                    <i className="ri-image-add-fill text-7xl before:content-['\ee46'] before:text-mvx-neutral"></i>
                                                </div>
                                                <p className="text-center text-xl font-rocGroteskBold text-gun-metal mb-[2px]">
                                                    Upload your logo here
                                                </p>
                                                <p className="text-center text-sm font-rocGroteskMedium text-gun-metal mb-4">
                                                    Choose a clear photo of your logo
                                                </p>
                                                <div className="relative w-full flex justify-center">
                                                    <p className="text-center text-sm font-rocGroteskMedium text-gun-metal underline cursor-pointer">
                                                        Upload from your device
                                                    </p>
                                                    <input
                                                        type={"file"}
                                                        name={
                                                            getModalContent(
                                                                activeTab,
                                                                editModal.editId
                                                            )?.inputName
                                                        }
                                                        onChange={(event) => {
                                                            handleUpload(
                                                                getModalContent(
                                                                    activeTab,
                                                                    editModal.editId
                                                                )?.inputName,
                                                                event.target.files[0].name,
                                                                event.target.files[0]
                                                            );
                                                        }}
                                                        className="absolute top-0 w-[45%] h-[90%] opacity-0 cursor-pointer"
                                                        accept="image/*"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="px-6 pt-8">
                                <p className="text-xl mb-3 font-rocGroteskBold text-gun-metal">
                                    {getModalContent(activeTab, editModal.editId)?.modalTitle}
                                </p>
                                <div>
                                    {getModalContent(activeTab, editModal.editId).type ===
                                        "text" && (
                                        <div>
                                            <p className="text-sm mb-1 font-rocGroteskMedium">
                                                {
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.label
                                                }
                                            </p>
                                            <input
                                                type="text"
                                                value={
                                                    generalData[
                                                        getModalContent(activeTab, editModal.editId)
                                                            ?.inputName
                                                    ]
                                                }
                                                placeholder={
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.inputPlaceholder
                                                }
                                                className="border border-gray-200 py-3 px-4 outline-0 w-full h-[50px] rounded text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                name={
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.inputName
                                                }
                                                onChange={(event) =>
                                                    handleInputChange(
                                                        event.target.name,
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                    {getModalContent(activeTab, editModal.editId).type ===
                                        "address" && (
                                        <div>
                                            <p className="text-sm mb-1 font-rocGroteskMedium">
                                                {
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.label
                                                }
                                            </p>
                                            <LocationSearchInput
                                                setData={setAddress}
                                                savedAddress={
                                                    address?.businessAddress
                                                        ? address?.businessAddress?.address
                                                        : ""
                                                }
                                                placeholder="Enter business address"
                                                name={"businessAddress"}
                                            />
                                        </div>
                                    )}
                                    {getModalContent(activeTab, editModal.editId).type ===
                                        "phoneNum" && (
                                        <div>
                                            <p className="text-sm mb-1 font-rocGroteskMedium">
                                                {
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.label
                                                }
                                            </p>
                                            <SelectInput
                                                value={generalData.phoneExt}
                                                isRequired={true}
                                                name="phoneExt"
                                                className="rounded-b-none rounded-t"
                                                handleChange={handleInputChange}
                                                dropdownOptions={countries.map((item) => ({
                                                    label: item?.codes[0]?.replace(" ", ""),
                                                    value: item?.codes[0]?.replace(" ", ""),
                                                }))}
                                                placeholder={"+000"}
                                            />
                                            <input
                                                type="text"
                                                value={
                                                    generalData[
                                                        getModalContent(activeTab, editModal.editId)
                                                            ?.inputName
                                                    ]
                                                }
                                                placeholder={
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.inputPlaceholder
                                                }
                                                className="border-x border-b rounded-b border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                name={
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.inputName
                                                }
                                                onChange={(event) =>
                                                    handleInputChange(
                                                        event.target.name,
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                    {getModalContent(activeTab, editModal.editId).type ===
                                        "textarea" && (
                                        <div>
                                            <p className="text-sm mb-1 font-rocGroteskMedium">
                                                {
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.label
                                                }
                                            </p>
                                            <textarea
                                                type="text"
                                                value={
                                                    generalData[
                                                        getModalContent(activeTab, editModal.editId)
                                                            ?.inputName
                                                    ]
                                                }
                                                placeholder={
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.inputPlaceholder
                                                }
                                                className="border resize-none border-gray-200 py-3 px-4 rounded outline-0 w-full text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                rows={7}
                                                name={
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.inputName
                                                }
                                                onChange={(event) =>
                                                    handleInputChange(
                                                        event.target.name,
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                    {getModalContent(activeTab, editModal.editId).type ===
                                        "url" && (
                                        <div>
                                            <p className="text-sm mb-1 font-rocGroteskMedium">
                                                {
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.label
                                                }
                                            </p>
                                            <div className="flex">
                                                <div className="bg-mvx-light-blue border-y border-l px-3 rounded-tl rounded-bl h-[50px] flex items-center justify-center">
                                                    <p className="text-sm text-mvx-neutral ">
                                                        Fleet+.io/
                                                    </p>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={
                                                        generalData[
                                                            getModalContent(
                                                                activeTab,
                                                                editModal.editId
                                                            )?.inputName
                                                        ]
                                                    }
                                                    placeholder={
                                                        getModalContent(activeTab, editModal.editId)
                                                            ?.inputPlaceholder
                                                    }
                                                    className="border border-gray-200 py-3 px-4 outline-0 w-full h-[50px] rounded-tr rounded-br text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                    required
                                                    name={
                                                        getModalContent(activeTab, editModal.editId)
                                                            ?.inputName
                                                    }
                                                    onChange={(event) =>
                                                        handleInputChange(
                                                            event.target.name,
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex pt-8">
                            <button
                                type="button"
                                className={`uppercase rounded-bl-lg w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border px-3`}
                                onClick={() => {
                                    setGeneralData((prev) => {
                                        return {
                                            ...prev,
                                            [getModalContent(activeTab, editModal.editId)
                                                ?.inputName]:
                                                defaultGeneralData[
                                                    getModalContent(activeTab, editModal.editId)
                                                        ?.inputName
                                                ],
                                        };
                                    });
                                    setUploadedImage((prev) => {
                                        return {
                                            ...prev,
                                            [getModalContent(activeTab, editModal.editId)
                                                ?.inputName]: {
                                                name: "",
                                                url:
                                                    activeTab === 0
                                                        ? defaultGeneralData.businessLogo
                                                        : defaultGeneralData.profilePic,
                                            },
                                        };
                                    });
                                    setEditModal({ open: false, editId: null });
                                }}
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const urlValue =
                                        generalData[
                                            getModalContent(activeTab, editModal.editId)?.inputName
                                        ];

                                    if (isWebsiteType) {
                                        const validURL = isValidUrl(urlValue);
                                        validURL
                                            ? handleSubmit()
                                            : toast.custom((t) => (
                                                  <CustomToast
                                                      t={t}
                                                      message={
                                                          "Website value is not a valid url type!"
                                                      }
                                                      type="error"
                                                  />
                                              ));
                                    } else {
                                        handleSubmit();
                                    }
                                }}
                                className={`uppercase w-full text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-6 border-y px-3`}
                            >
                                {updateBusinessProfileLoading || updatePersonalProfileLoading ? (
                                    <Loader color="gun-metal" />
                                ) : (
                                    <p className="text-inherit">save</p>
                                )}
                            </button>
                        </div>
                    </form>
                </ModalContainer>
            )}
        </div>
    );
};

export default General;
