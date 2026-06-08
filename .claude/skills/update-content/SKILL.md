---
description: Guide for updating product listings, watercolor works, and Chinese/English translation content on the Chun Wang Studio Shop site.
---

# 更新产品信息 & 翻译内容

## 产品数据在哪里

所有产品数据存储在一个文件里：

**`src/lib/products.ts`**

每个产品是 `products` 数组里的一个对象。

---

## 添加新产品

在 `products` 数组里复制粘贴下面的模板，填好每个字段：

```ts
{
  id: "unique-product-id",          // URL 用，小写+连字符，比如 "tote-bag"
  title: "Product Name in English",
  name:  "Product Name in English", // 和 title 保持一致

  // ── 中文翻译字段（留空 = 自动显示英文）──────────────────
  title_zh: "",
  description_zh: "",
  detailed_description_html_zh: "",
  category_zh: "",
  edition_info_zh: "",
  // ────────────────────────────────────────────────────────

  price: 0,                         // 数字，不含 $
  currency: "USD",
  description: "Short English description shown on the card.",
  detailed_description_html: `<p>Longer HTML description shown on the product page.</p>`,
  dimensions: "",                   // 留空则不显示
  edition_info: null,               // 留空则不显示
  edition_size: null,               // 数字或 null
  alt_text: "Image alt text",
  image_url: new URL("../assets/products/YOUR_FOLDER/main.jpg", import.meta.url).href,
  is_active: true,
  category: "Accessories",         // 需要与已有分类一致，否则会出现新分类按钮
  created_at: new Date().toISOString(),
  paylink: "https://www.paypal.com/...",
},
```

### 添加产品图片（走马灯）

额外图片加在 `productImages` 数组里：

```ts
{ id: "unique-img-id", product_id: "your-product-id", image_url: new URL("../assets/products/YOUR_FOLDER/2.jpg", import.meta.url).href, display_order: 0 },
```

---

## 修改已有产品

直接在 `src/lib/products.ts` 里找到对应产品，修改字段值即可。

---

## 更新中文翻译（产品内容）

在 `src/lib/products.ts` 里找到对应产品，填写 `_zh` 字段：

```ts
title_zh: "中文产品名称",
description_zh: "卡片上显示的简短中文描述。",
detailed_description_html_zh: "<p>产品详情页的长描述，支持 HTML。</p>",
category_zh: "配件",
edition_info_zh: "限量版信息（可选）",
```

- **留空字符串 `""` = 自动显示英文原文**，不会出现空白
- `detailed_description_html_zh` 支持 HTML 标签（`<p>`, `<b>`, `<i>`, `<a>` 等）

---

## 更新中文翻译（网站 UI 文字）

导航栏、按钮、提示语等 UI 静态文字统一在：

**`src/lib/translations.ts`**

找到 `zh:` 对象，修改对应的值：

```ts
zh: {
  header: {
    about: "关于",          // 导航"about"
    contact: "联系我们",    // 导航"contact"
  },
  shopTitle: {
    line1: "淳子",          // 首页大标题第一行
    line2: "艺术",          // 第二行
    line3: "商店",          // 第三行（红色）
  },
  hero: {
    description: "...",           // Hero 区描述文字
    createdExclusivelyBy: "...",  // "created exclusively by" 那行
  },
  about: {
    title: "关于",
    body: "...",            // About 区正文
    backToShop: "返回商店",
  },
  index: {
    tagline: "...",         // 首页副标题
  },
  productGrid: {
    loading: "...",
    searchPlaceholder: "搜索",
    noResults: "...",
    categoryAll: "全部",    // 分类过滤器"ALL"按钮
    // ...
  },
  productDetails: {
    orderNow: "立即购买",
    shippingIncluded: "含运费",
    details: "详情",
    // ...
  },
  watercolor: {
    back: "返回",
    inquire: "询价",
    // ...
  },
}
```

---

---

## 水彩作品数据

所有水彩作品存储在：

**`src/lib/watercolors.ts`**

### 添加新作品

往 `watercolors` 数组追加一个对象：

```ts
{
  id: "12",                          // 字符串，顺序递增
  title: "Title in English",
  titleZh: "中文标题",               // 留空则显示英文
  series: "II",                      // 对应 seriesList 里的 id
  note: "watercolor · 2025",
  noteZh: "水彩 · 2025",            // 留空则显示英文
  year: "2025",
  medium: "Watercolor on paper",
  mediumZh: "纸本水彩",             // 留空则显示英文
  description: "English description.",
  descriptionZh: "中文描述。",      // 留空则显示英文
},
```

### 修改作品中文翻译

在 `watercolors` 数组里找到对应作品，直接修改 `Zh` 字段：

```ts
titleZh: "新的中文标题",
descriptionZh: "新的中文描述。",
noteZh: "水彩 · 年份 · 地点",
mediumZh: "纸本水彩，已装裱",
```

- **省略或留空 `""` = 自动显示英文原文**

### 管理系列（seriesList）

系列名称和描述在 `seriesList` 数组里集中管理：

```ts
export const seriesList: WatercolorSeries[] = [
  {
    id: "I",                // 与作品的 series 字段对应
    label: "SERIES I",      // 目录页左侧标签
    englishName: "Breakfast", // 系列英文名（大字显示）
    chineseName: "早餐",    // 系列中文名（小字，muted，紧跟英文）
    subtitle: "Works 1–2 · Breakfast Residuals & Palette · London 2026",
  },
  // 新增系列：加一个对象，id 用 "III"、"IV" 等
];
```

### 作品图片

图片放在 `public/watercolors/<padded-id>/` 目录下：

- `main.jpg` — 主图（目录页缩略图 + 详情页首图）
- `1.jpg`, `2.jpg`, … — 详情页附加图（最多 6 张）

`<padded-id>` 是 id 补零到两位，例如 id `"3"` → `public/watercolors/03/main.jpg`

---

## 常见操作速查

| 想做的事 | 改哪里 |
|---|---|
| 改产品名/价格/描述 | `src/lib/products.ts` |
| 加新产品 | `src/lib/products.ts`，往 `products` 数组追加 |
| 加产品图片 | `src/lib/products.ts`，往 `productImages` 数组追加 |
| 填产品中文翻译 | `src/lib/products.ts`，填 `_zh` 字段 |
| 改按钮/导航等 UI 中文 | `src/lib/translations.ts`，改 `zh:` 对象 |
| 改按钮/导航等 UI 英文 | `src/lib/translations.ts`，改 `en:` 对象 |
| 加新水彩作品 | `src/lib/watercolors.ts`，往 `watercolors` 数组追加 |
| 改水彩作品中文翻译 | `src/lib/watercolors.ts`，改对应作品的 `Zh` 字段 |
| 改水彩系列名称/描述 | `src/lib/watercolors.ts`，改 `seriesList` 数组 |
| 上传水彩图片 | `public/watercolors/<padded-id>/main.jpg` |
