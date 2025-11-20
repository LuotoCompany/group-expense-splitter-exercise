# Task: Extract UI Components from Prototype

## Objective
Migrate presentation components from `ui-proto/` to `frontend/components/` with Storybook stories for visual quality assurance.

## Prerequisites
- Storybook configured and running
- Core UI dependencies installed (see Dependencies section)

## Dependencies to Install

### Core Utilities
```bash
cd frontend
pnpm add lucide-react class-variance-authority clsx tailwind-merge
```

### Radix UI Primitives (Essential Set)
```bash
pnpm add @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-select
pnpm add @radix-ui/react-dialog @radix-ui/react-separator
```

### Optional (Install as needed)
```bash
pnpm add @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-checkbox
pnpm add @radix-ui/react-tabs @radix-ui/react-dropdown-menu
pnpm add sonner  # For toast notifications (better than alert())
```

## Migration Steps

### Phase 1: Foundation (Critical Path)

#### 1.1 Create lib/utils.ts
Copy from: `ui-proto/src/components/ui/utils.ts`
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### 1.2 Create lib/types.ts
Extract from: `ui-proto/src/App.tsx`
```typescript
export interface Person {
  id: string;
  name: string;
}

export interface Split {
  personId: string;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  totalAmount: number;
  paidBy: string;
  splits: Split[];
  date: Date;
  receiptImage?: string;
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: Date;
}
```

#### 1.3 Update globals.css with Theme Tokens
Add indigo color palette and other tokens from `ui-proto/src/index.css`:
```css
@theme inline {
  --color-indigo-50: oklch(.962 .018 272.314);
  --color-indigo-100: oklch(.93 .034 272.788);
  --color-indigo-200: oklch(.87 .065 274.039);
  --color-indigo-300: oklch(.785 .115 274.713);
  --color-indigo-400: oklch(.673 .182 276.935);
  --color-indigo-500: oklch(.585 .233 277.117);
  --color-indigo-600: oklch(.511 .262 276.966);
  --color-indigo-700: oklch(.457 .24 277.023);
  --color-indigo-900: oklch(.359 .144 278.697);
  /* Add gray, green, red palettes as needed */
}
```

### Phase 2: Shadcn/UI Components

#### 2.1 Essential Components to Migrate
Copy these from `ui-proto/src/components/ui/` to `frontend/components/ui/`:

**Priority 1 (Immediate Need):**
1. `button.tsx` - Universal component
2. `input.tsx` - Form inputs
3. `label.tsx` - Form labels
4. `card.tsx` - Layout containers
5. `select.tsx` - Dropdowns
6. `dialog.tsx` - Modals

**Priority 2 (Enhanced UX):**
7. `separator.tsx` - Visual dividers
8. `sonner.tsx` - Toast notifications (optional: requires sonner package)

#### 2.2 Post-Migration Updates
For each copied file:
- Ensure `"use client"` directive is present at top
- Update imports to remove version specifiers (e.g., `@radix-ui/react-slot@1.1.2` → `@radix-ui/react-slot`)
- Verify `cn()` imports point to `@/lib/utils`

### Phase 3: Domain Component Extraction

#### 3.1 Create lib/calculations.ts
Extract from: `ui-proto/src/components/BalanceSummary.tsx`
```typescript
import type { Person, Expense, Settlement } from './types';

export function calculateBalances(
  expenses: Expense[],
  people: Person[],
  settlements: Settlement[]
): Array<{ from: string; to: string; amount: number }> {
  // Copy calculateBalances function logic
}
```

#### 3.2 Create components/expense/ Directory Structure
```
frontend/components/expense/
├── expense-card.tsx          # Display single expense
├── expense-card.stories.tsx
├── balance-card.tsx          # Balance display UI
├── balance-card.stories.tsx
├── settlement-history.tsx    # Settlement list
├── settlement-history.stories.tsx
├── receipt-modal.tsx         # Full-size receipt viewer
├── receipt-modal.stories.tsx
├── person-manager.tsx        # Add/remove people
├── person-manager.stories.tsx
└── add-expense-form.tsx      # Main expense form
    └── add-expense-form.stories.tsx
```

#### 3.3 Component Extraction Details

**ExpenseCard** (from ExpenseList.tsx):
- Props: `expense: Expense`, `people: Person[]`, `onDelete: (id: string) => void`, `onReceiptClick?: (image: string) => void`
- UI: Single expense card with delete button and receipt thumbnail
- Story: Show with/without receipt, different amounts, multiple splits

**BalanceCard** (from BalanceSummary.tsx):
- Props: `balance: { from: string; to: string; amount: number }`, `onSettle: () => void`
- UI: Display "X owes Y $Z" with settle button
- Story: Various amounts, different people names, settled state

