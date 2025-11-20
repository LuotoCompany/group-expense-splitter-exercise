import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator',
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the separator is decorative',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4 w-full">
      <p>Content above the separator</p>
      <Separator />
      <p>Content below the separator</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center gap-4">
      <div>Left content</div>
      <Separator orientation="vertical" />
      <div>Right content</div>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="border rounded-lg p-6 space-y-4 max-w-md">
      <div>
        <h3 className="font-medium">Section 1</h3>
        <p className="text-sm text-muted-foreground">First section content</p>
      </div>
      <Separator />
      <div>
        <h3 className="font-medium">Section 2</h3>
        <p className="text-sm text-muted-foreground">Second section content</p>
      </div>
      <Separator />
      <div>
        <h3 className="font-medium">Section 3</h3>
        <p className="text-sm text-muted-foreground">Third section content</p>
      </div>
    </div>
  ),
};

export const InBalanceCard: Story = {
  render: () => (
    <div className="border rounded-xl p-6 space-y-4 max-w-md bg-green-50 border-green-200">
      <div>
        <h3 className="font-medium text-green-700">Outstanding Balances</h3>
        <p className="text-sm text-green-600">Current amounts owed</p>
      </div>
      <Separator className="bg-green-200" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Alice → Bob</span>
          <span className="font-medium">$45.50</span>
        </div>
        <Separator className="bg-green-200" />
        <div className="flex justify-between">
          <span>Charlie → Alice</span>
          <span className="font-medium">$23.00</span>
        </div>
      </div>
    </div>
  ),
};

export const InMenu: Story = {
  render: () => (
    <div className="border rounded-md p-2 w-48 space-y-1">
      <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
        Profile
      </button>
      <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
        Settings
      </button>
      <Separator className="my-1" />
      <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
        Help
      </button>
      <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
        About
      </button>
      <Separator className="my-1" />
      <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-red-600">
        Logout
      </button>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <p>Section 1</p>
      <div className="relative">
        <Separator />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
          <span className="text-xs text-muted-foreground">OR</span>
        </div>
      </div>
      <p>Section 2</p>
    </div>
  ),
};
