from django.core.management import BaseCommand
from posts.models import Post


class Command(BaseCommand):
    help = "This command deletes all of the posts"

    def handle(self, *args, **options):
        # Subclass must implement this method.

        all_posts = Post.objects.all()
        all_posts_num = Post.objects.count()

        for post in all_posts:
            post.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"{all_posts_num} Posts are deleted automatically."
            )
        )
