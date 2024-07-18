"use client"

import Button from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/login")
  }, [router])

  return (
    <div className="h-screen w-screen solaris-background grid place-items-center">
      <Button asChild>
        <Link href="/login">
          Fazer Login
        </Link>
      </Button>
    </div>
  );
}
