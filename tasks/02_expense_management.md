# Task 02: Expense Management

## Objective
Implement complete expense tracking feature: users can add, view, and delete expenses with split amounts.

## What to Deliver

### Database Layer
- Expenses table schema with fields: id, description, totalAmount, paidBy, date, createdAt
- Splits table schema with fields: id, expenseId, personId, amount
- Foreign key relationships between expenses, people, and splits
- Migration files generated and ready to apply

### Backend Layer
- Server action to add expense with multiple splits (transactional)
- Server action to list all expenses with their splits
- Server action to delete expense (cascade delete splits)
- Validation: splits must sum to total amount (within 0.01 tolerance)
- Validation: paidBy must reference valid person
- Error handling for validation failures

### Validation Library
- Create `frontend/lib/validations.ts`
- Extract and refine split validation logic from AddExpenseForm
- Reusable validation functions for both client and server

### Frontend Integration
- Wire up AddExpenseForm component to server actions
- Wire up ExpenseCard component to display expenses
- Delete functionality on expense cards
- Loading and error states

## Success Criteria
- Users can add expenses with valid splits
- Validation ensures splits sum to total amount
- Users can see all expenses with split details
- Users can delete expenses
- Changes persist to database
- Both client-side and server-side validation work

## Dependencies
- Requires people to exist (references person IDs)
- Can be developed in parallel with Task 01 using test data

## Notes
- AddExpenseForm component exists at `frontend/components/expense/add-expense-form.tsx`
- ExpenseCard component exists at `frontend/components/expense/expense-card.tsx`
- Receipt upload feature is explicitly deferred to future task
