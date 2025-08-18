FROM python:3.12

ARG _WORKDIR=/app

WORKDIR ${_WORKDIR}

COPY . ${_WORKDIR}

WORKDIR ${_WORKDIR}/backend

RUN pip install -r requirements.txt \
    && chmod +x /app/backend/entrypoint.sh

EXPOSE 8000

ENTRYPOINT [ "/bin/sh", "-c", "/app/backend/entrypoint.sh" ]