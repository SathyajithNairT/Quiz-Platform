from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

# Create your models here.
    

class Category(models.Model):
    category_name = models.CharField(max_length = 250, unique = True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.category_name


class SubCategory(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete= models.CASCADE,
        related_name= 'subcategories'
    )
    
    sub_category_name = models.CharField(max_length= 250)

    class Meta:
        verbose_name_plural = 'SubCategories'
        unique_together = ('category', 'sub_category_name')

    def __str__(self):
        return f'{self.category.category_name} - {self.sub_category_name}'

    
class QuestionBankModel(models.Model):
    
    option_choices = [
        ('A', 'Option A'),
        ('B', 'Option B'),
        ('C', 'Option C')
    ]
    
    question = models.TextField(
        help_text= 'Enter the full question text here. Be descriptive.',
        blank=False
    )
    option_a = models.CharField(
        max_length= 250, 
        help_text= 'Provide Option (A)', 
        blank=False
    )
    option_b = models.CharField(
        max_length= 250, 
        help_text= 'Provide Option (B)', 
        blank=False
    )
    option_c = models.CharField(
        max_length= 250, 
        help_text= 'Provide Option (C)', 
        blank=False
    )
    correct_answer = models.CharField(
        max_length= 1,
        choices= option_choices,
        help_text= 'Select the correct answer option (A, B or C).',
        blank=False
    )
    
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_DEFAULT, 
        default=1
    )

    sub_category = models.ForeignKey(
        SubCategory,
        on_delete= models.SET_DEFAULT,
        default= 1
    )

    
    def clean(self):
        super().clean()
        
        if self.correct_answer not in [choice[0] for choice in self.option_choices]:
            raise ValidationError("Correct answer must match one of the provided options.")
        
        
        if any(opt == '' for opt in [self.option_a, self.option_b, self.option_c]):
            raise ValidationError('All options must be provided.')
        
    
    def get_correct_answer_text(self):
        options = {
            'A': self.option_a,
            'B': self.option_b,
            'C': self.option_c
        }
    
        return options.get(self.correct_answer, 'Unknown Option')
    
        
    def __str__(self):
        return self.question
    
    
    class Meta:
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'



class QuizModel(models.Model):
    title = models.CharField(max_length= 500)
    description = models.TextField()
    duration = models.PositiveIntegerField()
    questions = models.ManyToManyField('QuestionBankModel', blank= True, related_name= 'Quizzes')


    def clean(self):
        super().clean()

        if self.duration < 1:
            raise ValidationError('Duration must be greater than 0 and an integer.')

    @property
    def number_of_questions(self):
        return self.questions.count()

    def __str__(self):
        return self.title
    

class QuizHistoryModel(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name= 'quiz_history')
    quiz_name = models.CharField(max_length= 1000)
    score = models.DecimalField(max_digits= 4, decimal_places= 1)
    date_taken = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.quiz_name} - {self.get_formatted_score()} on {self.get_formatted_date()}"


    def get_formatted_score(self):
        if self.score % 1 == 0:
            return f'{int(self.score)}%'
        else:
            return f'{self.score}%'
        
        
    def get_formatted_date(self):
        return self.date_taken.strftime('%B %d, %Y')