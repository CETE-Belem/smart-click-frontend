import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EquipmentCardInfoProps {
  value: {
    V: number | null,
    I: number | null,
    Pr: number | null,
    Fp: number | null,
  };
  phase?: string;
}

export default function EquipmentCardInfo(props: EquipmentCardInfoProps) {
  return (
    <Card className="flex-1 flex">
      <CardHeader className="flex gap-2 space-y-3 border-b py-5 flex-1">
        <CardTitle>Fase {props.phase}</CardTitle>
        <CardDescription>
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col items-center justify-center">
              <p className="text-2xl">{props.value.V?.toFixed(2) ?? '-'}</p>
              <p className="text-2xs">Tensão (V)</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-2xl">{props.value.I?.toFixed(2) ?? '-'}</p>
              <p className="text-2xs">Corrente (A)</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-2xl">{props.value.Pr?.toFixed(2) ?? '-'}</p>
              <p className="text-2xs">Potência Real (W)</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-2xl">{props.value.Fp?.toFixed(2) ?? '-'}</p>
              <p className="text-2xs">Fator de Potência</p>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
