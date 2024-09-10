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
    Pa: number | null,
    Pr: number | null,
    Fp: number | null,
  };
  phase?: string;
}

export default function EquipmentCardInfo(props: EquipmentCardInfoProps) {
  return (
    <Card>
      <CardHeader className="flex gap-2 space-y-3 border-b py-5">
        <CardTitle>Fase {props.phase}</CardTitle>
        <CardDescription className="flex flex-row justify-between gap-5">
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
          {//todo: remove this
          }
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl">{props.value.Pa?.toFixed(2) ?? '-'}</p>
            <p className="text-2xs">Potência Aparente (VA)</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl">{props.value.Fp?.toFixed(2) ?? '-'}</p>
            <p className="text-2xs">Fator de Potência</p>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
