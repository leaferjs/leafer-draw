# @leafer-draw/extensions

轻量级 Leafer Draw 扩展包，一站式集成常用组件、图表、动画。

## 安装

```bash
npm install @leafer-draw/extensions
```

## 快速开始

```typescript
import { Leafer } from 'leafer-draw'
import { BarChart, Progress, fadeIn, Spinner } from '@leafer-draw/extensions'

const leafer = new Leafer({ view: 'app' })

// 组件
new Progress({ x: 50, y: 50, width: 200, percent: 60 })

// 图表
new BarChart({
  x: 50, y: 100,
  data: [
    { label: 'A', value: 100 },
    { label: 'B', value: 200 },
    { label: 'C', value: 150 }
  ]
})

// 动画
fadeIn(element, { duration: 500 })
```

## 组件

| 组件 | 说明 |
|------|------|
| `Progress` | 进度条 |
| `Badge` | 徽章 |
| `Tag` | 标签 |
| `Avatar` | 头像 |
| `Spinner` | 加载动画 |
| `Skeleton` | 骨架屏 |

## 图表

| 图表 | 说明 |
|------|------|
| `BarChart` | 柱状图 |
| `LineChart` | 折线图 |
| `PieChart` | 饼图 / 环形图 |

## 动画

| 函数 | 说明 |
|------|------|
| `fadeIn` / `fadeOut` | 淡入淡出 |
| `zoomIn` | 缩放进入 |
| `slideIn` | 滑入 (top/bottom/left/right) |
| `pulse` | 脉冲 |
| `shake` | 摇摆 |
| `spin` | 旋转 |

## 文件结构

```
extensions/
└── src/
    └── index.ts    # 约 250 行，单文件集成
```
