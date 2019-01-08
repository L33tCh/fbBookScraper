# Facebook Book Scraper

Since it does not appear possible to export your book list from Facebook I wanted to create something to help get the data as quickly and simply as possible.

[This script](https://gist.github.com/L33tCh/ba840987a8e34cd5d7eef54037975798) is used to collect all available information from your Facebook books list. It is built for use in [Tamper Monkey](https://tampermonkey.net/) but is simple javascript and so should be easy to adjust as needed.

The goal is to have this as input to another project which will help map book titles to ISBN numbers so that you can create a CSV ready to import into GoodReads or the like.

This will probably be performed though the [Google Books API](https://developers.google.com/books/docs/v1/getting_started) or the [Wikipedia API](https://www.mediawiki.org/wiki/API:Query)
