from django.core.management import BaseCommand

from workouts.models import FitElement, DailyLog
from tags.models import Tag
from users.models import User
from django_seed import Seed
from django.contrib.admin.utils import flatten
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = "This command creates default fitelement logs"

    def add_arguments(self, parser):
        parser.add_argument(
            "-n", "--number", type=int, default=0, help="# of logs to create."
        )

    def handle(self, *args, **options):
        number = options.get("number")
        all_users = User.objects.all()

        seeder = Seed.seeder()
        seeder.add_entity(
            FitElement,
            number,
            {
                "workout_type": lambda x: Tag.objects.get(id=random.randint(1, 44)),
                "author": lambda x: random.choice(all_users),
                "type": "log",
                "weight": lambda x: random.randint(1, 120),
                "rep": lambda x: random.randint(1, 20),
                "set": lambda x: random.randint(1, 20),
                "time": lambda x: random.randint(1, 120),
                "date": lambda x: seeder.faker.date_between_dates(
                    datetime(2022, 11, 20), datetime.now()
                ),
            },
        )

        seeder.execute()

        # 시작일,종료일 설정
        start = "2022-11-20"
        start_date = datetime.strptime(start, "%Y-%m-%d")
        last_date = datetime.now()

        seeder_daily_log = Seed.seeder()
        for user in all_users:
            start_date = datetime.strptime(start, "%Y-%m-%d")
            while start_date <= last_date:
                if not DailyLog.objects.filter(date=start_date).exists():
                    seeder_daily_log.add_entity(
                        DailyLog,
                        1,
                        {
                            "date": start_date,
                            "author": user,
                            "memo": None,
                            "calories": sum(
                                [
                                    x.workout_type.calories * x.time
                                    for x in FitElement.objects.filter(
                                        date=start_date, author_id=user.id
                                    )
                                ]
                            ),
                            "log_index": [
                                x.id
                                for x in FitElement.objects.filter(
                                    date=start_date, author_id=user.id
                                )
                            ],
                        },
                    )
                start_date += timedelta(days=1)

        created_daily_logs_ = seeder_daily_log.execute()
        created_daily_logs = flatten(list(created_daily_logs_.values()))

        for daily_log_pk in created_daily_logs:
            daily_log = DailyLog.objects.get(id=daily_log_pk)

            if len(FitElement.objects.filter(date=daily_log.date, author_id=daily_log.author.id)) > 0:
                daily_log.memo = lambda x: seeder.faker.sentence(len=10)

            for log in FitElement.objects.filter(date=daily_log.date, author_id=daily_log.author.id):
                daily_log.fit_element.add(log)

        self.stdout.write(self.style.SUCCESS(f"{number} Logs are generated automatically."))
