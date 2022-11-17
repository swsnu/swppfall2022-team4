# Generated by Django 4.1.3 on 2022-11-17 21:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_user_follower_user_following'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='follower',
            field=models.ManyToManyField(blank=True, related_name='+', to='users.user'),
        ),
        migrations.AlterField(
            model_name='user',
            name='following',
            field=models.ManyToManyField(blank=True, related_name='+', to='users.user'),
        ),
    ]
