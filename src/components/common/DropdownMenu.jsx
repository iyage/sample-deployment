import React, { useState } from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";
import classNames from "classnames";

const DropdownMenu = ({
    icon,
    children,
    dropdownClass,
    sideOffset = 10,
    alignOffset = -15,
    options = [],
}) => {
    const [open, setOpen] = useState(false);
    const displayOptions = options?.filter((opt) => !opt?.hide);
    return (
        <div className="flex-shrink-0">
            <Menu.Root
                open={open}
                onOpenChange={(value) => {
                    setOpen(value);
                }}
            >
                <Menu.Trigger asChild>
                    <div>{icon}</div>
                </Menu.Trigger>

                <Menu.Content
                    align="end"
                    alignOffset={alignOffset}
                    sideOffset={sideOffset}
                    className={classNames(
                        "bg-white shadow-dropdownShadow text-xs min-w-[200px] py-2 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade",
                        {
                            "z-[100]": open,
                        }
                    )}
                >
                    {displayOptions?.length
                        ? displayOptions?.map((opt) => (
                              <Menu.Item
                                  key={opt?.label}
                                  onClick={() => opt?.action?.()}
                                  className={classNames("outline-none", opt?.className)}
                              >
                                  {opt?.label}
                              </Menu.Item>
                          ))
                        : children}
                </Menu.Content>
            </Menu.Root>
        </div>
    );
};

export default DropdownMenu;
