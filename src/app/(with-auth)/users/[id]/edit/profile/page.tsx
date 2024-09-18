import { GetUserAction } from "@/action/get-user.action";
import { Suspense } from "react";
import EditProfileForm from "./components/EditProfileForm";

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { data } = await GetUserAction(params.id);
  return (
    <Suspense>
      <EditProfileForm data={data} />
    </Suspense>
  );
}
