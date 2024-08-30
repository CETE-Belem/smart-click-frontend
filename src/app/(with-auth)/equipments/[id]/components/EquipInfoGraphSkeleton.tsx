import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EquipInfoGraphSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <Skeleton className="h-6 w-[200px]" />
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto h-[250px] w-full">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="mt-4 flex justify-center space-x-2">
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}