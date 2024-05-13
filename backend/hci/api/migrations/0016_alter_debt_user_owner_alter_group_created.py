# Generated by Django 5.0.6 on 2024-05-13 11:25

import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_rename_debts_debt_debts_amounts_alter_group_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='debt',
            name='user_owner',
            field=models.ForeignKey(choices=[('hci', 'hci'), ('asd', 'asd'), ('rob', 'rob'), ('roba', 'roba'), ('robi', 'robi'), ('rbi', 'rbi'), ('robaaa', 'robaaa'), ('zxc', 'zxc'), ('robzxc', 'robzxc'), ('ccc', 'ccc')], default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='group',
            name='created',
            field=models.DateField(default='1111-11-11', verbose_name=datetime.datetime(2024, 5, 13, 11, 25, 52, 135138, tzinfo=datetime.timezone.utc)),
        ),
    ]
