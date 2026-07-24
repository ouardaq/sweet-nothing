import { test, expect } from '@playwright/test';

test('homepage lists products', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Sweet Nothing' }),
  ).toBeVisible();
  await expect(page.getByRole('link')).not.toHaveCount(0);
});

test('clicking a product opens its detail page', async ({ page }) => {
  await page.goto('/');
  const firstProduct = page.getByRole('link').first();
  const name = (await firstProduct.locator('h2').textContent())?.trim() ?? '';

  await firstProduct.click();

  await expect(page).toHaveURL(/\/products\//);
  await expect(page.getByRole('heading', { name })).toBeVisible();
});

test('unknown product slug returns 404', async ({ page }) => {
  const response = await page.goto('/products/definitely-not-real');
  expect(response?.status()).toBe(404);
});
