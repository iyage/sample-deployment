import { useSearchParams } from "react-router-dom";

const useRouteQuery = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    return {
        searchParams,
        set: (name, value, clearAll = false) => {
            const state = searchParams;
            const newQuery = new URLSearchParams(clearAll ? "" : state);
            if (Array.isArray(value)) {
                newQuery.delete(name);
                value.forEach((item) => {
                    newQuery.append(name, String(item));
                });
            } else {
                newQuery.set(name, String(value));
            }

            setSearchParams(newQuery);
        },
        setURLQuery: (queries, clearAll = false) => {
            const state = searchParams;
            const url = new URLSearchParams(clearAll ? "" : state);
            Object.keys(queries).forEach((key) => {
                const value = queries[key];
                if (value !== null) {
                    url.set(key, String(value));
                } else if (url.has(key)) {
                    url.delete(key);
                }
            });

            setSearchParams(url);
        },
    };
};

export default useRouteQuery;
