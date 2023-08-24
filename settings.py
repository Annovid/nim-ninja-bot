import os

from pydantic_settings import BaseSettings

PROJECT_NAME = 'nim-ninja-bot'
ENV_FILE = os.path.join(os.getcwd(), 'resources', '.env')


def get_current_directory_name():
    return os.getcwd().split('/')[-1]


def get_env_file():
    while get_current_directory_name() != PROJECT_NAME:
        os.chdir('..')
    return os.path.join(os.getcwd(), 'resources', '.env')


class Settings(BaseSettings):
    TOKEN: str

    class Config:
        env_file = ENV_FILE


settings = Settings()


if __name__ == '__main__':
    print(get_env_file())
