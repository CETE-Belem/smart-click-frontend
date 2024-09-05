import { getConcessionaireAction } from "@/action/get-concessionaire-action";
import { Suspense } from "react";
import EditConcessionaireForm from "./components/EditConcessionaireForm";

export default async function EditConcessionairePage({
  params,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { data } = await getConcessionaireAction(params.id);
  return (
    <Suspense>
      <EditConcessionaireForm data={data} />
    </Suspense>
  );
}
