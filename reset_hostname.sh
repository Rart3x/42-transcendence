HOSTNAME=`env | grep SESSION_MANAGER | cut -d/ -f2 | cut -c -18`

echo 'reset '${HOSTNAME}' to localhost'

find . -type f -not -name "reset_hostname.sh" -not -name "change_hostname.sh" -exec sed -i 's/'$HOSTNAME'/localhost/g' {} +
