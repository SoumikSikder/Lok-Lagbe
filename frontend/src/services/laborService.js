import API_CLIENT from "./apiClient.js";


function _cleanParameters(parameters) {
    return Object.fromEntries(
        Object.entries(parameters).filter(([, value]) => {
            if (value === null || value === undefined) {
                return false;
            }
            return typeof value !== "string" || value.trim() !== "";
        }),
    );
}


async function getLabors(parameters = {}, signal) {
    const response = await API_CLIENT.get("labors/", {
        params: _cleanParameters(parameters),
        signal,
    });
    return response.data;
}


async function getLaborById(laborId, signal) {
    const response = await API_CLIENT.get(
        `labors/${encodeURIComponent(laborId)}/`,
        { signal },
    );
    return response.data;
}


export { _cleanParameters, getLaborById, getLabors };
