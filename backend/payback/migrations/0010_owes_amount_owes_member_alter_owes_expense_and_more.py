# Generated by Django 5.0.4 on 2024-06-02 21:19

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("payback", "0009_expense_owes"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="owes",
            name="amount",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name="owes",
            name="member",
            field=models.ForeignKey(
                default=0,
                on_delete=django.db.models.deletion.CASCADE,
                to="payback.membership",
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="owes",
            name="expense",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="payback.expense"
            ),
        ),
        migrations.AlterField(
            model_name="owes",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
