# Generated by Django 5.0.6 on 2024-05-11 16:33

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_group_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='created',
            field=models.DateField(default='1111-11-11', verbose_name=datetime.datetime(2024, 5, 11, 16, 33, 34, 904713, tzinfo=datetime.timezone.utc)),
        ),
    ]
