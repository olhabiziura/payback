from django.apps import AppConfig
import os

class PaybackConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "payback"
    def ready(self):
        from .utils import start_background_task
        if os.environ.get('RUN_MAIN', None) != 'true':
            print("----------------------------------------- start")
            start_background_task()