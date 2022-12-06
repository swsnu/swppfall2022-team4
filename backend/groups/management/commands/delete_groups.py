from django.core.management import BaseCommand
from groups.models import Group, GroupCert


class Command(BaseCommand):
    help = "This command deletes all of the groups"

    def handle(self, *args, **options):
        # Subclass must implement this method.

        all_groups = Group.objects.all()
        all_groups_num = Group.objects.count()

        for group in all_groups:
            group.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"{all_groups_num} groups are deleted automatically."
            )
        )
