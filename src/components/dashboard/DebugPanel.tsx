import DebugActions from "@/components/DebugActions";

type DebugPanelProps = {
  onReset: () => void;
};

export default function DebugPanel({ onReset }: DebugPanelProps) {
  return <DebugActions onReset={onReset} />;
}