const { AssetCache } = require("@11ty/eleventy-fetch");
// Can this be replaced with fetch?
const axios = require("axios");

// Config
const ITEMS_PER_REQUEST = 10;

/**
 * Blog post API call by page
 *
 * @param {Int} page - Page number to fetch, defaults to 1
 * @return {Object} - Total, Pages, and full API data
 */
async function requestPosts({ page = 1, requestURL, extraParams }) {
  try {
    // https://developer.wordpress.org/rest-api/using-the-rest-api/pagination/
    const url = requestURL;
    const params = {
      params: {
        page,
        per_page: ITEMS_PER_REQUEST,
        ...extraParams,
      },
    };
    const response = await axios.get(url, params);

    return {
      total: parseInt(response.headers["x-wp-total"], 10),
      pages: parseInt(response.headers["x-wp-totalpages"], 10),
      data: response.data,
    };
  } catch (err) {
    console.error("API not responding, no data returned", err);
    return {
      total: 0,
      pages: 0,
      data: [],
    };
  }
}

/**
 * Get all blog posts from the API
 * Use cached values if available, pull from API if not.
 *
 * @return {Array} - array of blog posts
 */
module.exports = async function (args) {
  const postType = args.requestURL
    .split("/")
    .slice(-1)[0]
    .replace(/[^a-zA-Z0-9]/g, "");
  const cache = new AssetCache(postType);
  let requests = [];
  let apiData = [];

  if (cache.isCacheValid("2h") && !args.ignoreCache) {
    console.log("Using cached " + postType);
    return cache.getCachedValue();
  }

  // make first request and marge results with array
  const request = await requestPosts(args);
  console.log(
    `Using API ${postType}, retrieving ${request.pages} pages, ${request.total} total posts.`
  );
  apiData.push(...request.data);

  if (request.pages > 1) {
    // create additional requests
    for (let page = 2; page <= request.pages; page++) {
      const request = requestPosts({ ...args, page });
      requests.push(request);
    }

    // resolve all additional requests in parallel
    const allResponses = await Promise.all(requests);
    allResponses.map((response) => {
      apiData.push(...response.data);
    });
  }

  // return data
  await cache.save(apiData, "json");
  return apiData;
};
