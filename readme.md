# WP to 11ty

This starter 11ty project has everything you need to generate a site using the content from a wordpress site without the mess.

To get started do the following:

Edit `.eleventy.js` and change `example.com` in `eleventyConfig.addGlobalData("wordpressURL", "https://example.com/");` to your URL (Make sure to include the final `/`).

Then run the following:

```bash
npm install
npx @11ty/eleventy --serve
```

After a while, your site should be live at `localhost:8080`.

## Adding more post types

Information is fetched from wordpress in `_src/_data/`. If you wanted to bring over all pages for example, you could copy `posts.js` to `pages.js`, change the endpoint to `wordpressURL + "wp-json/wp/v2/pages"` and then access the variable using `{{pages}}`.
