type CardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <section
      className={`h-full overflow-visible rounded-lg border border-zinc-800 p-3 sm:p-4 lg:overflow-hidden ${className}`}
    >
      <h2 className="mb-2 text-base font-bold sm:text-lg">{title}</h2>
      {children}
    </section>
  );
}
