# Task: Install and Configure Storybook

## Objective
Set up Storybook 8.x for the Next.js 16 App Router frontend to enable visual component development and testing.

## Prerequisites
- Next.js 16.0.3 with App Router
- React 19.2.0
- Tailwind v4 configured
- pnpm package manager

## Steps

### 1. Install Storybook
```bash
cd frontend
pnpm dlx storybook@latest init
```

### 2. Verify Installation
Check that the following files were created:
- `.storybook/main.ts` - Main configuration
- `.storybook/preview.ts` - Global decorators and parameters
- `stories/` directory with example stories

### 3. Configure Storybook for Tailwind
Update `.storybook/preview.ts` to import global styles:
```typescript
import '../app/globals.css';
```

### 4. Configure for Next.js App Router
Ensure `.storybook/main.ts` has:
```typescript
framework: {
  name: '@storybook/nextjs',
  options: {},
}
```

### 5. Add Storybook Scripts
Verify `package.json` has:
```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### 6. Test Installation
```bash
pnpm storybook
```
Should open at http://localhost:6006

## Expected Outcome
- Storybook dev server runs successfully
- Example stories render with Tailwind styles
- Ready to add custom component stories

## Success Criteria
- [ ] Storybook installed without errors
- [ ] Can access Storybook UI at localhost:6006
- [ ] Tailwind styles visible in stories
- [ ] No console errors or warnings
