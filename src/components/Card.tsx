type CardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <section
      className={`h-full overflow-hidden border border-zinc-800 rounded-xl p-3 ${className}`}
    >
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      {children}
    </section>
  );
}