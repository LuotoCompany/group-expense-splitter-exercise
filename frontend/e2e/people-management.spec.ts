import { test, expect } from '@playwright/test';

// Generate unique test ID to avoid conflicts between test runs
const uniqueId = () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

// Helper function to add a person
async function addPerson(page: any, name: string) {
  const nameInput = page.getByPlaceholder(/enter name/i);
  await nameInput.fill(name);
  
  const addButton = page.getByRole('button', { name: /^add$/i });
  // Wait for button to be visible and stable
  await addButton.waitFor({ state: 'visible' });
  await page.waitForTimeout(500); // Small delay for any animations
  await addButton.click({ force: true }); // Force click to bypass viewport checks
}

test.describe('People Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main page with manage people button', async ({ page }) => {
    // Verify the page title and header
    await expect(page.getByText('Track expenses and split them fairly')).toBeVisible();
    
    // Verify manage people button exists
    const managePeopleButton = page.getByRole('button', { name: /manage people/i });
    await expect(managePeopleButton).toBeVisible();
  });

  test('should open people management dialog', async ({ page }) => {
    // Click manage people button
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Verify dialog is open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Manage People' })).toBeVisible();
    await expect(page.getByText('Add or remove people from your expense group.')).toBeVisible();
  });

  test('should add a new person', async ({ page }) => {
    const name = uniqueId();
    
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add a person
    await addPerson(page, name);
    
    // Verify person was added
    await expect(page.getByText(name)).toBeVisible();
  });

  test('should add multiple people', async ({ page }) => {
    const names = [uniqueId(), uniqueId(), uniqueId()];
    
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add all people
    for (const name of names) {
      await addPerson(page, name);
      await expect(page.getByText(name)).toBeVisible();
    }
  });

  test('should add person using Enter key', async ({ page }) => {
    const name = uniqueId();
    
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add a person using Enter key
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill(name);
    await nameInput.press('Enter');
    
    // Verify person was added
    await expect(page.getByText(name)).toBeVisible();
  });

  test('should not add person with empty name', async ({ page }) => {
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Try to add with empty name
    const addButton = page.getByRole('button', { name: /^add$/i });
    
    // Button should be disabled when input is empty
    await expect(addButton).toBeDisabled();
    
    // Try with spaces only
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill('   ');
    await expect(addButton).toBeDisabled();
  });

  test('should show error for duplicate name', async ({ page }) => {
    const name = uniqueId();
    
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add first person
    await addPerson(page, name);
    await expect(page.getByText(name)).toBeVisible();
    
    // Try to add duplicate
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill(name);
    
    const addButton = page.getByRole('button', { name: /^add$/i });
    await addButton.scrollIntoViewIfNeeded();
    await addButton.click();
    
    // Verify error message
    await expect(page.getByText(/person with this name already exists/i)).toBeVisible();
  });

  test('should delete a person', async ({ page }) => {
    const name = uniqueId();
    
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add a person
    await addPerson(page, name);
    await expect(page.getByText(name)).toBeVisible();
    
    // Find the person card and hover to reveal delete button
    const personCard = page.locator('div', { has: page.getByText(name) }).first();
    await personCard.hover();
    
    // Click delete button
    const deleteButton = personCard.getByRole('button').filter({ hasText: '' }).first(); // Trash icon button
    await deleteButton.click();
    
    // Verify person was deleted
    await expect(page.getByText(name)).not.toBeVisible();
  });

  test('should clear input field after adding person', async ({ page }) => {
    const name = uniqueId();
    
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add a person
    await addPerson(page, name);
    await expect(page.getByText(name)).toBeVisible();
    
    // Verify input field is cleared
    const nameInput = page.getByPlaceholder(/enter name/i);
    await expect(nameInput).toHaveValue('');
  });

  test('should persist people after closing and reopening dialog', async ({ page }) => {
    const name = uniqueId();
    
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add a person
    await addPerson(page, name);
    await expect(page.getByText(name)).toBeVisible();
    
    // Close dialog (click outside or ESC)
    await page.keyboard.press('Escape');
    
    // Verify dialog is closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Reopen dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Verify person is still there
    await expect(page.getByText(name)).toBeVisible();
  });
});
