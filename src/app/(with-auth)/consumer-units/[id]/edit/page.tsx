import { getConsumerUnitAction } from "@/action/get-consumer-unit.action";
import { Suspense } from "react";
import EditConsumerUnitForm from "./components/EditConsumerUnitForm";

export default async function EditConsumerUnitPage({
  params,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { data } = await getConsumerUnitAction(params.id);
  return (
    <Suspense>
      <EditConsumerUnitForm data={data} />
    </Suspense>
  );
}
