#!/bin/bash

echo "Running MindReply cleanup check..."

# Remove leftover temp files
find . -type f -name "*.old" -delete
find . -type f -name "*.tmp" -delete

# Remove debug logs
find . -type f -name "*.log" -delete

echo "Cleanup complete."
