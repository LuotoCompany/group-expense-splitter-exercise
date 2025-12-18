import { test, expect } from '@playwright/test';

test.describe('Smoke test', () => {
  test('renders the landing page with track expenses heading', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /track expenses and split them fairly/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /manage people/i })).toBeVisible();
  });
});

