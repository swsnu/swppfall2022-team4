# Generated by Django 4.1.2 on 2022-11-28 15:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        ('groups', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='JoinRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='join_request', to='groups.group')),
                ('members', models.ManyToManyField(related_name='join_request', to='users.user')),
            ],
        ),
    ]