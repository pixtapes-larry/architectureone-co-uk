"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";
import formStyles from "@/components/forms/forms.module.css";
import styles from "./login.module.css";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className={formStyles.form}>
      <div className={formStyles.field}>
        <label className={formStyles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={formStyles.input}
        />
      </div>
      <div className={formStyles.field}>
        <label className={formStyles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={formStyles.input}
        />
      </div>
      {state.error && <p className={styles.error}>{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className={formStyles.submitBtn}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
