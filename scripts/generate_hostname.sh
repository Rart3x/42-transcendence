#!/bin/bash

for x in {1..3}
do
 for W in {A..G}
 do
     for y in {1..7}
     do
         echo "http://${x}${W}${y}.42angouleme.fr:3000/auth/login" >> output.txt
     done
 done
done