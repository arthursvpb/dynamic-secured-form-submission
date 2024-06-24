import { test, expect } from '@playwright/test'

test.describe('Admin Flow', () => {
  test('should login as admin and create a form', async ({ page }) => {
    await page.goto('/admin')

    await expect(page.locator('h2')).toHaveText('Admin Login')

    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'password123')
    
    await page.click('button[type="submit"]')

    await expect(page.locator('h1')).toHaveText('Admin Dashboard')
    
    await page.click('text=Create New Form')

    await expect(page.locator('h1')).toHaveText('Create New Form')

    await page.fill('input[id="formTitle"]', 'Test Resident Form')

    await page.fill('input[placeholder="e.g., Personal Information"]', 'Personal Information')
    
    await page.fill('input[placeholder="Field label"]', 'Full Name')
    
    await page.click('text=Add Field')
    
    const secondFieldInput = page.locator('input[placeholder="Field label"]').nth(1)
    await secondFieldInput.fill('Age')
    
    const secondFieldSelect = page.locator('select.form-input').nth(1)
    await secondFieldSelect.selectOption('number')

    await page.click('text=Add Section')

    const secondSectionNameInput = page.locator('input[placeholder="e.g., Personal Information"]').nth(1)
    await secondSectionNameInput.fill('Contact Information')

    const contactFieldInput = page.locator('.bg-white.rounded-lg.shadow').nth(2).locator('input[placeholder="Field label"]')
    await contactFieldInput.fill('Email Address')

    await page.click('button[type="submit"]')

    await page.waitForTimeout(2000)

    await expect(page.locator('h1')).toHaveText('Admin Dashboard')

    await expect(page.locator('text=Test Resident Form')).toBeVisible()
  })

  test('should generate and copy form URL', async ({ page }) => {
    await page.goto('/admin')
    
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.waitForSelector('text=Create New Form', { timeout: 5000 })

    const formCards = page.locator('.bg-white.rounded-lg.shadow-md')
    
    if (await formCards.count() > 0) {
      const firstFormCard = formCards.first()
      const copyButton = firstFormCard.locator('button:has-text("Copy")')
      
      await copyButton.click()
      
      await expect(copyButton).toHaveText('Copied!')
    }
  })

  test('should logout successfully', async ({ page }) => {
    await page.goto('/admin')
    
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.waitForSelector('h1:has-text("Admin Dashboard")')

    await page.click('text=Logout')

    await expect(page.locator('h2')).toHaveText('Admin Login')
  })
}) 