export const translations = {
  en: {
    header: {
      about: "about",
      contact: "contact",
    },
    hero: {
      description:
        "What started as bespoke observations and a bit of overthinking turn into whimsical objects you can use, gift, or just stare at in existential curiosity,",
      createdExclusivelyBy: "created exclusively by",
    },
    about: {
      title: "About",
      body: "Based in New York City, our shop started as a collection of observations of the modern society that wouldn't leave us alone until they became physical things. We produce whimsical objects at the nexus of utility and contemporary art, designed for people who want to see the world just a little differently. Feel free to stay as long as your curiosity allows.",
      backToShop: "Back to Shop",
    },
    shopTitle: {
      line1: "Chun Wang",
      line2: "Studio",
      line3: "SHOP",
    },
    index: {
      tagline: "Unique works for the imaginative collectors",
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
      seriesPrefix: "Series",
      inquire: "inquire",
      buyNow: "Buy Now",
      shippingIncluded: "Shipping included",
    },
  },
  zh: {
    header: {
      about: "关于",
      contact: "联系我们",
    },
    hero: {
      description:
        "从独特的生活观察与一点点的过度思考开始，这些想法逐渐化为奇思妙想的实物——可以使用，可以送礼，也可以对着它发一会儿呆，",
      createdExclusivelyBy: "由艺术家独家创作",
    },
    about: {
      title: "关于",
      body: "我们的店铺诞生于纽约，最初是一系列对现代社会的观察——那些念念不忘的想法，最终化为了有形之物。我们创作奇思妙想的实用艺术品，处于实用性与当代艺术的交汇点，专为那些希望以不同眼光看待世界的人而设计。欢迎停留，只要好奇心还在。",
      backToShop: "返回商店",
    },
    shopTitle: {
      line1: "Chun Wang",
      line2: "工作室",
      line3: "商店",
    },
    index: {
      tagline: "献给富有想象力的收藏者们",
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
      back: "返回",
      seriesPrefix: "系列",
      inquire: "询价",
      buyNow: "立即购买",
      shippingIncluded: "含运费",
    },
  },
} as const;

export type Lang = keyof typeof translations;
export type Translations = (typeof translations)[Lang];
