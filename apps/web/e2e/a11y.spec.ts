import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// WCAG 2.0, 2.1 and 2.2 — levels A and AA.
const WCAG_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const pages = [{ name: 'Login', path: '/' }]

for (const { name, path } of pages) {
  test(`${name} page has no WCAG 2 AA violations`, async ({ page }, testInfo) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page }).withTags(WCAG_AA_TAGS).analyze()

    await testInfo.attach('axe-results', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    })

    const summary = results.violations.map((violation) => ({
      rule: violation.id,
      impact: violation.impact,
      help: violation.help,
      helpUrl: violation.helpUrl,
      targets: violation.nodes.map((node) => node.target.join(' ')),
    }))
    expect(summary).toEqual([])
  })
}
