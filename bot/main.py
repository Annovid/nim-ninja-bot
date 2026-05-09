import logging
import os
import sys
from pathlib import Path

import telebot
from dotenv import load_dotenv
from telebot.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

for env_path in (Path.cwd() / ".env", Path(__file__).resolve().parent / ".env", Path(__file__).resolve().parent.parent / ".env"):
    if env_path.is_file():
        load_dotenv(env_path)
        break

TOKEN = os.environ.get("TOKEN")
WEBAPP_URL = os.environ.get("WEBAPP_URL", "https://annovid.github.io/nim-ninja-bot/")

if not TOKEN:
    print("TOKEN env var is required.", file=sys.stderr)
    sys.exit(2)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
log = logging.getLogger("nim-ninja-bot")

bot = telebot.TeleBot(TOKEN)


def launch_markup() -> InlineKeyboardMarkup:
    markup = InlineKeyboardMarkup()
    markup.add(InlineKeyboardButton(text="Играть", web_app=WebAppInfo(url=WEBAPP_URL)))
    return markup


@bot.message_handler(commands=["start"])
def on_start(message):
    text = (
        f"Привет, {message.chat.first_name}!\n"
        f"Я познакомлю тебя с игрой Ним. Жми «Играть»."
    )
    bot.send_message(message.chat.id, text, reply_markup=launch_markup())
    log.info("start from %s (%s)", message.chat.id, message.from_user.first_name)


@bot.message_handler(content_types=["text"])
def on_text(message):
    bot.send_message(
        message.chat.id,
        "Открой мини-приложение кнопкой ниже.",
        reply_markup=launch_markup(),
    )


if __name__ == "__main__":
    log.info("Starting bot, webapp url: %s", WEBAPP_URL)
    bot.infinity_polling(timeout=10, long_polling_timeout=5)
