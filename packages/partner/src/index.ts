// leafer's partner, allow replace
export * from '@leafer/watcher'
export * from '@leafer/layouter'
export * from '@leafer/renderer'

import { ICreator, ILeaf, ILeaferCanvas, IRenderOptions } from '@leafer/interface'
import { Creator, LeafList, Platform } from '@leafer/core'

import { Watcher } from '@leafer/watcher'
import { Layouter } from '@leafer/layouter'
import { Renderer } from '@leafer/renderer'


Object.assign(Creator, {
    watcher: (target, options?) => new Watcher(target, options),
    layouter: (target, options?) => new Layouter(target, options),
    renderer: (target, canvas, options?) => new Renderer(target, canvas, options),
    selector: (_target, _options?) => undefined,
    interaction: (_target, _canvas, _selector, _options?) => undefined
} as ICreator)

Platform.layout = Layouter.fullLayout
Platform.render = function (target: ILeaf, canvas: ILeaferCanvas, options: IRenderOptions): void {
    const topOptions: IRenderOptions = { ...options, topRendering: true }
    options.topList = new LeafList()
    target.__render(canvas, options)
    if (options.topList.length) options.topList.forEach(item => item.__render(canvas, topOptions))
}