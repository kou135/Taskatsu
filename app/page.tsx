import LoginButton from "./components/LoginButton";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Job Hunt Notifier</h1>
      <LoginButton />
    </main>
  );
}