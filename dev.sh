#!/bin/bash

# Development server script for Hugo with live reload
# Usage: ./dev.sh or chmod +x dev.sh && ./dev.sh

echo "🚀 Starting Hugo development server with live reload..."
echo "📱 Server will be available at: http://localhost:1313"
echo "🌐 Network access: http://YOUR_LOCAL_IP:1313"
echo "⚡ Live reload is enabled - changes will automatically refresh your browser"
echo ""
echo "Features enabled:"
echo "  ✅ Live reload on file changes"
echo "  ✅ Navigate to changed content"
echo "  ✅ Network accessible (0.0.0.0 binding)"
echo "  ✅ Full rebuilds (disableFastRender)"
echo ""
echo "To stop the server, press Ctrl+C"
echo "----------------------------------------"

hugo server \
  --baseURL http://localhost:1313 \
  --bind 0.0.0.0 \
  --port 1313 \
  --navigateToChanged \
  --disableFastRender \
  --buildDrafts \
  --buildFuture \
  --watch