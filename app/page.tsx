"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginButton from "./components/LoginButton";

/**
 * Renders the home page, redirecting authenticated users to the dashboard and displaying a login interface for others.
 *
 * If the user is authenticated and a session exists, the component automatically navigates to the `/dashboard` route.
 */
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Job Hunt Notifier</h1>
      <LoginButton />
    </main>
  );
}