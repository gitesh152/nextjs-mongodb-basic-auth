import { GoBackButton } from "../../components/GoBackButton";

export default async function ProfilePage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-4">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Profile Page
        </h1>
        {id && (
          <p className="text-center text-sm">
            <span className="text-black font-medium"> ID: {id}</span>
          </p>
        )}
        <GoBackButton />
      </div>
    </div>
  );
}
