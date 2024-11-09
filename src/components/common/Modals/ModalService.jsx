import { useCallback } from "react";
import { create } from "zustand";
import { combine } from "zustand/middleware";

const modalStore = create(
    combine({ list: [] }, (set, get) => ({
        closeModal: (key) => {
            set({
                list: get().list.map((item) =>
                    item?.key === key
                        ? { ...item, props: { ...item.props, show: false } }
                        : { ...item }
                ),
            });

            setTimeout(() => {
                set({
                    list: get().list.filter((item) => item?.key !== key),
                });
            }, 1000);
        },
        openModal: (args) => {
            const key = args?.key ?? Math.random().toString(36).slice(2);
            set({
                list: [
                    ...get().list,
                    {
                        component: args?.modal,
                        props: args?.props,
                        key,
                    },
                ],
            });
            return key;
        },
    }))
);

export const ModalService = {
    open: (args) => {
        const key = modalStore.getState().openModal({
            ...args,
            props: {
                ...args?.props,
                show: true,
                onclose: args?.props?.onClose?.(),
            },
        });

        return {
            key,
            close: () => ModalService.close(key),
        };
    },

    close: (key) => {
        modalStore.getState().closeModal(key);
    },
};

export const ModalServiceProvider = () => {
    const [modals, closeModal] = modalStore(
        useCallback((state) => [state.list, state.closeModal], [])
    );
    return (
        <section>
            {modals.map((m) => {
                const Component = m.component;
                return (
                    <Component
                        {...m.props}
                        key={m.key}
                        show={m.props.show}
                        onClose={() => {
                            m.props?.onClose?.();
                            closeModal(m.key);
                        }}
                    />
                );
            })}
        </section>
    );
};
