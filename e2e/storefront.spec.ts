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

test('shop filters by category from the URL', async ({ page }) => {
  await page.goto('/shop?category=mochi');

  await expect(page.getByRole('heading', { name: 'Treat Shop' })).toBeVisible();
  await expect(productCards(page)).toHaveCount(5);
  await expect(page.getByText('5 delicious things')).toBeVisible();
});

test('category cards on the home page link into the shop', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Mochi/ }).first().click();

  await expect(page).toHaveURL(/\/shop\?category=mochi/);
});

test('product detail shows the buy box and related items', async ({ page }) => {
  await page.goto('/products/matcha-mochi');

  await expect(
    page.getByRole('heading', { name: 'Matcha Mochi' }),
  ).toBeVisible();
  await expect(page.getByText('hand-made today')).toBeVisible();
  await expect(page.getByText('matcha flavor')).toBeVisible();
  await expect(page.getByLabel('Increase quantity')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'More like this' }),
  ).toBeVisible();
});

test('empty basket shows a designed state', async ({ page }) => {
  await page.goto('/cart');

  await expect(
    page.getByRole('heading', { name: 'Your Basket', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Your basket is empty')).toBeVisible();
  await expect(page.getByRole('link', { name: /Browse treats/ })).toBeVisible();
});

test('adding a treat puts it in the basket', async ({ page }) => {
  await page.goto('/products/peach-macaron');
  await page.getByRole('button', { name: /Add 1 to basket/ }).click();

  await expect(
    page.getByRole('link', { name: /Basket, 1 item/ }),
  ).toBeVisible();

  await page.goto('/cart');
  await expect(page.getByText('Peach Macaron')).toBeVisible();
  await expect(page.getByText('Subtotal (1 item)')).toBeVisible();
});

test('guest can check out and place an order', async ({ page }) => {
  await page.goto('/products/custard-taiyaki');
  await page.getByRole('button', { name: /Add 1 to basket/ }).click();
  await expect(
    page.getByRole('link', { name: /Basket, 1 item/ }),
  ).toBeVisible();

  await page.goto('/cart');
  await page.getByRole('link', { name: 'Checkout →' }).click();
  await expect(page).toHaveURL(/\/checkout/);

  await page.getByLabel('your name').fill('Playwright Tester');
  await page.getByRole('radio', { name: /Pickup/ }).click();

  await page.getByLabel('Promo code').fill('pixel15');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByText('Promo PIXEL15 (–15%)')).toBeVisible();

  await page.getByRole('button', { name: /Place order/ }).click();

  await expect(page).toHaveURL(/\/checkout\/done\?order=SN-/);
  await expect(
    page.getByRole('heading', { name: 'Order placed!' }),
  ).toBeVisible();
  await expect(page.getByText(/#SN-/)).toBeVisible();

  await expect(page.getByRole('link', { name: 'Basket, empty' })).toBeVisible();
});

test('checkout with an empty basket bounces back to the cart', async ({
  page,
}) => {
  await page.goto('/checkout');
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.getByText('Your basket is empty')).toBeVisible();
});
