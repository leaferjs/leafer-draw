export * from '@leafer-ui/interface'

export * from './core'
export * from '@leafer-draw/partner'

export * from '@leafer-ui/draw'
export * from '@leafer-ui/partner'

import { useCanvas } from './core'

try {
    if (wx) useCanvas('miniapp', wx)
} catch { }