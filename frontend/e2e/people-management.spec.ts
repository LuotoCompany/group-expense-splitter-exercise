import { test, expect } from '@playwright/test';

// Generate unique test ID to avoid conflicts between test runs
const uniqueId = () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

// Helper function to add a person
async function addPerson(page: any, name: string) {
  const nameInput = page.getByPlaceholder(/enter name/i);
  await nameInput.fill(name);
  
  // Press Enter instead of clicking the button to avoid viewport issues
  await nameInput.press('Enter');
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
    
    // Verify person was added - look specifically in the dialog for the person card
    await expect(page.getByRole('dialog').getByText(name).first()).toBeVisible();
  });

  test('should add multiple people', async ({ page }) => {
    const names = [uniqueId(), uniqueId(), uniqueId()];
    
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add all people
    for (const name of names) {
      await addPerson(page, name);
      await expect(page.getByRole('dialog').getByText(name).first()).toBeVisible();
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
    await expect(page.getByRole('dialog').getByText(name).first()).toBeVisible();
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
    await expect(page.getByRole('dialog').getByText(name).first()).toBeVisible();
    
    // Try to add duplicate by pressing Enter
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill(name);
    await nameInput.press('Enter');
    
    // Verify error message
    await expect(page.getByText(/person with this name already exists/i)).toBeVisible();
  });

  test('should delete a person', async ({ page }) => {
    const name = uniqueId();
    
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add a person
    await addPerson(page, name);
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText(name).first()).toBeVisible();
    
    // Wait for any transitions
    await page.waitForTimeout(500);
    
    // Find the person card - it's a div with class "group" containing the person's name
    const personCard = dialog.locator('.group', { hasText: name }).first();
    
    // Hover over the card to reveal the delete button
    await personCard.hover();
    await page.waitForTimeout(300);
    
    // Click the delete button using the title attribute
    const deleteButton = personCard.locator('button[title="Remove person"]');
    await deleteButton.click({ force: true });
    
    // Verify person was deleted - wait a bit for the deletion to process
    await page.waitForTimeout(500);
    await expect(dialog.locator('.group', { hasText: name })).not.toBeVisible();
  });

  test('should clear input field after adding person', async ({ page }) => {
    const name = uniqueId();
    
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add a person
    await addPerson(page, name);
    await expect(page.getByRole('dialog').getByText(name).first()).toBeVisible();
    
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
    await expect(page.getByRole('dialog').getByText(name).first()).toBeVisible();
    
    // Close dialog (click outside or ESC)
    await page.keyboard.press('Escape');
    
    // Verify dialog is closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Reopen dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Verify person is still there
    await expect(page.getByRole('dialog').getByText(name).first()).toBeVisible();
  });
});
