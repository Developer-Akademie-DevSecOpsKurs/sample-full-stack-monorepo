FROM python:3.12-slim AS backend
WORKDIR /app
COPY . .
WORKDIR /app/backend
RUN pip install -r requirements.txt \
    && chmod +x /app/backend/entrypoint.sh
EXPOSE 8000
ENTRYPOINT [ "/bin/sh", "-c", "/app/backend/entrypoint.sh" ]