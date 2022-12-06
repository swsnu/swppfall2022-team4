import random
from datetime import datetime, timedelta

from django.core.management import BaseCommand
from django.contrib.admin.utils import flatten
from django_seed import Seed
from users.models import User
from tags.models import Tag
from groups.models import Group, GroupCert, JoinRequest
from workouts.models import FitElement

class Command(BaseCommand):
    help = "This command creates many groups"

    def add_arguments(self, parser):
        parser.add_argument("-n", "--number", type=int, default=0, help="# of groups to create.")

    def handle(self, *args, **options):
        number = options.get("number")
        seeder = Seed.seeder()

        all_users = User.objects.all()

        seeder.add_entity(
            Group,
            number,
            {
                "group_name": lambda x: seeder.faker.company(),
                "group_leader": lambda x: random.choice(all_users),
                "number": lambda x: random.randint(50,100),
                "start_date": lambda x: seeder.faker.date_between_dates(
                    datetime(2022, 1, 1), datetime(2022, 7, 1)
                ),
                "end_date": lambda x: seeder.faker.date_between_dates(
                    datetime(2022, 7, 2), datetime(2023, 12, 30)
                ),
                "member_number": lambda x: 0,
                "description": lambda x: seeder.faker.sentence(),
                "free": lambda x: bool(random.getrandbits(1)),
                "lat": lambda x: random.randint(32,38),
                "lng": lambda x: random.randint(127,129),
                "address": lambda x: seeder.faker.address(),
            },
        )

        created_groups_ = seeder.execute()
        created_groups = flatten(list(created_groups_.values()))
        
        today = datetime.now().strftime("%Y-%m-%d")

        for group_pk in created_groups:
            group = Group.objects.get(pk=group_pk)
            join = JoinRequest(group=group)
            join.save()

            #goal add
            for tag in Tag.objects.filter(tag_name='레그 프레스').all():
                if random.randint(1, 100) <= 100:
                    fit = FitElement(
                            author=group.group_leader,
                            type='goal',
                            workout_type=tag,
                            weight=100,
                            rep=10,
                            set=10,
                            time=10,
                        )
                    fit.save()
                    group.goal.add(fit)

            #members add
            for user in User.objects.order_by("?"):
                if random.randint(1, 10) <= 1:
                    group.members.add(user)
                    group.member_number += 1
                    cert = GroupCert(group=group, member=user, date=today)
                    cert.save()
                    cert.fit_element.add(group.goal.get(weight=100))
                elif random.randint(1, 10) >= 9:
                    if (group.free==False):
                        join.members.add(user)

            #tags
            for tag in Tag.objects.all():
                if random.randint(1, 100) <= 3:
                    group.tags.add(tag)
                    group.prime_tag = tag
                    group.save()
