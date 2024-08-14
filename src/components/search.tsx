import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Input from "./ui/input";
import { useState } from "react";
import { useDebouncedCallback } from 'use-debounce';

export type SearchInputProps = {
  placeholder?: string;
  onSearch?: () => void;
}

export default function SearchInput({placeholder = "Pesquisar...", onSearch}: SearchInputProps){
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const { replace } = useRouter()

  const query = searchParams.get("query") ?? "";
  const [text, setText] = useState(query);
 
  const debounced = useDebouncedCallback(
    (value) => {
      setText(value);
      handleSearch(value);
      onSearch && onSearch();
    },
    1000
  );

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams)

    if (term) {
        params.set("query", term)
    } else {
        params.delete("query")
    }
    replace(`${pathname}?${params.toString()}`)
}

  return (
    <Input 
      defaultValue={text}
      placeholder={placeholder} 
      labelClassName="w-full" 
      onChange={(e) => debounced(e.target.value)}
    />
  )
}