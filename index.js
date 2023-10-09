const cheerio = require("cheerio");
const request = require("request-promise");
const fs = require("fs-extra");
const writeStream = fs.createWriteStream("quotes.csv");

const init = async () => {
  const $ = await request({
    uri: "http://quotes.toscrape.com",
    transform: (body) => cheerio.load(body), // get all the content and pass to cheerio
  });

  writeStream.write("Quote|Author|Tags\n");

  const title = $("title");
  //console.log(title)

  const heading = $("h1 a[href='/']");
  //console.log(heading.text().trim()); // trim: clear the empty spaces

  const qutoe = $(".quote").find("a");
  // console.log(qutoe.html());

  const thridQuote = $(".quote").next().next();
  // console.log(thridQuote.html());

  const container = $(".row .col-md-8").parent().next();
  // console.log(container.html());

  const quotes = $(".quote span.text").each((i, element) => {
    // console.log(i, $(element).html());

    const quoteText = $(element).text();
    const quoteWithoutC = quoteText.replace(/(^\“|\”$)/g, ""); // remove the “”
    // console.log(quoteWithoutC);
  });

  $(".quote").each((i, element) => {
    const tags = [];

    const text = $(element)
      .find("span.text")
      .text()
      .replace(/(^\“|\”$)/g, "");
    const author = $(element).find("span small.author").text();
    const tag = $(element)
      .find(".tags a.tag")
      .each((i, element) => {
        tags.push($(element).text());
      });

    writeStream.write(`${text}|${author}|${tags}\n`);
    // console.log(tags.join(","));
  });
};

init();
