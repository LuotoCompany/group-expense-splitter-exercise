import { test, expect } from '@playwright/test';

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
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Verify initial state - empty list
    await expect(page.getByText('No people in this group yet')).toBeVisible();
    
    // Add a person
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill('Alice');
    
    await page.getByRole('button', { name: /^add$/i }).click();
    
    // Verify person was added
    await expect(page.getByText('Alice')).toBeVisible();
    await expect(page.getByText('Group Members (1)')).toBeVisible();
    
    // Verify empty state message is gone
    await expect(page.getByText('No people in this group yet')).not.toBeVisible();
  });

  test('should add multiple people', async ({ page }) => {
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add first person
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill('Alice');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Alice')).toBeVisible();
    
    // Add second person
    await nameInput.fill('Bob');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Bob')).toBeVisible();
    
    // Add third person
    await nameInput.fill('Charlie');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Charlie')).toBeVisible();
    
    // Verify count
    await expect(page.getByText('Group Members (3)')).toBeVisible();
  });

  test('should add person using Enter key', async ({ page }) => {
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add a person using Enter key
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill('David');
    await nameInput.press('Enter');
    
    // Verify person was added
    await expect(page.getByText('David')).toBeVisible();
    await expect(page.getByText('Group Members (1)')).toBeVisible();
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
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add first person
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill('Eve');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Eve')).toBeVisible();
    
    // Try to add duplicate
    await nameInput.fill('Eve');
    await page.getByRole('button', { name: /^add$/i }).click();
    
    // Verify error message
    await expect(page.getByText(/person with this name already exists/i)).toBeVisible();
  });

  test('should delete a person', async ({ page }) => {
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add a person
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill('Frank');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Frank')).toBeVisible();
    
    // Hover over the person card to reveal delete button
    const personCard = page.locator('div', { has: page.getByText('Frank') }).first();
    await personCard.hover();
    
    // Click delete button
    const deleteButton = personCard.getByRole('button', { name: /remove frank/i });
    await deleteButton.click();
    
    // Verify person was deleted
    await expect(page.getByText('Frank')).not.toBeVisible();
    await expect(page.getByText('No people in this group yet')).toBeVisible();
  });

  test('should delete one of multiple people', async ({ page }) => {
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add multiple people
    const nameInput = page.getByPlaceholder(/enter name/i);
    
    await nameInput.fill('Grace');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Grace')).toBeVisible();
    
    await nameInput.fill('Henry');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Henry')).toBeVisible();
    
    await nameInput.fill('Ivy');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Ivy')).toBeVisible();
    
    // Delete middle person
    const henryCard = page.locator('div', { has: page.getByText('Henry') }).first();
    await henryCard.hover();
    await henryCard.getByRole('button', { name: /remove henry/i }).click();
    
    // Verify Henry was deleted but others remain
    await expect(page.getByText('Henry')).not.toBeVisible();
    await expect(page.getByText('Grace')).toBeVisible();
    await expect(page.getByText('Ivy')).toBeVisible();
    await expect(page.getByText('Group Members (2)')).toBeVisible();
  });

  test('should persist people after closing and reopening dialog', async ({ page }) => {
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add a person
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill('Jack');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Jack')).toBeVisible();
    
    // Close dialog (click outside or ESC)
    await page.keyboard.press('Escape');
    
    // Verify dialog is closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Verify count is shown on main page
    await expect(page.getByText('1 person in this group')).toBeVisible();
    
    // Reopen dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Verify person is still there
    await expect(page.getByText('Jack')).toBeVisible();
    await expect(page.getByText('Group Members (1)')).toBeVisible();
  });

  test('should clear input field after adding person', async ({ page }) => {
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add a person
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill('Kate');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Kate')).toBeVisible();
    
    // Verify input field is cleared
    await expect(nameInput).toHaveValue('');
  });

  test('should update person count on main page', async ({ page }) => {
    // Initially should show message to add people
    await expect(page.getByText('Add people to start tracking expenses.')).toBeVisible();
    
    // Open manage people dialog
    await page.getByRole('button', { name: /manage people/i }).click();
    
    // Add first person
    const nameInput = page.getByPlaceholder(/enter name/i);
    await nameInput.fill('Leo');
    await page.getByRole('button', { name: /^add$/i }).click();
    
    // Close dialog
    await page.keyboard.press('Escape');
    
    // Verify count on main page
    await expect(page.getByText('1 person in this group')).toBeVisible();
    
    // Add second person
    await page.getByRole('button', { name: /manage people/i }).click();
    await nameInput.fill('Mia');
    await page.getByRole('button', { name: /^add$/i }).click();
    await page.keyboard.press('Escape');
    
    // Verify count updated
    await expect(page.getByText('2 people in this group')).toBeVisible();
  });
});
