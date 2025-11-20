import { test, expect } from '@playwright/test';

test.describe('Smoke test', () => {
  test('renders the landing page with getting started text', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('To get started');
    await expect(page.getByRole('link', { name: 'Deploy Now' })).toBeVisible();
  });
});

