const MarkdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || '/';
  const outputDir = process.env.ELEVENTY_OUTPUT_DIR || 'output/site';
  const cmsMarkdown = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true
  });

  eleventyConfig.addFilter("cmsInline", function(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return cmsMarkdown.renderInline(String(value));
  });

  eleventyConfig.addFilter("cmsBlock", function(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return cmsMarkdown.render(String(value));
  });

  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy({ 'src/assets/js': 'assets/js' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/webfonts': 'assets/webfonts' });
  eleventyConfig.addPassthroughCopy('src/assets/css/custom.css');
  eleventyConfig.addPassthroughCopy('src/assets/css/fontawesome-all.min.css');
  eleventyConfig.addPassthroughCopy('src/assets/fonts');

  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");
  eleventyConfig.addWatchTarget("src/assets/webfonts/");

  return {
    pathPrefix,
    dir: { 
      input: 'src', 
      output: outputDir, 
      data: '_data' 
    },
    templateFormats: ['njk', 'md', 'html', 'yml'],
    htmlTemplateEngine: 'njk'
  };
};
