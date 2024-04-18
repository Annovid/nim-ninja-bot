import logging

import telebot

import utils.nim as nim
from utils.reader import Reader
from utils.settings import settings

problems = {"1.1": [2, 3, 4], "1.2": [3, 4, 5], "1.3": [3, 4, 5, 6]}
move_description = Reader.read_file("static/nim/move_description")
user_state_matching: dict[int, "User"] = {}


class User:
    progress = dict()
    status = "menu_1"
    pos = []

    def __init__(self, user_id):
        self.id = user_id

    def start(self):
        try:
            f = open(str(self.id) + ".txt", "r")
            for line in f:
                arr = [i for i in line.split()]
                self.progress[arr[0]] = int(arr[1])
        except:
            print("FAIL")

        for i in problems:
            try:
                self.progress[i]
            except:
                self.progress[i] = 0
        print(self.id, self.progress)

    def send_answer(self, _message=tuple()):
        if self.status == "menu_1":
            makeup = keyboard(["Играть", "Обо мне"])
            bot.send_message(
                self.id, "Выберите вариант ответа", reply_markup=makeup
            )
        if self.status == "menu_2":
            makeup = keyboard(["Ним", "Вернуться"])
            bot.send_message(
                self.id, "Выберите вариант ответа", reply_markup=makeup
            )
        if self.status == "Ним":
            text = "В скобках указаны начальные позиции"
            makeup = keyboard(
                [
                    "Правила",
                    "1. (2, 3, 4)",
                    "2. (3, 4, 5)",
                    "3. (3, 4, 5, 6) *",
                    "Общее решение",
                    "Вернуться",
                ]
            )
            bot.send_message(self.id, text, reply_markup=makeup)


def keyboard(buttons):
    markup = telebot.types.ReplyKeyboardMarkup()
    for i in range(len(buttons)):
        buttons[i] = telebot.types.KeyboardButton(buttons[i])
        markup.add(buttons[i])
    return markup


bot = telebot.TeleBot(settings.TOKEN)


@bot.message_handler(commands=["start"])
def send_welcome(message):
    send_text = (
        f"Привет, {message.chat.first_name}!\n"
        f"Я - бот. Я могу сыграсть с тобой в ним"
    )
    bot.send_message(message.chat.id, send_text)
    logging.debug(
        f"Init user {message.chat.id}: {message.from_user.first_name}"
    )
    user_state_matching[message.chat.id] = User(message.chat.id)
    user_state_matching[message.chat.id].send_answer(message)


@bot.message_handler(commands=["safe"])
def safe_all(message):
    return 0


@bot.message_handler(content_types=["text"])
def message_handler(message):
    if message.chat.id not in user_state_matching.keys():
        bot.send_message(message.chat.id, "Чтобы начать, введите /start")
        return 0
    current_user = user_state_matching[message.chat.id]
    if current_user.status == "menu_1" and message.text == "Играть":
        current_user.status = "menu_2"
        current_user.send_answer()
    if current_user.status == "menu_1" and message.text == "Обо мне":
        bot.send_message(message.chat.id, nim.about_me)
    if current_user.status == "menu_2" and message.text == "Ним":
        current_user.status = "Ним"
        current_user.send_answer()
    if current_user.status == "menu_2" and message.text == "Вернуться":
        current_user.status = "menu_1"
        current_user.send_answer()
    if current_user.status == "Ним" and message.text == "Правила":
        text = nim.nim_rules
        bot.send_message(message.chat.id, text)
    if current_user.status == "Ним" and message.text == "Общее решение":
        text = nim.nim_solution
        bot.send_message(message.chat.id, text)
    if current_user.status[:2] == "1." and message.text == "Вернуться":
        current_user.status = "Ним"
        current_user.send_answer()
        return 0
    if current_user.status == "Ним" and message.text == "Вернуться":
        current_user.status = "menu_2"
        current_user.send_answer()
    if current_user.status[:2] == "1." and message.text == "Ещё раз":
        current_user.pos = problems[current_user.status].copy()
        bot.send_message(
            message.chat.id, "Если захотите закончить, введите 'Вернуться'"
        )
        text = "Ходите:\n" + nim.print_nim(current_user.pos)
        bot.send_message(message.chat.id, text)
        return 0
    if current_user.status == "Ним" and message.text[1:2] == ".":
        current_user.status = "1." + message.text[0:1]

        for key in problems.keys():
            if key == current_user.status:
                current_user.pos = problems[key].copy()
        bot.send_message(message.chat.id, move_description)
        text = "Ходите:\n" + nim.print_nim(current_user.pos)
        bot.send_message(message.chat.id, text)
        return 0
    if current_user.status[:2] == "1.":
        move = nim.user_move(message.text, current_user.pos)
        if str(move) == "Ход некорректен.":
            bot.send_message(message.chat.id, str(move))
            bot.send_message(
                message.chat.id,
                nim.print_nim(current_user.pos),
            )
        else:
            current_user.pos = move
            text = "Позиция после вашего хода:\n" + nim.print_nim(
                current_user.pos
            )
            bot.send_message(message.chat.id, text)
            if sum(current_user.pos) == 0:
                board = keyboard(["Вернуться", "Ещё раз"])
                bot.send_message(
                    message.chat.id,
                    "Поздравляю, вы победили!",
                    reply_markup=board,
                )
                current_user.pos = []
                return 0
            res = nim.nim_do_move(current_user.pos)
            text = "Мой ход: " + str(res[0][0]) + " " + str(res[0][1]) + "\n"
            text += nim.print_nim(current_user.pos)
            bot.send_message(message.chat.id, text)
            if sum(current_user.pos) == 0:
                board = keyboard(["Вернуться", "Ещё раз"])
                bot.send_message(
                    message.chat.id, "Я победил", reply_markup=board
                )
                current_user.pos = []
