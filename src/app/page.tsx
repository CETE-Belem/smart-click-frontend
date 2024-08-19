"use client"

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Routes } from "@/enums/Routes.enum";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch(Routes.Login)
  }, [router])

  return (
    <div className="h-screen w-screen solaris-background grid place-items-center">
      <Button variant="solar" asChild>
        <Link href={Routes.Login}>
          Fazer Login
        </Link>
      </Button>
    </div>
  );
}
