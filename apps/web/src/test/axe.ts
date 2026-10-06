import axe, { type Result } from 'axe-core'

// WCAG 2.0, 2.1 and 2.2 — levels A and AA (AA includes everything from A).
export const WCAG_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

function formatViolations(violations: Result[]) {
  return violations
    .map((violation) => {
      const targets = violation.nodes
        .map((node) => `    - ${node.target.join(' ')}\n      ${node.failureSummary?.replace(/\n/g, '\n      ')}`)
        .join('\n')
      return `[${violation.impact}] ${violation.id}: ${violation.help}\n  ${violation.helpUrl}\n${targets}`
    })
    .join('\n\n')
}

// jsdom does not compute styles, so axe skips color-contrast here; the
// Playwright suite in e2e/ covers it in a real browser.
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: WCAG_AA_TAGS },
  })
  expect(results.violations, formatViolations(results.violations)).toEqual([])
}
