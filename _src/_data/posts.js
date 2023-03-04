const getWPPosts = require("../../11ty_scripts/getWPPosts");

module.exports = async ({ wordpressURL }) => {
  let posts = await getWPPosts({
    requestURL: wordpressURL + "wp-json/wp/v2/posts",
    extraParams: { _embed: 1, order: "desc" },
  });

  console.log("Total posts", posts.length);
  return posts;
};
