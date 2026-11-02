#! /bin/bash

rsync \
    -aP \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.lostpixel \
    --exclude=tests \
    --exclude=tests-examples \
    --exclude=mockoon \
    ./ root@aimedlabs.com:~/amw_app_3
