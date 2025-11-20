import type { Meta, StoryObj } from '@storybook/react';
import { PersonManager } from './person-manager';
import { useState } from 'react';
import type { Person } from '@/lib/types';

const meta: Meta<typeof PersonManager> = {
  title: 'Expense/PersonManager',
  component: PersonManager,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PersonManager>;

const mockPeople: Person[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

export const Default: Story = {
  render: () => {
    const [people, setPeople] = useState(mockPeople);
    return (
      <PersonManager
        people={people}
        onAdd={(name) => {
          setPeople([...people, { id: Date.now().toString(), name }]);
        }}
        onRemove={(id) => {
          setPeople(people.filter(p => p.id !== id));
        }}
      />
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [people, setPeople] = useState<Person[]>([]);
    return (
      <PersonManager
        people={people}
        onAdd={(name) => {
          setPeople([...people, { id: Date.now().toString(), name }]);
        }}
      />
    );
  },
};

export const WithoutRemove: Story = {
  args: {
    people: mockPeople,
    onAdd: (name) => console.log('Add person:', name),
  },
};

export const SinglePerson: Story = {
  render: () => {
    const [people, setPeople] = useState([mockPeople[0]]);
    return (
      <PersonManager
        people={people}
        onAdd={(name) => {
          setPeople([...people, { id: Date.now().toString(), name }]);
        }}
        onRemove={(id) => {
          setPeople(people.filter(p => p.id !== id));
        }}
      />
    );
  },
};
