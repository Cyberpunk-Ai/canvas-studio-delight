import { initials } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const gradients = [
  "from-violet-500 to-fuchsia-500",
  "from-orange-500 to-rose-500",
  "from-sky-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-indigo-500 to-violet-500",
];

function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  return gradients[hash % gradients.length]!;
}

export function Avatar({
  name,
  src,
  className,
  ring = false,
}: {
  name: string;
  src?: string | null;
  className?: string;
  ring?: boolean;
}) {
  const base = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white select-none",
    ring && "ring-2 ring-card",
    className ?? "h-10 w-10 text-xs",
  );

  if (src) {
    return <img src={src} alt={name} loading="lazy" className={cn(base, "object-cover")} />;
  }
  return (
    <span className={cn(base, "bg-gradient-to-br", gradientFor(name))} aria-hidden>
      {initials(name)}
    </span>
  );
}
