# FITogether
[![Build Status](https://app.travis-ci.com/swsnu/swppfall2022-team4.svg?branch=main)](https://app.travis-ci.com/swsnu/swppfall2022-team4)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swppfall2022-team4&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=swsnu_swppfall2022-team4)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swppfall2022-team4/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/swsnu/swppfall2022-team4?branch=main)  

https://fitogether.site/

## Locally Install
### Run frontend server
    # node.js : v16.18.1
    # Rename frontend/example.env to frontend/.env
    
    cd frontend
    yarn install
    yarn start
### Run backend server
    # python : v3.9.5
    
    cd backend
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver 0.0.0.0:8000
### Websocket setting
    # redis-server should be installed. (apt-get install redis-server)
    
    cd backend
    /etc/init.d/redis-server start
    daphne -b 0.0.0.0 -p 8001 FITogether.asgi:application
    
## Testing  
### Test frontend
    cd frontend
    yarn test --coverage --watchAll=false
### Test backend
    cd backend
    coverage run --source='.' manage.py test
    coverage report
------------------
## Create Dummy Data
    cd backend
    python manage.py seed_users -n 10
    ...
You can find commands to add dummy data at https://github.com/swsnu/swppfall2022-team4/wiki.
