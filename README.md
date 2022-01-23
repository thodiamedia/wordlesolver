![Banner with text "wordle.tools - easy, fast wordle solver!"](assets/wordle.tools-cover.png)

# `wordle.tools`

Efficiently complete Wordle puzzles with this solver! [Try it yourself at wordle.tools](https://wordle.tools)

## Navigating the Repo

wordle.tools is a straightforward project:

* `index.html`: HTML content of the website.
* `scripts.js`: JavaScript logic of the website.
* `styles.css`: CSS stylesheet of the website.
* `server.py`: Local web server for development.
* `data/`: Comma-separated, base64-encoded word sets.
* `py-scripts/get-words.py`: Python script used to generate the words list.
* `4`, `5`, `6`, `7`, `8`: Symlinks to `index.html` to support separate for different word lengths.

## Fun Facts

* wordle.tools supports IPv6!
* wordle.tools matches your system's light mode/dark mode preferences!
* wordle.tools is responsive!

## Development

To run the server locally:

```
python3 server.py
```

To regenerate the data files:

```
python3 py-scripts/getwords.py
```

## Acknowledgements

* Wordle is created by [Josh Wardle](https://www.powerlanguage.co.uk/).
* Word list is from the [`dwyl/english-words` repository](https://github.com/dwyl/english-words) and originally created by Infochimps.
* Website is hosted by GitHub pages.
