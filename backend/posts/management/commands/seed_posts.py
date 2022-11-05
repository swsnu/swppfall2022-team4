import random
import datetime

from django.core.management import BaseCommand
from django.contrib.admin.utils import flatten
from django_seed import Seed
from users.models import User
from tags.models import Tag
from posts.models import Post


class Command(BaseCommand):
    help = "This command creates many posts"

    def add_arguments(self, parser):
        parser.add_argument("-n", "--number", type=int, default=0, help="# of posts to create.")

    def handle(self, *args, **options):
        # Subclass must implement this method.
        number = options.get("number")
        seeder = Seed.seeder()

        all_users = User.objects.all()

        seeder.add_entity(
            Post,
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
            post = Post.objects.get(pk=post_pk)

            # 60% like
            for user in User.objects.order_by("?"):
                if random.randint(1, 10) <= 6:
                    post.liker.add(user)

            # 20% dislike
            for user in User.objects.order_by("?"):
                if random.randint(1, 10) <= 2:
                    post.disliker.add(user)

            # 10% scrap
            for user in User.objects.order_by("?"):
                if random.randint(1, 10) <= 1:
                    post.scraper.add(user)

            # 5% tag
            for tag in Tag.objects.all():
                if random.randint(1, 100) <= 5:
                    post.tags.add(tag)

        self.stdout.write(self.style.SUCCESS(f"{number} Posts are generated automatically."))
