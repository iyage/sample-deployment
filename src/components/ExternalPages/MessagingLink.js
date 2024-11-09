/* eslint-disable react-hooks/exhaustive-deps */
import { authActions, chatActions, shipmentActions } from "actions";
// import { PDFIcon } from "assets/arts";
import ModalContainer from "components/common/ModalContainer";
import Navbar from "components/common/Navbar";
import Skeleton from "components/common/Skeleton";
import { Timestamp } from "firebase/firestore";
import downloadURLFile from "helpers/downloadURLFile";
import scrollVertical from "helpers/scrollVertical";
import moment from "moment";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { useReactMediaRecorder } from "react-media-recorder";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { firebaseService } from "services/firebaseService";

/* todo
- When sending a message tge first time check the pagination data.
- And also the second time

all file and image preview,
load only the last 20/10 on first load
make firestore listner work
use firstore listner to update the chat. If the object exist - do not replace
add loaders on the buttons
add recorders
set limit
*/

const MessagingLink = () => {
    const messageAttachmentRef = useRef();
    const messageBoxRef = useRef();
    const elmScrollRef = useRef();
    const [messageInput, setMessageInput] = useState("");
    const [newChat, setNewChat] = useState(null);
    const [previewDoc, setPreviewDoc] = useState();
    const [clickType, setClickType] = useState("");

    const defaultFileTypes = {
        filename: "",
        mediaType: "",
        content: " ",
    };
    const [fileAttachment, setFileAttachment] = useState(defaultFileTypes);
    const dispatch = useDispatch();
    const params = useParams();
    const { ffProfile } = useSelector((state) => state.auth);
    let {
        customerShipmentChatsLoading,
        customerShipmentChats: { pagination, data: chats },
        sendCustomerChatLoading,
        sendCustomerChatSuccess,
    } = useSelector((state) => state.chat);
    chats = chats ?? [];

    const { ffCustomerShipmentLoading, ffCustomerShipment } = useSelector(
        (state) => state.shipment
    );

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
            shipmentId: params?.shipmentId,
        };
        dispatch(
            chatActions.sendCustomerChat(media ? { ...messageData, media: [media] } : messageData)
        );
    };

    useEffect(() => {
        let unSubscribe;
        firebaseService.listenForNewMEssages(params?.shipmentId, setNewChat, (unSubFunc) => {
            unSubscribe = unSubFunc;
        });

        return () => {
            if (unSubscribe) {
                unSubscribe();
            }
        };
    }, [params]);

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
                chatActions.AddNewChat({ ...newChat, createdAt: created, updatedAt: updated })
            );
            setNewChat(null);
        }
    }, [newChat]);

    useEffect(() => {
        if (fileAttachment.content.length > 3 && fileAttachment.content !== "error") {
            sendMessage(null, fileAttachment);
        }
    }, [fileAttachment]);

    useEffect(() => {
        if (params?.shipmentId) {
            dispatch(shipmentActions.fetchFFSingleShipmentForCustomer(params.shipmentId));
            dispatch(chatActions.fetchCustomerShipmentChat(params?.shipmentId));
        }
    }, [params]);

    useEffect(() => {
        if (ffCustomerShipment?.freightForwarderId) {
            dispatch(
                authActions.fetchFreightForwarderProfile(ffCustomerShipment?.freightForwarderId)
            );
        }
    }, [ffCustomerShipment]);

    // On chats load
    useEffect(() => {
        if (sendCustomerChatSuccess || (chats.length && pagination?.current === 1)) {
            setMessageInput("");
            scrollVertical(messageBoxRef.current, "bottom");
            setFileAttachment(defaultFileTypes);
        }
    }, [chats, pagination, sendCustomerChatSuccess]);

    const loadMoreChats = useCallback(() => {
        if (pagination && messageBoxRef.current) {
            const { scrollTop } = messageBoxRef.current;
            // const isAt50Percent = scrollHeight * 0.5;
            let { current, number_of_pages } = pagination;

            // FIX THIS
            // And it's loader
            if (scrollTop.toFixed() >= 100 && scrollTop.toFixed() <= 140) {
                if (!customerShipmentChatsLoading && current !== number_of_pages) {
                    console.log("intersecting");
                    dispatch(chatActions.fetchCustomerShipmentChat(params?.shipmentId, ++current));
                }
            }
        }
    }, [pagination, customerShipmentChatsLoading]);

    const shortenText = (text) => {
        const splitted = text?.split(".");

        let extensionType = splitted[splitted?.length - 1];

        const theRestText = splitted?.slice(0, -1)?.join("");

        return {
            text: `${theRestText?.match(/.{2,}/g).join("")}`,
            extensionType,
        };
    };

    const renderChats = () => (
        <>
            {Object.keys(chatsGroupedByDays).map((date, idx) => {
                const sortedChats = chatsGroupedByDays[date].sort(
                    (a, b) => moment(a.createdAt) - moment(b.createdAt)
                );
                return (
                    <Fragment key={date + idx}>
                        <div
                            className={`border rounded-3xl w-max text-[11px] py-1 px-[14px] mx-auto text-gray-500 font-bold ${
                                idx && "mt-5"
                            }`}
                        >
                            {date}
                        </div>

                        {sortedChats.map((chatObj, idx2) => (
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
                                {ffProfile?.result?.profile?.logo &&
                                chatObj.sender !== "customer" ? (
                                    <img
                                        className="self-start border rounded-full object-cover"
                                        width={"35px"}
                                        height={"35px"}
                                        src={ffProfile.result.profile.logo}
                                        alt={`${ffProfile.result.profile?.fullName} freight forwarder logo`}
                                    />
                                ) : (
                                    <span className="material-icons text-4xl self-start">
                                        account_circle
                                    </span>
                                )}
                                <div className="ml-2 w-[85%] 375:w-[90%]">
                                    <p className="capitalize font-rocGroteskBold text-sm w-full">
                                        {chatObj.sender === "customer"
                                            ? ffCustomerShipment?.shipperDetails?.fullName ??
                                              "customer"
                                            : ffProfile?.result?.fullName}
                                        <span className="uppercase text-gray-400 font-rocGroteskMedium text-xs ml-1">
                                            {moment(chatObj.createdAt).format("LT")}
                                        </span>
                                    </p>
                                    <p
                                        className={`text-[13px] font-rocGroteskMedium break-words text-[#253858] mt-[2px] w-full ${
                                            chatObj.media.length && "mb-[9px]"
                                        }`}
                                    >
                                        {chatObj.content}
                                    </p>
                                    {chatObj.media.length
                                        ? chatObj.media.map((media) => (
                                              <div
                                                  key={media._id}
                                                  className={`420:w-max ${
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
                                                              <span className="uppercase font-rocGroteskRegular text-[#6B778C] block text-xs mt-[2px]">
                                                                  {/* 32 mb | */}

                                                                  {
                                                                      shortenText(media.filename)
                                                                          .extensionType
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
                                        : ""}
                                </div>
                            </div>
                        ))}
                    </Fragment>
                );
            })}
        </>
    );

    return (
        <>
            <Navbar />
            <div className="w-full sm:w-[80%] lg:w-[48%] sm:border sm:mx-auto lg:!ml-[23.3%] sm:mt-11 text-xs relative h-[calc(100vh-65px)] sm:h-[80vh] flex flex-col justify-between">
                <div className="flex-1 flex flex-col">
                    <div className="bg-[#F4F5F7] p-4 flex">
                        <Skeleton
                            className={"w-[40px] h-[37px] !rounded-full border mr-1"}
                            dataLoaded={ffProfile}
                        >
                            {ffProfile?.result?.profile?.logo ? (
                                <img
                                    className="self-start border rounded-full object-cover mt-[2px] mr-[1px]"
                                    width={"40px"}
                                    height={"40px"}
                                    src={ffProfile.result.profile.logo}
                                    alt={`${ffProfile.result.profile?.fullName} freight forwarder logo`}
                                />
                            ) : (
                                <span className="material-icons text-4xl self-start">
                                    account_circle
                                </span>
                            )}
                        </Skeleton>
                        <div className="ml-2 w-full mr-6">
                            <Skeleton className={"h-5 w-[210px]"} dataLoaded={ffProfile}>
                                <h4 className="font-rocGroteskBold text-sm">
                                    {ffProfile?.result?.fullName}
                                </h4>
                            </Skeleton>

                            <Skeleton className={"h-3 w-[260px] mt-2"} dataLoaded={ffProfile}>
                                <p className="flex items-center text-mvx-neutral font-rocGroteskMedium text-xs">
                                    Verified Freight Forwarder{" "}
                                    <span className="material-icons text-sm ml-[3px] translate-y-[1px]">
                                        verified
                                    </span>
                                </p>
                            </Skeleton>
                        </div>
                    </div>
                    <div className="grid grid-cols-[20%,36%,40%] 580:grid-cols-[14%,41%,41%] gap-x-3 bg-mvx-light-blue pt-2 pb-4 text-xs px-5 580:px-14">
                        <p className={`font-rocGroteskMedium text-mvx-neutral`}>
                            <Skeleton
                                className={"h-[10px] w-[80px] mt-[6px]"}
                                dataLoaded={!ffCustomerShipmentLoading}
                            >
                                Shipment ID
                            </Skeleton>

                            <Skeleton
                                className={"h-[10px] w-[140px] mt-2"}
                                dataLoaded={!ffCustomerShipmentLoading}
                            >
                                <span className="capitalize block mt-[2px] text-[13px]">
                                    {ffCustomerShipment?.mvxid &&
                                        ` MVX ${ffCustomerShipment?.mvxid}`}
                                </span>
                            </Skeleton>
                        </p>
                        <p className="font-rocGroteskMedium text-mvx-neutral break-words">
                            <Skeleton
                                className={"h-[10px] text-mvx-neutral w-[80px] mt-[6px]"}
                                dataLoaded={!ffCustomerShipmentLoading}
                            >
                                Origin
                            </Skeleton>

                            <Skeleton
                                className={"h-[10px] w-[140px] mt-2"}
                                dataLoaded={!ffCustomerShipmentLoading}
                            >
                                <span className="capitalize block mt-[2px] text-[13px]">
                                    {ffCustomerShipment?.origin?.address}
                                </span>
                            </Skeleton>
                        </p>
                        <p className="font-rocGroteskMedium text-mvx-neutral break-words">
                            <Skeleton
                                className={"h-[10px] text-mvx-neutral w-[80px] mt-[6px]"}
                                dataLoaded={!ffCustomerShipmentLoading}
                            >
                                Destination
                            </Skeleton>

                            <Skeleton
                                className={"h-[10px] w-[140px] mt-2"}
                                dataLoaded={!ffCustomerShipmentLoading}
                            >
                                <span className="capitalize block mt-[2px] text-[13px]">
                                    {ffCustomerShipment?.destination?.address}
                                </span>
                            </Skeleton>
                        </p>
                    </div>
                    <div
                        className="pl-4 mt-6 pr-6 flex-[200px] overflow-y-auto pb-[14px]"
                        ref={messageBoxRef}
                        onScroll={() => loadMoreChats()}
                    >
                        {customerShipmentChatsLoading ? (
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
                </div>
                <div>
                    <p className="bg-[#F4F5F7] font-rocGroteskMedium border-y text-[11px] py-2 px-7 text-center">
                        <Skeleton
                            className={"h-[11px] my-[2.4px] w-[80%] mx-auto"}
                            dataLoaded={!customerShipmentChatsLoading}
                        >
                            It is important to note that we will not be held liable for any
                            conversations held off this platform
                        </Skeleton>
                    </p>

                    <form
                        className="flex pl-4 pr-6 items-center"
                        onSubmit={(evt) => {
                            setClickType("");
                            sendMessage(evt);
                        }}
                    >
                        {(sendCustomerChatLoading && clickType === "attachment") ||
                        (customerShipmentChatsLoading && !chats) ? (
                            <Skeleton
                                dataLoaded={false}
                                className={"!h-6 !w-[29px] !rounded-full"}
                            />
                        ) : (
                            <span
                                className="material-icons !font-normal rotate-[45deg] text-[22px] cursor-pointer text-gray-500"
                                onClick={() => {
                                    messageAttachmentRef.current.click();
                                    setClickType("attachment");
                                }}
                            >
                                attach_file
                            </span>
                        )}

                        <textarea
                            className="appearance-none outline-0 w-full text-[13px] ml-3 mr-8 font-rocGroteskMedium border-x placeholder:font-rocGroteskMedium p-2 resize-none leading-5"
                            rows={"4"}
                            value={messageInput}
                            placeholder={chats.length ? "Write your message here" : ""}
                            disabled={sendCustomerChatLoading}
                            onInput={(evt) => setMessageInput(evt.target.value)}
                        />

                        <input
                            className="hidden"
                            type={"file"}
                            accept={
                                "image/*, .pdf, .doc, .docx, .ppt, .xlsx, .xltx, .xlm, .xls, .cts, .xlr, .csv, .mp3, .ogg"
                            }
                            ref={messageAttachmentRef}
                            onInput={addAttachment}
                        />

                        {(sendCustomerChatLoading && !clickType) ||
                        (customerShipmentChatsLoading && !chats) ? (
                            <Skeleton
                                dataLoaded={false}
                                className={"!h-6 !w-[29px] !rounded-full"}
                            />
                        ) : (
                            <button
                                className="p-0 material-icons text-sm w-7 h-6 text-white rounded-full bg-mvx-blue grid place-items-center pl-[6px] pr-1 cursor-pointer disabled:bg-mvx-blue/40"
                                type="submit"
                                disabled={false}
                            >
                                send
                            </button>
                        )}

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
            {(previewDoc?.type === "image" || previewDoc?.ext === "pdf") && (
                <ModalContainer showCloseIcon={true} closeModal={() => setPreviewDoc(null)}>
                    {previewDoc.type === "image" && (
                        <img
                            src={previewDoc.url}
                            alt={previewDoc.content}
                            className="min-w-[290px] max-w-[75vw] max-h-[88vh] m-auto rounded-md object-cover sm:object-['unset']"
                        />
                    )}
                    {previewDoc.ext === "pdf" && (
                        <iframe
                            src={previewDoc.url}
                            className="h-[80vh] min-w-[320px] w-[60vw] rounded-lg"
                            title={previewDoc.content}
                        ></iframe>
                    )}
                </ModalContainer>
            )}
        </>
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
    // const [playAudio, setPlayAudio] = useState(false);
    // const playbacks = [1, 1.25, 1.5, 1.75, 2];
    // const [playbackSpeed, setPlaybackSpeed] = useState(playbacks[0]);

    // const updatePlayback = () => {
    //     setPlaybackSpeed((prev) =>
    //         prev === playbacks[playbacks.length - 1]
    //             ? playbacks[0]
    //             : playbacks[playbacks.indexOf(prev) + 1]
    //     );
    // };

    // const audioPlayer = document.querySelector("#audio-player");

    return (
        // <div className="border rounded-tl-none shadow-sm rounded-lg px-[14px] py-[10px] flex w-max">
        //     <span
        //         className="material-icons text-[32px] self-center cursor-pointer"
        //         onClick={() => setPlayAudio((prev) => !prev)}
        //     >
        //         {playAudio ? "pause_circle" : "play_circle"}
        //     </span>
        //     <SoundWaveIcon className="mx-2 flex-1 self-center" />

        //     <span
        //         className="bg-gray-300 rounded-full text-[#6A7987] self-center h-7 w-10 flex justify-center items-center cursor-pointer text-xs font-semibold"
        //         onClick={updatePlayback}
        //     >
        //         {playbackSpeed}x
        //     </span>
        // </div>
        <audio controls src={audioSrc} id={"audio-player"}>
            <a href="/media/cc0-audio/t-rex-roar.mp3">Download audio</a>
        </audio>
    );
};

// const Recorder = () => {
//     const { status, startRecording, stopRecording, pauseRecording, mediaBlobUrl } =
//         useReactMediaRecorder({
//             video: false,
//             audio: true,
//             echoCancellation: true,
//         });
//     console.log("url", mediaBlobUrl);
// };

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

const ChatLoader = ({ isFirst }) => {
    return (
        <div className="flex mr-auto mt-4 mb-7 w-[70%]">
            <Skeleton className={"w-[34px] h-[33px] !rounded-full border mr-4 mt-[2px]"} />
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

export default MessagingLink;
