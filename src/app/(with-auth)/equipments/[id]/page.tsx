import { getEquipmentAction } from "@/action/get-equipment.action";
import { Suspense } from "react";
import EditEquipmentForm from "./components/EditEquipmentForm";

export default async function EditEquipmentPage({params}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { equipment } = await getEquipmentAction(params.id);
  return (
    <Suspense fallback={<></>}>
      <EditEquipmentForm data={equipment}/>
    </Suspense>
  );
}
