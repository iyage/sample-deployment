import { configureStore } from "@reduxjs/toolkit";
import {
    auth,
    shipment,
    chat,
    quote,
    payment,
    app,
    subscription,
    notification,
    folder,
    blog,
    rate,
} from "reducers";

const store = configureStore({
    reducer: {
        auth,
        shipment,
        chat,
        quote,
        payment,
        app,
        subscription,
        notification,
        folder,
        blog,
        rate,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: true, immutableCheck: true }),
});

export default store;
