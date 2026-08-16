import API_CLIENT from "./apiClient.js";


async function createReview(reviewData) {
    const response = await API_CLIENT.post("reviews/", reviewData);
    return response.data;
}


export { createReview };
