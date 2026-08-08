/**
 * Leafer Draw Extensions - 轻量级扩展
 * 核心组件 + 图表 + 常用动画，一站 式集成
 */

import { Rect, Text, Group, Ellipse, Path, Line, IHash, ILeaf } from '@leafer-ui/draw'

// ========== 工具函数 ==========
const colorPalette = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2']

function getColor(index: number): string {
  return colorPalette[index % colorPalette.length]
}

// ========== 通用组件 ==========

/** 进度条 */
export class Progress extends Group {
  constructor(options?: IHash) {
    const width = options?.width || 200
    const height = options?.strokeWidth || 8
    const percent = Math.min(100, Math.max(0, options?.percent || 0))

    super({ width, height, ...options })

    this.add(new Rect({ width, height, fill: '#f0f0f0', cornerRadius: height / 2 }))
    this.add(new Rect({
      width: (width * percent) / 100,
      height,
      fill: options?.color || '#1890ff',
      cornerRadius: height / 2
    }))
  }

  setPercent(percent: number) {
    const bar = this.children[1] as Rect
    bar.width = (this.width * Math.min(100, Math.max(0, percent))) / 100
  }
}

/** 徽章 */
export class Badge extends Group {
  constructor(options?: IHash) {
    const size = options?.size || 20
    super({
      width: size, height: size,
      cornerRadius: size / 2,
      fill: options?.color || '#ff4d4f',
      ...options
    })
    
    if (options?.count) {
      const text = new Text({
        text: String(options.count),
        fontSize: 10, fill: '#fff'
      })
      text.center(this)
      this.add(text)
    }
  }
}

/** 标签 */
export class Tag extends Group {
  constructor(options?: IHash) {
    const colors: IHash = {
      primary: '#1890ff', success: '#52c41a',
      warning: '#faad14', danger: '#ff4d4f'
    }
    const color = colors[options?.type as string] || '#f0f0f0'
    const textColor = options?.type ? '#fff' : '#666'

    super({
      autoWidth: true, autoHeight: true,
      fill: color, cornerRadius: 4,
      ...options
    })

    if (options?.text) {
      const text = new Text({
        text: options.text as string,
        fontSize: 12, fill: textColor, padding: [4, 8, 4, 8]
      })
      text.center(this)
      this.add(text)
    }
  }
}

/** 头像 */
export class Avatar extends Group {
  constructor(options?: IHash) {
    const size = options?.size || 40
    super({
      width: size, height: size,
      cornerRadius: options?.shape === 'square' ? 4 : size / 2,
      fill: '#e6e6e6', ...options
    })

    if (options?.text) {
      const text = new Text({
        text: String(options.text).charAt(0).toUpperCase(),
        fontSize: size * 0.4, fill: '#999'
      })
      text.center(this)
      this.add(text)
    }
  }
}

/** 加载动画 */
export class Spinner extends Group {
  constructor(options?: IHash) {
    const size = options?.size || 40
    const color = options?.color || '#1890ff'
    const count = options?.count || 8

    super({ width: size, height: size })

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 360
      const r = (size / 2 - 4) * Math.cos(angle * Math.PI / 180)
      const y = (size / 2 - 4) * Math.sin(angle * Math.PI / 180)
      const circle = new Ellipse({
        x: size / 2 + r, y: size / 2 + y,
        width: 4, height: 4, fill: color
      })
      circle.opacity = 0.3 + (i / count) * 0.7
      this.add(circle)
    }
    this.animate({ rotation: 360 }, { duration: 1000, repeat: -1, easing: 'linear' })
  }
}

