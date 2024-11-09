import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { trackingActions } from "actions";
import AddContainerForm from "./ItemIntineries/AddContainer";
import ShipmentList from "./ShipmentList";

import MovementList from "./MovementList";
import _ from "lodash";

function Sidebar({ searchTerm, data, filters }) {
    const { id, movementId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [movements, setMovements] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const previousFilters = useRef(filters);
    const previousSearchTerm = useRef(searchTerm);
    const [page, setPage] = useState(1);
    const observer = useRef();

    const {
        fetchedTrackingShipmentsSuccess,
        fetchingTrackingShipments,
        fetchedShipmentMovementsSuccess,
        fetchingShipmentMovements,
        activeDashboardTab,

        fetchedTrackingShipmentSuccess: selectedShipment,
    } = useSelector((state) => state.tracking);

    const selectedMovement = useMemo(
        () => movements?.find(({ _id }) => _id === movementId),
        [movements, movementId]
    );

    const handleItemActions = (value) => {
        data.actions(value);
    };

    const handleBackBtn = () => {
        const pathName = location.pathname.split("/");
        const newPath = pathName.filter((val, index) => index !== pathName.length - 1).join("/");
        navigate(newPath);
    };

    const lastItemElementRef = useCallback(
        (node) => {
            if (fetchingTrackingShipments || fetchingShipmentMovements) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && fetchedTrackingShipmentsSuccess?.length === 10) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [fetchingTrackingShipments, fetchingShipmentMovements, fetchedTrackingShipmentsSuccess]
    );

    const debouncedSearchTerm = useRef(
        _.debounce((term, page, tab, newFilters) => {
            if (!movementId) {
                if (term !== previousSearchTerm.current || newFilters !== previousFilters.current) {
                    setPage(1);
                    dispatch(trackingActions.clearTrackingShipments());
                    previousSearchTerm.current = term;
                    previousFilters.current = newFilters;
                }

                dispatch(
                    trackingActions.fetchTrackingShipmentsBySearch(term, tab, newFilters, page)
                );
            }
        }, 500)
    );

    useEffect(() => {
        console.log(filters, "from sidebar");
        debouncedSearchTerm.current(
            searchTerm,
            page,
            selectedShipment?.currentStatus || activeDashboardTab,
            filters
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, activeDashboardTab, filters, dispatch, selectedShipment]);

    useEffect(() => {
        if (page > 1) {
            dispatch(
                trackingActions.fetchTrackingShipmentsBySearch(
                    searchTerm,
                    activeDashboardTab,
                    filters,
                    page
                )
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        return () => {
            dispatch(trackingActions.clearTrackingShipments());
        };
    }, [dispatch]);

    useEffect(() => {
        dispatch(trackingActions.fetchShipmentMovements(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (fetchedTrackingShipmentsSuccess) {
            if (Array.isArray(fetchedTrackingShipmentsSuccess)) {
                setItems(fetchedTrackingShipmentsSuccess);
            } else setItems(fetchedTrackingShipmentsSuccess.data);
        }
    }, [fetchedTrackingShipmentsSuccess]);

    useEffect(() => {
        if (fetchedShipmentMovementsSuccess) {
            setMovements(fetchedShipmentMovementsSuccess);
        }
    }, [fetchedShipmentMovementsSuccess]);

    return (
        <div
            className={`hidden lg:block max-w-[340px] h-[calc(100vh-250px)] border-[#DFE1E6] border-[1px] flex justify-center items-start  border-b-0 overflow-hidden flex-shrink-0`}
        >
            <div className=" border-[#DFE1E6] w-full overflow-y-auto h-full scrollbar-hide overflow-y-auto min-w-[340px]">
                {movementId && (
                    <div className="flex justify-between items-center font-rocGroteskMedium px-[24px] py-[12px] border-b-[1px] border-b-mv-neutral">
                        <button
                            className="flex bg-transparent border-0 justify-start p-0"
                            onClick={handleBackBtn}
                        >
                            <i className="ri-arrow-left-line text-mvx-neutral mr-[6px]"></i>
                            <p className="text-mvx-neutral">TA {selectedShipment?.mvxid}</p>
                        </button>

                        <button
                            className="flex bg-transparent border-0 justify-start p-0"
                            onClick={() => setOpenForm(true)}
                        >
                            <i className="ri-add-line mr-[6px]"></i>
                            <p className="text-pacific-cyan">Add container</p>
                        </button>
                    </div>
                )}

                <AddContainerForm closeForm={setOpenForm} isActive={openForm} />

                {!movementId ? (
                    <ShipmentList
                        className={
                            "border-[#DFE1E6] border-b-[1px] p-[24px] flex-shrink-0 hover:bg-mvx-light-blue"
                        }
                        ref={lastItemElementRef}
                        data={items}
                        selectedItem={selectedShipment}
                        itemActions={handleItemActions}
                        loading={fetchingTrackingShipments}
                        sidebar
                    />
                ) : (
                    <MovementList
                        className={
                            "border-[#DFE1E6] border-b-[1px] p-[24px] flex-shrink-0 hover:bg-mvx-light-blue"
                        }
                        data={movements}
                        ref={lastItemElementRef}
                        selectedItem={selectedMovement}
                        itemActions={handleItemActions}
                        loading={fetchingShipmentMovements}
                        sidebar
                    />
                )}
            </div>
        </div>
    );
}

export default Sidebar;
