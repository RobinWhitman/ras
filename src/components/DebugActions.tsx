type DebugActionsProps = {
  onReset: () => void;
};

export default function DebugActions({ onReset }: DebugActionsProps) {
  return (
    <details className="border border-zinc-800 rounded-xl p-4 text-zinc-400">
      <summary className="cursor-pointer font-semibold">
        Outils de test
      </summary>

      <button
        onClick={onReset}
        className="mt-4 bg-red-600 text-white font-bold px-6 py-3 rounded-xl"
      >
        Reset progression
      </button>
    </details>
  );
}