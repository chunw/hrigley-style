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
  imageFolder: "your-folder-name",  // folder name inside src/assets/products/
  image_url: new URL("../assets/products/your-folder-name/main.jpg", import.meta.url).href,
  is_active: true,
  category: "Accessories",         // 需要与已有分类一致，否则会出现新分类按钮
  created_at: new Date().toISOString(),
  paylink: "https://www.paypal.com/...",
},
```

**When adding a new product, ALL `_zh` fields must be filled in — never leave them as `""`.**  The site shows English as fallback when `_zh` is empty, so an empty field means Chinese-mode users always see English. Write full English AND Chinese descriptions in the shop's tone:
- Tone: artistic, slightly dry/ironic, confident. Speaks to the creative professional — gallery-opening energy, not department-store energy.
- `description` (card blurb): one punchy sentence, 10–15 words.
- `detailed_description_html`: 2–3 short paragraphs in `<p>` tags. Lead with the concept or story, close with a material/practical detail.
- `description_zh` / `detailed_description_html_zh`: faithful Chinese translation that keeps the same register — literary but not stiff. **`detailed_description_html_zh` must use `<p>` tags** just like the English field — it is rendered via `dangerouslySetInnerHTML` and plain text will have no paragraph styling. Use backtick delimiters if the text contains `"…"` quote marks.
- `title_zh`: translate the product name naturally (not literally word-for-word).
- `category_zh`: match the category — 服饰 (Accessories), 服饰 (Apparel), 文具 (Stationery), 家居 (Home), 原创艺术 (Original Art).

**After adding a product, always tell the user:**
> Drop images into `src/assets/products/<imageFolder>/` — they will auto-load into the carousel. Set `image_url` to whichever file in that folder should be the cover photo.

**Cover photo selection rule (when setting `image_url`):**
Always check `src/assets/products/<imageFolder>/` BEFORE writing the product entry.
1. If the folder exists and has a file named `main.*` (any extension — `main.jpg`, `main.png`, `main.webp`, etc.) → always use that file as `image_url`, regardless of what other images are in the folder.
2. If the folder exists but has no `main.*` file → use the first file alphabetically.
3. If the folder does not exist → leave `image_url: ""` and tell the user to create the folder and add images.

This rule also applies retroactively: if a `main.*` file is added to (or already exists in) a product's folder, `image_url` should point to it even if it currently points elsewhere — check for `main.*` whenever touching a product's images, not just when adding a new product.

The cover image is always shown first in the product detail slider — this is enforced automatically by the `productImages` sort in `src/lib/products.ts`.

### 产品图片放在哪里

图片放在 `src/assets/products/<your-folder-name>/` 下，每个产品一个文件夹。文件夹名称任意，但要和 `image_url` 里的路径一致。

```
src/assets/products/
  everyflushnathmat/        ← 新建文件夹（名称与 image_url 路径对应）
    Fresh Bath Mat 1.png    ← 主图（用在 image_url 字段）
    Fresh Bath Mat 2.png    ← 额外图（加进 productImages 数组）
```


**主图**：在产品对象的 `image_url` 字段引用：

```ts
image_url: new URL("../assets/products/everyflushnathmat/Fresh Bath Mat 1.png", import.meta.url).href,
```

### 添加产品图片（走马灯）

额外图片加在 `productImages` 数组里，`product_id` 要和产品的 `id` 一致：

```ts
{ id: "flush-mat-1", product_id: "every-flush-bath-mat", image_url: new URL("../assets/products/everyflushnathmat/Fresh Bath Mat 1.png", import.meta.url).href, display_order: 0 },
{ id: "flush-mat-2", product_id: "every-flush-bath-mat", image_url: new URL("../assets/products/everyflushnathmat/Fresh Bath Mat 2.png", import.meta.url).href, display_order: 1 },
```

> `id` 字段在整个 `productImages` 数组里必须唯一。

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
category_zh: "服饰",
edition_info_zh: "限量版信息（可选）",
```

- **留空字符串 `""` = 自动显示英文原文**，不会出现空白
- `detailed_description_html_zh` **必须使用 HTML 标签**（`<p>`, `<b>`, `<i>`, `<a>` 等）——它和英文版一样通过 `dangerouslySetInnerHTML` 渲染，纯文本不会有段落格式。每段内容都要包在 `<p>…</p>` 里。

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
    line1: "王淳",          // 首页大标题第一行
    line2: "创意工作室",          // 第二行
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
    shippingIncluded: "已包含运费和税费",
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

## ⚠️ 常见坑：弯引号导致语法报错

从微信、Word、Pages、Notes 等软件粘贴中文文字时，外层的英文引号 `"` 可能被自动替换成中文弯引号 `"` `"`（U+201C / U+201D）。

TypeScript 编译器**不认识**弯引号作为字符串定界符，会抛出类似以下的错误：

```
[plugin:vite:react-swc] Unexpected character '《'
```

**排查方法：** 看报错行，如果值是 `title_zh: "《…"` 而不是 `title_zh: "《…"` ，前者用了弯引号作为外层定界符，就是这个问题。

**修复方法：**
- 确保每个字段值的**外层**引号都是普通 ASCII 直引号 `"`（从键盘直接打出来）
- 字符串**内容**里如果有中文直角引号（`"无所事事"`），这些引号若用的是 ASCII `"`，会提前关闭外层字符串，导致报错。解决方案：把该字段的外层定界符换成反引号 `` ` ``：
  ```ts
  detailed_description_html_zh: `...在"无所事事"的瞬间...`,
  ```

---

## 常见操作速查

| 想做的事 | 改哪里 |
|---|---|
| 改产品名/价格/描述 | `src/lib/products.ts` |
| 加新产品 | `src/lib/products.ts`，往 `products` 数组追加 |
| 加产品图片（文件） | `src/assets/products/<folder>/`，新建文件夹放图片 |
| 加产品图片（走马灯） | `src/lib/products.ts`，往 `productImages` 数组追加 |
| 填产品中文翻译 | `src/lib/products.ts`，填 `_zh` 字段 |
| 改按钮/导航等 UI 中文 | `src/lib/translations.ts`，改 `zh:` 对象 |
| 改按钮/导航等 UI 英文 | `src/lib/translations.ts`，改 `en:` 对象 |
| 加新水彩作品 | `src/lib/watercolors.ts`，往 `watercolors` 数组追加 |
| 改水彩作品中文翻译 | `src/lib/watercolors.ts`，改对应作品的 `Zh` 字段 |
| 改水彩系列名称/描述 | `src/lib/watercolors.ts`，改 `seriesList` 数组 |
| 上传水彩图片 | `public/watercolors/<padded-id>/main.jpg` |
