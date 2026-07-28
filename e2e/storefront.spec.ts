import { test, expect, type Page } from '@playwright/test';

const productCards = (page: Page) => page.locator('a[href^="/products/"]');

test('homepage lists products', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(productCards(page).first()).toBeVisible();
});

test('clicking a product opens its detail page', async ({ page }) => {
  await page.goto('/');
  const firstProduct = productCards(page).first();
  const name = (await firstProduct.locator('h2').textContent())?.trim() ?? '';

  await firstProduct.click();

  await expect(page).toHaveURL(/\/products\//);
  await expect(page.getByRole('heading', { name })).toBeVisible();
});

test('unknown product slug returns 404', async ({ page }) => {
  const response = await page.goto('/products/definitely-not-real');
  expect(response?.status()).toBe(404);
});
