export const translations = {
  en: {
    header: {
      about: "about",
      contact: "contact",
      contactEmailCopiedTitle: "Drop us an email at (copied to clipboard):",
      contactEmailCopyFailedTitle: "Copy failed",
      contactEmailCopyFailedDescription: "Please copy manually:",
    },
    hero: {
      description:
        "What started as bespoke observations and a bit of overthinking turn into whimsical objects you can use, gift, or just stare at in existential curiosity.",
      createdExclusivelyBy: "created exclusively by",
      forImaginativeCollectors: " for the imaginative collectors",
    },
    about: {
      title: "About",
      body: "Based in New York City, Chun Wang Studio Shop started as a collection of observations of the modern society that wouldn't leave us alone until they became physical things. We produce whimsical objects at the nexus of utility and contemporary art, designed for people who want to see the world just a little differently. Feel free to stay as long as your curiosity allows.",
      artistLabel: "About the Artist",
      backToShop: "Back to Shop",
    },
    shopTitle: {
      line1: "Chun Wang",
      line2: "Studio",
      line3: "SHOP",
    },
    index: {
      tagline: "Unique works for the imaginative collectors.",
      catalogsTitle: "Art Catalogs",
    },
    footer: {
      copyright: "All rights reserved.",
    },
    productGrid: {
      loading: "LOADING REALLY GOOD STUFF...",
      error: "SOMETHING WENT WRONG",
      searchPlaceholder: "SEARCH",
      matchedProduct: "matched product",
      matchedProducts: "matched products",
      noResults: "NO RESULTS FOUND",
      noResultsDetail: "We couldn't find anything for",
      categoryAll: "ALL",
    },
    productDetails: {
      loading: "Loading...",
      details: "Details",
      orderNow: "ORDER NOW",
      shippingIncluded: "Shipping included",
      limitedEditionPrefix: "Limited edition of",
      limitedEditionSuffix: "",
    },
    watercolor: {
      notFound: "Work not found.",
      back: "back",
      backToCatalog: "Back to catalog",
      seriesPrefix: "Series",
      inquire: "inquire",
      buyNow: "Buy Now",
      shippingIncluded: "Shipping included",
    },
    watercolorCatalog: {
      subtitle: "Visions in Watercolor",
      works: "works",
      printCatalog: "Print Complete Catalog",
      noteLabel: "NOTE",
      noteText: "Watercolor remains a pursuit of materiality — especially now",
      artistStatement: "Artist Statement",
      artistLocation: "CHUN WANG · NEW YORK",
      uploadImage: "Upload Image",
    },
    photographyCatalog: {
      subtitle: "Inner Wilderness",
      works: "works",
      categoryLabel: "Photography · 摄影作品",
    },
    remainsCatalog: {
      subtitle: "Remains",
      works: "works",
      categoryLabel: "Remains · 遗迹",
    },
    spirit21Catalog: {
      subtitle: "In The Spirit of the 21st Century",
      works: "works",
      categoryLabel: "In The Spirit of the 21st Century · 21世纪精神",
    },
  },
  zh: {
    header: {
      about: "关于",
      contact: "联系我们",
      contactEmailCopiedTitle: "给我们发邮件（邮箱地址已复制到剪贴板）：",
      contactEmailCopyFailedTitle: "复制失败",
      contactEmailCopyFailedDescription: "请手动复制：",
    },
    hero: {
      description:
        "从一点点生活观察，和一点点过度思考开始。想法落地，变成好用、好送、也好对着发呆的小物件。",
      createdExclusivelyBy: "独家创作 by",
      forImaginativeCollectors: "，献给富有想象力的收藏者们",
    },
    about: {
      title: "关于",
      body: "我们的店铺诞生于纽约，最初是一系列对当代社会的观察。那些念念不忘的想法，最终化为有形之物。这些奇思妙想的实用艺术品，专为那些希望以不同眼光看待世界的人而设计。欢迎停留，只要好奇心还在。",
      artistLabel: "关于艺术家",
      backToShop: "返回商店",
    },
    shopTitle: {
      line1: "Chun Wang",
      line2: "创意工作室",
      line3: "商店",
    },
    index: {
      tagline: "献给富有想象力的收藏者们",
      catalogsTitle: "作品系列",
    },
    footer: {
      copyright: "版权所有。",
    },
    productGrid: {
      loading: "好东西加载中……",
      error: "出了点问题",
      searchPlaceholder: "搜索",
      matchedProduct: "件匹配商品",
      matchedProducts: "件匹配商品",
      noResults: "未找到结果",
      noResultsDetail: "未找到与以下内容相关的商品：",
      categoryAll: "全部",
    },
    productDetails: {
      loading: "加载中……",
      details: "详情",
      orderNow: "立即购买",
      shippingIncluded: "含运费",
      limitedEditionPrefix: "限量版，共",
      limitedEditionSuffix: "件",
    },
    watercolor: {
      notFound: "作品未找到。",
      back: "返回目录",
      seriesPrefix: "系列",
      inquire: "询价",
      buyNow: "立即购买",
      shippingIncluded: "含运费",
    },
    watercolorCatalog: {
      subtitle: "水彩视界",
      works: "件作品",
      printCatalog: "打印目录",
      noteLabel: "注",
      noteText: "水彩依然是对物质性的追寻——尤其是在当下",
      artistStatement: "艺术家自述",
      artistLocation: "王淳 · 纽约",
      uploadImage: "上传图片",
    },
    photographyCatalog: {
      subtitle: "内在荒原",
      works: "件作品",
      categoryLabel: "Photography · 摄影作品",
    },
    remainsCatalog: {
      subtitle: "遗迹",
      works: "件作品",
      categoryLabel: "Remains · 遗迹",
    },
    spirit21Catalog: {
      subtitle: "21世纪精神",
      works: "件作品",
      categoryLabel: "In The Spirit of the 21st Century · 21世纪精神",
    },
  },
} as const;

export type Lang = keyof typeof translations;
export type Translations = (typeof translations)[Lang];
