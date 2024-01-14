#!/bin/sh

HOSTNAME=`env | grep SESSION_MANAGER | cut -d/ -f2 | cut -c -18`

echo 'reset hostname to 2F2.42angouleme.fr'

find . -type f -not -name "$0" -exec sed -i 's/'$HOSTNAME'/2F2.42angouleme.fr/g' {} +
