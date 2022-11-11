# frontend/Dockerfile
FROM python:3.9.6

RUN mkdir -p /app/backend
WORKDIR /app/backend

COPY requirements.txt /backend/requirements.txt
RUN pip install -r requirements.txt
RUN pip install uwsgi

COPY . .

EXPOSE 8000

CMD uwsgi --wsgi-file backend/wsgi.py --env DJANGO_SETTINGS_MODULE=backend.settings.production --http :8000