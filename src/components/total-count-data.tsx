interface TotalCountDataProps {
  label?: string;
  count?: number;
}

export default function TotalCountData({count = 0, label = "Total"}: TotalCountDataProps) {
  return (
    <h3 className="uppercase text-sm font-bold text-black/50 my-5">
      {label} ({count})
    </h3>
  );
}
