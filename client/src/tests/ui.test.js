const { test, expect } = require('@playwright/test');

test.describe('Item Manager UI Tests', () => {
  let itemName;
  let itemDescription;

  const generateUniqueIdentifier = () => Date.now().toString();

  test.beforeEach(async ({ page }) => {
    // Generate unique names for each test
    const uniqueIdentifier = generateUniqueIdentifier();
    itemName = `Test Item ${uniqueIdentifier}`;
    itemDescription = `Test Description ${uniqueIdentifier}`;
  });

  test.afterEach(async ({ page }) => {
    await page.goto('http://localhost:3000/item-list');
    await page.waitForTimeout(500); 
  
    let itemsToDelete = page.locator(`text=${itemName}`);
    let itemCount = await itemsToDelete.count();
  
    for (let i = 0; i < itemCount; i++) {

      const item = itemsToDelete.nth(i);
      const editLink = item.locator('a:has-text("Edit")').first();
      await editLink.click();

      await page.waitForSelector('button:has-text("Delete Item")');
      const deleteButton = page.locator('button:has-text("Delete Item")');
      await deleteButton.click();
  
      await page.waitForTimeout(500); 
    }
  
    // Verify that the item has been deleted
    await page.goto('http://localhost:3000/item-list');
    await page.waitForTimeout(500); 
    const remainingItems = page.locator(`text=${itemName}`);
    expect(await remainingItems.count()).toBe(0);
  });

  // Add a new item test
  test('Add a new item', async ({ page }) => {
    await page.goto('http://localhost:3000/add-item');
    await page.waitForTimeout(500); 

    // Fill out the form and submit
    await page.fill('input[placeholder="Item name"]', itemName);
    await page.fill('textarea[placeholder="Item description"]', itemDescription);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500); 

    // Verify item is added to the list
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(500); 
    const itemText = await page.textContent(`text=${itemName}`);
    expect(itemText).toContain(itemName);
  });

  // Delete the newly added item test
  test('Delete the newly added item', async ({ page }) => {
    await page.goto('http://localhost:3000/add-item');
    await page.waitForTimeout(500); 

    await page.fill('input[placeholder="Item name"]', itemName);
    await page.fill('textarea[placeholder="Item description"]', itemDescription);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500); 

    // Go to the item list page
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(500); 

    // Ensure the item exists
    const itemLocator = page.locator(`text=${itemName}`);
    await expect(itemLocator).toBeVisible();

    // Click the "Edit" link and then delete the item
    const editLink = itemLocator.locator('a:has-text("Edit")').first();
    await editLink.click();
    await page.waitForSelector('button:has-text("Delete Item")'); 
    const deleteButton = page.locator('button:has-text("Delete Item")');
    await deleteButton.click();

    // Confirm the item is deleted
    await page.waitForTimeout(500); 
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(500); 
    const remainingItems = page.locator(`text=${itemName}`);
    expect(await remainingItems.count()).toBe(0);
  });

  // Favorite and unfavorite the item test
  test('Favorite and unfavorite the item', async ({ page }) => {
    await page.goto('http://localhost:3000/add-item');
    await page.waitForTimeout(500); 

    await page.fill('input[placeholder="Item name"]', itemName);
    await page.fill('textarea[placeholder="Item description"]', itemDescription);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500); 

    // Locate the favorite button and click it
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(500); 
    const favoriteButton = page.locator(`text=${itemName}`).locator('button:has-text("☆")').first();
    await favoriteButton.click();
    await page.waitForTimeout(500); 

    // Verify the item is added to favorites
    await page.goto('http://localhost:3000/favorites');
    await page.waitForTimeout(500); 
    const favoriteItem = await page.locator(`text=${itemName}`);
    expect(await favoriteItem.count()).toBeGreaterThan(0);

    // Unfavorite the item
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(500); 
    const unfavoriteButton = page.locator(`text=${itemName}`).locator('button:has-text("⭐")').first();
    await unfavoriteButton.click();
    await page.waitForTimeout(500); 

    // Verify the item is removed from favorites
    await page.goto('http://localhost:3000/favorites');
    await page.waitForTimeout(500); 
    const favoriteItemsAfterUnfavorite = await page.locator(`text=${itemName}`);
    expect(await favoriteItemsAfterUnfavorite.count()).toBe(0);
  });

  // Search for the item test
  test('Search for the item', async ({ page }) => {
    await page.goto('http://localhost:3000/add-item');
    await page.waitForTimeout(500); 

    await page.fill('input[placeholder="Item name"]', itemName);
    await page.fill('textarea[placeholder="Item description"]', itemDescription);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500); 

    // Perform search
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(500); 
    await page.fill('input[placeholder="Search items"]', itemName);
    await page.waitForTimeout(500); 

    const searchResults = await page.locator(`text=${itemName}`);
    expect(await searchResults.count()).toBe(1);
  });
});
