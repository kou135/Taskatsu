"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
        <button onClick={() => signOut()}>ログアウト</button>
    );
  }
  return <button onClick={() => signIn("google")}>Googleでログイン</button>;
}