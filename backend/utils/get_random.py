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


def get_random_color():
    """
    랜덤 색상 문자열을 생성합니다.
    태그 색상을 임의로 생성하기 위한 함수입니다.
    :return result: 생성된 색상 문자열
    """
    return f'hsl({360* random.random()},{25 + 70 * random.random()}%,{75 + 10 * random.random()}%)'
