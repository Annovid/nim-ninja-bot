import telebot
from telebot import types
import sec

TOKEN = "6330444469:AAG3T1yBMKj1Wir7iKwpERk_6mFfpySuVTA"
MY_ID = 491372273

problems = {
    "1.1": [2, 3, 4],
    "1.2": [3, 4, 5],
    "1.3": [3, 4, 5, 6]
}

Users = {}


class User:
    progress = dict()
    status = "menu_1"
    pos = []

    def __init__(self, user_id):
        self.id = user_id

    def start(self):
        try:
            f = open(str(self.id) + '.txt', 'r')
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

    def send_answer(self, message=tuple()):
        if self.status == "menu_1":
            makeup = keyboard(["Играть", "Обо мне"])
            bot.send_message(self.id, "Выберите вариант ответа", reply_markup=makeup)
        if self.status == "menu_2":
            makeup = keyboard(["Ним", "Вернуться"])
            bot.send_message(self.id, "Выберите вариант ответа", reply_markup=makeup)
        if self.status == "Ним":
            text = "В скобках указаны начальные позиции"
            makeup = keyboard(
                ["Правила", "1. (2, 3, 4)", "2. (3, 4, 5)", "3. (3, 4, 5, 6) *", "Общее решение", "Вернуться"])
            bot.send_message(self.id, text, reply_markup=makeup)


def keyboard(buttons):
    markup = types.ReplyKeyboardMarkup()
    for i in range(len(buttons)):
        buttons[i] = types.KeyboardButton(buttons[i])
        markup.add(buttons[i])
    return markup


bot = telebot.TeleBot(TOKEN)


@bot.message_handler(commands=['start'])
def send_welcome(message):
    send_text = "Привет, " + str(message.chat.first_name) + "!\n" + \
                "Я - бот. Я могу сыграсть с тобой в ним"
    bot.send_message(message.chat.id, send_text)
    Users[message.chat.id] = User(message.chat.id)
    Users[message.chat.id].send_answer(message)


@bot.message_handler(commands=["safe"])
def safe_all(message):
    if message.chat.id != MY_ID:
        return 0


@bot.message_handler(content_types=['text'])
def lalala(message):
    try:
        Users[message.chat.id]
    except:
        bot.send_message(message.chat.id, "Чтобы начать, введите /start")
        return 0
    if Users[message.chat.id].status == "menu_1" and message.text == "Играть":
        Users[message.chat.id].status = "menu_2"
        Users[message.chat.id].send_answer()
    if Users[message.chat.id].status == "menu_1" and message.text == "Обо мне":
        bot.send_message(message.chat.id, sec.about_me)
    if Users[message.chat.id].status == "menu_2" and message.text == "Ним":
        Users[message.chat.id].status = "Ним"
        Users[message.chat.id].send_answer()
    if Users[message.chat.id].status == "menu_2" and message.text == "Вернуться":
        Users[message.chat.id].status = "menu_1"
        Users[message.chat.id].send_answer()
    if Users[message.chat.id].status == "Ним" and message.text == "Правила":
        text = sec.nim_rules
        bot.send_message(message.chat.id, text)
    if Users[message.chat.id].status == "Ним" and message.text == "Общее решение":
        text = sec.nim_solution
        bot.send_message(message.chat.id, text)
    if Users[message.chat.id].status[:2] == "1." and message.text == "Вернуться":
        Users[message.chat.id].status = "Ним"
        Users[message.chat.id].send_answer()
        return 0
    if Users[message.chat.id].status == "Ним" and message.text == "Вернуться":
        Users[message.chat.id].status = "menu_2"
        Users[message.chat.id].send_answer()
    if Users[message.chat.id].status[:2] == "1." and message.text == "Ещё раз":
        Users[message.chat.id].pos = problems[Users[message.chat.id].status].copy()
        bot.send_message(message.chat.id, "Если захотите закончить, введите 'Вернуться'")
        text = "Ходите:\n" + sec.print_nim(Users[message.chat.id].pos)
        # print(Users[message.chat.id].status)          !!!
        bot.send_message(message.chat.id, text)
        return 0
    if (Users[message.chat.id].status == "Ним" and message.text[1:2] == "."):
        Users[message.chat.id].status = ("1." + message.text[0:1])
        # print(message.text)
        # print(message.text[0:1])
        # print(Users[message.chat.id].status)

        for key in problems.keys():
            if key == Users[message.chat.id].status:
                Users[message.chat.id].pos = problems[key].copy()
        bot.send_message(message.chat.id,
                         "Чтобы сделать ход, вам нужно вписать два числа через пробел: номер кучки и количество предметов, которое вы берёте.\nЕсли захотите закончить, введите 'Вернуться'")
        text = "Ходите:\n" + sec.print_nim(Users[message.chat.id].pos)
        # print(Users[message.chat.id].status)          !!!
        bot.send_message(message.chat.id, text)
        return 0
    if Users[message.chat.id].status[:2] == "1.":
        move = sec.user_move(message.text, Users[message.chat.id].pos)
        if str(move) == "Ход некорректен.":
            bot.send_message(message.chat.id, str(move))
            bot.send_message(message.chat.id, sec.print_nim(Users[message.chat.id].pos))
        else:
            Users[message.chat.id].pos = move
            text = "Позиция после вашего хода:\n" + sec.print_nim(Users[message.chat.id].pos)
            bot.send_message(message.chat.id, text)
            if sum(Users[message.chat.id].pos) == 0:
                board = keyboard(["Вернуться", "Ещё раз"])
                bot.send_message(message.chat.id, "Поздравляю, вы победили!", reply_markup=board)
                Users[message.chat.id].pos = []
                return 0
            res = sec.nim_do_move(Users[message.chat.id].pos)
            text = "Мой ход: " + str(res[0][0]) + " " + str(res[0][1]) + "\n"
            text += sec.print_nim(Users[message.chat.id].pos)
            bot.send_message(message.chat.id, text)
            if sum(Users[message.chat.id].pos) == 0:
                board = keyboard(["Вернуться", "Ещё раз"])
                bot.send_message(message.chat.id, "Я победил", reply_markup=board)
                Users[message.chat.id].pos = []


# RUN
bot.polling(none_stop=True)
