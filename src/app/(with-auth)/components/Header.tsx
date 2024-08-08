import { CircleUser, Sun } from "lucide-react";
import HeaderInfo from "./HeaderInfo";

//TODO: Transform in a composing component
export default function Header() {
  return (
    <div className="h-44 solaris-background-header">
      <div className="flex justify-between pt-12 pl-16 pr-10">
        <HeaderInfo />
        <div className="flex gap-6">
          <div className="h-10 w-10 bg-white rounded-full flex justify-center items-center">
            <Sun size={22} className="text-solaris-primary" />
          </div>
          <div>
            <div className="flex gap-2 items-center">
              <CircleUser size={40} className="text-white" />
              <p className="text-sm text-muted-foreground">John Doe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
