"use client";

import { useState } from "react";
import { Loader2, UserPlus, X } from "lucide-react";
import type { Person } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PersonManagerProps {
  people: Person[];
  onAdd: (name: string) => void;
  onRemove?: (id: string) => void;
  isBusy?: boolean;
  statusMessage?: string | null;
  errorMessage?: string | null;
  className?: string;
}

/**
 * PersonManager allows adding and removing people from the group.
 *
 * Features:
 * - List of current people
 * - Input to add new person
 * - Optional remove button for each person
 */
export function PersonManager({
  people,
  onAdd,
  onRemove,
  isBusy,
  statusMessage,
  errorMessage,
  className,
}: PersonManagerProps) {
  const [newPersonName, setNewPersonName] = useState("");
  const [showAddPerson, setShowAddPerson] = useState(false);

  const handleAddPerson = () => {
    if (!newPersonName.trim() || isBusy) return;
    onAdd(newPersonName.trim());
    setNewPersonName("");
    setShowAddPerson(false);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900 font-medium">People</h3>
        {!showAddPerson && (
          <Button
            onClick={() => setShowAddPerson(true)}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
            disabled={isBusy}
          >
            {isBusy ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <UserPlus className="w-4 h-4" aria-hidden="true" />
            )}
            Add Person
          </Button>
        )}
      </div>

      {people.length > 0 && (
        <div className="space-y-2">
          {people.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between rounded-md border border-gray-200 p-2"
            >
              <span className="text-gray-900">{person.name}</span>
              {onRemove && (
                <button
                  onClick={() => onRemove(person.id)}
                  className="text-red-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:text-gray-400"
                  aria-label={`Remove ${person.name}`}
                  disabled={isBusy}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddPerson && (
        <div className="flex gap-2">
          <Input
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            placeholder="Enter name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddPerson();
              } else if (e.key === "Escape") {
                setShowAddPerson(false);
                setNewPersonName("");
              }
            }}
            autoFocus
            disabled={isBusy}
          />
          <Button onClick={handleAddPerson} size="sm" disabled={isBusy || !newPersonName.trim()}>
            Add
          </Button>
          <Button
            onClick={() => {
              setShowAddPerson(false);
              setNewPersonName("");
            }}
            size="sm"
            variant="outline"
            disabled={isBusy}
          >
            Cancel
          </Button>
        </div>
      )}

      {people.length === 0 && !showAddPerson && (
        <p className="text-sm text-gray-500">No people added yet</p>
      )}

      <div className="min-h-5 text-sm" aria-live="polite" role="status">
        {errorMessage ? (
          <span className="text-red-600">{errorMessage}</span>
        ) : statusMessage ? (
          <span className="text-gray-600">{statusMessage}</span>
        ) : null}
      </div>
    </div>
  );
}
