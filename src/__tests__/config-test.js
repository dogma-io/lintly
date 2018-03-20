import actual from '../config'
import expected from 'eslint-config-lintly'

describe('config', () => {
  it("should re-export eslint-config-lintly's config", () => {
    expect(actual).toBe(expected)
  })
})
