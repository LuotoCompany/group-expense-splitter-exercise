# Task 04: Balance Calculation & Display

## Objective
Display calculated balances showing who owes money to whom, using expenses and settlements data.

## What to Deliver

### Frontend Integration
- Use existing `calculateBalances` function from `frontend/lib/calculations.ts`
- Fetch expenses and settlements from database
- Calculate current balances based on expenses and settlements
- Display balances using BalanceCard components
- Handle "settled up" state when all balances are zero
- Loading and error states

### Balance Display Features
- Show who owes whom and how much
- Group balances by debtor/creditor relationships
- Show "All settled up!" message when no outstanding debts
- Enable settlement action from balance cards (triggers settlement flow)

## Success Criteria
- Balances accurately reflect expenses and settlements
- UI updates when new expenses or settlements are added
- Zero-balance state displays correctly
- Users can initiate settlement from balance display

## Dependencies
- **Requires Task 02** (expenses data)
- **Requires Task 03** (settlements data)
- Cannot be completed until expenses and settlements are available from database

## Notes
- Balance calculation logic already implemented in `frontend/lib/calculations.ts`
- BalanceCard component already exists at `frontend/components/expense/balance-card.tsx`
- Focus on data fetching and integration, calculation logic is done
