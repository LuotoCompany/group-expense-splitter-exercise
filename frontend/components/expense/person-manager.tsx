"use client";

import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import type { Person } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PersonManagerProps {
  people: Person[];
  onAdd: (name: string) => void;
  onRemove?: (id: string) => void;
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
  className,
}: PersonManagerProps) {
  const [newPersonName, setNewPersonName] = useState('');
  const [showAddPerson, setShowAddPerson] = useState(false);

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      onAdd(newPersonName.trim());
      setNewPersonName('');
      setShowAddPerson(false);
    }
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
          >
            <UserPlus className="w-4 h-4" />
            Add Person
          </Button>
        )}
      </div>

      {people.length > 0 && (
        <div className="space-y-2">
          {people.map(person => (
            <div
              key={person.id}
              className="flex items-center justify-between p-2 border border-gray-200 rounded-md"
            >
              <span className="text-gray-900">{person.name}</span>
              {onRemove && (
                <button
                  onClick={() => onRemove(person.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  aria-label={`Remove ${person.name}`}
                >
                  <X className="w-4 h-4" />
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
              if (e.key === 'Enter') {
                handleAddPerson();
              } else if (e.key === 'Escape') {
                setShowAddPerson(false);
                setNewPersonName('');
              }
            }}
            autoFocus
          />
          <Button onClick={handleAddPerson} size="sm">
            Add
          </Button>
          <Button
            onClick={() => {
              setShowAddPerson(false);
              setNewPersonName('');
            }}
            size="sm"
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      )}

      {people.length === 0 && !showAddPerson && (
        <p className="text-gray-500 text-sm">No people added yet</p>
      )}
    </div>
  );
}
