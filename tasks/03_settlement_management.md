# Task 03: Settlement Management

## Objective
Implement debt settlement feature: users can record payments between people and view settlement history.

## What to Deliver

### Database Layer
- Settlements table schema with fields: id, fromPersonId, toPersonId, amount, date, createdAt
- Foreign key relationships to people table
- Migration files generated and ready to apply

### Backend Layer
- Server action to add settlement (record payment between two people)
- Server action to list all settlements
- Server action to delete settlement (undo a recorded payment)
- Validation: from and to must be different people
- Validation: amount must be positive
- Validation: from and to must reference valid people
- Error handling for validation failures

### Settlement Dialog Component
- Create new Dialog component for settlement confirmation flow
- Replace browser alert/confirm with custom Dialog
- Show settlement details before confirmation
- Handle settlement creation on confirm

### Frontend Integration
- Wire up BalanceCard component to trigger settlement dialog
- Wire up SettlementHistory component to display past settlements
- Delete functionality for settlements (undo payment)
- Loading and error states

## Success Criteria
- Users can record settlements between two people
- Custom dialog replaces browser alert/confirm
- Users can see settlement history
- Users can delete/undo settlements
- Changes persist to database
- Validation prevents invalid settlements

## Dependencies
- Requires people to exist (references person IDs)
- Can be developed in parallel with Task 01 and 02 using test data

## Notes
- BalanceCard component exists at `frontend/components/expense/balance-card.tsx`
- SettlementHistory component exists at `frontend/components/expense/settlement-history.tsx`
- Settlement dialog component needs to be created using shadcn Dialog from `frontend/components/ui/dialog.tsx`
