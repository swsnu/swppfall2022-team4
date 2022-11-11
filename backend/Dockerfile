# frontend/Dockerfile
FROM python:3.9.6

RUN mkdir -p /app/backend
WORKDIR /app/backend

COPY requirements.txt /app/backend/requirements.txt
RUN pip install -r requirements.txt

COPY . /app/backend

ENV DJANGO_SETTINGS_MODULE=FITogether.settings

RUN pip install uwsgi
RUN python manage.py migrate
RUN python manage.py makemigrations

EXPOSE 8000
ENTRYPOINT [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
