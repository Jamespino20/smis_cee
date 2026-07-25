"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export const LOCATIONS = [
  {
    id: "rebirth-core",
    label: "The Rebirth Core",
    sectionId: "rebirth-core",
    x: 200,
    y: 180,
  },
  {
    id: "creators-hand",
    label: "The Creator's Hand",
    sectionId: "creators-hand",
    x: 420,
    y: 120,
  },
  {
    id: "archers-aim",
    label: "The Archer's Aim",
    sectionId: "archers-aim",
    x: 620,
    y: 200,
  },
  {
    id: "petals-promise",
    label: "The Petal's Promise",
    sectionId: "petals-promise",
    x: 500,
    y: 340,
  },
  {
    id: "heart-of-vestia",
    label: "The Heart of Vestia",
    sectionId: "heart-of-vestia",
    x: 280,
    y: 360,
  },
  {
    id: "gallery-of-wishes",
    label: "The Gallery of Wishes",
    sectionId: "gallery-of-wishes",
    x: 150,
    y: 320,
  },
] as const;

export type LocationId = (typeof LOCATIONS)[number]["id"];

interface ProgressContextValue {
  unlockedLocations: Set<LocationId>;
  currentLocation: LocationId | null;
  completeLocation: (id: LocationId) => void;
  isPathUnlocked: (from: LocationId, to: LocationId) => boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [unlockedLocations, setUnlockedLocations] = useState<Set<LocationId>>(
    () => new Set<LocationId>(["rebirth-core"])
  );
  const [currentLocation, setCurrentLocation] = useState<LocationId | null>(null);

  const completeLocation = useCallback((id: LocationId) => {
    setUnlockedLocations((prev) => {
      const next = new Set(prev);
      next.add(id);
      const idx = LOCATIONS.findIndex((l) => l.id === id);
      if (idx !== -1 && idx + 1 < LOCATIONS.length) {
        next.add(LOCATIONS[idx + 1].id);
      }
      return next;
    });
    setCurrentLocation(id);
  }, []);

  const isPathUnlocked = useCallback(
    (from: LocationId, to: LocationId) => {
      return unlockedLocations.has(from) && unlockedLocations.has(to);
    },
    [unlockedLocations]
  );

  return (
    <ProgressContext.Provider
      value={{ unlockedLocations, currentLocation, completeLocation, isPathUnlocked }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
