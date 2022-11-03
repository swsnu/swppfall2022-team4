import random
import datetime

from django.core.management import BaseCommand
from django_seed import Seed
from users import models as user_models
from posts import models


class Command(BaseCommand):
    help = "This command creates many posts"

    def add_arguments(self, parser):
        parser.add_argument(
            "-n", "--number", type=int, default=0, help="# of posts to create."
        )

    def handle(self, *args, **options):
        # Subclass must implement this method.
        number = options.get("number")
        seeder = Seed.seeder()

        all_users = user_models.User.objects.all()

        seeder.add_entity(
            models.Post,
            number,
            {
                "title": lambda x: seeder.faker.company(),
                "author": lambda x: random.choice(all_users),
                "content": lambda x: seeder.faker.sentence(),
                "like_num": lambda x: random.randint(0, 100),
                "dislike_num": lambda x: random.randint(0, 30),
                "scrap_num": lambda x: random.randint(0, 10),
                "created": lambda x: seeder.faker.date_between_dates(
                    datetime.datetime(2022, 1, 1), datetime.datetime(2022, 7, 1)
                ),
                "updated": lambda x: seeder.faker.date_between_dates(
                    datetime.datetime(2022, 7, 2), datetime.datetime(2022, 11, 2)
                ),
            },
        )

        seeder.execute()

        self.stdout.write(
            self.style.SUCCESS(f"{number} Posts are generated automatically.")
        )
