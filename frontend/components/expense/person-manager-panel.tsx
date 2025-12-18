"use client";

import { addPerson, deletePerson } from "@/app/actions/people";
import type { Person } from "@/lib/types";
import { PersonManager } from "@/components/expense/person-manager";

export interface PersonManagerPanelProps {
  initialPeople: Person[];
}

export function PersonManagerPanel({ initialPeople }: PersonManagerPanelProps) {
  return (
    <PersonManager
      people={initialPeople}
      onAdd={addPerson}
      onRemove={deletePerson}
    />
  );
}

