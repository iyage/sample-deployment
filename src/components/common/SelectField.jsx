import * as Select from "@radix-ui/react-select";
import { cn } from "helpers/utils";
import React, { useState } from "react";

const SelectField = ({
    placeholder,
    value,
    triggerClassName,
    onValueChange,
    items = [],
    conatinerClassName,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Select.Root
            className="w-full relative"
            value={value}
            onValueChange={(v) => {
                onValueChange?.(v);
                console.log(v);
            }}
            open={open}
            onOpenChange={(value) => {
                setOpen(value);
            }}
        >
            <Select.Trigger
                className={cn(
                    "flex items-center w-full h-full px-0 gap-1 outline-none",
                    triggerClassName
                )}
            >
                <div className="flex w-full flex-row h-full items-center">
                    <p className="text-sm text-neutral-n-200 font-rocGroteskMedium w-full truncate">
                        {value ? value : placeholder}
                    </p>
                    <img
                        src="/icons/caret_down.svg"
                        alt="caret"
                        className="w-5 h-5 flex-shrink-0 mb-0.5"
                    />
                </div>
            </Select.Trigger>
            <Select.Content
                className={cn(
                    "shadow-dropdownShadow rounded-md bg-white py-2",
                    {
                        "z-[50]": open,
                    },
                    conatinerClassName
                )}
            >
                {items?.map((it) => (
                    <Select.Item
                        key={it.value}
                        value={it.value}
                        className="w-full outline-none hover:bg-neutral-n-20 py-1.5 pl-3"
                    >
                        <p className="text-sm text-neutral-n-200 font-rocGroteskMedium cursor-pointer w-full">
                            {it?.label}
                        </p>
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
};

export default SelectField;
