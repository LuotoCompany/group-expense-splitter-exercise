# Task 05: Main Application Integration

## Objective
Compose all features into the main application page with proper data fetching, loading states, and error handling.

## What to Deliver

### Main Page Implementation
- Update `frontend/app/page.tsx` from Next.js boilerplate to full expense tracker app
- Server-side data fetching for people, expenses, and settlements
- Compose all feature components into cohesive layout
- Maintain responsive grid layout matching ui-proto design

### Application Structure
- Layout sections:
  - People management (add/remove people)
  - Add expense form
  - Balance summary (who owes whom)
  - Expense list
  - Settlement history
- Proper component composition matching ui-proto visual hierarchy

### Loading & Error States
- Add Suspense boundaries for data fetching
- Loading states for async operations
- Error boundaries for error handling
- User-friendly error messages

### Data Flow
- Server components fetch initial data
- Server actions handle mutations
- Path revalidation after mutations
- Consistent data across all components

## Success Criteria
- Application loads with all data from database
- All features work together seamlessly
- Responsive layout works on mobile and desktop
- Loading states show during data fetching
- Errors display user-friendly messages
- Visual design matches ui-proto reference

## Dependencies
- **Requires Task 01** (people management)
- **Requires Task 02** (expense management)
- **Requires Task 03** (settlement management)
- **Requires Task 04** (balance display)
- Must be completed last after all other tasks

## Notes
- Reference ui-proto/src/App.tsx for layout and component composition
- All individual components are already extracted and tested in Storybook
- Focus on composition, data flow, and user experience
- Keep Tailwind class patterns from ui-proto for visual consistency
