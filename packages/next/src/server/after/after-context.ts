import PromiseQueue from 'next/dist/compiled/p-queue'
import {
  requestAsyncStorage,
  type RequestStore,
} from '../../client/components/request-async-storage.external'
import { ResponseCookies } from '../web/spec-extension/cookies'
import type { RequestLifecycleOpts } from '../base-server'
import type { AfterCallback, AfterTask } from './after'
import { InvariantError } from '../../shared/lib/invariant-error'
import { isThenable } from '../../shared/lib/is-thenable'
import { staticGenerationAsyncStorage } from '../../client/components/static-generation-async-storage.external'
import { withExecuteRevalidates } from './revalidation-utils'

export type AfterContextOpts = {
  waitUntil: RequestLifecycleOpts['waitUntil'] | undefined
  onClose: RequestLifecycleOpts['onClose'] | undefined
}

export class AfterContext {
  private waitUntil: RequestLifecycleOpts['waitUntil'] | undefined
  private onClose: RequestLifecycleOpts['onClose'] | undefined

  private requestStore: RequestStore | undefined

  private runCallbacksOnClosePromise: Promise<void> | undefined
  private callbackQueue: PromiseQueue

  constructor({ waitUntil, onClose }: AfterContextOpts) {
    this.waitUntil = waitUntil
    this.onClose = onClose

    this.callbackQueue = new PromiseQueue()
    this.callbackQueue.pause()
  }

  public run<T>(requestStore: RequestStore, callback: () => T): T {
    this.requestStore = requestStore
    return callback()
  }

  public after(task: AfterTask): void {
    if (isThenable(task)) {
      task.catch(() => {}) // avoid unhandled rejection crashes
      if (!this.waitUntil) {
        errorWaitUntilNotAvailable()
      }
      this.waitUntil(task)
    } else if (typeof task === 'function') {
      // TODO(after): implement tracing
      this.addCallback(task)
    } else {
      throw new Error(
        '`unstable_after()`: Argument must be a promise or a function'
      )
    }
  }

  private addCallback(callback: AfterCallback) {
    // if something is wrong, throw synchronously, bubbling up to the `unstable_after` callsite.
    if (!this.waitUntil) {
      errorWaitUntilNotAvailable()
    }
    if (!this.requestStore) {
      throw new InvariantError(
        'unstable_after: Expected `AfterContext.requestStore` to be initialized'
      )
    }
    if (!this.onClose) {
      throw new InvariantError(
        'unstable_after: Missing `onClose` implementation'
      )
    }

    // this should only happen once.
    if (!this.runCallbacksOnClosePromise) {
      // NOTE: We're creating a promise here, which means that
      // we will propagate any AsyncLocalStorage contexts we're currently in
      // to the callbacks that'll execute later.
      // This includes e.g. `requestAsyncStorage` and React's `requestStorage` (which backs `React.cache()`).
      this.runCallbacksOnClosePromise = this.runCallbacksOnClose()
      this.waitUntil(this.runCallbacksOnClosePromise)
    }

    const wrappedCallback = async () => {
      try {
        await callback()
      } catch (err) {
        // TODO(after): this is fine for now, but will need better intergration with our error reporting.
        console.error(
          'An error occurred in a function passed to `unstable_after()`:',
          err
        )
      }
    }

    this.callbackQueue.add(wrappedCallback)
  }

  private async runCallbacksOnClose() {
    await new Promise<void>((resolve) => this.onClose!(resolve))
    return this.runCallbacks(this.requestStore!)
  }

  private async runCallbacks(requestStore: RequestStore): Promise<void> {
    if (this.callbackQueue.size === 0) return

    const readonlyRequestStore: RequestStore =
      wrapRequestStoreForAfterCallbacks(requestStore)

    const staticGenerationStore = staticGenerationAsyncStorage.getStore()

    return withExecuteRevalidates(staticGenerationStore, () =>
      requestAsyncStorage.run(readonlyRequestStore, async () => {
        this.callbackQueue.start()
        await this.callbackQueue.onIdle()
      })
    )
  }
}

function errorWaitUntilNotAvailable(): never {
  throw new Error(
    '`unstable_after()` will not work correctly, because `waitUntil` is not available in the current environment.'
  )
}

/** Disable mutations of `requestStore` within `after()` and disallow nested after calls.  */
function wrapRequestStoreForAfterCallbacks(
  requestStore: RequestStore
): RequestStore {
  return {
    url: requestStore.url,
    get headers() {
      return requestStore.headers
    },
    get cookies() {
      return requestStore.cookies
    },
    get draftMode() {
      return requestStore.draftMode
    },
    // TODO(after): calling a `cookies.set()` in an after() that's in an action doesn't currently error.
    mutableCookies: new ResponseCookies(new Headers()),
    assetPrefix: requestStore.assetPrefix,
    reactLoadableManifest: requestStore.reactLoadableManifest,
    afterContext: requestStore.afterContext,
    isHmrRefresh: requestStore.isHmrRefresh,
    serverComponentsHmrCache: requestStore.serverComponentsHmrCache,
  }
}
