# FITogether
[![Build Status](https://app.travis-ci.com/swsnu/swppfall2022-team4.svg?branch=main)](https://app.travis-ci.com/swsnu/swppfall2022-team4)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swppfall2022-team4&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=swsnu_swppfall2022-team4)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swppfall2022-team4/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/swsnu/swppfall2022-team4?branch=main)

## Quick Start
### docker with nginx (frontend + backend)
    docker-compose up
    # If you want to rebuild, please type docker-compose up --build
- After docker-compose, type just ```localhost``` in any browser
- Happy with _FITogether_!

### docker (frontend)
    cd frontend
    docker build -t frontend .
    docker run -d -p 3000:3000 --rm --name frontend_container frontend:latest
### docker (backend)
    cd backend
    docker build -t backend .
    docker run -d -p 8000:8000 --rm --name backend_container backend:latest
