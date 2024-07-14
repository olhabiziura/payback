from django.apps import AppConfig


class PaybackConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "payback"
    def ready(self):
        from .utils import start_background_task
        start_background_task()