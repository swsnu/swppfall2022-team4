import random

from django.core.management import BaseCommand
from tags.models import TagClass, Tag


def get_random_color():
    """
    랜덤 색상 문자열을 생성합니다.
    태그 색상을 임의로 생성하기 위한 함수입니다.
    :return result: 생성된 색상 문자열
    """
    return f'hsl({360* random.random()},{25 + 70 * random.random()}%,{75 + 10 * random.random()}%)'


class Command(BaseCommand):
    help = "This command prepares some tag classes & basic tags."

    def handle(self, *args, **options):
        # Subclass must implement this method.
        class_list = ["무산소", "유산소", "장소", "식단", "정보", "유머", "유튜브", "루틴", "근육", "잡담"]

        # 무산소 태그 프리셋
        anaerobic_sublist = {}
        anaerobic_sublist["등"] = ["데드리프트", "랫풀다운", "턱걸이", "바벨로우", "케이블로우", "바벨풀오버"]
        anaerobic_sublist["가슴"] = ["벤치프레스", "딥스", "플라이", "팔굽혀펴기", "덤벨풀오버"]
        anaerobic_sublist["어깨"] = ["밀리터리프레스", "업라이트로우"]
        anaerobic_sublist["하체"] = ["스쿼트", "레그프레스"]
        anaerobic_sublist["복근"] = ["크런치", "윗몸일으키기"]

        anaerobic_list = []
        for key in anaerobic_sublist.keys():
            anaerobic_list += anaerobic_sublist[key]

        # 유산소 태그 프리셋
        aerobic_list = ["자전거", "조깅", "수영", "트레드밀"]

        # 식단 태그 프리셋
        food_list = ["저탄고지", "간헐적단식", "치팅데이"]

        tag_preset = [anaerobic_list, aerobic_list, [], food_list, [], [], [], [], [], []]

        for class_name, tag_names in zip(class_list, tag_preset):
            tag_class = TagClass.objects.create(class_name=class_name, color=get_random_color())
            for tag_name in tag_names:
                Tag.objects.create(tag_name=tag_name, tag_class=tag_class)

        self.stdout.write(
            self.style.SUCCESS(f"Tag classes & Tag presets are prepared automatically.")
        )
