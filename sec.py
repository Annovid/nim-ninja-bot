from random import randint as r


nim_rules = "Ним — игра, в которой два игрока по очереди берут предметы, разложенные на несколько кучек. " \
            "За один ход может быть взято любое количество предметов (большее нуля) из одной кучки. " \
            "Выигрывает игрок, взявший последний предмет." \
            "\nГарантируется, что при данных начальных условиях при правильной игре первый игрок ходит и побеждает. " \
            "\nЧтобы сделать ход, вам нужно вписать два числа через пробел: номер кучки и количество предметов, " \
            "которое вы берёте."

about_me = "Я - бот, созданный, чтобы познакомить пользователя с некоторыми математическими играми."

nim_solution = "Решение нима не поместится на нескольких строчках, поэтому можете почитать решение здесь: " \
                "\nhttps://e-maxx.ru/algo/sprague_grundy"


def nim_do_move(pos):
    re = 0
    for i in pos:
        re ^= i
    if re == 0:
        row = r(0, len(pos) - 1)
        while pos[row] == 0:
            row = r(0, len(pos) - 1)
        num = r(1, pos[row])
        pos[row] -= num
        return [row + 1, num], pos
    for row in range(len(pos)):
        for num in range(1, pos[row] + 1):
            pos[row] -= num
            re = 0
            for q in pos:
                re ^= q
            if re == 0:
                return [row + 1, num], pos
            pos[row] += num


def print_nim(pos):
    text = ""
    for row in range(len(pos)):
        text += str(row + 1) + ") " + "📎" * pos[row] + "\n"
    return text


def user_move(move, pos):
    try:
        move = [int(i) for i in move.split()]
    except:
        return "Ход некорректен."
    if len(move) != 2:
        return "Ход некорректен."
    move[0] -= 1
    if move[0] * (len(pos) - move[0] - 1) < 0:
        return "Ход некорректен."
    if pos[move[0]] < move[1] or move[1] < 1:
        return "Ход некорректен."
    pos[move[0]] -= move[1]
    return pos


if __name__ == "__main__":
    print(nim_do_move([2, 0, 0, 2]))
