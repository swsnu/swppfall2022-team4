import random
import datetime

from django.core.management import BaseCommand
from django.contrib.admin.utils import flatten
from django_seed import Seed
from users.models import User
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

        all_users = User.objects.all()

        seeder.add_entity(
            models.Post,
            number,
            {
                "title": lambda x: seeder.faker.company(),
                "author": lambda x: random.choice(all_users),
                "content": lambda x: seeder.faker.sentence(),
                "created": lambda x: seeder.faker.date_between_dates(
                    datetime.datetime(2022, 1, 1), datetime.datetime(2022, 7, 1)
                ),
                "updated": lambda x: seeder.faker.date_between_dates(
                    datetime.datetime(2022, 7, 2), datetime.datetime(2022, 11, 2)
                ),
            },
        )

        created_posts_ = seeder.execute()
        created_posts = flatten(list(created_posts_.values()))

        for post_pk in created_posts:
            post = models.Post.objects.get(pk=post_pk)

            for user in User.objects.order_by("?"):
                rand_num = random.randint(1, 10)
                if rand_num <= 6:  # 60% like
                    post.liker.add(user)
            for user in User.objects.order_by("?"):
                rand_num = random.randint(1, 10)
                if rand_num <= 2:  # 20% dislike
                    post.disliker.add(user)
            for user in User.objects.order_by("?"):
                rand_num = random.randint(1, 10)
                if rand_num <= 1:  # 10% scrap
                    post.scraper.add(user)

        self.stdout.write(
            self.style.SUCCESS(f"{number} Posts are generated automatically.")
        )
