#!/bin/bash
if [ -e "/opt/linkzone/run.py" ]; then
    cd /opt/linkzone/ && python3 run.py
else
    tail -f /dev/null
fi