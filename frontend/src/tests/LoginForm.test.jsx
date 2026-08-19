import {
    render,
    screen
} from "@testing-library/react";


import userEvent from "@testing-library/user-event";


import {
    BrowserRouter
} from "react-router-dom";


import {
    vi
} from "vitest";


import LoginForm from "../components/LoginForm";


import { loginUser } from "../services/api";






vi.mock("../services/api", () => ({

    loginUser: vi.fn(),

}));





vi.mock("../utils/auth", () => ({

    saveToken: vi.fn(),

}));









test("renders login form", () => {


    render(

        <BrowserRouter>

            <LoginForm />

        </BrowserRouter>

    );



    expect(

        screen.getByText("LokLagbe")

    ).toBeInTheDocument();



});









test("username and password inputs work", async () => {


    const user = userEvent.setup();



    render(

        <BrowserRouter>

            <LoginForm />

        </BrowserRouter>

    );




    const usernameInput = screen.getByPlaceholderText(

        "Enter username"

    );



    const passwordInput = screen.getByPlaceholderText(

        "Enter password"

    );





    await user.type(

        usernameInput,

        "sadia"

    );





    await user.type(

        passwordInput,

        "password123"

    );





    expect(

        usernameInput.value

    ).toBe("sadia");





    expect(

        passwordInput.value

    ).toBe("password123");



});









test("successful login calls login API", async () => {



    loginUser.mockResolvedValue({

        access: "fake_access_token"

    });





    const user = userEvent.setup();





    render(

        <BrowserRouter>

            <LoginForm />

        </BrowserRouter>

    );






    await user.type(

        screen.getByPlaceholderText(

            "Enter username"

        ),

        "sadia"

    );







    await user.type(

        screen.getByPlaceholderText(

            "Enter password"

        ),

        "password123"

    );






    await user.click(

        screen.getByText("Login")

    );







    expect(

        loginUser

    ).toHaveBeenCalledWith({

        username: "sadia",

        password: "password123"

    });



});