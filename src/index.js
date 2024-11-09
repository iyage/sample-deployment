import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "store";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";
import CustomToast from "components/common/CustomToast";
import { ModalProvider } from "components/common/Modals/ModalProvider";
import { ModalServiceProvider } from "components/common/Modals/ModalService";

const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
            if (mutation.options.onError) return;
            const message =
                error.message ||
                error?.response?.message ||
                "Something went wrong, please try again";
            toast.custom((t) => <CustomToast type="error" message={message} t={t} />);
        },
    }),
    queryCache: new QueryCache({
        onError: (error, query) => {
            if (query.options.onError) return;
            const message =
                error.message ||
                error?.response?.message ||
                "Something went wrong, please try again";
            toast.custom((t) => <CustomToast type="error" message={message} t={t} />);
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 1000 * 6 * 5,
        },
    },
});

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <ModalProvider>
                        <>
                            <ModalServiceProvider />
                            <App />
                        </>
                    </ModalProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
