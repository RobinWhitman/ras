type ProgressBarProps = {
  value: number;
  max: number;
  color?: "yellow" | "red";
};

export default function ProgressBar({
  value,
  max,
  color = "yellow",
}: ProgressBarProps) {
  const percent = Math.round((value / max) * 100);
  const colorClass = color === "red" ? "bg-red-600" : "bg-yellow-500";

  return (
    <div className="w-full h-2.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
      <div
        className={`h-full ${colorClass} transition-all duration-300`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}