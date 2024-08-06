import { Building, ChevronsRight, Home } from "lucide-react";
import Header from "../components/Header";

export default function ConsumerUnitPage(){
  return (
    <>
      <Header title="Unidades Consumidoras">
        <div className="flex gap-2">
          <Home size={20} className="text-white" />
          <p className="text-white text-sm">Dashboard</p>
        </div>
        <ChevronsRight size={24} className="text-white" />
        <div className="flex gap-2">
          <Building size={20} className="text-white" />
          <p className="text-white text-sm">Unidades Consumidoras</p>
        </div>
      </Header>
    </>
  )
}