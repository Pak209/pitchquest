import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Lives({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`${count} lives`}>
      {Array.from({ length: max }).map((_, i) => (
        <Heart
          key={i}
          className={cn(
            "h-7 w-7",
            i < count ? "fill-rose-500 text-rose-500" : "text-white/25"
          )}
        />
      ))}
    </div>
  );
}
