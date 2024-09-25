import { AppSegmentConfigSchema } from './app-segment-config'

describe('AppConfigSchema', () => {
  it('should only support zero, a positive number or false for revalidate', () => {
    const valid = [0, 1, 100, false]

    for (const value of valid) {
      expect(
        AppSegmentConfigSchema.safeParse({ revalidate: value }).success
      ).toBe(true)
    }

    const invalid = [-1, -100, true]

    for (const value of invalid) {
      expect(
        AppSegmentConfigSchema.safeParse({ revalidate: value }).success
      ).toBe(false)
    }
  })

  it('should support an empty config', () => {
    expect(AppSegmentConfigSchema.safeParse({}).success).toBe(true)
  })

  it('should support a boolean for dynamicParams', () => {
    expect(
      AppSegmentConfigSchema.safeParse({ dynamicParams: true }).success
    ).toBe(true)
    expect(
      AppSegmentConfigSchema.safeParse({ dynamicParams: false }).success
    ).toBe(true)
    expect(
      AppSegmentConfigSchema.safeParse({ dynamicParams: 'foo' }).success
    ).toBe(false)
  })

  it('should support "auto" | "force-dynamic" | "error" | "force-static" for dynamic', () => {
    expect(AppSegmentConfigSchema.safeParse({ dynamic: 'auto' }).success).toBe(
      true
    )
    expect(
      AppSegmentConfigSchema.safeParse({ dynamic: 'force-dynamic' }).success
    ).toBe(true)
    expect(AppSegmentConfigSchema.safeParse({ dynamic: 'error' }).success).toBe(
      true
    )
    expect(
      AppSegmentConfigSchema.safeParse({ dynamic: 'force-static' }).success
    ).toBe(true)
  })

  it('should support "edge" | "nodejs" for runtime', () => {
    expect(AppSegmentConfigSchema.safeParse({ runtime: 'edge' }).success).toBe(
      true
    )
    expect(
      AppSegmentConfigSchema.safeParse({ runtime: 'nodejs' }).success
    ).toBe(true)
    expect(AppSegmentConfigSchema.safeParse({ runtime: 'foo' }).success).toBe(
      false
    )
  })

  it('should support a positive number or zero for maxDuration', () => {
    expect(AppSegmentConfigSchema.safeParse({ maxDuration: 0 }).success).toBe(
      true
    )
    expect(AppSegmentConfigSchema.safeParse({ maxDuration: 100 }).success).toBe(
      true
    )
    expect(AppSegmentConfigSchema.safeParse({ maxDuration: -1 }).success).toBe(
      false
    )
  })

  it('should support "force-cache" | "only-cache" for fetchCache', () => {
    expect(
      AppSegmentConfigSchema.safeParse({ fetchCache: 'force-cache' }).success
    ).toBe(true)
    expect(
      AppSegmentConfigSchema.safeParse({ fetchCache: 'only-cache' }).success
    ).toBe(true)
    expect(
      AppSegmentConfigSchema.safeParse({ fetchCache: 'foo' }).success
    ).toBe(false)
  })

  it('should support a string or an array of strings for preferredRegion', () => {
    expect(
      AppSegmentConfigSchema.safeParse({ preferredRegion: 'foo' }).success
    ).toBe(true)
    expect(
      AppSegmentConfigSchema.safeParse({ preferredRegion: ['foo', 'bar'] })
        .success
    ).toBe(true)
  })

  it('should support a boolean for experimental_ppr', () => {
    expect(
      AppSegmentConfigSchema.safeParse({ experimental_ppr: true }).success
    ).toBe(true)
    expect(
      AppSegmentConfigSchema.safeParse({ experimental_ppr: false }).success
    ).toBe(true)
    expect(
      AppSegmentConfigSchema.safeParse({ experimental_ppr: 'foo' }).success
    ).toBe(false)
  })
})
