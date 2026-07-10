type DebugPanelProps = {
  onReset: () => void;
  onSimulateNewDay: () => void;
};

export default function DebugPanel({
  onReset,
  onSimulateNewDay,
}: DebugPanelProps) {
  return (
    <details className="h-full border border-zinc-800 rounded-xl p-3 text-zinc-400">
      <summary className="cursor-pointer font-semibold">
        Outils de test
      </summary>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={onSimulateNewDay}
          className="bg-zinc-700 text-white font-bold px-4 py-2 rounded-lg"
        >
          Simuler demain
        </button>

        <button
          onClick={onReset}
          className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg"
        >
          Reset total
        </button>
      </div>
    </details>
  );
}