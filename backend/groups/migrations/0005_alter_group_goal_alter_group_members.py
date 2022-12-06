# Generated by Django 4.1.2 on 2022-12-06 12:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0007_rename_index_dailylog_log_index'),
        ('users', '0001_initial'),
        ('groups', '0004_merge_0002_joinrequest_0003_group_prime_tag'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='goal',
            field=models.ManyToManyField(blank=True, related_name='group_goal', to='workouts.fitelement'),
        ),
        migrations.AlterField(
            model_name='group',
            name='members',
            field=models.ManyToManyField(blank=True, related_name='group', to='users.user'),
        ),
    ]