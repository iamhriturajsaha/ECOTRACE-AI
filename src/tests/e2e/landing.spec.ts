import { test, expect } from '@playwright/test';

test('landing page renders correctly', async ({ page }) => {
  await page.goto('/');

  // Check the title
  await expect(page).toHaveTitle(/EcoTrace/);

  // Check the main headline for Problem Statement Alignment
  const heading = page.locator('h1');
  await expect(heading).toContainText('Your Carbon Footprint');

  // Verify Sign In link exists
  const signInLink = page.getByRole('link', { name: /Sign In/i });
  await expect(signInLink).toBeVisible();
});
