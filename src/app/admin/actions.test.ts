import { beforeEach, describe, expect, it, vi } from "vitest";

const { signIn, signOut } = vi.hoisted(() => ({ signIn: vi.fn(), signOut: vi.fn() }));

vi.mock("@/auth", () => ({ signIn, signOut }));

import { loginAction, logoutAction } from "./actions";

function credentials(email = "admin@example.com", password = "a-long-test-password") {
  const form = new FormData();
  form.set("email", email);
  form.set("password", password);
  return form;
}

describe("admin login action", () => {
  beforeEach(() => {
    signIn.mockReset();
    signOut.mockReset();
  });

  it("creates the Auth.js sign-in flow for valid credentials", async () => {
    signIn.mockResolvedValue(undefined);

    await expect(loginAction({ error: null }, credentials())).resolves.toEqual({ error: null });
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "admin@example.com",
      password: "a-long-test-password",
      redirectTo: "/admin/leads",
    });
  });

  it("ends the server session and redirects to login", async () => {
    signOut.mockResolvedValue(undefined);

    await logoutAction();

    expect(signOut).toHaveBeenCalledWith({ redirectTo: "/admin/login" });
  });
});
