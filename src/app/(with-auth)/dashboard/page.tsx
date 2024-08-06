import { Home } from "lucide-react";
import Header from "../components/Header";

export default function DashboardPage(){
  return (
    <>
      <Header title="Unidades Consumidoras">
        <div className="flex gap-2">
          <Home size={20} className="text-white" />
          <p className="text-white text-sm">Dashboard</p>
        </div>
      </Header>
    </>
  )
}