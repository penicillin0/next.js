import type { StaticGenerationStore } from '../../client/components/static-generation-async-storage.external'

/** Run a callback, and execute any *new* revalidations added during its runtime. */
export async function withExecuteRevalidates<T>(
  store: StaticGenerationStore | undefined,
  callback: () => Promise<T>
): Promise<T> {
  if (!store) {
    return callback()
  }
  // If we executed any revalidates during the request, then we don't want to execute them again.
  // save the state so we can check if anything changed after we're done running callbacks.
  const savedRevalidationState = cloneRevalidationState(store)
  try {
    return await callback()
  } finally {
    // Check if we have any new revalidates, and if so, wait until they are all resolved.
    const newRevalidates = diffRevalidationState(
      savedRevalidationState,
      cloneRevalidationState(store)
    )
    await executeRevalidates(store, newRevalidates)
  }
}

type RevalidationState = Required<
  Pick<StaticGenerationStore, 'revalidatedTags' | 'pendingRevalidates'>
>

function cloneRevalidationState(
  store: StaticGenerationStore
): RevalidationState {
  return {
    revalidatedTags: store.revalidatedTags ? [...store.revalidatedTags] : [],
    pendingRevalidates: { ...store.pendingRevalidates },
  }
}

function diffRevalidationState(
  prev: RevalidationState,
  curr: RevalidationState
): RevalidationState {
  const prevTags = new Set(prev.revalidatedTags)
  return {
    revalidatedTags: curr.revalidatedTags.filter((tag) => !prevTags.has(tag)),
    pendingRevalidates: Object.fromEntries(
      Object.entries(curr.pendingRevalidates).filter(
        ([key]) => !(key in prev.pendingRevalidates)
      )
    ),
  }
}

async function executeRevalidates(
  staticGenerationStore: StaticGenerationStore,
  { revalidatedTags, pendingRevalidates }: RevalidationState
) {
  return Promise.all([
    staticGenerationStore.incrementalCache?.revalidateTag(revalidatedTags),
    ...Object.values(pendingRevalidates),
  ])
}
