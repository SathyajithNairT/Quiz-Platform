from rest_framework import serializers
from .models import QuestionBankModel, QuizModel, QuizHistoryModel, Category, SubCategory
from django.contrib.auth.models import User


class UserSerialiser(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)

    class Meta:
        model = User 
        fields = ['username', 'email', 'password']

    def validate(self, data):
        if User.objects.filter(username = data.get('username')).exists():
            raise serializers.ValidationError({'username': 'Username already exists.'})
            

        if User.objects.filter(email = data.get('email')).exists():
            raise serializers.ValidationError({'email': 'Email already exists.'})

        return data 

    def create(self, validated_data):
        user = User.objects.create_user(
            username= validated_data['username'],
            email= validated_data['email'],
            password= validated_data['password']
        )

        return user 
        

class RegisteredUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['id', 'username', 'email']


class QuestionBankModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionBankModel
        fields = '__all__'



class QuizModelSerializer(serializers.ModelSerializer):
    questions = serializers.PrimaryKeyRelatedField(queryset = QuestionBankModel.objects.all(), many = True)
    number_of_questions = serializers.SerializerMethodField()

    class Meta:
        model = QuizModel
        fields = '__all__'

    def get_number_of_questions(self, obj):
        return obj.number_of_questions


class QuizHistoryModelPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizHistoryModel
        fields = ['user', 'quiz_name', 'score']


class QuizHistoryModelGetSerializer(serializers.ModelSerializer):
    formatted_score = serializers.SerializerMethodField()
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = QuizHistoryModel
        fields = '__all__'

    def get_formatted_score(self, obj):
        return obj.get_formatted_score()
    
    def get_formatted_date(self, obj):
        return obj.get_formatted_date()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only = True)


class GetQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionBankModel
        fields = ['question', 'option_a', 'option_b', 'option_c']


class GetAnswerSerializer(serializers.ModelSerializer):
    correct_answer_text = serializers.SerializerMethodField()
    
    class Meta:
        model = QuestionBankModel
        fields = ['id', 'correct_answer', 'question', 'correct_answer_text']
        
    def get_correct_answer_text(self, obj):
        return obj.get_correct_answer_text()
    

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
   
        
class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = '__all__'
        

class PracticeQuestionFetchSerializer(serializers.ModelSerializer):
    correct_answer_text = serializers.SerializerMethodField()

    class Meta:
        model = QuestionBankModel
        fields = ['id' ,'question', 'option_a', 'option_b', 'option_c', 'correct_answer', 'correct_answer_text']

    def get_correct_answer_text(self, obj):
        return obj.get_correct_answer_text()