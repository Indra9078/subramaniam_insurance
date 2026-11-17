"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { signInUser, signUpUser, type AuthState } from "@/app/[lang]/account/actions";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const field =
  "min-h-[50px] w-full rounded-[14px] border border-[#cfccd6] bg-white px-3.5 text-base text-ink focus:border-iris-500 focus:outline-none focus:ring-2 focus:ring-iris-200";

/** Log in / create account. The two forms share the page; the tabs switch between them. */
export function AuthForm({ lang, next, dict, initial = "login", linkError }: { lang: string; next: string; dict: Dictionary; initial?: "login" | "signup"; linkError?: boolean }) {
  const a = dict.account;
  const [mode, setMode] = useState<"login" | "signup">(initial);
  const [login, loginAction, loginPending] = useActionState<AuthState, FormData>(signInUser.bind(null, lang, next), {});
  const [signup, signupAction, signupPending] = useActionState<AuthState, FormData>(signUpUser.bind(null, lang, next), {});
  const state = mode === "login" ? login : signup;
  const pending = mode === "login" ? loginPending : signupPending;
  const action = mode === "login" ? loginAction : signupAction;
  const message = state.error ? a.errors[state.error] : linkError && !state.info ? a.errors.link : "";

  const tab = (m: "login" | "signup", label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => setMode(m)}
      className={`min-h-11 flex-1 rounded-full text-sm font-semibold transition-colors ${mode === m ? "bg-ink text-white" : "text-ink hover:bg-paper"}`}
    >
      {label}
    </button>
  );
  const label = (id: string, text: string, hint?: string) => (
    <label htmlFor={id} className="text-sm font-semibold">
      {text}
      {hint && <span className="ml-1 font-normal text-muted">({hint})</span>}
    </label>
  );

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label={a.loginTitle} className="flex gap-1 rounded-full border border-line bg-white p-1">
        {tab("login", a.tabLogin)}
        {tab("signup", a.tabSignup)}
      </div>

      {state.info === "checkEmail" ? (
        <div role="status" className="rounded-[1.25rem] border border-[#bfe5cc] bg-[#e7f5ec] p-5 text-[15px] leading-relaxed">{a.checkEmail}</div>
      ) : (
        <form
          key={mode}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(() => action(fd));
          }}
          className="flex flex-col gap-4"
        >
          {mode === "signup" && (
            <>
              <div className="flex flex-col gap-1.5">
                {label("au-name", a.name)}
                <input id="au-name" name="name" autoComplete="name" required maxLength={80} aria-invalid={state.error === "name" || undefined} className={field} />
              </div>
              <div className="flex flex-col gap-1.5">
                {label("au-phone", a.phone)}
                <input id="au-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={16} aria-invalid={state.error === "phone" || undefined} className={field} />
              </div>
            </>
          )}
          <div className="flex flex-col gap-1.5">
            {label("au-email", a.email)}
            <input id="au-email" name="email" type="email" autoComplete="username" required maxLength={254} aria-invalid={state.error === "email" || undefined} className={field} />
          </div>
          <div className="flex flex-col gap-1.5">
            {label("au-pass", a.password, mode === "signup" ? a.passwordHint : undefined)}
            <input id="au-pass" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={mode === "signup" ? 8 : undefined} maxLength={200}
              aria-invalid={state.error === "weak" || undefined} className={field} />
          </div>
          {mode === "signup" && (
            <div className="flex items-start gap-2.5">
              <input id="au-consent" name="consent" type="checkbox" required aria-invalid={state.error === "consent" || undefined} className="mt-0.5 size-5 shrink-0" />
              <label htmlFor="au-consent" className="text-sm leading-relaxed text-muted">
                {a.consent}{" "}
                <Link href={`/${lang}/terms`} className="font-semibold text-ember underline underline-offset-2">{a.terms}</Link>
                {" · "}
                <Link href={`/${lang}/privacy`} className="font-semibold text-ember underline underline-offset-2">{a.privacy}</Link>
              </label>
            </div>
          )}
          <button type="submit" disabled={pending} className="btn-sheen min-h-[54px] rounded-full text-base font-semibold text-white disabled:opacity-70">
            {pending ? a.working : mode === "login" ? a.login : a.signup}
          </button>
          <p aria-live="assertive" className="min-h-5 text-center text-sm font-semibold text-ember">{message}</p>
        </form>
      )}
    </div>
  );
}
