export * from '@leafer-ui/interface'

export * from '@leafer/miniapp'
export * from '@leafer-draw/partner'

export * from '@leafer-ui/draw'
export * from '@leafer-ui/partner'

import { useCanvas } from '@leafer/miniapp'

try {
    if (wx) useCanvas('miniapp', wx)
} catch { }