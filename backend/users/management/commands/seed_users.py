import bcrypt
import random
import datetime

from django.core.management import BaseCommand
from django_seed import Seed
from users.models import User


class Command(BaseCommand):
    help = "This command creates many users"

    def add_arguments(self, parser):
        parser.add_argument(
            "-n", "--number", type=int, default=0, help="# of users to create."
        )

    def handle(self, *args, **options):
        number = options.get("number")
        seeder = Seed.seeder()

        User.objects.create(
            username='testuser',
            hashed_password=bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt()).decode(
                'utf-8'
            ),
            nickname='테스트_유저',
            gender='male',
            age=20,
            height=170,
            weight=70.5,
            image="profile_default.png",
            exp=0,
            level=1,
        )

        seeder.add_entity(
            User,
            number,
            {
                "username": lambda x: seeder.faker.word() + str(random.randint(0, 999)),
                "hashed_password": bcrypt.hashpw(
                    "password".encode('utf-8'),
                    bcrypt.gensalt()
                ).decode('utf-8'),
                "nickname": lambda x: seeder.faker.name()[:8],
                "image": "profile_default.png",
                "gender": lambda x: random.choice(["male", "female"]),
                "height": lambda x: random.randint(150, 190),
                "weight": lambda x: random.randint(45, 130),
                "age": lambda x: random.randint(15, 60),
                "exp": lambda x: random.randint(0, 100),
                "level": lambda x: random.randint(1, 20),
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
            self.style.SUCCESS(f"{number} Users are generated automatically.")
        )