# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('upload/', views.upload_file, name='upload'),
    path('download/', views.download_files, name='download'),  # 不再需要file_id
    path('data-overview/', views.data_overview, name='data-overview'),  # 数据总览
    path('students/', views.students_list, name='students'),  # 学生信息列表
    path('students/<str:name>/', views.student_detail, name='student-detail'),  # 学生详细信息
]
