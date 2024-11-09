import NavTwo from "components/common/NavTwo";
import React, { useState } from "react";
import SelectUploadOption from "./SelectUploadOption";
import AutomaticUpload from "./AutomaticUpload";
import ManualUpload from "./ManualUpload";

const AddRate = () => {
    const [activeSection, setActiveSection] = useState(0);

    const displayActiveOption = () => {
        switch (activeSection) {
            case 0:
                return (
                    <SelectUploadOption
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    />
                );

            case 1:
                return <AutomaticUpload setActiveSection={setActiveSection} />;

            case 2:
                return <ManualUpload setActiveSection={setActiveSection} />;

            default:
                return (
                    <SelectUploadOption
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    />
                );
        }
    };

    return (
        <div>
            <NavTwo />
            <div className="w-full mt-24">{displayActiveOption()}</div>
        </div>
    );
};

export default AddRate;
