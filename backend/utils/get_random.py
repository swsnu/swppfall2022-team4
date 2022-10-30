import random

def get_random_string(length):
    """
    특정 길이의 랜덤한 문자열을 생성합니다.
    :param length: 문자열의 길이
    :return result: 생성된 문자열
    """
    result = ''
    for _ in range (length):
        seed = random.randrange(0, 36)
        if seed < 26:
            result += chr(ord('a') + seed)
        else:
            result += chr(ord('0') + seed - 26)
    return result
