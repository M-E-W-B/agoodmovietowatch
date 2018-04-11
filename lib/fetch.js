const request = require("request-promise");
const cheerio = require("cheerio");

module.exports = async url => {
  const $ = await request({
    uri: url,
    transform: function(body) {
      return cheerio.load(body);
    }
  });

  const $results = $("article.post").map(function() {
    const meta = {};
    const $this = $(this);
    const $metas = $this.find("meta");

    // add meta
    $this.find("meta").each(function() {
      const attr = $(this).attr("itemprop");
      const content = $(this).prop("content");
      meta[attr] = meta[attr] ? meta[attr].concat(content) : [content];
    });

    const title =
      $this
        .find(".content-title")
        .text()
        .trim() ||
      $this
        .find(".entry-title")
        .text()
        .trim();

    const userRating =
      $this.find(".user-rating-list-rating").text() +
      $this.find(".rating-outoff").text();

    const genre = $this.find(".genre-content").text();
    const description = $this.find(".text-excerpt p").text();

    return {
      title,
      director: meta.director,
      released: meta.datePublished,
      userRating,
      genre,
      description
    };
  });

  return $results.toArray();
};
