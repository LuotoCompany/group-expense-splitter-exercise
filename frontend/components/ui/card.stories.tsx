import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from './card';
import { Button } from './button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardContent>
        This is a basic card
      </CardContent>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is the main body of the card.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with Footer</CardTitle>
        <CardDescription>This card has a footer with actions</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>This card has an action button in the header</CardDescription>
        <CardAction>
          <Button size="sm" variant="ghost">Edit</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>The action button appears in the top-right corner of the header.</p>
      </CardContent>
    </Card>
  ),
};

export const ExpenseCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Dinner at Restaurant</CardTitle>
        <CardDescription>Paid by Alice on Nov 19, 2024</CardDescription>
        <CardAction>
          <Button size="sm" variant="destructive">Delete</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="font-medium">$150.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Split between:</span>
            <span>Alice, Bob, Charlie</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const BalanceCard: Story = {
  render: () => (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-700">Alice owes Bob</CardTitle>
        <CardDescription>Outstanding balance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-green-600">$45.50</div>
      </CardContent>
      <CardFooter>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Settle Up
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>First card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the first card.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Second card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the second card.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
          <CardDescription>Third card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the third card.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 4</CardTitle>
          <CardDescription>Fourth card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the fourth card.</p>
        </CardContent>
      </Card>
    </div>
  ),
};
