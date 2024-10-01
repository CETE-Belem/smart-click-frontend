import { getRateAction } from "@/action/get-rate.action";
import { Suspense } from "react";
import EditRateForm from "./component/EditRateForm";

export default async function EditRatePage({
  params,
}: {
  params: { ratesId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log(params.ratesId);

  const { data } = await getRateAction(params.ratesId);
  return (
    <Suspense>
      <EditRateForm data={data} />
    </Suspense>
  );
}
