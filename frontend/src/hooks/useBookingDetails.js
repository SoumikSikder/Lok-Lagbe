import { useCallback, useEffect, useState } from "react";

import { getBookingById } from "../services/bookingService.js";


function useBookingDetails(bookingId) {
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let ignoreResponse = false;

        async function _loadBooking() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getBookingById(
                    bookingId,
                    controller.signal,
                );
                if (!ignoreResponse) {
                    setBooking(response);
                }
            } catch (requestError) {
                if (!ignoreResponse && requestError.code !== "ERR_CANCELED") {
                    setBooking(null);
                    setError(requestError);
                }
            } finally {
                if (!ignoreResponse) {
                    setIsLoading(false);
                }
            }
        }

        _loadBooking();

        return () => {
            ignoreResponse = true;
            controller.abort();
        };
    }, [bookingId, reloadKey]);

    const retry = useCallback(() => {
        setReloadKey((currentKey) => currentKey + 1);
    }, []);

    return { booking, isLoading, error, retry };
}


export default useBookingDetails;
