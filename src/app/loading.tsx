import { Loader } from "lucide-react";

export default function Loading(){
  return (
    <div className="loading animate-spin">
      <Loader size={50} />
    </div>
  )
}