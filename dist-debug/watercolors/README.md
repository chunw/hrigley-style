# Watercolors — image folder

Drop images here. Both the catalog page and the shop's product pages read from this folder.

## Folder structure

```
public/watercolors/
  01/
    main.jpg   ← catalog card + product page hero
    1.jpg      ← detail images for your shop listing
    2.jpg
  02/
    main.jpg
    1.jpg
  ...
```

- File must be named exactly `main.jpg` (lowercase).
- Supported formats: jpg, jpeg, png, webp, gif — rename to `.jpg` if needed.
- After dropping a file, refresh the page. No build step required.

## Catalog page

Open in browser (via dev server or Finder):

  http://localhost:5173/Chun%20Wang%20Watercolors%20-%20Store%20Style.html

## Shop product pages

  http://localhost:5173/watercolors/1  (etc.)

## Linking catalog cards to product pages

Open `public/Chun Wang Watercolors - Store Style.html`, find `SHOP_BASE` near the bottom,
and set it to your deployed URL. Each card auto-links to `SHOP_BASE/watercolors/{number}`.
