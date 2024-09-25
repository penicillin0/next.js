import { z } from 'next/dist/compiled/zod'

/**
 * The schema for the dynamic behavior of a page.
 */
export const AppSegmentConfigDynamicSchema = z.enum([
  'auto',
  'error',
  'force-static',
  'force-dynamic',
])

/**
 * The dynamic behavior of the page.
 */
export type AppSegmentConfigDynamic = z.infer<
  typeof AppSegmentConfigDynamicSchema
>

/**
 * The schema for configuration for a page.
 */
export const AppSegmentConfigSchema = z.object({
  /**
   * The number of seconds to revalidate the page or false to disable revalidation.
   */
  revalidate: z
    .union([z.number().int().nonnegative(), z.literal(false)])
    .optional(),

  /**
   * Whether the page supports dynamic parameters.
   */
  dynamicParams: z.boolean().optional(),

  /**
   * The dynamic behavior of the page.
   */
  dynamic: AppSegmentConfigDynamicSchema.optional(),

  /**
   * The caching behavior of the page.
   */
  fetchCache: z.enum(['force-cache', 'only-cache']).optional(),

  /**
   * The preferred region for the page.
   */
  preferredRegion: z.union([z.string(), z.array(z.string())]).optional(),

  /**
   * Whether the page supports partial prerendering. When true, the page will be
   * served using partial prerendering. This setting will only take affect if
   * it's enabled via the `experimental.ppr = "incremental"` option.
   */
  experimental_ppr: z.boolean().optional(),

  /**
   * The runtime to use for the page.
   */
  runtime: z.enum(['edge', 'nodejs']).optional(),

  /**
   * The maximum duration for the page in seconds.
   */
  maxDuration: z.number().int().nonnegative().optional(),
})

/**
 * The configuration for a page.
 */
export type AppSegmentConfig = z.infer<typeof AppSegmentConfigSchema>

export const AppSegmentConfigSchemaKeys = AppSegmentConfigSchema.keyof().options
