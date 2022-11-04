import random
import datetime

from django.core.management import BaseCommand
from django_seed import Seed
from users.models import User
from chatrooms.models import Chatroom, Message


class Command(BaseCommand):
    help = "This command creates many messages"

    def add_arguments(self, parser):
        parser.add_argument(
            "-n", "--number", type=int, default=0, help="# of messages to create."
        )

    def handle(self, *args, **options):
        number = options.get("number")
        seeder = Seed.seeder()

        all_chatrooms = Chatroom.objects.all()

        for chatroom in all_chatrooms:
            user1 = User.objects.get(username=chatroom.username1)
            user2 = User.objects.get(username=chatroom.username2)
            seeder.add_entity(
                Message,
                number,
                {
                    "room": chatroom,
                    "author": lambda x: random.choice([user1, user2]),
                    "content": lambda x: seeder.faker.sentence(),
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
            self.style.SUCCESS(f"{number * len(all_chatrooms)} Messages are generated automatically.")
        )