from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    QuestionBankViewset, 
    QuizViewset, 
    LoginView, 
    UserDetailsView,
    QuizHistoryViewset,
    view_all_questions, 
    view_all_quiz,
    delete_quiz,
    register,
    registered_users,
    delete_user,
    delete_question,
    edit_question,
    edit_quiz,
    get_question,
    get_answer,
    manage_category,
    manage_sub_category,
    get_questions_by_sub_category,
    )  
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework_simplejwt.views import(
    TokenRefreshView,
)


router = DefaultRouter()
router.register(r'add-question', QuestionBankViewset, basename= 'add-question')
router.register(r'add-quiz', QuizViewset, basename= 'add-quiz')

@api_view(['GET'])
def api_root(request, format = None):
    return Response({
        'Add Questions': reverse('add-question-list', request= request, format= format),
        'View all Questions': reverse('questions', request= request, format= format),
        'Add Quiz': reverse('add-quiz-list', request= request, format= format),
        'View all Quizzes': reverse('quizzes', request= request, format=format),
        'Register': reverse('register', request= request, format= format),
        'Registered Users': reverse('registered-users', request= request, format= format),
        'Login': reverse('login', request= request, format= format),
    })



urlpatterns = [
    path('', api_root),
    path('', include(router.urls)),
    path('questions/', view_all_questions, name= 'questions'),
    path('quizzes/', view_all_quiz, name = 'quizzes'),
    path('register/', register, name= 'register'),
    path('registered-users/', registered_users, name= 'registered-users'),
    path('login/', LoginView.as_view(), name= 'login'),
    path('delete-user/<int:user_id>/', delete_user, name = 'delete-user'),
    path('delete-quiz/<int:quiz_id>/', delete_quiz, name= 'delete-quiz'),
    path('delete-question/<int:question_id>/', delete_question, name= 'delete-question'),
    path('edit-question/<int:question_id>/', edit_question, name= 'edit-question'),
    path('edit-quiz/<int:quiz_id>/', edit_quiz, name = 'edit-quiz'),
    path('fetch-user/', UserDetailsView.as_view(), name= 'fetch-user'),
    path('access-token/', TokenRefreshView.as_view(), name= 'access-token'),
    path('fetch-question/<int:question_id>/', get_question, name= 'fetch-question'),
    path('fetch-answer/<int:question_id>/', get_answer, name= 'fetch-answer'),
    path('quiz-history/', QuizHistoryViewset.as_view(), name= 'quiz-history'),
    path('manage-category/', manage_category, name = 'manage-category'),
    path('manage-category/<int:category_id>/', manage_category, name= 'manage-category-with-id'),
    path('manage-sub-category/', manage_sub_category, name= 'manage-sub-category'),
    path('manage-sub-category/<int:subCategoryID>/', manage_sub_category, name= 'manage-sub-category-with-id'),
    path('get-questions-by-sub-category/<int:subCategoryID>/', get_questions_by_sub_category, name= 'get-questions-by-sub-category'),
]
