import { useCallback, useEffect, useState } from "react";

import { getLaborById } from "../services/laborService.js";


function useLaborDetails(laborId) {
    const [labor, setLabor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let ignoreResponse = false;

        async function _loadLabor() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getLaborById(
                    laborId,
                    controller.signal,
                );
                if (!ignoreResponse) {
                    setLabor(response);
                }
            } catch (requestError) {
                if (!ignoreResponse && requestError.code !== "ERR_CANCELED") {
                    setLabor(null);
                    setError(requestError);
                }
            } finally {
                if (!ignoreResponse) {
                    setIsLoading(false);
                }
            }
        }

        _loadLabor();

        return () => {
            ignoreResponse = true;
            controller.abort();
        };
    }, [laborId, reloadKey]);

    const retry = useCallback(() => {
        setReloadKey((currentKey) => currentKey + 1);
    }, []);

    return { labor, isLoading, error, retry };
}


export default useLaborDetails;
