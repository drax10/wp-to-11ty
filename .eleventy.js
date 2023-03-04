const htmlmin = require("html-minifier");

module.exports = (eleventyConfig) => {
  // So the script knows where to pull the wordpress information from
  eleventyConfig.addGlobalData("wordpressURL", "http://example.com/");
  eleventyConfig.addGlobalData("eleventyURL", "http://localhost:8080/");

  // Include assets in output
  eleventyConfig.addPassthroughCopy("_src/assets");
  eleventyConfig.addPassthroughCopy("_src/favicon.ico");

  // Refresh build when styles are changed
  eleventyConfig.addWatchTarget("./_src/assets/styles/");

  // Minify all pages automatically
  eleventyConfig.addTransform("htmlmin", function (content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      try {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
        });
        return minified;
      } catch (error) {
        console.count("Errors Minifying HTML");
        return content + `<!-- ERROR: PAGE COULD NOT BE MINIFIED ${error} -->`;
      }
    }
    return content;
  });

  eleventyConfig.addFilter("debug", (content) => `${JSON.stringify(content)}`);

  return {
    dir: {
      input: "_src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
    },
  };
};
