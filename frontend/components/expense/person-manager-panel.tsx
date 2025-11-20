"use client";

import { useState, useTransition } from "react";

import { addPerson, deletePerson } from "@/app/actions/people";
import type { Person } from "@/lib/types";
import { PersonManager } from "@/components/expense/person-manager";

export interface PersonManagerPanelProps {
  initialPeople: Person[];
}

const sortPeople = (people: Person[]) =>
  [...people].sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    if (aTime !== bTime) {
      return aTime - bTime;
    }
    return a.name.localeCompare(b.name);
  });

export function PersonManagerPanel({ initialPeople }: PersonManagerPanelProps) {
  const [people, setPeople] = useState(() => sortPeople(initialPeople));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAdd = (name: string) => {
    startTransition(async () => {
      setErrorMessage(null);
      setStatusMessage(null);
      const result = await addPerson({ name });
      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }
      setPeople((prev) => sortPeople([...prev, result.data]));
      setStatusMessage(`Added ${result.data.name}.`);
    });
  };

  const handleRemove = (id: string) => {
    startTransition(async () => {
      setErrorMessage(null);
      setStatusMessage(null);
      const result = await deletePerson({ id });
      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }
      setPeople((prev) => prev.filter((person) => person.id !== id));
      setStatusMessage("Person removed.");
    });
  };

  return (
    <PersonManager
      people={people}
      onAdd={handleAdd}
      onRemove={people.length ? handleRemove : undefined}
      isBusy={isPending}
      statusMessage={statusMessage}
      errorMessage={errorMessage}
    />
  );
}

