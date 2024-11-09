import { Toaster } from "react-hot-toast";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import routes from "./routes";
import "react-multi-carousel/lib/styles.css";
import { PrivateRoutes } from "components/common/PrivateRoutes";
import { PublicRoutes } from "components/common/PublicRoutes";

import { Suspense } from "react";
import useModal from "components/common/Modals/ModalProvider";

function App() {
    const location = useLocation();
    const { getActiveModal } = useModal();
    const authRoutes = ["/login", "/register", "/reset-password"];

    const getRoutes = (routes, parent) => {
        return routes
            .filter((r) => (parent ? r.parent === parent : !r.parent))
            .map((route, routeKey) => {
                let routesArray = [];

                if (route.children) {
                    routesArray = route.children.map((child, key) => {
                        return (
                            <Route
                                key={`${routeKey}_${key}`}
                                path={child.path}
                                element={child.component}
                            />
                        );
                    });
                }
                if (route.path && route.children) {
                    routesArray.push(
                        <Route key={routeKey} path={route.path} element={route.component} />
                    );
                }

                if (route.children) {
                    return routesArray;
                } else {
                    const isAuthPage = authRoutes.includes(route.path);
                    return (
                        <Route
                            key={routeKey}
                            path={route.path}
                            element={
                                isAuthPage ? (
                                    <PublicRoutes>{route.component}</PublicRoutes>
                                ) : (
                                    route.component
                                )
                            }
                        />
                    );
                }
            });
    };
    return (
        <main className="">
            <Toaster position="top-right" />
            {getActiveModal()}
            <Suspense
                // fallback={
                //     <div className="h-screen flex items-center justify-center">
                //         <Loader color="mvx-black" size={10} />
                //     </div>
                // }
                fallback
            >
                <Routes>
                    {getRoutes(routes)}
                    <Route
                        path="dashboard"
                        element={
                            <PrivateRoutes>
                                {location.pathname === "/dashboard" ? (
                                    <Navigate to={"/dashboard/home"} replace />
                                ) : (
                                    <Outlet />
                                )}
                            </PrivateRoutes>
                        }
                    >
                        {getRoutes(routes, "dashboard")}
                    </Route>

                    <Route path={"*"} element={<Navigate to={"/dashboard/home"} replace />} />
                    <Route
                        path={"/dashboard/"}
                        element={<Navigate to={"/dashboard/home"} replace />}
                    />
                </Routes>
            </Suspense>
        </main>
    );
}

export default App;
