# Generated by Django 4.1.3 on 2022-12-06 21:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tags', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailyLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('memo', models.TextField(null=True)),
                ('calories', models.FloatField(default=0, null=True)),
                ('log_index', models.TextField(null=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='daily_log', to='users.user')),
            ],
        ),
        migrations.CreateModel(
            name='FitElement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('goal', 'goal'), ('log', 'log')], max_length=4)),
                ('period', models.IntegerField(null=True)),
                ('weight', models.IntegerField(null=True)),
                ('rep', models.IntegerField(null=True)),
                ('set', models.IntegerField(null=True)),
                ('time', models.IntegerField(null=True)),
                ('date', models.DateField(null=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fit_element', to='users.user')),
                ('workout_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fit_element', to='tags.tag')),
            ],
        ),
        migrations.CreateModel(
            name='Routine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('calories', models.IntegerField(null=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='routine', to='users.user')),
                ('fit_element', models.ManyToManyField(blank=True, to='workouts.fitelement')),
            ],
        ),
        migrations.CreateModel(
            name='DailyLogImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.CharField(max_length=255)),
                ('daily_log', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='workouts.dailylog')),
            ],
        ),
        migrations.AddField(
            model_name='dailylog',
            name='fit_element',
            field=models.ManyToManyField(blank=True, to='workouts.fitelement'),
        ),
    ]
