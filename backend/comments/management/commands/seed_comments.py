import random
import datetime

from django.core.management import BaseCommand
from django.contrib.admin.utils import flatten
from django_seed import Seed
from users.models import User
from posts.models import Post
from comments.models import Comment


class Command(BaseCommand):
    help = "This command creates many comments"

    def add_arguments(self, parser):
        parser.add_argument(
            "-n", "--number", type=int, default=0, help="# of comments to create."
        )

    def handle(self, *args, **options):
        # Subclass must implement this method.
        number = options.get("number")
        seeder = Seed.seeder()

        all_posts = Post.objects.all()
        all_users = User.objects.all()
        comments_before = flatten(list(Comment.objects.all().values()))

        seeder.add_entity(
            Comment,
            number,
            {
                "post": lambda x: random.choice(all_posts),
                "author": lambda x: random.choice(all_users),
                "content": lambda x: seeder.faker.sentence(),
                "created": lambda x: seeder.faker.date_between_dates(
                    datetime.datetime(2022, 1, 1), datetime.datetime(2022, 7, 1)
                ),
                "updated": lambda x: seeder.faker.date_between_dates(
                    datetime.datetime(2022, 7, 2), datetime.datetime(2022, 11, 2)
                ),
                "parent_comment": lambda x: None,
            },
        )

        created_comments_ = seeder.execute()
        created_comments = flatten(list(created_comments_.values()))

        for comment_pk in created_comments:
            comment = Comment.objects.get(pk=comment_pk)

            for comment_before in comments_before:
                parent_comment = Comment.objects.get(pk=comment_before["id"])
                if parent_comment.post != comment.post:
                    continue
                if random.randint(1, 10) <= 3:
                    comment.parent_comment = parent_comment
                    comment.save()
                    break
            for user in User.objects.order_by("?"):
                if random.randint(1, 10) <= 6:  # 60% like
                    comment.liker.add(user)
            for user in User.objects.order_by("?"):
                if random.randint(1, 10) <= 2:  # 20% dislike
                    comment.disliker.add(user)

        self.stdout.write(
            self.style.SUCCESS(f"{number} Comments are generated automatically.")
        )
