type CardProps = {
  title: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <section className="border border-zinc-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}