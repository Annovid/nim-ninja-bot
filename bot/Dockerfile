FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml ./
RUN pip install --no-cache-dir "pyTelegramBotAPI>=4.21.0" "python-dotenv>=1.0.0"

COPY main.py ./

CMD ["python", "main.py"]
