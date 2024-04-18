from random import randint as r

from utils.reader import Reader

nim_rules = Reader.read_file("static/nim/rules.txt")
about_me = Reader.read_file("static/about_me.txt")
nim_solution = Reader.read_file("static/nim/solution.txt")
incorrect_move = "Ход некорректен."
emoji = "📎"


def nim_do_move(position: list[int]):
    re = 0
    for i in position:
        re ^= i
    if re == 0:
        row = r(0, len(position) - 1)
        while position[row] == 0:
            row = r(0, len(position) - 1)
        num = r(1, position[row])
        position[row] -= num
        return [row + 1, num], position
    for row in range(len(position)):
        for num in range(1, position[row] + 1):
            position[row] -= num
            re = 0
            for q in position:
                re ^= q
            if re == 0:
                return [row + 1, num], position
            position[row] += num


def print_nim(pos: list[int]):
    text = ""
    for row, count in enumerate(pos):
        text += str(row + 1) + ") " + emoji * count + "\n"
    return text


def user_move(move: str, position: list[int]):
    try:
        move = [int(i) for i in move.split()]
    except:
        return incorrect_move
    if len(move) != 2:
        return incorrect_move
    move[0] -= 1
    if move[0] * (len(position) - move[0] - 1) < 0:
        return incorrect_move
    if position[move[0]] < move[1] or move[1] < 1:
        return incorrect_move
    position[move[0]] -= move[1]
    return position
