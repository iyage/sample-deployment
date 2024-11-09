import NavTwo from "components/common/NavTwo";
import avatar from "assets/images/avatar.svg";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { chatActions } from "actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import downloadURLFile from "helpers/downloadURLFile";
// import { PDFIcon } from "assets/arts";
import { firebaseService } from "services/firebaseService";
import ModalContainer from "components/common/ModalContainer";
import scrollVertical from "helpers/scrollVertical";
import { Timestamp } from "firebase/firestore";
import Skeleton from "components/common/Skeleton";

const Messaging = () => {
    const messageAttachmentRef = useRef();
    const messageBoxRef = useRef();
    const elmScrollRef = useRef();
    const { shipmentId } = useParams();
    const dispatch = useDispatch();
    const [previewDoc, setPreviewDoc] = useState();
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

    const chatsGroupedByDays = useMemo(() => {
        if (chats?.length) {
            const chatsDates = chats.map((sts) => moment(sts.createdAt).format("MMM DD, YYYY"));

            const datesGroups = [...new Set(chatsDates)];
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
            shipmentId: shipmentId,
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
            <div className="flex p-6 mr-auto mt-4 mb-7 w-[70%]">
                <Skeleton className={"w-[36px] h-[36px] !rounded-full border mr-4 mt-[2px]"} />
                <div className="w-full">
                    <Skeleton className={"h-[10px] w-[40%] !bg-[#EBECF0]"} />
                    <Skeleton className={"h-[10px] mt-2 !bg-[#EBECF0]"} />
                    <Skeleton className={"h-[10px] mt-2 !bg-[#EBECF0]"} />

                    {isFirst && (
                        <>
                            <Skeleton className={"h-[40px] w-[46%] mt-6 !bg-[#EBECF0]"} />
                            <Skeleton className={"h-[40px] w-[46%] mt-3 !bg-[#EBECF0]"} />
                            <Skeleton className={"h-[80px] w-[46%] mt-3 !bg-[#EBECF0]"} />
                        </>
                    )}
                </div>
            </div>
        );
    };

    const renderChats = () => (
        <>
            {Object.keys(chatsGroupedByDays).map((date, idx) => {
                const sortedChats = chatsGroupedByDays[date].sort(
                    (a, b) => moment(a.createdAt) - moment(b.createdAt)
                );
                return (
                    <div className="p-6" key={date + idx}>
                        <div
                            className={`border rounded-3xl w-max text-[11px] py-1 px-[14px] mx-auto text-gray-500 font-bold ${
                                idx && "mt-5"
                            }`}
                        >
                            {date}
                        </div>

                        {sortedChats.map((chatObj, idx2) => {
                            // console.log("chatObj -->", chatObj);

                            return (
                                <div
                                    className={`flex mt-6 ${
                                        chatObj.sender === "customer" && ""
                                    } test-scroll`}
                                    key={chatObj._id}
                                    ref={
                                        idx === Object.keys(chatsGroupedByDays).length - 1 &&
                                        idx2 === sortedChats.length - 1
                                            ? elmScrollRef
                                            : null
                                    }
                                >
                                    {chatObj?.freightForwarder?.profile?.logo &&
                                    chatObj.sender !== "customer" ? (
                                        <img
                                            className="self-start border rounded-full object-cover"
                                            width={"36px"}
                                            height={"36px"}
                                            src={chatObj.freightForwarder.profile.logo}
                                            alt={`${chatObj.freightForwarder.profile?.businessName} freight forwarder logo`}
                                        />
                                    ) : (
                                        <img
                                            className="self-start border rounded-full object-cover"
                                            width={"36px"}
                                            height={"36px"}
                                            src={avatar}
                                            alt={`customer avatar`}
                                        />
                                    )}

                                    <div className="ml-2">
                                        <p className="capitalize font-rocGroteskBold text-sm">
                                            {chatObj.sender === "customer"
                                                ? chatObj?.shipment?.shipperDetails?.fullName ??
                                                  "customer"
                                                : chatObj?.freightForwarder?.profile?.businessName}
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
                                                          <div className="relative">
                                                              <img
                                                                  className="w-[340px] h-[370px] border rounded-tl-none shadow-sm rounded-lg object-cover"
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
                                                                  <span className="uppercase font-normal text-[#6B778C] block text-xs mt-[2px]">
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
            const created = new Timestamp(createdAt.seconds, createdAt.nanoseconds)
                .toDate()
                .toDateString();
            const updated = new Timestamp(updatedAt.seconds, updatedAt.nanoseconds)
                .toDate()
                .toDateString();
            dispatch(
                chatActions.AddNewFFChat({ ...newChat, createdAt: created, updatedAt: updated })
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
    console.log("newchat -->", newChat, chats);
    return (
        <div>
            <NavTwo />
            <div className="w-full h-[calc(100vh-96px)] flex mt-24">
                {/* <div className="border-r w-[27%]">
                    <div className="flex justify-between p-6 border-b mb-1">
                        <p className="text-lg text-gun-metal font-rocGroteskBold">Messages</p>
                        <span className="material-icons">filter_list</span>
                    </div>
                    <div className="px-3">
                        <div className="grid grid-cols-[0.5fr_3fr] items-center cursor-pointer py-4 px-3 gap-3 hover:bg-mvx-light-blue hover:rounded-xl">
                            <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                            <div>
                                <div className="flex justify-between">
                                    <span className="font-rocGroteskMedium text-sm text-gun-metal">
                                        MVX004548
                                    </span>
                                    <span className="font-rocGroteskMedium text-xs text-gun-metal">
                                        9:15 PM
                                    </span>
                                </div>
                                <p className="font-rocGroteskMedium text-sm text-gun-metal">
                                    Hello, please where is my shipment now? I would love to update
                                    my manager on...
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-[0.5fr_3fr] items-center cursor-pointer py-4 px-3 gap-3 hover:bg-mvx-light-blue hover:rounded-xl">
                            <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                            <div>
                                <div className="flex justify-between">
                                    <span className="font-rocGroteskMedium text-sm text-gun-metal">
                                        MVX004548
                                    </span>
                                    <span className="font-rocGroteskMedium text-xs text-gun-metal">
                                        9:15 PM
                                    </span>
                                </div>
                                <p className="font-rocGroteskMedium text-sm text-gun-metal">
                                    Hello, please where is my shipment now? I would love to update
                                    my manager on...
                                </p>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="w-[70%] relative">
                    <div className="px-6 py-3.5 border-b mb-1 flex justify-between">
                        <div>
                            <div className="flex gap-3 items-center">
                                <p className="text-lg font-rocGroteskBold text-gun-metal">
                                    Chat with MVX004548
                                </p>
                                <span className="material-icons text-2xl">expand_more</span>
                            </div>
                            <div className="flex items-center gap-1 ">
                                <span className={`material-icons text-[8px] text-pacific-cyan`}>
                                    fiber_manual_record
                                </span>
                                <span className="text-xs font-rocGroteskMedium">Online</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="material-icons text-xl cursor-pointer">fmd_good</span>
                            <span className="material-icons text-xl cursor-pointer">call</span>
                            <span className="material-icons text-xl cursor-pointer">archive</span>
                        </div>
                    </div>
                    <div>
                        <div
                            onScroll={() => loadMoreChats()}
                            ref={messageBoxRef}
                            className="h-[calc(100vh-265px)] overflow-auto"
                        >
                            {/* {renderChats()} */}
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

                        <div className="absolute bottom-2 w-full">
                            <form
                                className="flex pl-4 pr-6 items-end w-full gap-4"
                                onSubmit={(evt) => {
                                    setClickType("");
                                    sendMessage(evt);
                                }}
                            >
                                <span className="material-icons text-[22px] cursor-pointer text-gray-500 mb-3">
                                    add_circle
                                </span>
                                {(sendFFChatLoading && clickType === "attachment") ||
                                (FFShipmentChatsLoading && !chats) ? (
                                    <Skeleton
                                        dataLoaded={false}
                                        className={"!h-6 !w-6 !rounded-full mb-3"}
                                    />
                                ) : (
                                    <span
                                        className="material-icons !font-normal rotate-[45deg] text-[22px] cursor-pointer text-gray-500 mb-3"
                                        onClick={() => {
                                            messageAttachmentRef.current.click();
                                            setClickType("attachment");
                                        }}
                                    >
                                        attach_file
                                    </span>
                                )}
                                <input
                                    className="hidden"
                                    type={"file"}
                                    accept={
                                        "image/*, .pdf, .doc, .docx, .ppt, .xlsx, .xltx, .xlm, .xls, .cts, .xlr, .csv, .mp3, .ogg"
                                    }
                                    ref={messageAttachmentRef}
                                    onInput={addAttachment}
                                />
                                {/* )} */}
                                <div className="flex w-full relative">
                                    <div className="w-full">
                                        <p className="bg-[#F4F5F7] font-rocGroteskMedium border text-[11px] py-2 text-center">
                                            It is important to note that we will not be held liable
                                            for any conversations held off this platform
                                        </p>
                                        <textarea
                                            className="appearance-none outline-0 w-full text-[13px] font-rocGroteskMedium border-x border-b placeholder:font-rocGroteskMedium p-3 resize-none leading-5"
                                            rows={"1"}
                                            value={messageInput}
                                            placeholder={"Type a message"}
                                            disabled={sendFFChatLoading}
                                            onInput={(evt) => setMessageInput(evt.target.value)}
                                        />
                                    </div>
                                    {/* <button className="absolute bottom-3.5 cursor-pointer right-2 rounded-full w-7 p-0 h-7 bg-gun-metal flex items-center justify-center">
                                        <span className="material-icons text-sm text-white">send</span>
                                    </button> */}
                                    {(sendFFChatLoading && !clickType) ||
                                    (FFShipmentChatsLoading && !chats) ? (
                                        <div className="w-fit absolute bottom-3.5 right-2">
                                            <Skeleton
                                                dataLoaded={false}
                                                className={" !h-6 !w-[29px] !rounded-full"}
                                            />
                                        </div>
                                    ) : (
                                        <button
                                            className="absolute bottom-3.5 right-2 p-0 material-icons text-sm w-7 h-7 text-white rounded-full bg-mvx-blue grid place-items-center pl-[6px] pr-1 cursor-pointer disabled:bg-mvx-blue/40"
                                            type="submit"
                                            disabled={false}
                                        >
                                            send
                                        </button>
                                    )}
                                    {/* <button
                                        className="p-0 material-icons text-sm w-7 h-6 text-white rounded-full bg-mvx-blue grid place-items-center pl-[6px] pr-1 cursor-pointer"
                                        type="submit"
                                    >
                                        send
                                    </button> */}
                                </div>
                                {/* <input
                                    className="hidden"
                                    type={"file"}
                                    accept={
                                        "image/*, .pdf, .doc, .docx, .ppt, .xlsx, .xltx, .xlm, .xls, .cts, .xlr, .csv, .mp3, .ogg"
                                    }
                                    // ref={messageAttachmentRef}
                                    // onInput={addAttachment}
                                /> */}

                                {/* {(sendCustomerChatLoading && !clickType) || */}
                                {/* (customerShipmentChatsLoading && !chats) ? (
                            <Skeleton
                                dataLoaded={false}
                                className={"!h-6 !w-[29px] !rounded-full"}
                            />
                        ) : ( */}
                                {/* <button
                                    className="p-0 material-icons text-sm w-7 h-6 text-white rounded-full bg-mvx-blue grid place-items-center pl-[6px] pr-1 cursor-pointer disabled:bg-mvx-blue/40"
                                    type="submit"
                                    disabled={false}
                                >
                                    send
                                </button> */}
                                {/* )} */}
                                {/* {messageInput ? (
                            <button
                                className="p-0 material-icons text-sm w-7 h-6 text-white rounded-full bg-mvx-blue grid place-items-center pl-[6px] pr-1 cursor-pointer"
                                type="submit"
                            >
                                send
                            </button>
                        ) : (
                            <span className="p-0 material-icons w-7 h-6 text-white text-base font-bold rounded-full bg-mvx-blue grid place-items-center px-1 cursor-pointer">
                                mic
                            </span>
                        )} */}
                            </form>
                        </div>
                    </div>
                </div>
                <div className="border-l w-[30%] ">
                    <div className="flex justify-between p-6 border-b mb-1">
                        <p className="text-lg text-gun-metal font-rocGroteskBold">
                            Shipment details
                        </p>
                        {/* <span className="material-icons">close</span> */}
                    </div>
                    <div className="px-3">
                        <div className="py-6 px-3">
                            <p className="text-gun-metal font-rocGroteskMedium text-base">
                                MVX 5178569
                            </p>
                            <div>
                                <div className="flex items-center">
                                    <span className="basis-[7px] h-1.5 bg-mvx-black mr-2"></span>
                                    <span className="flex-1 h-1 bg-mvx-black"></span>
                                    <span className="material-icons mx-2 text-lg">
                                        local_shipping
                                    </span>
                                    <span className="flex-1 h-1 bg-[#DFE1E6]"></span>
                                    <span className="basis-[7px] h-1.5 bg-[#DFE1E6] ml-2"></span>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <p className="text-sm text-gun-metal font-rocGroteskMedium w-1/2">
                                        Lagos, Nigeria
                                        <span className="text-mvx-neutral text-xs block font-rocGroteskMedium mt-[1px] text-left">
                                            MVX Change LTD
                                        </span>
                                    </p>
                                    <p className="text-sm text-gun-metal font-rocGroteskMedium text-right w-1/2">
                                        United state
                                        <span className="text-mvx-neutral text-xs block font-rocGroteskMedium mt-[1px]">
                                            Apple Inc.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {(previewDoc?.type === "image" || previewDoc?.ext === "pdf") && (
                <ModalContainer showCloseIcon={true} closeModal={() => setPreviewDoc(null)}>
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
    );
};

export default Messaging;
