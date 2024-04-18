import logging

from utils.settings import settings


def setup_logging():
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    logging.basicConfig(
        level=log_level,
        format=" %(name)s :: %(levelname)-8s :: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    ignore_modules = [
        "urllib3.connectionpool",
    ]

    for module in ignore_modules:
        logging.getLogger(module).setLevel(logging.WARNING)
