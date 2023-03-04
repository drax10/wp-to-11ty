module.exports = {
  data: {},
  render(data) {
    // All WP links converted to relative links on this site
    let content = data.content.replaceAll(
      'href="' + data.wordpressURL,
      'href="/'
    );

    // Canonical URL cannot be a relative URL, so we fix that
    content = content.replaceAll(
      `rel="canonical" href="/`,
      `rel="canonical" href="` + data.eleventyURL
    );

    return content;
  },
};
