# FITogether
[![Build Status](https://app.travis-ci.com/swsnu/swppfall2022-team4.svg?branch=main)](https://app.travis-ci.com/swsnu/swppfall2022-team4)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swppfall2022-team4&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=swsnu_swppfall2022-team4)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swppfall2022-team4/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/swsnu/swppfall2022-team4?branch=main)

## Locally Install
### Run frontend server
    # node.js : v16.18.1
    # Rename frontend/example.env to frontend/.env
    
    cd frontend
    yarn install
    yarn start
### Test frontend
    yarn test --coverage --watchAll=false
### Run backend server
    # python : v3.9.5
    # Rename backend/example.env to backend/.env
    # redis-server should be running in the background to chat.
    
    cd backend
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver 0.0.0.0:8000
### Test backend
    coverage run --source='.' manage.py test
    coverage report
------------------
## Docker
### Nginx (front + back)
    docker-compose up
    # If you want to rebuild, please type docker-compose up --build
- After docker-compose, type just ```http://localhost/``` in any browser
- You can access an account that already has chat dummy data created. Username is "testuser" and password is "password".
- Happy with _FITogether_!
