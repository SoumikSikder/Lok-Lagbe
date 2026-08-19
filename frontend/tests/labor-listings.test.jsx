import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";

import useLabors from "../src/hooks/useLabors.js";
import LaborListPage from "../src/pages/LaborListPage.jsx";


vi.mock("../src/hooks/useLabors.js", () => ({
    default: vi.fn(),
}));

const LABORS = [
    {
        id: 1,
        name: "Rahim Uddin",
        photo: "",
        profession: "Electrician",
        category: "Electrician",
        location: "Dhaka",
        hourly_wage: "500.00",
        rating: "4.8",
        review_count: 8,
        description: "Residential electrical specialist.",
        available: true,
        experience: 7,
    },
    {
        id: 2,
        name: "Nadia Akter",
        photo: "",
        profession: "Cleaner",
        category: "Cleaner",
        location: "Khulna",
        hourly_wage: "250.00",
        rating: "4.2",
        review_count: 12,
        description: "Home and office cleaning specialist.",
        available: true,
        experience: 5,
    },
];

const DEFAULT_HOOK_STATE = {
    labors: [],
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    isLoading: false,
    error: null,
    retry: vi.fn(),
};

const mockedUseLabors = vi.mocked(useLabors);

function _setHookState(overrides = {}) {
    mockedUseLabors.mockReturnValue({
        ...DEFAULT_HOOK_STATE,
        retry: vi.fn(),
        ...overrides,
    });
}

function _renderPage(initialEntry = "/labors") {
    return render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <LaborListPage />
        </MemoryRouter>,
    );
}

describe("view labor listings", () => {
    beforeEach(() => {
        _setHookState();
    });

    test("shows an accessible loading state", () => {
        _setHookState({ isLoading: true });

        _renderPage();

        expect(screen.getByRole("status")).toHaveTextContent(
            "Loading labor listings",
        );
    });

    test("renders the total and labor cards returned by the API hook", () => {
        _setHookState({
            labors: LABORS,
            totalCount: LABORS.length,
        });

        _renderPage();

        expect(screen.getByText("2 laborers available")).toBeInTheDocument();
        expect(screen.getByText("Rahim Uddin")).toBeInTheDocument();
        expect(screen.getByText("Nadia Akter")).toBeInTheDocument();
        expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    });

    test("shows the empty state when no laborers match", () => {
        _renderPage();

        expect(
            screen.getByRole("heading", { name: "No labor found" }),
        ).toBeInTheDocument();
    });

    test("shows an API error and retries the request", async () => {
        const user = userEvent.setup();
        const retry = vi.fn();
        _setHookState({
            error: new Error("The labor service is unavailable."),
            retry,
        });

        _renderPage();
        await user.click(screen.getByRole("button", { name: "Try again" }));

        expect(screen.getByRole("alert")).toHaveTextContent(
            "The labor service is unavailable.",
        );
        expect(retry).toHaveBeenCalledOnce();
    });

    test("passes URL search, filters, and page values to the data hook", () => {
        _setHookState({ isLoading: true });

        _renderPage(
            "/labors?search=Dhaka&category=Electrician&rating=4&page=2",
        );

        expect(mockedUseLabors).toHaveBeenCalledWith(
            {
                search: "Dhaka",
                category: "Electrician",
                rating: "4",
                min_wage: "",
                max_wage: "",
                sort: "highest_rated",
                page_size: 8,
            },
            2,
        );
    });

    test("updates listing parameters after a search", async () => {
        const user = userEvent.setup();
        _setHookState({ isLoading: true });
        _renderPage();

        await user.type(
            screen.getByRole("searchbox", { name: "Search laborers" }),
            "Dhaka",
        );
        await user.click(screen.getByRole("button", { name: "Search" }));

        await waitFor(() => {
            expect(mockedUseLabors).toHaveBeenLastCalledWith(
                expect.objectContaining({ search: "Dhaka" }),
                1,
            );
        });
    });

    test("requests another page when pagination is selected", async () => {
        const user = userEvent.setup();
        _setHookState({
            labors: LABORS,
            totalCount: 17,
            hasNextPage: true,
        });
        _renderPage();

        await user.click(screen.getByRole("button", { name: "2" }));

        await waitFor(() => {
            expect(mockedUseLabors).toHaveBeenLastCalledWith(
                expect.any(Object),
                2,
            );
        });
        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: "smooth",
        });
    });
});
