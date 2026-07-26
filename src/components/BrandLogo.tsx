import Link from "next/link";

type BrandLogoProps = {
  compact?: boolean;
};

export default function BrandLogo({
  compact = false,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      title="Retour au Dashboard"
      aria-label="Retour au Dashboard RAS"
      className={`relative block shrink-0 overflow-hidden ${
        compact ? "h-10 w-14" : "h-12 w-20"
      }`}
    >
      <img
        src="/assets/brand/ras-logo.png"
        alt=""
        className="absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 scale-125 object-contain"
      />
    </Link>
  );
}