**SettlementHistory** (from BalanceSummary.tsx):
- Props: `settlements: Settlement[]`, `people: Person[]`, `onDelete: (id: string) => void`
- UI: List of past settlements with delete option
- Story: Empty state, single settlement, multiple settlements

**ReceiptModal** (from ExpenseList.tsx):
- Props: `isOpen: boolean`, `receiptImage: string | null`, `onClose: () => void`
- UI: Full-screen modal with receipt image using shadcn dialog
- Story: Open/closed states, different image sizes

**PersonManager**:
- Props: `people: Person[]`, `onAdd: (name: string) => void`, `onRemove?: (id: string) => void`
- UI: List of people with add form
- Story: Empty, single person, multiple people, with/without remove

**AddExpenseForm** (from AddExpense.tsx):
- Props: `people: Person[]`, `onSubmit: (expense) => void`, `onAddPerson: (name: string) => void`
- UI: Full expense form with all fields, validation, split management
- Extract validation logic to `lib/validations.ts`
- Story: Empty form, partially filled, with validation errors, with receipt

### Phase 4: Create Storybook Stories

#### 4.1 Story Template
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './component-name';

const meta: Meta<typeof ComponentName> = {
  title: 'Expense/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    // Define controls
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const Variant: Story = {
  args: {
    // Variant props
  },
};
```

#### 4.2 Stories to Create
Each component needs:
- **Default** - Standard usage
- **Edge Cases** - Empty states, long text, large numbers
- **Variants** - All possible prop combinations
- **Interactive** - Demonstrate callbacks and state changes

### Phase 5: Validation & Testing

#### 5.1 Visual Regression Checklist
- [ ] All components render in Storybook without errors
- [ ] Tailwind styles match ui-proto design
- [ ] Responsive layouts work (mobile, tablet, desktop)
- [ ] Interactive elements respond to clicks
- [ ] Forms show validation states
- [ ] Colors match theme tokens (indigo palette)

#### 5.2 Component API Checklist
For each component:
- [ ] Props are typed with TypeScript interfaces
- [ ] Required vs optional props clearly marked
- [ ] Callback props follow naming convention (onAction)
- [ ] Components are "use client" if interactive
- [ ] No business logic in presentation components
- [ ] Reusable and composable

#### 5.3 Documentation Checklist
- [ ] Each component has JSDoc comments
- [ ] Storybook stories demonstrate all use cases
- [ ] Props table auto-generated in Storybook
- [ ] Examples show typical usage patterns

## File Checklist

### Files to Create
- [ ] `frontend/lib/utils.ts`
- [ ] `frontend/lib/types.ts`
- [ ] `frontend/lib/calculations.ts`
- [ ] `frontend/lib/validations.ts`
- [ ] `frontend/components/ui/button.tsx` + story
- [ ] `frontend/components/ui/input.tsx` + story
- [ ] `frontend/components/ui/label.tsx` + story
- [ ] `frontend/components/ui/card.tsx` + story
- [ ] `frontend/components/ui/select.tsx` + story
- [ ] `frontend/components/ui/dialog.tsx` + story
- [ ] `frontend/components/ui/separator.tsx` + story
- [ ] `frontend/components/expense/expense-card.tsx` + story
- [ ] `frontend/components/expense/balance-card.tsx` + story
- [ ] `frontend/components/expense/settlement-history.tsx` + story
- [ ] `frontend/components/expense/receipt-modal.tsx` + story
- [ ] `frontend/components/expense/person-manager.tsx` + story
- [ ] `frontend/components/expense/add-expense-form.tsx` + story

### Files to Update
- [ ] `frontend/app/globals.css` - Add theme tokens
- [ ] `frontend/package.json` - Dependencies installed

## Success Criteria
- [ ] All dependencies installed without conflicts
- [ ] 6+ shadcn/ui components migrated and working
- [ ] 6 domain components extracted with clear prop APIs
- [ ] All components have Storybook stories
- [ ] Storybook shows all components rendering correctly
- [ ] No TypeScript errors in `pnpm tsc --noEmit`
- [ ] Visual consistency with ui-proto design maintained
- [ ] Components are presentation-only (no data fetching or mutations)

## Estimated Effort
- Phase 1 (Foundation): 1-2 hours
- Phase 2 (Shadcn/UI): 2-3 hours  
- Phase 3 (Domain Components): 4-6 hours
- Phase 4 (Stories): 2-3 hours
- Phase 5 (Testing): 1-2 hours
- **Total: 10-16 hours**

## Notes
- Start with Phase 1 foundation before proceeding
- Test each component in Storybook immediately after creation
- Keep business logic separate from presentation
- Follow existing ui-proto design patterns for visual consistency
- Use shadcn/ui components instead of raw HTML where possible
