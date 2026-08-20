import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import ProfileForm from "../../components/ProfileForm.jsx";

vi.mock("../../services/authService.js", () => ({
    _updateProfile: vi.fn(() =>
        Promise.resolve({
            message: "Profile updated successfully",
            data: {
                username: "sadia",
                email: "profile@gmail.com",
                phone_number: "01999999999",
                address: "Dhaka",
                avatar: 1,
            },
        }),
    ),
}));

vi.mock("../../components/Avatar.jsx", () => ({
    default: () => <div>Avatar</div>,
}));

const mockProfile = {
    id: 2,
    username: "sadia",
    email: "profile@gmail.com",
    phone_number: "01800000000",
    address: "Dhaka",
    avatar: 1,
};

test("profile information renders", () => {
    render(<ProfileForm profile={mockProfile} onUpdate={vi.fn()} />);

    expect(screen.getByText("sadia")).toBeInTheDocument();
    expect(screen.getByText("profile@gmail.com")).toBeInTheDocument();
});

test("phone number can be updated", async () => {
    const user = userEvent.setup();

    render(<ProfileForm profile={mockProfile} onUpdate={vi.fn()} />);

    const phoneInput = screen.getByDisplayValue("01800000000");

    await user.clear(phoneInput);
    await user.type(phoneInput, "01999999999");

    expect(phoneInput.value).toBe("01999999999");
});

test("address can be updated", async () => {
    const user = userEvent.setup();

    render(<ProfileForm profile={mockProfile} onUpdate={vi.fn()} />);

    const addressInput = screen.getByDisplayValue("Dhaka");

    await user.clear(addressInput);
    await user.type(addressInput, "Chittagong");

    expect(addressInput.value).toBe("Chittagong");
});

test("update button submits profile data", async () => {
    const user = userEvent.setup();

    render(<ProfileForm profile={mockProfile} onUpdate={vi.fn()} />);

    await user.click(screen.getByText("Update Profile"));

    expect(
        await screen.findByText("Profile updated successfully"),
    ).toBeInTheDocument();
});
