type CardProps = {
  title: string;
  children: React.ReactNode;
  compact?: boolean;
};

export default function Card({ title, children, compact = false }: CardProps) {
  return (
    <section
      className={`border border-zinc-800 rounded-xl ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}