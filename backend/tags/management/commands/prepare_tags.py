import random

from django.core.management import BaseCommand
from tags.models import TagClass, Tag
from informations.models import Information


def get_random_color():
    """
    랜덤 색상 문자열을 생성합니다.
    태그 색상을 임의로 생성하기 위한 함수입니다.
    :return result: 생성된 색상 문자열
    """
    return f'hsl({360* random.random()},{25 + 70 * random.random()}%,{75 + 10 * random.random()}%)'


def get_tag_class_type(class_name):
    if class_name in ["등운동", "가슴운동", "어깨운동", "하체운동", "복근운동", "팔운동", "유산소", "기타운동"]:
        return "workout"
    elif class_name in ["장소"]:
        return "place"
    return "general"


class Command(BaseCommand):
    help = "This command prepares some tag classes & basic tags."

    def handle(self, *args, **options):
        # Subclass must implement this method.
        class_list = [
            "등운동",
            "가슴운동",
            "어깨운동",
            "하체운동",
            "복근운동",
            "팔운동",
            "유산소",
            "기타운동",
            "장소",
            "식단",
            "정보",
            "유머",
            "유튜브",
            "연구/기사",
            "루틴",
            "근육",
            "잡담",
        ]

        # 무산소 태그 프리셋
        anaerobic_sublist = {}
        anaerobic_sublist["back"] = ["데드리프트", "랫 풀 다운", "턱걸이", "바벨 로우", "케이블 로우", "바벨 풀오버"]
        anaerobic_sublist["chest"] = ["벤치프레스", "딥스", "팩 덱 블라이", "팔굽혀펴기", "덤벨 풀오버"]
        anaerobic_sublist["deltoid"] = ["밀리터리프레스", "래터럴 레이즈", "업라이트 로우"]
        anaerobic_sublist["leg"] = ["스쿼트", "레그 프레스", "카프레이즈"]
        anaerobic_sublist["abs"] = ["크런치", "AB 롤아웃", "윗몸 일으키기", "마운틴 클라이머", "바이시클 크런치"]
        anaerobic_sublist["arm"] = ["스컬 크러셔", "트라이셉스 푸시 다운", "바벨 컬", "덤벨 컬"]

        # 유산소 태그 프리셋
        aerobic_list = [
            "실내 걷기",
            "실외 걷기",
            "스트레칭",
            "계단 오르기",
            "자전거",
            "사이클 머신",
            "줄넘기",
            "필라테스",
            "에어로빅",
            "복싱",
            "등산",
        ]

        # 기타 운동 태그 프리셋
        etc_workout_list = ["수영", "테니스", "배드민턴", "골프", "농구", "축구", "야구"]

        # 식단 태그 프리셋
        food_list = ["평소식단", "저탄고지", "간헐적단식", "치팅데이"]

        # 근육 태그 프리셋
        muscle_list = ["삼각근", "승모근", "광배근", "대흉근"]

        tag_preset = [
            anaerobic_sublist["back"],  # "등운동"
            anaerobic_sublist["chest"],  # "가슴운동"
            anaerobic_sublist["deltoid"],  # "어깨운동"
            anaerobic_sublist["leg"],  # "하체운동"
            anaerobic_sublist["abs"],  # "복근운동"
            anaerobic_sublist["arm"],  # "팔운동"
            aerobic_list,  # "유산소"
            etc_workout_list,  # "기타운동"
            [],  # "장소"
            food_list,  # "식단"
            [],  # "정보"
            [],  # "유머"
            [],  # "유튜브"
            [],  # "연구/기사"
            [],  # "루틴"
            muscle_list,  # "근육"
            [],  # "잡담"
        ]

        for class_name, tag_names in zip(class_list, tag_preset):

            tag_class = TagClass.objects.create(
                class_name=class_name,
                class_type=get_tag_class_type(class_name),
                color=get_random_color(),
            )
            for tag_name in tag_names:
                tag = Tag.objects.create(tag_name=tag_name, tag_class=tag_class)

                if get_tag_class_type(class_name) == 'workout':
                    Information.objects.create(name=tag_name, tag=tag)

        self.stdout.write(
            self.style.SUCCESS(
                f"Tag classes & Tag & Information presets are prepared automatically."
            )
        )
