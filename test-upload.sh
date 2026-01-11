#!/bin/bash

echo "Testing Upload Route..."
echo ""

# Test 1: Check if route exists (should get 400 or message about missing file)
echo "Test 1: Check route exists"
curl -X POST http://localhost:5000/api/f/upload
echo ""
echo ""

# Test 2: Create a test file and upload it
echo "Test 2: Upload actual file"
echo "Hello from TIC Portal!" > test-upload.txt

curl -X POST http://localhost:5000/api/f/upload \
  -F "file=@test-upload.txt"

echo ""
echo ""
echo "If you see a file URL above, the upload works! ✅"

# Cleanup
rm -f test-upload.txt
