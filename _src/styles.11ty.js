const path = require("path");
const sass = require("node-sass");
const CleanCSS = require("clean-css");

module.exports = class {
  // define meta data for this template,
  // just like you would with front matter in markdown.
  async data() {
    return {
      permalink: "/assets/styles/main.css",
      eleventyExcludeFromCollections: true,
      entryFile: path.join(__dirname, "assets/styles/main.scss"),
    };
  }

  // custom method that runs Sass compilation
  // and returns CSS as a string
  async compileSass(options) {
    return new Promise((resolve, reject) => {
      const callback = (error, result) => {
        if (error) reject(error);
        else resolve(result.css.toString());
      };
      return sass.render(options, callback);
    });
  }

  // this function is mandatory and determines the contents of the
  // generated output file. it gets passed all our "front matter" data.
  async render({ entryFile }) {
    try {
      const renderedCSS = await this.compileSass({ file: entryFile });
      const minifiedCSS = new CleanCSS({
        level: 2,
      }).minify(renderedCSS);
      return minifiedCSS.styles;
    } catch (error) {
      throw error;
    }
  }
};
