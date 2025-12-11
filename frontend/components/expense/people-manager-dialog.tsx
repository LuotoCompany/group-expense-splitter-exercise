"use client";

import { Users } from "lucide-react";
import { useState } from "react";

import { addPerson, deletePerson } from "@/app/actions/people";
import { PersonManager } from "@/components/expense/person-manager";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { Person } from "@/lib/types";

interface PeopleManagerDialogProps {
  people: Person[];
}

export function PeopleManagerDialog({ people }: PeopleManagerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" />
          Manage People
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage People</DialogTitle>
          <DialogDescription>
            Add or remove people from your expense group.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <PersonManager 
            people={people} 
            onAdd={addPerson} 
            onRemove={deletePerson} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
