from django.contrib import admin
from .models import QuestionBankModel, QuizModel, QuizHistoryModel, Category, SubCategory

# Register your models here.
admin.site.register(QuestionBankModel)
admin.site.register(QuizModel)
admin.site.register(QuizHistoryModel)
admin.site.register(Category)
admin.site.register(SubCategory)
