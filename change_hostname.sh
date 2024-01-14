#!/bin/sh

HOSTNAME=`env | grep SESSION_MANAGER | cut -d/ -f2 | cut -c -18`

echo 'set website hostname to '$HOSTNAME''

find . -type f -not -name "$0" -exec sed -i 's/localhost/'$HOSTNAME'/g' {} +
