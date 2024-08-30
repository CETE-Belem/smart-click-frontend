import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EquipmentCardInfoSkeleton() {
  return (
    <Card className="w-[540px]">
      <CardHeader className="flex gap-2 space-y-3 border-b py-5">
        <Skeleton className="h-6 w-24" />
        <div className="flex flex-row justify-between w-full">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center justify-center">
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardHeader>
    </Card>
  )
}