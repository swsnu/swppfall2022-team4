import random


def get_random_string(length):
    """
    특정 길이의 랜덤한 문자열을 생성합니다.
    :param length: 문자열의 길이
    :return result: 생성된 문자열
    """
    result = ''
    for _ in range(length):
        seed = random.randrange(0, 36)
        if seed < 26:
            result += chr(ord('a') + seed)
        else:
            result += chr(ord('0') + seed - 26)
    return result


def hsl2hex(h_num, s_num, l_num):
    l_num /= 100
    a_num = (s_num * min([l_num, 1 - l_num])) / 100

    def to_hex(num):
        k_num = (num + h_num / 30) % 12
        color = l_num - a_num * max([min([k_num - 3, 9 - k_num, 1]), -1])
        return hex(round(255 * color))[2:]

    return f"#{to_hex(0)}{to_hex(8)}{to_hex(4)}"


def get_random_color():
    """
    랜덤 색상 문자열(Hex)을 생성합니다.
    태그 색상을 임의로 생성하기 위한 함수입니다.
    :return result: 생성된 색상 문자열
    """
    return hsl2hex(360 * random.random(), 25 + 70 * random.random(), 75 + 10 * random.random())
