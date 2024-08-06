import { CircleUser, Sun } from "lucide-react";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

//TODO: Transform in a composing component
export default function Header({title, children} : HeaderProps) {
  return (
    <div className="h-44 solaris-background-header">
      <div className="flex justify-between pt-12 pl-16 pr-10">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-white">{title}</h1>
          <div className="text-sm text-white flex gap-4 items-center">
            {children}
          </div>
        </div>
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
