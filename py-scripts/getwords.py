import base64

INPUT_FILE = './py-scripts/source.txt'
OUTPUT_FILE = './words.b64.txt'

# read
source = ''
with open('py-scripts/wordle-wordset.txt', 'r') as f:
  source = f.readline()

# compress
output = base64.b64encode(source.encode('utf-8'))

# save
with open(OUTPUT_FILE, 'wb') as file:
  file.write(output)
