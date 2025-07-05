"use client";

import { signIn, signOut, useSession } from "next-auth/react";

/**
 * Renders a button for user authentication using NextAuth.js.
 *
 * Displays a "ログアウト" (Logout) button if the user is logged in, or a "Googleでログイン" (Login with Google) button if not. Handles sign-in and sign-out actions accordingly.
 */
export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
        <button onClick={() => signOut()}>ログアウト</button>
    );
  }
  return <button onClick={() => signIn("google")}>Googleでログイン</button>;
}