/** 骨架屏 */
export class Skeleton extends Group {
  constructor(options?: IHash) {
    const width = options?.width || 200
    const height = options?.height || 16
    const rows = options?.rows || 3

    super({ width, height: height * rows + 10 * (rows - 1) })

    for (let i = 0; i < rows; i++) {
      const w = i === 0 ? width * 0.8 : width * (0.4 + Math.random() * 0.6)
      const rect = new Rect({
        x: 0, y: i * (height + 10), width: w, height,
        fill: '#f0f0f0', cornerRadius: 4
      })
      rect.animate({ opacity: 0.4 }, { duration: 1000, repeat: -1, easing: 'sine-in-out' })
      this.add(rect)
    }
  }
}

// ========== 图表组件 ==========

/** 柱状图 */
export class BarChart extends Group {
  constructor(options: IHash) {
    const { data = [], width = 400, height = 250, padding = 40, ...rest } = options
    super({ width, height, ...rest })

    const max = Math.max(...(data as any[]).map((d: any) => d.value))
    const barW = 30, gap = 10
    const chartW = width - padding * 2
    const startX = padding + (chartW - barW * (data as any[]).length) / 2

    ;(data as any[]).forEach((item: any, i: number) => {
      const barH = (item.value / max) * (height - padding * 2)
      const bar = new Rect({
        x: startX + i * (barW + gap),
        y: height - padding - barH,
        width: barW, height: barH,
        fill: item.color || getColor(i),
        cornerRadius: [4, 4, 0, 0]
      })
      bar.scale = { x: 1, y: 0.01 }
      bar.animate({ scale: { x: 1, y: 1 } }, { duration: 400, delay: i * 80, easing: 'back-out' })
      this.add(bar)

      const label = new Text({
        text: item.label, fontSize: 11, fill: '#666',
        x: startX + i * (barW + gap) + barW / 2,
        y: height - padding + 8
      })
      label.textAlign = 'center'
      this.add(label)
    })
  }
}

/** 折线图 */
export class LineChart extends Group {
  constructor(options: IHash) {
    const { data = [], width = 400, height = 250, padding = 40, color, ...rest } = options
    super({ width, height, ...rest })

    const values = (data as any[]).map((d: any) => d.value)
    const max = Math.max(...values), min = Math.min(...values)
    const step = (width - padding * 2) / Math.max(1, values.length - 1)

    const points = (data as any[]).map((d: any, i: number) => ({
      x: padding + i * step,
      y: height - padding - ((d.value - min) / (max - min || 1)) * (height - padding * 2)
    }))

    // 折线
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
    this.add(new Path({ d: path, stroke: color || '#1890ff', lineWidth: 2 }))

    // 数据点
    points.forEach((p, i) => {
      const dot = new Ellipse({
        x: p.x, y: p.y, width: 6, height: 6,
        fill: '#fff', stroke: color || '#1890ff', lineWidth: 2
      })
      dot.scale = { x: 0, y: 0 }
      dot.animate({ scale: { x: 1, y: 1 } }, { duration: 300, delay: 400 + i * 100, easing: 'back-out' })
      this.add(dot)
    })
  }
}

/** 饼图/环形图 */
export class PieChart extends Group {
  constructor(options: IHash) {
    const { data = [], width = 300, height = 300, innerRadius = 0, ...rest } = options
    super({ width, height, ...rest })

    const cx = width / 2, cy = height / 2
    const outer = Math.min(width, height) / 2 - 20
    const total = (data as any[]).reduce((s: number, d: any) => s + d.value, 0)
    let startAngle = -90

    ;(data as any[]).forEach((item: any, i: number) => {
      const percent = item.value / total
      const angle = percent * 360
      const endAngle = startAngle + angle
      const color = item.color || getColor(i)

      // 扇形路径
      const path = this.arcPath(cx, cy, innerRadius, outer, startAngle, endAngle)
      const pie = new Path({ d: path, fill: color, stroke: '#fff', lineWidth: 2 })
      pie.opacity = 0
      pie.animate({ opacity: 1 }, { duration: 400, delay: i * 120 })
      this.add(pie)

      // 百分比标签
      if (percent > 0.08) {
        const mid = startAngle + angle / 2
        const labelR = outer + 20
        const label = new Text({
          text: `${(percent * 100).toFixed(0)}%`,
          fontSize: 12, fill: '#666',
          x: cx + labelR * Math.cos(mid * Math.PI / 180),
          y: cy + labelR * Math.sin(mid * Math.PI / 180)
        })
        label.textAlign = 'center'
        label.textVerticalAlign = 'middle'
        this.add(label)
      }
      startAngle = endAngle
    })
  }

