from django.core.management import BaseCommand

from workouts.models import FitElement, DailyLog
from tags.models import Tag
from users.models import User
from django_seed import Seed
from django.contrib.admin.utils import flatten
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = "This command creates default fitelement logs on specific date"

    def add_arguments(self, parser):
        parser.add_argument(
            "-n", "--number", type=int, default=0, help="# of logs to create."
        )
        parser.add_argument("-i", "--id", type=int, default=1, help="user_id")
        parser.add_argument(
            "-d",
            "--date",
            type=str,
            default=datetime.now().strftime("%Y-%m-%d"),
            help="# of logs to create on specific date(default=today)",
        )

    def handle(self, *args, **options):
        number = options.get("number")
        specific_date = options.get("date")
        user_id = options.get("id")
        user = User.objects.get(id=user_id)

        seeder = Seed.seeder()
        seeder.add_entity(
            FitElement,
            number,
            {
                "workout_type": lambda x: Tag.objects.get(id=random.randint(1, 44)),
                "author": user,
                "type": "log",
                "weight": lambda x: random.randint(1, 120),
                "rep": lambda x: random.randint(1, 20),
                "set": lambda x: random.randint(1, 20),
                "time": lambda x: random.randint(1, 120),
                "date": specific_date,
            },
        )

        seeder.execute()

        seeder_daily_log = Seed.seeder()
        if not DailyLog.objects.filter(date=specific_date).exists():
            seeder_daily_log.add_entity(
                DailyLog,
                1,
                {
                    "date": specific_date,
                    "author": user,
                    "memo": None,
                    "calories": sum(
                        [
                            x.workout_type.calories * x.time
                            for x in FitElement.objects.filter(
                                date=specific_date, author_id=user.id
                            )
                        ]
                    ),
                    "log_index": [
                        x.id
                        for x in FitElement.objects.filter(
                            date=specific_date, author_id=user.id
                        )
                    ],
                },
            )
        try:
            created_daily_logs_ = seeder_daily_log.execute()
        except:
            created_daily_logs_ = []
        if len(created_daily_logs_) == 0:
            specific_daily_log = DailyLog.objects.get(
                date=specific_date, author_id=user.id
            ).pk

        else:
            specific_daily_log = flatten(list(created_daily_logs_.values()))[0]

        daily_log = DailyLog.objects.get(id=specific_daily_log)
        daily_log.log_index = [
            x.id
            for x in FitElement.objects.filter(date=specific_date, author_id=user.id)
        ]
        daily_log.calories = sum(
            [
                x.workout_type.calories * x.time
                for x in FitElement.objects.filter(
                    date=specific_date, author_id=user.id
                )
            ]
        )
        daily_log.save()

        for log in FitElement.objects.filter(
            date=daily_log.date, author_id=daily_log.author.id
        ):
            daily_log.fit_element.add(log)

        self.stdout.write(
            self.style.SUCCESS(f"{number} Logs are generated automatically.")
        )
