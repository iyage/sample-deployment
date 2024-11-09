import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["recentSearches"],
    blacklist: [],
};

export const persistedReducer = (rootReducer) => persistReducer(persistConfig, rootReducer);
