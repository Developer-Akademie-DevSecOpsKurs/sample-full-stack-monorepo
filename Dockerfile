FROM alpine:3.22.1 AS base
ARG _WORKDIR=/app
COPY . ${_WORKDIR}

FROM python:3.12-slim AS backend
WORKDIR /app/backend
COPY --from=base /app/backend .
RUN pip install -r requirements.txt \
    && chmod +x /app/backend/entrypoint.sh
EXPOSE 8000
ENTRYPOINT [ "/bin/sh", "-c", "/app/backend/entrypoint.sh" ]