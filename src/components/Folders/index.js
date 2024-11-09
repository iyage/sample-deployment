import NavTwo from "components/common/NavTwo";
import React, { useEffect, useState } from "react";
import ParentDirectory from "./components/ParentDirectory";
import ChildDirectory from "./components/ChildDirectory";
import { folderActions } from "actions";
import { useDispatch, useSelector } from "react-redux";

const Folders = () => {
    // const tabs = ["All folders", "My folders", "Shared with me"];

    // const [activeTab, setActiveTab] = useState(0);
    const [step, setStep] = useState(0);

    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFoldersArr, setSelectedFoldersArr] = useState([]);
    const [isParentDirListMode, setIsParentDirlistMode] = useState(true);
    const [searchResults, setSearchResults] = useState(null);
    const [searchField, setSearchField] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [activeFilterOption, setActiveFilterOption] = useState(null);
    const [activeFilterChildOption, setActiveFilterChildOption] = useState(null);

    const dispatch = useDispatch();

    const { searchFoldersSuccess } = useSelector((state) => state.folder);

    useEffect(() => {
        if (
            Boolean(
                (activeFilterChildOption && typeof activeFilterChildOption !== "number") ||
                    searchField
            )
        ) {
            const body = {
                name: searchField ? true : false,
                docs: typeof activeFilterChildOption !== "number" ? true : false,
                search:
                    activeFilterChildOption && activeFilterOption !== "date"
                        ? activeFilterChildOption
                        : searchField,
            };

            dispatch(folderActions.searchFolders(body));
        }
    }, [dispatch, activeFilterChildOption, activeFilterOption, searchField]);

    useEffect(() => {
        if (Boolean(searchFoldersSuccess)) {
            setStep(1);
            setSearchResults(searchFoldersSuccess?.searchResult);
            dispatch(folderActions.resetSearchFolderData());
        }
    }, [searchFoldersSuccess, dispatch]);

    return (
        <div>
            <NavTwo />

            <div className="mt-[100px]">
                {step === 0 && (
                    <ParentDirectory
                        setStep={setStep}
                        setSelectedFolder={setSelectedFolder}
                        selectedFolder={selectedFolder}
                        setSelectedFoldersArr={setSelectedFoldersArr}
                        setIslistMode={setIsParentDirlistMode}
                        isListMode={isParentDirListMode}
                        setSearchResults={setSearchResults}
                        setSearchField={setSearchField}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        setActiveFilterOption={setActiveFilterOption}
                        activeFilterOption={activeFilterOption}
                        setActiveFilterChildOption={setActiveFilterChildOption}
                        activeFilterChildOption={activeFilterChildOption}
                    />
                )}
                {step > 0 && (
                    <ChildDirectory
                        selectedFoldersArr={selectedFoldersArr}
                        setSelectedFoldersArr={setSelectedFoldersArr}
                        setIsChildDirListMode={setIsParentDirlistMode}
                        isChildDirListMode={isParentDirListMode}
                        setStep={setStep}
                        setSearchResults={setSearchResults}
                        searchResults={searchResults}
                        searchField={searchField}
                        setSearchField={setSearchField}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        setActiveFilterChildOption={setActiveFilterChildOption}
                    />
                )}
            </div>
        </div>
    );
};

export default Folders;
