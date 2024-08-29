"use client";
import { useState, useEffect } from "react";
import useUfs from "@/hooks/useUF";
import { ConsumerUnit } from "@/types/unidade-consumidora";

export default function EditConsumerUnitForm({ data }: { data: ConsumerUnit }) {
  const { ufs, loading: ufLoading } = useUfs();
  const [uf, setUf] = useState<number | null>(null);
  return <h1>oi</h1>;
}
