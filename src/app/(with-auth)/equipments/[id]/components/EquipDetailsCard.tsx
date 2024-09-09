import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EquipmentSchemaType } from "@/schemas/equipment.schema";
import { Power, Timer } from "lucide-react";

interface EquipmentDetailsInfoProps {
  equipment: EquipmentSchemaType;
  online: boolean;
}

export default function EquipmentDetailsInfo({equipment, online}: EquipmentDetailsInfoProps ) {
  return (
    <Card>
      <CardHeader className="flex gap-2 space-y-3 border-b py-5">
        <CardTitle className="text-3xl">Equipamento {equipment.nome}</CardTitle>
        <CardDescription className="flex flex-col justify-between gap-5">
          <div className="flex gap-5">
            <p>Concessionária: {equipment.concessionaria.nome}</p>
            <p>UC {equipment.unidade_consumidora.numero}</p>
          </div>
          <div className="flex flex-wrap gap-5">
            <div className={cn("flex gap-2 items-center text-[#96B562]", {
              "text-[#F87171]": !online,
            })}>
              <Power width={14} height={14} />
              <p className="text-xs">Ligado</p>
            </div>
            {/* <div className="flex gap-2 items-center">
              <Timer width={14} height={14} />
              <p className="text-xs">Tempo desligado: {}</p>
            </div> */}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
