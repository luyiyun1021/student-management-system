# myapp/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

# 用户模型
class User(AbstractUser):
    # 用户模型继承自 AbstractUser，保持 Django 的内置认证功能
    pass

# 上传文件模型（一个用户可以上传多个压缩包）
class DataFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='data_files')
    file = models.FileField(upload_to='uploads/')  # 上传路径为 'uploads/'
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.file.name}"

    class Meta:
        verbose_name = "Data File"
        verbose_name_plural = "Data Files"



# 学生信息模型
class Student(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # 用户与学生信息的关联
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    heart_rate = models.FloatField()
    skin_conductance = models.FloatField()
    brain_wave = models.FloatField()
    step_count = models.IntegerField()
    score = models.FloatField()

    def __str__(self):
        return self.name