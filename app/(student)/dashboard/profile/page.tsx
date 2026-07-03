import { requireUser } from "@/lib/auth";
import { ProfileForm } from "@/components/forms/profile-form";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hồ sơ của tôi</h1>
      <ProfileForm name={user.name} email={user.email} bio={user.bio} avatarUrl={user.avatarUrl} />
    </div>
  );
}
