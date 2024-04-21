FROM python:3.9-slim AS django-app

ENV PYTHONUNBUFFERED=1

WORKDIR /app

ADD requirements.txt .
RUN pip install -r requirements.txt

ADD . .

EXPOSE 8000

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
