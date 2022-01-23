import base64
from urllib.request import urlopen

SOURCE_URL = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
OUTPUT_FILE = './words.b64.txt'

# download file
data = urlopen(SOURCE_URL).read()
body = data.decode('utf-8')
all_words = body.splitlines()

# filter
wordle_words = list(filter(lambda word: len(word) == 5, all_words))

# serialize
csv = ','.join(wordle_words)

# compress
output = base64.b64encode(csv.encode('utf-8'))

# save
with open(OUTPUT_FILE, 'wb') as file:
  file.write(output)
