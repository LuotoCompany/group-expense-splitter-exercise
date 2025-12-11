"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActionResponse, Person } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Loader2, Trash2, User, UserPlus } from "lucide-react";
import { useState, useTransition } from "react";

export interface PersonManagerProps {
  people: Person[];
  onAdd: (name: string) => Promise<ActionResponse>;
  onRemove: (id: string) => Promise<ActionResponse>;
  className?: string;
}

export function PersonManager({
  people,
  onAdd,
  onRemove,
  className,
}: PersonManagerProps) {
  const [newPersonName, setNewPersonName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // Track which specific person is being deleted
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddPerson = async () => {
    const name = newPersonName.trim();
    if (!name) return;
    
    setError(null);
    
    startTransition(async () => {
      const result = await onAdd(name);
      if (result.success) {
        setNewPersonName("");
      } else {
        setError(result.error || "Failed to add person");
      }
    });
  };

  const handleRemovePerson = async (id: string) => {
    setError(null);
    setDeletingId(id);
    
    // We don't wrap this in startTransition for the deletingId state to work immediately
    // But the actual action is async
    try {
      const result = await onRemove(id);
      if (!result.success) {
        setError(result.error || "Failed to remove person");
      }
    } catch (e) {
      setError("An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPerson();
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <label className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Add New Person
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              placeholder="Enter name (e.g. Alice)"
              onKeyDown={handleKeyDown}
              className="pl-9"
              disabled={isPending}
            />
          </div>
          <Button 
            onClick={handleAddPerson} 
            disabled={isPending || !newPersonName.trim()}
            className="min-w-[100px]"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Add
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none text-gray-700">
          Group Members ({people.length})
        </label>
        
        {people.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
            No people in this group yet. Add someone above to get started.
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {people.map((person) => (
              <div
                key={person.id}
                className="group flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">{person.name}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                  onClick={() => handleRemovePerson(person.id)}
                  disabled={deletingId === person.id}
                  title="Remove person"
                >
                  {deletingId === person.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Remove {person.name}</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
