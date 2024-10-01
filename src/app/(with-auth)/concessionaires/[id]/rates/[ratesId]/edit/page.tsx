import { getRateAction } from "@/action/get-rate.action";
import { Suspense } from "react";
import EditRateForm from "./component/EditRateForm";

export default async function EditRatePage({
  params,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { data } = await getRateAction(params.id);
  return (
    <Suspense>
      <EditRateForm data={data} />
    </Suspense>
  );
}
