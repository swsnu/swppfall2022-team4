from django.core.management import BaseCommand
from tags.models import TagClass


class Command(BaseCommand):
    help = "This command deletes all of the tag classes, tags"

    def handle(self, *args, **options):
        # Subclass must implement this method.

        all_tag_classes = TagClass.objects.all()

        for tag_class in all_tag_classes:
            tag_class.delete()

        self.stdout.write(self.style.SUCCESS(f"All objects related to tag are deleted automatically."))
