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
    P: number | null,
  };
  phase?: string;
}

export default function EquipmentCardInfo(props: EquipmentCardInfoProps) {
  return (
    <Card>
      <CardHeader className="flex gap-2 space-y-3 border-b py-5">
        <CardTitle>Fase {props.phase}</CardTitle>
        <CardDescription className="flex flex-row justify-between">
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl">{props.value.V}</p>
            <p className="text-2xs">Tensão (V)</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl">{props.value.I}</p>
            <p className="text-2xs">Corrente (A)</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl">{props.value.P}</p>
            <p className="text-2xs">Potência (W)</p>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
