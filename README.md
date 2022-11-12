# FITogether
[![Build Status](https://app.travis-ci.com/swsnu/swppfall2022-team4.svg?branch=main)](https://app.travis-ci.com/swsnu/swppfall2022-team4)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swppfall2022-team4&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=swsnu_swppfall2022-team4)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swppfall2022-team4/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/swsnu/swppfall2022-team4?branch=main)

## Quick Start
- locally install
- docker

### Locally Install
```backend```폴더 안의 ```example.env```의 REDIS_HOST env 값을 아래와 같이 수정
######
    ...
    REDIS_HOST=127.0.0.1
    
#### run frontend server
    cd frontend
    yarn install
    yarn start
#### run backend server
    cd backend
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
------------------
### Docker
```backend```폴더 안의 ```example.env```의 REDIS_HOST env 값을 아래와 같이 수정
######
    ...
    REDIS_HOST=redis
#### nginx(front+back)
    docker-compose up
    # If you want to rebuild, please type docker-compose up --build
- After docker-compose, type just ```localhost``` in any browser
- Happy with _FITogether_!
- If you don't use docker-compose, you cannot connect frontend with backend. It needs nginx subdomain routing on Docker environment.
#### Only Frontend
    cd frontend
    docker build -t frontend .
    docker run -d -p 3000:3000 --rm --name frontend_container frontend:latest
### Only Backend
    cd backend
    docker build -t backend .
    docker run -d -p 8000:8000 --rm --name backend_container backend:latest
