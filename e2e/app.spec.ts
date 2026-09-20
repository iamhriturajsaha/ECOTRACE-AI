import { test, expect } from '@playwright/test';

test('homepage has correct title and CTA', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/EcoTrace AI/);

  // Expect the CTA button to be visible
  const getStartedButton = page.getByRole('button', { name: /Calculate Footprint/i });
  await expect(getStartedButton).toBeVisible();
});

test('navigation links work', async ({ page }) => {
  await page.goto('/');

  // Click on "Log In"
  await page.getByRole('link', { name: /Log In/i }).click();

  // Expect URL to have auth/signin
  await expect(page).toHaveURL(/.*auth\/signin/);
});
