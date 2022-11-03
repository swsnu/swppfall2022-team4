from django.core.management import BaseCommand
from comments.models import Comment


class Command(BaseCommand):
    help = "This command deletes all of the comments"

    def handle(self, *args, **options):
        # Subclass must implement this method.

        all_comments = Comment.objects.all()
        all_comments_num = Comment.objects.count()

        for comment in all_comments:
            comment.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"{all_comments_num} Comments are deleted automatically."
            )
        )
