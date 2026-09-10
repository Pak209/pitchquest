"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/hooks/AppProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { defaultAppState, saveAppState } from "@/lib/storage/storage";
import { STORAGE_KEY } from "@/lib/storage/types";
import { playNote, resumeAudio } from "@/lib/audio/engine";

export default function SettingsPage() {
  const { activeProfile, selectProfile, state, persist, changeInstrument } =
    useApp();
  const router = useRouter();

  const reset = () => {
    if (!confirm("Reset all Pitch Quest progress on this device?")) return;
    const fresh = defaultAppState();
    saveAppState(fresh);
    persist(fresh);
    router.push("/");
  };

  return (
    <main className="flex flex-col gap-4 pt-2">
      <h1 className="text-2xl font-extrabold text-star">Settings</h1>

      <Card className="p-4">
        <h2 className="mb-2 font-bold">Active profile</h2>
        <div className="flex gap-2">
          <Button
            variant={activeProfile?.id === "son" ? "default" : "outline"}
            onClick={() => selectProfile("son")}
          >
            🧒 Son
          </Button>
          <Button
            variant={activeProfile?.id === "dad" ? "default" : "outline"}
            onClick={() => selectProfile("dad")}
          >
            🧔 Dad
          </Button>
        </div>
        <Button
          className="mt-3 w-full"
          variant="soft"
          onClick={() => router.push("/")}
        >
          Switch on Home
        </Button>
      </Card>

      {activeProfile && (
        <Card className="p-4">
          <h2 className="mb-2 font-bold">Quick audio test</h2>
          <Button
            className="w-full"
            onClick={async () => {
              await resumeAudio();
              await playNote("A", 4, {
                timbre: activeProfile.instrument,
                duration: 0.8,
              });
            }}
          >
            Play A4 ({activeProfile.instrument})
          </Button>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["piano", "pad", "bell", "organ", "sine"] as const).map((t) => (
              <Button
                key={t}
                size="sm"
                variant={
                  activeProfile.instrument === t ? "default" : "outline"
                }
                onClick={() => changeInstrument(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-4 text-sm text-white/70">
        <p>
          Persistence key: <code className="text-star">{STORAGE_KEY}</code>
        </p>
        <p className="mt-1">
          Profiles: {state ? Object.keys(state.profiles).join(", ") : "—"}
        </p>
      </Card>

      <Button variant="danger" onClick={reset}>
        Reset all data
      </Button>
    </main>
  );
}
