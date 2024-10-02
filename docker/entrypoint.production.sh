#!/bin/bash

# Run npm run build in the background
npm run build &

# Store the PID of the npm run build process
BUILD_PID=$!

# Wait for the build process to finish
wait $BUILD_PID
