# Task 01: People Management

## Objective
Implement complete people management feature: users can add, view, and delete people in their expense group.

## What to Deliver

### Database Layer
- People table schema with fields: id, name, createdAt
- Migration files generated and ready to apply
- Proper indexing for common queries

### Backend Layer
- Server action to add a new person (with name validation)
- Server action to list all people
- Server action to delete a person (handle foreign key constraints appropriately)
- Error handling for duplicate names, invalid input, and constraint violations

### Frontend Integration
- Wire up PersonManager component to server actions
- Display list of people with delete functionality
- Form to add new people
- Loading and error states

## Success Criteria
- Users can add people with valid names
- Users can see all people in their group
- Users can delete people (with appropriate handling of related expenses/settlements)
- Changes persist to database
- Appropriate error messages for validation failures

## Dependencies
None - can be developed in parallel

## Notes
- PersonManager component already exists at `frontend/components/expense/person-manager.tsx`
- Consider cascade deletion strategy for expenses and settlements referencing deleted people
