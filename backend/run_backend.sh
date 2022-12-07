B#!/bin/bash

python manage.py makemigrations 
python manage.py migrate

python manage.py seed_users -n 10
python manage.py seed_chatrooms
python manage.py seed_messages -n 20
python manage.py prepare_tags
python manage.py seed_logs -n 100
python manage.py seed_groups -n 16
python manage.py seed_posts -n 73
python manage.py seed_comments -n 120
python manage.py seed_comments -n 216

mkdir -p /log
uwsgi --ini uwsgi.ini