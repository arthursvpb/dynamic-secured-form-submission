import { test, expect } from '@playwright/test'

test.describe('Form Submission Flow', () => {
  let formToken: string

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    
    await page.goto('/admin')
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.waitForSelector('text=Create New Form')
    await page.click('text=Create New Form')

    await page.fill('input[id="formTitle"]', 'E2E Test Form')
    await page.fill('input[placeholder="e.g., Personal Information"]', 'Personal Details')
    await page.fill('input[placeholder="Field label"]', 'Name')

    await page.click('text=Add Field')
    const ageField = page.locator('input[placeholder="Field label"]').nth(1)
    await ageField.fill('Age')
    const ageSelect = page.locator('select.form-input').nth(1)
    await ageSelect.selectOption('number')

    await page.click('text=Add Section')
    const contactSection = page.locator('input[placeholder="e.g., Personal Information"]').nth(1)
    await contactSection.fill('Contact Info')
    
    const emailField = page.locator('.bg-white.rounded-lg.shadow').nth(2).locator('input[placeholder="Field label"]')
    await emailField.fill('Email')

    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)

    const formCard = page.locator('.bg-white.rounded-lg.shadow-md').first()
    const urlInput = formCard.locator('input[readonly]')
    const urlValue = await urlInput.inputValue()
    formToken = urlValue.split('/').pop() || ''

    await context.close()
  })

  test('should access form via secure URL', async ({ page }) => {
    await page.goto(`/form/${formToken}`)

    await expect(page.locator('h1')).toContainText('Form Submission')
    await expect(page.locator('text=Personal Details')).toBeVisible()
    await expect(page.locator('text=Step 1 of 2')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto(`/form/${formToken}`)

    await page.click('button:has-text("Continue")')

    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Age is required')).toBeVisible()
  })

  test('should navigate between form steps', async ({ page }) => {
    await page.goto(`/form/${formToken}`)

    await page.fill('input[type="text"]', 'John Doe')
    await page.fill('input[type="number"]', '30')

    await page.click('button:has-text("Continue")')

    await expect(page.locator('text=Contact Info')).toBeVisible()
    await expect(page.locator('text=Step 2 of 2')).toBeVisible()

    await page.click('button:has-text("Previous")')

    await expect(page.locator('text=Personal Details')).toBeVisible()
    await expect(page.locator('text=Step 1 of 2')).toBeVisible()
  })

  test('should submit form successfully', async ({ page }) => {
    await page.goto(`/form/${formToken}`)

    await page.fill('input[type="text"]', 'Jane Smith')
    await page.fill('input[type="number"]', '25')
    await page.click('button:has-text("Continue")')

    await page.fill('input[type="text"]', 'jane.smith@example.com')
    await page.click('button:has-text("Submit Form")')

    await page.waitForSelector('text=Thank you for your submission!')

    await expect(page.locator('h1')).toHaveText('Thank you for your submission!')
    await expect(page.locator('text=Your information has been successfully submitted')).toBeVisible()
    await expect(page.locator('text=✅')).toBeVisible()
  })

  test('should handle invalid form token', async ({ page }) => {
    await page.goto('/form/invalid-token-123')

    await expect(page.locator('h1')).toHaveText('Form Not Found')
    await expect(page.locator('text=⚠️')).toBeVisible()
  })

  test('should display form validation errors', async ({ page }) => {
    await page.goto(`/form/${formToken}`)

    await page.fill('input[type="text"]', 'Test User')
    await page.click('button:has-text("Continue")')

    await expect(page.locator('text=Age is required')).toBeVisible()

    await page.fill('input[type="number"]', '35')
    await page.click('button:has-text("Continue")')

    await page.click('button:has-text("Submit Form")')

    await expect(page.locator('text=Email is required')).toBeVisible()
  })
}) 