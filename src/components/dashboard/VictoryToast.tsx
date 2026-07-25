type VictoryToastProps = {
  message: string;
  visible: boolean;
};

export default function VictoryToast({
  message,
  visible,
}: VictoryToastProps) {
  if (!visible || !message) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-50 w-[min(520px,calc(100vw-32px))] -translate-x-1/2">
      <div className="rounded-xl border border-yellow-500 bg-zinc-950/95 px-5 py-4 shadow-2xl shadow-yellow-950/40">
        <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
          RAS
        </p>

        <p className="mt-1 text-base font-bold text-white">
          {message}
        </p>
      </div>
    </div>
  );
}