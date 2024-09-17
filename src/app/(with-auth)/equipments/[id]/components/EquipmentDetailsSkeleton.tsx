import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EquipmentDetailsSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-2 space-y-3 border-b py-5">
        <Skeleton className="h-9 w-3/4" />
        <div className="space-y-5">
          <div className="flex gap-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex flex-wrap gap-5">
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}