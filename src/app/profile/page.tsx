import Image from "next/image";
import { Calendar } from "@gravity-ui/icons";
import EditProfileDialog from "./EditProfileDialog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const page = async () => {
  const session = await auth.api.getSession({
        headers: await headers()
    })
  const user = session?.user;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
        Profile
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Manage how you appear on SmartHealth.
      </p>

      <div className="mt-8 rounded-2xl border border-zinc-150 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50">
            {user?.image ? (
              <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
            ) : null}
          </div>

          <div className="flex-1">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
              <h2 className="text-xl font-semibold text-zinc-950">
                {user?.name}
              </h2>
            </div>

            <p className="mt-1 text-sm text-zinc-500">{user?.email}</p>

            {user?.createdAt ? (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-zinc-400 sm:justify-start">
                <Calendar width={13} height={13} />
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}
              </p>
            ) : null}
          </div>

          <div className="shrink-0">
            <EditProfileDialog user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;