const getWPPosts = require("../../11ty_scripts/getWPPosts");

module.exports = async ({ wordpressURL }) => {
  return await getWPPosts({
    requestURL: wordpressURL + "wp-json/wp/v2/tags",
    extraParams: {
      _embed: 1,
      order: "asc",
      orderby: "name",
    },
  });
};
