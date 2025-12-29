import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome, {session.user.name}!</h1>
      <pre className="mt-5 bg-gray-800 text-green-400 p-4 rounded">
        {JSON.stringify(session.user, null, 2)}
      </pre>
      <a href="/api/auth/signout" className="mt-5 inline-block text-red-500 underline">Logout</a>
    </div>
  );
}