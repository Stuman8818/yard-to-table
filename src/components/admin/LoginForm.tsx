"use client";

import { useActionState } from "react";

import { loginAction, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[#25372d]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-lg border border-[#c8d1c7] bg-white px-4 py-3 text-[#1e2923] shadow-sm focus:border-[#476654] focus:ring-2 focus:ring-[#c9d9bb]"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-[#25372d]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-lg border border-[#c8d1c7] bg-white px-4 py-3 text-[#1e2923] shadow-sm focus:border-[#476654] focus:ring-2 focus:ring-[#c9d9bb]"
        />
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-[#fbe8e4] px-4 py-3 text-sm text-[#7d2d22]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#173f32] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#245b48] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Signing inâ€¦" : "Sign in"}
      </button>
    </form>
  );
}
