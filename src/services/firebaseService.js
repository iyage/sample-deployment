import config from "config/config";
import { initializeApp } from "firebase/app";
import {
    collection,
    doc,
    getFirestore,
    limit,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { getDatabase, onValue, ref as refRealtimeDB } from "firebase/database";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const app = initializeApp(config.FB);
const db = getFirestore(app);
const realtimeDB = getDatabase(app);
const storage = getStorage(app);

export const firebaseService = {
    listenForNewMEssages,
    uploadFile,
    fetchRealtimeMvmLocations,
    downloadFolder,
};

function listenForNewMEssages(shipmentId, setNewMessage, unSub) {
    const q = query(
        collection(db, `${process.env.REACT_APP_STAGE}/conversation/${shipmentId}`),
        orderBy("createdAt", "desc"),
        limit(1)
    );

    const unSubscribe = onSnapshot(q, (snapshot) => {
        snapshot.forEach((shot) => setNewMessage(shot.data()));
    });

    unSub && unSubscribe && unSub(unSubscribe);
}

async function uploadFile(filePathAndName, file, setReturnType, progressRef, setProgressFunc) {
    const storageRef = ref(storage, filePathAndName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * progressRef;
            setProgressFunc && setProgressFunc({ progress });
        },
        (error) => {
            console.log(error, error.code, " firebase storage upload error check");
            setReturnType("error");
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                setReturnType(downloadURL)
            );
        }
    );
}

function fetchRealtimeMvmLocations(oceanTrackingId, mvmId, saveResult, unSubScribeFunc) {
    const locationPath = `relay/${process.env.REACT_APP_STAGE}/location_updates/${oceanTrackingId}/${mvmId}/locations`;

    const mvmLocationRef = refRealtimeDB(realtimeDB, locationPath);

    const unSubScribe = onValue(mvmLocationRef, (snapshot) => {
        const value = snapshot.val();
        saveResult(value);
    });
    unSubScribeFunc && unSubScribe && unSubScribeFunc(unSubScribe);
}

function downloadFolder(folderId, downloadFunc, unSub) {
    const q = query(
        doc(
            db,
            `relay_app/${
                process.env.REACT_APP_STAGE === "development" ||
                process.env.REACT_APP_STAGE === "staging"
                    ? "staging"
                    : "production"
            }/zipFolders/${folderId}`
        )
    );

    const unSubscribe = onSnapshot(q, (shot) => {
        if (shot.exists) {
            const data = shot.data();
            const media = data?.media;
            return media && downloadFunc(media);
        }
    });
    if (unSub) {
        unSub(() => unSubscribe && unSubscribe());
    }
}
