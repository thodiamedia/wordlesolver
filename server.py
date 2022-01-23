import http.server
import os
import socketserver

PORT = 8000

# symlink allowlisting
ALLOWED_SYMLINK_SOURCES = ['4', '6', '7', '8']
ALLOWED_SYMLINK_DESTINATIONS = ['index.html']

# http handler with symlink support
class HttpRequestHandlerWithSymlinks(http.server.SimpleHTTPRequestHandler):
  def translate_path(self, req_path):
    path = req_path
    if path[0] == '/':
      path = path[1:]
    if path[-1] == '/':
      path = path[:-1]
    file_path = path + '/index.html'
    if path in ALLOWED_SYMLINK_SOURCES and os.path.islink(file_path) and os.readlink(file_path):
      return os.readlink(file_path)
    
    return super().translate_path(path)

print(f'wordle.tools server starting on port {PORT}')
http_server = socketserver.TCPServer(('', PORT), HttpRequestHandlerWithSymlinks)
http_server.serve_forever()
