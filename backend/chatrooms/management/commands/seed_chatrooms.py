import random

from django.core.management import BaseCommand
from users.models import User
from chatrooms.models import Chatroom


class Command(BaseCommand):
    help = "This command creates many chatrooms"

    def handle(self, *args, **options):
        cnt = 0
        all_users = User.objects.all()
        user_count = len(all_users)

        for i in range(user_count):
            for j in range(i + 1, user_count):
                if random.randint(0, 1) == 0:
                    Chatroom.objects.create(
                        username1=all_users[i].username,
                        username2=all_users[j].username
                    )
                    cnt += 1

        self.stdout.write(
            self.style.SUCCESS(f"{cnt} Chatrooms are generated automatically.")
        )