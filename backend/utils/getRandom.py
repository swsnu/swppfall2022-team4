import random

def getRandomString(length):
    result = ''
    for i in range (length):
        seed = random.randrange(0, 36)
        if seed < 26:
            result += chr(ord('a') + seed)
        else:
            result += chr(ord('0') + seed - 26)
    return result