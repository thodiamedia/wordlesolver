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
    path = req_path[1:]
    if path in ALLOWED_SYMLINK_SOURCES and os.path.islink(path) and os.readlink(path):
      return os.readlink(path)
    
    return super().translate_path(path)

print(f'wordle.tools server starting on port {PORT}')
http_server = socketserver.TCPServer(('', PORT), HttpRequestHandlerWithSymlinks)
http_server.serve_forever()
