import { useEffect } from "react";
import { X } from "lucide-react";
import { Composer } from "@/components/social/Composer";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ComposeModal() {
  const { composerOpen, dispatch } = useStore();

  useEffect(() => {
    if (!composerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dispatch({ type: "closeComposer" });
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [composerOpen, dispatch]);

  return (
    <div
      aria-hidden={!composerOpen}
      className={cn(
        "fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[10vh] transition-opacity duration-300",
        composerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div
        onClick={() => dispatch({ type: "closeComposer" })}
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Compose a post"
        className={cn(
          "relative w-full max-w-xl transition-all duration-300 ease-out",
          composerOpen ? "translate-y-0 scale-100" : "-translate-y-4 scale-95",
        )}
      >
        <button
          onClick={() => dispatch({ type: "closeComposer" })}
          aria-label="Close"
          className="absolute -top-12 right-0 rounded-full bg-card/80 p-2 text-foreground shadow-soft backdrop-blur transition-all hover:bg-card active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>
        {composerOpen && (
          <Composer autoFocus onPosted={() => dispatch({ type: "closeComposer" })} />
        )}
      </div>
    </div>
  );
}
