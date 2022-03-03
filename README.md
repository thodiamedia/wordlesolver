# `wordle.tools` - Repl/Flask backend

This is the branch for a Wordle Solver using a Repl/Flask backend. You may set up a Repl project, move over the files `static/*`, `templates/*`, `main.py`, and `assignment.py`, then run! As long as `assignment.py` is implemented according to the specification provided in the PDF file, you should have a nice interactive frontend for your intro Python assignment!

[Try it yourself at wordle-solver-flask.andreybutenko1.repl.co](https://wordle-solver-flask.andreybutenko1.repl.co/)!

## Navigating the Repo

wordle.tools is a straightforward project:

* `templates/index.html`: HTML content of the website.
* `static/scripts.js`: JavaScript logic of the website.
* `static/styles.css`: CSS stylesheet of the website.
* `local-server.py`: Local web server for development.
* `main.py`: Web server for Repl.
* `assignment.py`: File to implement assignment.
* `docs/`: Assignment description.

## Local Development

To run the server locally:

```
python3 local-server.py
```

## Acknowledgements

* Wordle is created by [Josh Wardle](https://www.powerlanguage.co.uk/).
* Word list is from the [`dwyl/english-words` repository](https://github.com/dwyl/english-words) and originally created by Infochimps.
* Website is hosted by Repl.