  private arcPath(cx: number, cy: number, r1: number, r2: number, start: number, end: number): string {
    const s = (a: number) => [cx + r1 * Math.cos(a * Math.PI / 180), cy + r1 * Math.sin(a * Math.PI / 180)]
    const e = (a: number) => [cx + r2 * Math.cos(a * Math.PI / 180), cy + r2 * Math.sin(a * Math.PI / 180)]
    const [x1, y1] = s(start), [x2, y2] = e(start)
    const [x3, y3] = e(end), [x4, y4] = s(end)
    const large = end - start > 180 ? 1 : 0
    return `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 ${large} 1 ${x3} ${y3} L ${x4} ${y4}${r1 ? ` A ${r1} ${r1} 0 ${large} 0 ${x1} ${y1}` : ''} Z`
  }
}

// ========== 动画函数 ==========

/** 淡入 */
export function fadeIn(el: ILeaf, options?: IHash): void {
  el.opacity = 0
  el.animate({ opacity: 1 }, { duration: 300, easing: 'quad-out', ...options })
}

/** 淡出 */
export function fadeOut(el: ILeaf, options?: IHash): void {
  el.animate({ opacity: 0 }, { duration: 300, easing: 'quad-in', ...options })
}

/** 缩放进入 */
export function zoomIn(el: ILeaf, options?: IHash): void {
  el.scale = { x: 0, y: 0 }
  el.animate({ scale: { x: 1, y: 1 } }, { duration: 400, easing: 'back-out', ...options })
}

/** 滑入 */
export function slideIn(el: ILeaf, dir: 'top' | 'bottom' | 'left' | 'right', options?: IHash): void {
  const dist = 60
  const ox = el.x || 0, oy = el.y || 0
  if (dir === 'left') el.x = ox - dist
  else if (dir === 'right') el.x = ox + dist
  else if (dir === 'top') el.y = oy - dist
  else if (dir === 'bottom') el.y = oy + dist
  el.opacity = 0
  el.animate({ opacity: 1, x: ox, y: oy }, { duration: 350, easing: 'quint-out', ...options })
}

/** 脉冲 */
export function pulse(el: ILeaf, options?: IHash): void {
  const sx = el.scale?.x || 1, sy = el.scale?.y || 1
  el.animate([
    { scale: { x: sx * 1.1, y: sy * 1.1 }, easing: 'sine-in-out' },
    { scale: { x: sx, y: sy } }
  ], { duration: 600, repeat: -1, ...options })
}

/** 摇摆 */
export function shake(el: ILeaf, options?: IHash): void {
  const x = el.x || 0
  el.animate([
    { x: x - 8, easing: 'quad-out' },
    { x: x + 8, easing: 'quad-in-out' },
    { x: x - 6, easing: 'quad-in-out' },
    { x: x + 6, easing: 'quad-in-out' },
    { x: x }
  ], { duration: 400, ...options })
}

/** 旋转 */
export function spin(el: ILeaf, options?: IHash): void {
  el.animate({ rotation: (el.rotation || 0) + 360 }, {
    duration: 1000, repeat: -1, easing: 'linear', ...options
  })
}

// ========== 导出 ==========

export const Extensions = {
  // 组件
  Progress, Badge, Tag, Avatar, Spinner, Skeleton,
  // 图表
  BarChart, LineChart, PieChart,
  // 动画
  fadeIn, fadeOut, zoomIn, slideIn, pulse, shake, spin
}

export default Extensions
