from django.core.management import BaseCommand

from workouts.models import FitElementType
import csv

class Command(BaseCommand):
    help = "This command creates default fitelement types"

    def handle(self, *args, **options):
        f = open('workouts/resource/workout_types.csv', 'r', encoding='cp949')
        next(f)
        rdr = csv.reader(f)
        for line in rdr:
            fitelement_type = FitElementType(
                name=line[1],
                korean_name=line[2],
                category=line[3],
                calories=int(line[4])
            )
            fitelement_type.save()
        
        f.close()
