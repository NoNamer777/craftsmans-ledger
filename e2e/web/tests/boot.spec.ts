import { expect, test } from '@playwright/test';

test('loads the app shell', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Web');
    await expect(page.locator('h1')).toContainText('Hello, web');
});
