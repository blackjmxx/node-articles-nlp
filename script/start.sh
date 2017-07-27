#!/bin/bash
if [ "$ENABLE_DEBUG" == "true" ]; then
	echo "Starting with debugger on port $AUX_PORT"
	exec with_ngrok node --debug=$AUX_PORT lib/worker.js
else
	echo "Starting without debugger"
	exec node lib/worker.js
fi