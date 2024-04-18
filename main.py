import logging

from app.bot import bot
from utils.log import setup_logging

if __name__ == "__main__":
    setup_logging()

    logging.info("Starting bot...")
    bot.infinity_polling(
        timeout=10,
        long_polling_timeout=5,
    )
    logging.info("Finished bot.")
