from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
from assignment import filter_to_words_matching_format, filter_to_words_excluding_all_chars
from word_provider import get_all_words_en

app = Flask('app')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/wordle', methods = ['POST'])
@cross_origin()
def get_wordle_result():
    json_data = request.get_json(force=True)

    print(request)
    print(json_data)

    wordlist = get_all_words_en()
    wordlist = filter_to_words_matching_format(wordlist, json_data['fmt'])
    wordlist = filter_to_words_excluding_all_chars(wordlist, json_data['excluded'])
    
    return dict(
        results = wordlist
    )

@app.route('/')
def index():
  return render_template('index.html')

app.run(host='0.0.0.0', port=8080)
