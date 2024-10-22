# myapp/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, DataFile

# 自定义用户模型的Admin类，继承自Django的UserAdmin
class CustomUserAdmin(UserAdmin):
    # 显示的字段
    list_display = ('username', 'email', 'is_staff', 'is_active', 'date_joined')
    # 可编辑的字段
    list_filter = ('is_staff', 'is_active')
    # 可通过点击链接跳转的字段
    search_fields = ('username', 'email')
    # 表单中的字段分组
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    ordering = ('username',)

# 注册DataFile模型
class DataFileAdmin(admin.ModelAdmin):
    list_display = ('user', 'file', 'uploaded_at')
    search_fields = ('user__username', 'file')

# 注册Student模型
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'heart_rate', 'skin_conductance', 'brain_wave', 'step_count', 'score')
    search_fields = ('name',)
    list_filter = ('score', 'age')
    
# 注册模型到管理后台
admin.site.register(User, CustomUserAdmin)
admin.site.register(DataFile, DataFileAdmin)
