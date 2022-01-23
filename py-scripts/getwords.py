import base64
from urllib.request import urlopen

WORDS_SOURCE_URL = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
WORDLE_INPUT_FILE = './py-scripts/wordle-wordset.txt'
OUTPUT_FILE = './data/words-5ch.b64.txt'

# read wordle wordset
wordle_source = ''
with open(WORDLE_INPUT_FILE, 'r') as f:
  source = f.readline()

# compress wordle wordset
output = base64.b64encode(source.encode('utf-8'))

# save wordle wordset
with open(OUTPUT_FILE, 'wb') as file:
  file.write(output)

# download file
data = urlopen(WORDS_SOURCE_URL).read()
body = data.decode('utf-8')
all_words = body.splitlines()

def store_wordset(word_list, word_length):
  filtered_word_list = list(filter(lambda word: len(word) == word_length, word_list))
  csv = ','.join(filtered_word_list)
  output = base64.b64encode(csv.encode('utf-8'))
  with open(f'data/words-{word_length}ch.b64.txt', 'wb') as file:
    file.write(output)

for word_length in (4, 6, 7, 8):
  store_wordset(all_words, word_length)
