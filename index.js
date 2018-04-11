const Table = require("cli-table");
const AGoodMovieToWatch = require("./lib");

module.exports = async (
  input,
  {
    page = 1,
    text = "",
    mood = "dark",
    genre = "drama",
    sortby = "",
    type = "all"
  }
) => {
  const table = new Table({
    head: ["title", "director", "released", "rating", "genre", "description"],
    colWidths: [30, 20, 10, 10, 20, 40]
  });

  let url;

  switch (input) {
    case "search":
      url = `https://agoodmovietowatch.com/page/${page}?s=${text}`;
      break;

    case "mood":
      url = `https://agoodmovietowatch.com/mood/${mood}/page/${page}${
        sortby === "top-rated" ? "?toprated=1" : ""
      }`;
      break;

    case "genre":
      url = `https://agoodmovietowatch.com/genre/${genre}/page/${page}${
        sortby === "top-rated" ? "?toprated=1" : ""
      }`;
      break;

    case "netflix":
      // 'top-rated', '' for latest
      url = `https://agoodmovietowatch.com/netflix/${sortby}/page/${page}`;
      break;

    case "prime":
      url = `https://agoodmovietowatch.com/amazon-prime/page/${page}`;
      break;

    case "best":
      // 'all', 'amazon-prime', 'netflix'
      url = `https://agoodmovietowatch.com/best/${type}/page/${page}`;
      break;
  }

  try {
    const data = await AGoodMovieToWatch.fetch(url);
    const formatData = data.map(r => [
      r.title,
      r.director,
      r.released,
      r.userRating,
      r.genre,
      r.description
    ]);

    table.push.apply(table, formatData);
    console.log(table.toString());
  } catch (e) {
    console.log("No results found!");
  }
};
