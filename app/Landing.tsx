"use client";

import { useEffect, useState } from "react";
import styles from "./landing.module.css";

type ChipState = "loading" | "ok" | "fail";

const CHIP_LABEL: Record<ChipState, string> = {
  loading: "Checking…",
  ok: "API ok",
  fail: "API down",
};

async function fetchHealthStatus(): Promise<"ok" | "fail"> {
  try {
    const res = await fetch("/api/health");
    if (!res.ok) return "fail";
    const data: unknown = await res.json();
    const ok =
      typeof data === "object" &&
      data !== null &&
      "ok" in data &&
      (data as { ok: unknown }).ok === true;
    return ok ? "ok" : "fail";
  } catch {
    return "fail";
  }
}

export default function Landing() {
  const [chip, setChip] = useState<ChipState>("loading");

  useEffect(() => {
    let cancelled = false;
    void fetchHealthStatus().then((result) => {
      if (!cancelled) setChip(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleCheck() {
    setChip("loading");
    void fetchHealthStatus().then(setChip);
  }

  const chipClass =
    chip === "ok"
      ? `${styles.chip} ${styles.chipOk}`
      : chip === "fail"
        ? `${styles.chip} ${styles.chipFail}`
        : `${styles.chip} ${styles.chipLoading}`;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Pipeline Test</h1>
      <p className={styles.blurb}>
        Tiny site to prove Design → Frontend → Backend.
      </p>
      <div className={styles.statusGroup} role="group" aria-label="Status check">
        <button type="button" className={styles.cta} onClick={handleCheck}>
          Check status
        </button>
        <span className={chipClass} role="status" aria-live="polite">
          <span className={styles.dot} aria-hidden="true" />
          {CHIP_LABEL[chip]}
        </span>
      </div>
    </main>
  );
}
