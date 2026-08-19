import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

import LoginForm from "../../components/LoginForm.jsx";
import { _loginUser } from "../../services/authService.js";

vi.mock("../../services/authService.js", () => ({
    _loginUser: vi.fn(),
}));

vi.mock("../../utils/auth.js", () => ({
    saveToken: vi.fn(),
    getToken: vi.fn(),
    removeToken: vi.fn(),
}));

/**
 * Render the login form inside a router.
 *
 * @returns {void}
 */
function _renderLoginForm() {
    render(
        <MemoryRouter>
            <LoginForm />
        </MemoryRouter>,
    );
}

test("renders login form", () => {
    _renderLoginForm();

    expect(screen.getByText("LokLagbe")).toBeInTheDocument();
});

test("username and password inputs work", async () => {
    const user = userEvent.setup();

    _renderLoginForm();

    const usernameInput = screen.getByPlaceholderText("Enter username");
    const passwordInput = screen.getByPlaceholderText("Enter password");

    await user.type(usernameInput, "sadia");
    await user.type(passwordInput, "password123");

    expect(usernameInput.value).toBe("sadia");
    expect(passwordInput.value).toBe("password123");
});

test("successful login calls login API", async () => {
    _loginUser.mockResolvedValue({ access: "fake_access_token" });

    const user = userEvent.setup();

    _renderLoginForm();

    await user.type(
        screen.getByPlaceholderText("Enter username"),
        "sadia",
    );
    await user.type(
        screen.getByPlaceholderText("Enter password"),
        "password123",
    );

    await user.click(screen.getByText("Login"));

    expect(_loginUser).toHaveBeenCalledWith({
        username: "sadia",
        password: "password123",
    });
});
