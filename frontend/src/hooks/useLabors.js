import { useCallback, useEffect, useState } from "react";

import { getLabors } from "../services/laborService.js";


function useLabors(parameters, page) {
    const [labors, setLabors] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let ignoreResponse = false;

        async function _loadPage() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getLabors(
                    { ...parameters, page },
                    controller.signal,
                );
                if (!ignoreResponse) {
                    setLabors(response.results || []);
                    setTotalCount(response.count || 0);
                    setHasNextPage(Boolean(response.next));
                    setHasPreviousPage(Boolean(response.previous));
                }
            } catch (requestError) {
                if (!ignoreResponse && requestError.code !== "ERR_CANCELED") {
                    setLabors([]);
                    setTotalCount(0);
                    setHasNextPage(false);
                    setHasPreviousPage(false);
                    setError(requestError);
                }
            } finally {
                if (!ignoreResponse) {
                    setIsLoading(false);
                }
            }
        }

        _loadPage();

        return () => {
            ignoreResponse = true;
            controller.abort();
        };
    }, [page, parameters, reloadKey]);

    const retry = useCallback(() => {
        setReloadKey((currentKey) => currentKey + 1);
    }, []);

    return {
        labors,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        isLoading,
        error,
        retry,
    };
}


export default useLabors;
