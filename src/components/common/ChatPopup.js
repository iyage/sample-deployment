/* eslint-disable react-hooks/exhaustive-deps */
import avatar from "assets/images/avatar.svg";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chatActions } from "actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import downloadURLFile from "helpers/downloadURLFile";
// import { PDFIcon } from "assets/arts";
import { firebaseService } from "services/firebaseService";
import ModalContainer from "components/common/ModalContainer";
import scrollVertical from "helpers/scrollVertical";
import Skeleton from "components/common/Skeleton";
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";

const ChatPopup = ({ shipmentData, openChatPopup, closePopUp }) => {
    const messageAttachmentRef = useRef();
    const messageBoxRef = useRef();
    const elmScrollRef = useRef();
    const addIconRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previewDoc, setPreviewDoc] = useState();
    const [addIconOpen, setAddIconOpen] = useState(false);
    const [clickType, setClickType] = useState("");
    const [messageInput, setMessageInput] = useState("");
    const [newChat, setNewChat] = useState(null);
    const [fileAttachment, setFileAttachment] = useState({
        filename: "",
        mediaType: "",
        content: " ",
    });
    const {
        FFShipmentChatsLoading,
        FFShipmentChats: { pagination, data: chats },
        sendFFChatLoading,
        sendFFChatSuccess,
    } = useSelector((state) => state.chat);
    const shipmentId = shipmentData?._id;

    const chatsGroupedByDays = useMemo(() => {
        if (chats?.length) {
            const chatsDates = chats.map((sts) => moment(sts.createdAt).format("MMM DD, YYYY"));

            const datesGroups = _.uniqWith(chatsDates, _.isEqual);
            datesGroups.sort((a, b) => moment(a) - moment(b));
            const chatsByDates = {};

            datesGroups.forEach((chatDate) => {
                chatsByDates[chatDate] = chats.filter(
                    (chat) => moment(chat.createdAt).format("MMM DD, YYYY") === chatDate
                );
            });

            return chatsByDates;
        } else {
            return [];
        }
    }, [chats]);

    const addAttachment = (evt) => {
        const file = evt.target.files[0];
        const imageType = file.type?.includes("image");
        const audioType = file.type?.includes("audio");

        if (file.size > 15000000) {
            return;
        }

        setFileAttachment({
            filename: file.name,
            mediaType: imageType ? "image" : audioType ? "audio" : "document",
            content: " ",
        });
        firebaseService.uploadFile(`relayApp/${file.name}`, file, (url) =>
            setFileAttachment((prev) => ({ ...prev, content: url }))
        );
    };

    const sendMessage = (evt, media = null) => {
        evt?.preventDefault();
        if (media === null && !messageInput) return;

        const messageData = {
            content: messageInput || " ",
            shipmentId,
        };
        dispatch(chatActions.sendFFChat(media ? { ...messageData, media: [media] } : messageData));
    };

    const shortenText = (text) => {
        const splitted = text?.split(".");

        let extensionType = splitted[splitted?.length - 1];

        const theRestText = splitted?.slice(0, -1)?.join("");

        return {
            text: `${theRestText?.match(/.{2,}/g).join("")}`,
            extensionType,
        };
    };

    const loadMoreChats = useCallback(() => {
        if (pagination && messageBoxRef.current) {
            const { scrollTop } = messageBoxRef.current;
            // const isAt50Percent = scrollHeight * 0.5;
            let { current, number_of_pages } = pagination;

            // FIX THIS
            // And it's loader
            if (scrollTop.toFixed() >= 100 && scrollTop.toFixed() <= 140) {
                if (!FFShipmentChatsLoading && current !== number_of_pages) {
                    console.log("intersecting");
                    dispatch(chatActions.fetchFFShipmentChat(shipmentId, ++current));
                }
            }
        }
    }, [pagination, FFShipmentChatsLoading, dispatch, shipmentId]);

    const Download = ({ url, filename, className }) => {
        return (
            <span
                className={`material-icons text-[22px] !font-semibold cursor-pointer rounded-sm rounded-br-lg p-1 bg-gray-300 text-white absolute right-0 bottom-0 hover:bg-gray-500 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-500 active:shadow-lg transition duration-150 ease-in-out ${className}`}
                onClick={(evt) => {
                    evt.stopPropagation();
                    downloadURLFile(url, filename);
                }}
            >
                download
            </span>
        );
    };

    const ExtensionType = ({ extTyp }) => {
        const extType = `${extTyp}`.toLowerCase();
        return extType === "pdf" ? (
            // <PDFIcon className="w-8 h-11" />
            <img
                src={
                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687258778/Web%20App/messaging_link/pdf-document_rvpnl1.svg"
                }
                alt="pdf icon"
                className="w-8 h-11"
            />
        ) : extType === "ppt" ? (
            // <PowerPointIcon className="w-8 h-11" />
            <img
                src={
                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687258778/Web%20App/messaging_link/powerpoint-presentation_nj6ewi.svg"
                }
                alt="Powerpoint Icon"
                className="w-8 h-11"
            />
        ) : extType === "doc" || extType === "docx" ? (
            // <WordDocIcon className="w-8 h-11" />
            <img
                src={
                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687258777/Web%20App/messaging_link/word-document_mhftgk.svg"
                }
                alt="Word doc icon"
                className="w-8 h-11"
            />
        ) : (
            // <ExcelIcon className="w-8 h-11" />
            <img
                src={
                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687258778/Web%20App/messaging_link/excel-spreadsheet_wigk4b.svg"
                }
                alt="Excel Icon"
                className="w-8 h-11"
            />
        );
    };

    const AudioPlayer = ({ audioSrc }) => {
        return (
            <audio controls src={audioSrc} id={"audio-player"}>
                <a href="/media/cc0-audio/t-rex-roar.mp3">Download audio</a>
            </audio>
        );
    };

    const ChatLoader = ({ isFirst }) => {
        return (
            <div className="flex py-6 px-2 375:p-6 mr-auto mt-4 mb-7">
                <Skeleton className={"w-[50px] h-[40px] !rounded-full border mr-4 mt-[2px]"} />
                <div className="w-full">
                    <Skeleton className={"h-[10px] w-[40%] !bg-[#EBECF0]"} />
                    <Skeleton className={"h-[10px] mt-2 !bg-[#EBECF0]"} />
                    <Skeleton className={"h-[10px] mt-2 !bg-[#EBECF0]"} />

                    {isFirst && (
                        <>
                            <Skeleton className={"h-[40px] w-[56%] mt-6 !bg-[#EBECF0]"} />
                            <Skeleton className={"h-[40px] w-[46%] mt-3 !bg-[#EBECF0]"} />
                            <Skeleton className={"h-[100px] w-[66%] mt-3 !bg-[#EBECF0]"} />
                        </>
                    )}
                </div>
            </div>
        );
    };

    const renderChats = () => (
        <>
            {Object.keys(chatsGroupedByDays).map((date, idx) => {
                const sortedChats = _.uniqBy(
                    chatsGroupedByDays[date].sort(
                        (a, b) => moment(a.createdAt) - moment(b.createdAt)
                    ),
                    "_id"
                );

                return (
                    <div className={`pb-2 break-words`} key={date + idx}>
                        <div
                            className={`border rounded-3xl w-max text-[11px] py-1 px-[14px] mx-auto text-gray-500 font-rocGroteskMedium ${
                                idx && "mt-5"
                            }`}
                        >
                            {date}
                        </div>

                        {sortedChats.map((chatObj, idx2) => {
                            return (
                                <div
                                    className={`flex mt-6 ${
                                        chatObj.sender === "customer" && ""
                                    } test-scroll ${sortedChats.length - 1 === idx2 && "mb-3"} `}
                                    key={chatObj._id}
                                    ref={
                                        idx === Object.keys(chatsGroupedByDays).length - 1 &&
                                        idx2 === sortedChats.length - 1
                                            ? elmScrollRef
                                            : null
                                    }
                                >
                                    {chatObj.sender.toLowerCase() !== "customer" ? (
                                        <Link
                                            to={`/profile/${chatObj?.freightForwarderId}`}
                                            className="cursor-pointer"
                                        >
                                            <img
                                                className="self-start border rounded-full object-cover"
                                                width={"36px"}
                                                height={"36px"}
                                                src={
                                                    shipmentData?.freightForwarder?.profile?.logo ??
                                                    avatar
                                                }
                                                alt={`${chatObj?.freightForwarder?.profile?.businessName} freight forwarder logo`}
                                            />
                                        </Link>
                                    ) : (
                                        <img
                                            className="self-start border rounded-full object-cover"
                                            width={"36px"}
                                            height={"36px"}
                                            src={avatar}
                                            alt={`customer avatar`}
                                        />
                                    )}

                                    <div className="ml-2 w-[calc(100%-52px)] sm:w-[calc(100%-44px)]">
                                        <p className="capitalize font-rocGroteskBold text-sm">
                                            {chatObj.sender.toLowerCase() === "customer"
                                                ? chatObj?.shipment?.shipperDetails?.fullName ??
                                                  "customer"
                                                : shipmentData?.freightForwarder?.profile
                                                      ?.businessName}
                                            <span className="uppercase text-gray-400 font-rocGroteskMedium text-xs ml-1">
                                                {moment(chatObj.createdAt).format("LT")}
                                            </span>
                                        </p>
                                        <p
                                            className={`text-[13px] font-rocGroteskMedium text-[#253858] mt-[2px] ${
                                                chatObj?.media?.length && "mb-[9px]"
                                            }`}
                                        >
                                            {chatObj?.content}
                                        </p>
                                        {chatObj?.media?.length
                                            ? chatObj.media.map((media) => (
                                                  <div
                                                      key={media._id}
                                                      className={`${
                                                          media.mediaType !== "audio" &&
                                                          "cursor-pointer"
                                                      }`}
                                                      onClick={() => {
                                                          if (media.mediaType !== "audio") {
                                                              setPreviewDoc({
                                                                  url: media.content,
                                                                  type: media.mediaType,
                                                                  name: media.content,
                                                                  ext: shortenText(media.filename)
                                                                      .extensionType,
                                                              });
                                                          }
                                                      }}
                                                  >
                                                      {media.mediaType === "image" && (
                                                          <div className="relative 420:w-max">
                                                              <img
                                                                  className="w-full 420:w-[340px] h-[370px] border rounded-tl-none shadow-sm rounded-lg object-cover"
                                                                  src={media.content}
                                                                  alt={media.filename}
                                                              />
                                                              <Download
                                                                  url={media.content}
                                                                  filename={media.filename}
                                                              />
                                                          </div>
                                                      )}
                                                      {media.mediaType === "document" && (
                                                          <div className="border relative rounded-tl-none shadow-sm rounded-lg px-[14px] py-[10px] flex w-max">
                                                              <ExtensionType
                                                                  extTyp={
                                                                      shortenText(media.filename)
                                                                          .extensionType
                                                                  }
                                                              />
                                                              <p className="font-medium text-sm text-mvx-blue ml-3 mt-1 capitalize">
                                                                  {shortenText(media.filename).text}
                                                                  <span className="uppercase font-rocGroteskRegular text-[#6B778C] block text-xs mt-[2px]">
                                                                      {/* 32 mb | */}

                                                                      {
                                                                          shortenText(
                                                                              media.filename
                                                                          ).extensionType
                                                                      }
                                                                  </span>
                                                              </p>
                                                              <Download
                                                                  url={media.content}
                                                                  filename={media.filename}
                                                                  className={"!text-[12px]"}
                                                              />
                                                          </div>
                                                      )}
                                                      {media.mediaType === "audio" && (
                                                          <AudioPlayer audioSrc={media.content} />
                                                      )}
                                                  </div>
                                              ))
                                            : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </>
    );

    useEffect(() => {
        dispatch(chatActions.fetchFFShipmentChat(shipmentId));
    }, [shipmentId, dispatch]);

    useEffect(() => {
        let unSubscribe;

        firebaseService.listenForNewMEssages(shipmentId, setNewChat, (unSubFunc) => {
            unSubscribe = unSubFunc;
        });

        return () => {
            if (unSubscribe) {
                unSubscribe();
            }
        };
    }, [shipmentId]);

    useEffect(() => {
        if (newChat) {
            const { createdAt, updatedAt } = newChat;
            dispatch(
                chatActions.AddNewFFChat({
                    ...newChat,
                    createdAt: moment(createdAt.seconds * 1000).format(),
                    updatedAt: moment(updatedAt.seconds * 1000).format(),
                })
            );
            setNewChat(null);
        }
    }, [newChat, dispatch]);

    useEffect(() => {
        if (fileAttachment.content.length > 3 && fileAttachment.content !== "error") {
            sendMessage(null, fileAttachment);
        }
    }, [fileAttachment]);

    useEffect(() => {
        if (sendFFChatSuccess) {
            setMessageInput("");
        }
        if (chats?.length && pagination?.current === 1) {
            scrollVertical(messageBoxRef?.current, "bottom");
        }
        if (chats?.length && newChat) {
            scrollVertical(messageBoxRef?.current, "bottom");
        }
    }, [chats, pagination, sendFFChatSuccess, newChat]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addIconRef.current && !addIconRef.current.contains(event.target) && addIconOpen) {
                setAddIconOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [addIconRef, addIconOpen]);

    return (
        <>
            <div
                className={`bg-gun-metal/20 fixed bottom-0 left-0 w-screen h-screen sm:h-[calc(100vh-72px)] ${
                    openChatPopup ? "z-[5000]" : "invisible z-[-5000]"
                }`}
            >
                <div
                    className={`h-full w-screen border-t border-l 475:w-[472px] bg-white absolute right-0 top-0 transition-transform ease-out ${
                        openChatPopup ? "translate-x-0 flex flex-col" : "translate-x-[200%]"
                    } shadow-modalShadow`}
                    onClick={(evt) => evt.stopPropagation()}
                >
                    <div>
                        <div className="p-6 max-sm:p-4 flex items-center justify-between border-b">
                            <p className="font-rocGroteskBold text-base">
                                Chat with TA {shipmentData?.mvxid}
                            </p>
                            <div className="flex items-center ">
                                <span
                                    onClick={() =>
                                        navigate(`/dashboard/shipment/${shipmentData?._id}`)
                                    }
                                    className="material-icons text-xl cursor-pointer mr-6"
                                >
                                    fmd_good
                                </span>
                                <a
                                    href={`tel:${
                                        shipmentData?.shipperDetails?.phoneNumberExtention +
                                        shipmentData?.shipperDetails?.phoneNumber
                                    }`}
                                    className="mr-4"
                                >
                                    <span className="material-icons text-xl cursor-pointer mt-1">
                                        call
                                    </span>
                                </a>

                                <div className="hover:bg-mvx-light-blue rounded-full">
                                    <span
                                        className="material-icons px-2 py-1 text-xl cursor-pointer"
                                        onClick={closePopUp}
                                    >
                                        close
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#F4F5F7] py-3 px-2 text-center flex items-center justify-center gap-3">
                            <p className="font-rocGroteskMedium text-xs">
                                Fleet+ will not be held liable for any conversation held off this
                                platform
                            </p>
                        </div>
                    </div>

                    <div className="h-full p-6 max-sm:p-2 flex-1 overflow-y-hidden">
                        <div className="flex flex-col justify-between h-full">
                            <div
                                onScroll={() => loadMoreChats()}
                                ref={messageBoxRef}
                                className="h-[100%] overflow-y-auto"
                            >
                                {FFShipmentChatsLoading ? (
                                    <>
                                        {chats?.length ? (
                                            <>
                                                <ChatLoader />
                                                {renderChats()}
                                            </>
                                        ) : (
                                            <ChatLoader isFirst />
                                        )}
                                    </>
                                ) : (
                                    renderChats()
                                )}
                            </div>

                            <div className="w-full basis-[94px] relative">
                                <form
                                    className="flex items-end w-full gap-4"
                                    onSubmit={(evt) => {
                                        setClickType("");
                                        sendMessage(evt);
                                    }}
                                >
                                    <div className="flex flex-col w-full border rounded overflow-hidden">
                                        <div className="w-full">
                                            <textarea
                                                className="!appearance-none !outline-0 !border-0 w-full text-[13px] font-rocGroteskMedium  placeholder:font-rocGroteskMedium p-3 resize-none leading-5"
                                                rows={"1"}
                                                value={messageInput}
                                                placeholder={"Type a message"}
                                                disabled={sendFFChatLoading}
                                                onInput={(evt) => setMessageInput(evt.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between px-3">
                                            <div className="flex items-center gap-4">
                                                <div className="absolute">
                                                    {addIconOpen && (
                                                        <div
                                                            ref={addIconRef}
                                                            className={`min-w-max py-2 bg-white absolute bottom-[107%] w-full h-auto  z-20 overflow-auto border rounded`}
                                                        >
                                                            <div className={``}>
                                                                <div className="">
                                                                    <p
                                                                        className={`text-[10px] flex gap-3 py-3 px-4 items-center font-rocGroteskMedium text-mvx-neutral`}
                                                                    >
                                                                        NEW SHIPMENT
                                                                    </p>
                                                                    <p
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/dashboard/shipment-creation/${shipmentData?.freightForwarderId}`
                                                                            )
                                                                        }
                                                                        className="flex cursor-pointer items-center justify-between px-4 py-2 gap-12 hover:bg-mvx-light-blue "
                                                                    >
                                                                        <span className="text-xs font-rocGroteskMedium text-gun-metal">
                                                                            Create a new shipment
                                                                        </span>
                                                                        <span className="material-icons text-xl">
                                                                            navigate_next
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                <hr />
                                                                <div>
                                                                    <p
                                                                        className={`uppercase  text-[10px] flex gap-3 py-3 px-4 items-center font-rocGroteskMedium text-mvx-neutral`}
                                                                    >
                                                                        Shipment status
                                                                    </p>
                                                                    <div
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/dashboard/shipment/${shipmentData?._id}`
                                                                            )
                                                                        }
                                                                        className="py-3 hover:bg-mvx-light-blue cursor-pointer"
                                                                    >
                                                                        <p className="flex items-center justify-between px-4 gap-12  ">
                                                                            <span className="text-xs font-rocGroteskMedium text-gun-metal">
                                                                                TA{" "}
                                                                                {
                                                                                    shipmentData?.mvxid
                                                                                }
                                                                            </span>
                                                                        </p>
                                                                        <p className="text-xs px-4 font-rocGroteskMedium text-mvx-neutral">
                                                                            {_.truncate(
                                                                                shipmentData?.origin
                                                                                    ?.address +
                                                                                    " • " +
                                                                                    shipmentData
                                                                                        ?.destination
                                                                                        ?.address,
                                                                                { length: 37 }
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <hr />
                                                                <div className="">
                                                                    <p
                                                                        className={`uppercase text-[10px] flex gap-3 py-3 px-4 items-center font-rocGroteskMedium text-mvx-neutral`}
                                                                    >
                                                                        MEDIA
                                                                    </p>
                                                                    <p
                                                                        onClick={() => {
                                                                            messageAttachmentRef.current.accept =
                                                                                "image/*";
                                                                            messageAttachmentRef.current.click();
                                                                            setClickType(
                                                                                "attachment"
                                                                            );
                                                                            setAddIconOpen(false);
                                                                        }}
                                                                        className="flex items-center px-4 py-2 gap-[10px] hover:bg-mvx-light-blue cursor-pointer"
                                                                    >
                                                                        <span className="material-icons text-xl">
                                                                            add_photo_alternate
                                                                        </span>
                                                                        <span className="text-xs font-rocGroteskMedium text-gun-metal">
                                                                            Photo & Video Library
                                                                        </span>
                                                                    </p>
                                                                    <p
                                                                        onClick={() => {
                                                                            messageAttachmentRef.current.accept =
                                                                                ".pdf, .doc, .docx, .ppt, .xlsx, .xltx, .xlm, .xls, .cts, .xlr, .csv, .mp3, .ogg";
                                                                            messageAttachmentRef.current.click();
                                                                            setClickType(
                                                                                "attachment"
                                                                            );
                                                                            setAddIconOpen(false);
                                                                        }}
                                                                        className="flex items-center px-4 py-2 gap-[10px] hover:bg-mvx-light-blue cursor-pointer"
                                                                    >
                                                                        <span className="material-icons text-xl">
                                                                            note_add
                                                                        </span>
                                                                        <span className="text-xs font-rocGroteskMedium text-gun-metal">
                                                                            Document Upload
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {(sendFFChatLoading &&
                                                        clickType === "attachment") ||
                                                    (FFShipmentChatsLoading && !chats) ? (
                                                        <Skeleton
                                                            dataLoaded={false}
                                                            className={
                                                                "!h-6 !w-6 !rounded-full mb-3"
                                                            }
                                                        />
                                                    ) : (
                                                        <span
                                                            onClick={() =>
                                                                setAddIconOpen(!addIconOpen)
                                                            }
                                                            className="material-icons text-[22px] cursor-pointer text-gray-500 mb-3"
                                                        >
                                                            add_circle
                                                        </span>
                                                    )}
                                                </div>

                                                <input
                                                    className="hidden"
                                                    type={"file"}
                                                    accept={
                                                        "image/*, .pdf, .doc, .docx, .ppt, .xlsx, .xltx, .xlm, .xls, .cts, .xlr, .csv, .mp3, .ogg"
                                                    }
                                                    ref={messageAttachmentRef}
                                                    onInput={addAttachment}
                                                />
                                            </div>

                                            {(sendFFChatLoading && !clickType) ||
                                            (FFShipmentChatsLoading && !chats) ? (
                                                <div className="w-fit ">
                                                    <Skeleton
                                                        dataLoaded={false}
                                                        className={
                                                            "mb-3 !h-6 !w-[29px] !rounded-full"
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <button
                                                    className="mb-3  p-0 material-icons text-sm w-7 h-7 text-white rounded-full bg-pacific-cyan grid place-items-center pl-[6px] pr-1 cursor-pointer disabled:bg-pacific-cyan/40"
                                                    type="submit"
                                                    disabled={!Boolean(messageInput)}
                                                >
                                                    send
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {(previewDoc?.type === "image" || previewDoc?.ext === "pdf") && (
                            <ModalContainer
                                showCloseIcon={true}
                                closeModal={() => setPreviewDoc(null)}
                            >
                                {previewDoc?.type === "image" && (
                                    <img
                                        src={previewDoc?.url}
                                        alt={previewDoc?.content}
                                        className="min-w-[290px] max-w-[75vw] max-h-[88vh] m-auto rounded-md object-cover sm:object-['unset']"
                                    />
                                )}
                                {previewDoc?.ext === "pdf" && (
                                    <iframe
                                        src={previewDoc?.url}
                                        className="h-[80vh] min-w-[320px] w-[60vw] rounded-lg"
                                        title={previewDoc?.content}
                                    ></iframe>
                                )}
                            </ModalContainer>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatPopup;
