from rest_framework import viewsets, views, status
from .models import QuestionBankModel, QuizModel, QuizHistoryModel, Category, SubCategory
from .serializers import (
    QuestionBankModelSerializer, 
    QuizModelSerializer, 
    UserSerialiser, 
    RegisteredUsersSerializer, 
    LoginSerializer,
    GetQuestionSerializer,
    GetAnswerSerializer,
    QuizHistoryModelPostSerializer,
    QuizHistoryModelGetSerializer,
    CategorySerializer,
    SubCategorySerializer,
    PracticeQuestionFetchSerializer,
    )
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.http import Http404

# Create your views here.


class IsAdminOrOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        
        return obj.user == request.user


class QuestionBankViewset(viewsets.ModelViewSet):
    queryset = QuestionBankModel.objects.all()
    serializer_class = QuestionBankModelSerializer



class QuizViewset(viewsets.ModelViewSet):
    queryset = QuizModel.objects.all()
    serializer_class = QuizModelSerializer


class QuizHistoryViewset(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminOrOwner]
    authentication_classes = [JWTAuthentication]

    def post(self, request, *args, **kwargs):
        data = request.data 

        data['user'] = request.user.id

        serializer = QuizHistoryModelPostSerializer(data = data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status= status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, *args, **kwargs):
        user_id = int(request.query_params.get('user_id', request.user.id))
        quiz_history = QuizHistoryModel.objects.filter(user = user_id)
        serializer = QuizHistoryModelGetSerializer(quiz_history, many = True)
        return Response(serializer.data, status= status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        quizHistoryID = request.data.get('id', None)
        
        if quizHistoryID is None:
            return Response({'detail': 'History ID must be provided.'}, status= status.HTTP_400_BAD_REQUEST)
        
        try:
            quizHistoryObject = QuizHistoryModel.objects.get(id = quizHistoryID)
        except QuizHistoryModel.DoesNotExist:
            return Response({'detail': 'Not found or not authorized'}, status= status.HTTP_404_NOT_FOUND)
        
        quizHistoryObject.delete()
        return Response({'detail': 'History deleted successfully.'}, status= status.HTTP_204_NO_CONTENT)
        

class LoginView(views.APIView):
    permission_classes= [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data = request.data)
        serializer.is_valid(raise_exception= True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(request, email = email, password= password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'username': user.username,
                'specialAccess': user.is_superuser
                })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        

class UserDetailsView(views.APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try: 
            user = request.user

            return Response({
                'username': user.username,
                'specialAccess': user.is_superuser
            })
        
        except Exception as e:
            raise AuthenticationFailed('Failed to retrive user details.')


@api_view(['GET'])
def view_all_questions(request):
    category = request.GET.get('category')

    if category:
        questions = QuestionBankModel.objects.filter(category = category)
        if not questions.exists():
            return Response({'error': 'No questions in the category.'}, status= status.HTTP_404_NOT_FOUND)
    else:
        questions = QuestionBankModel.objects.all()

    serializer = QuestionBankModelSerializer(questions, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def view_all_quiz(request):
    quizzes = QuizModel.objects.all()
    serializer = QuizModelSerializer(quizzes, many = True)

    return Response(serializer.data)


@api_view(['POST'])
def register(request):
    email = request.data.get('email')

    if User.objects.filter(email = email).exists():
        return Response({'error': 'Email already exists.'}, status= status.HTTP_400_BAD_REQUEST)

    serializer = UserSerialiser(data = request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status= status.HTTP_201_CREATED)

    return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def registered_users(request):
    users = User.objects.all()
    serializer = RegisteredUsersSerializer(users, many = True)

    return Response(serializer.data)


@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id = user_id)
    except User.DoesNotExist:
        raise Http404
    
    user.delete()
    return Response(status= status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
def delete_quiz(request, quiz_id):
    try:
        quiz = QuizModel.objects.get(id = quiz_id)
    except QuizModel.DoesNotExist:
        return Response({'error': 'Quiz not found.'}, status= status.HTTP_404_NOT_FOUND)
    

    quiz.delete()
    return Response({'message': 'Quiz deleted successfully.'}, status= status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
def delete_question(request, question_id):
    try:
        question = QuestionBankModel.objects.get(id = question_id)
    except QuestionBankModel.DoesNotExist:
        return Response({'error': 'Question not found.'}, status= status.HTTP_404_NOT_FOUND)
    
    question.delete()
    return Response({'message': 'Question deleted Successfully.'}, status= status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
def edit_question(request, question_id):
    try: 
        question = QuestionBankModel.objects.get(id = question_id)
    except QuestionBankModel.DoesNotExist:
        return Response({'error': 'Question not found.'}, status= status.HTTP_404_NOT_FOUND)
    
    serializer = QuestionBankModelSerializer(question, data = request.data, partial = True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status= status.HTTP_200_OK)
    
    return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def edit_quiz(request, quiz_id):
    try:
        quiz = QuizModel.objects.get(id = quiz_id)
    except QuizModel.DoesNotExist:
        return Response({'error': 'Quiz not found.'}, status= status.HTTP_404_NOT_FOUND)
    
    serializer = QuizModelSerializer(quiz, data = request.data, partial = True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status= status.HTTP_200_OK)
    
    return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_question(request, question_id):
    try:
        question = QuestionBankModel.objects.get(id = question_id)
    except QuestionBankModel.DoesNotExist:
        return Response({'error': 'Question Not Found.'}, status= status.HTTP_404_NOT_FOUND)
    
    serializer = GetQuestionSerializer(question)

    return Response(serializer.data, status= status.HTTP_200_OK)


@api_view(['GET'])
def get_answer(request, question_id):
    try:
        question = QuestionBankModel.objects.get(id = question_id)
    except QuestionBankModel.DoesNotExist:
        return Response({'error': 'Question not Found.'}, status= status.HTTP_404_NOT_FOUND)
    
    serializer = GetAnswerSerializer(question)

    return Response(serializer.data, status= status.HTTP_200_OK)


@api_view(['POST', 'GET', 'DELETE'])
def manage_category(request, category_id = None):
    if request.method == 'POST':
        serializer = CategorySerializer(data = request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status= status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many = True)
        return Response(serializer.data)

    if request.method == 'DELETE':
        if category_id:
            try:
                category = Category.objects.get(id = category_id)
                category.delete()
                return Response({'message': 'Category deleted'}, status= status.HTTP_204_NO_CONTENT)
            except Category.DoesNotExist:
                return Response({'error': 'Category not found.'}, status= status.HTTP_404_NOT_FOUND)
        
        return Response({'error': 'Category ID required for deletion.'}, status= status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', 'POST', 'DELETE'])
def manage_sub_category(request, subCategoryID = None):
    if request.method == 'POST':
        serializer = SubCategorySerializer(data = request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status= status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    
    
    if request.method == 'GET':
        subCategories = SubCategory.objects.all()
        serializer = SubCategorySerializer(subCategories, many = True)
        
        return Response(serializer.data)
    
    
    if request.method == 'DELETE':
        if subCategoryID:
            try:
                sub_category = SubCategory.objects.get(id = subCategoryID)
                sub_category.delete()
                return Response({'message': 'Sub-Category deleted.'}, status= status.HTTP_204_NO_CONTENT)
            except SubCategory.DoesNotExist:
                return Response({'error': 'Sub-Category not found.'}, status= status.HTTP_404_NOT_FOUND)
            
           
        return Response({'error': 'Sub-Category ID required for deletion.'}, status= status.HTTP_400_BAD_REQUEST) 
    

@api_view(['GET'])
def get_questions_by_sub_category(request, subCategoryID):
    try:
        questions = QuestionBankModel.objects.filter(sub_category = subCategoryID)
    except QuestionBankModel.DoesNotExist:
        return Response({'error': 'Questions with the sub category does not exist.'}, status= status.HTTP_404_NOT_FOUND)

    serializer = PracticeQuestionFetchSerializer(questions, many = True)
    return Response(serializer.data, status= status.HTTP_200_OK)