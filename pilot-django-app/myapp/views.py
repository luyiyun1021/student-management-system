from django.http import JsonResponse, FileResponse
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, DataFile
import os
import zipfile
import io
from .mock_data import students

# 注册用户
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'detail': '用户已存在'}, status=status.HTTP_400_BAD_REQUEST)

    if len(password) < 6:
        return Response({'detail': '密码长度必须大于6'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_user(username=username, password=password)
    return Response({'message': '注册成功'}, status=status.HTTP_201_CREATED)

# 用户登录
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        return Response({'message': '登录成功'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': '用户名或密码错误'}, status=status.HTTP_400_BAD_REQUEST)

# 上传压缩包文件
@api_view(['POST'])
def upload_file(request):
    username = request.data.get('username')
    file = request.FILES.get('file')

    if not file:
        return Response({'detail': '没有提供文件'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'detail': '用户不存在'}, status=status.HTTP_404_NOT_FOUND)

    data_file = DataFile.objects.create(user=user, file=file)
    return Response({'message': '文件上传成功', 'file_id': data_file.id}, status=status.HTTP_201_CREATED)
    
# 下载文件
# 下载用户所有的压缩包文件
@api_view(['GET'])
def download_files(request):
    username = request.query_params.get('username')

    try:
        user = User.objects.get(username=username)
        data_files = DataFile.objects.filter(user=user)

        if data_files.exists():
            # 创建一个内存中的zip文件
            zip_buffer = io.BytesIO()

            with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
                for data_file in data_files:
                    file_path = data_file.file.path
                    if os.path.exists(file_path):
                        # 将文件添加到zip中
                        zip_file.write(file_path, os.path.basename(file_path))

            zip_buffer.seek(0)  # 将指针移动到开头以便读取

            # 返回一个文件响应，下载zip文件
            response = FileResponse(zip_buffer, as_attachment=True, filename=f'{username}_files.zip')
            response['Content-Type'] = 'application/zip'
            return response
        else:
            return Response({'detail': '没有找到文件'}, status=status.HTTP_404_NOT_FOUND)

    except User.DoesNotExist:
        return Response({'detail': '用户不存在'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def list_user_files(request):
    username = request.GET.get('username')

    try:
        user = User.objects.get(username=username)
        data_files = user.data_files.all()
        files = [{'id': df.id, 'filename': df.file.name, 'uploaded_at': df.uploaded_at} for df in data_files]
        return Response(files, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'detail': '用户不存在'}, status=status.HTTP_404_NOT_FOUND)
    
# 数据总览视图 (返回mock数据)
@api_view(['GET'])
def data_overview(request):
    data = {
        'dates': ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05"],
        'heartRate': [72, 75, 78, 76, 80],
        'skinConductance': [4, 5, 6, 4, 7],
        'brainWave': [100, 110, 120, 130, 115],
        'stepCount': [3000, 5000, 7000, 8000, 6000],
        'calorieBurn': [200, 300, 400, 350, 500],
        'sleepQuality': [7, 6.5, 8, 7.5, 6]
    }
    return Response(data, status=status.HTTP_200_OK)

# 学生信息列表视图 (返回mock学生数据)
@api_view(['GET'])
def students_list(request):
    return Response(students, status=status.HTTP_200_OK)

# 学生详细信息视图 (返回mock单个学生详细信息)
@api_view(['GET'])
def student_detail(request, id):
    student = next((s for s in students if s['id'] == id), None)

    if student:
        return Response(student, status=status.HTTP_200_OK)
    else:
        return Response({'detail': '学生未找到'}, status=status.HTTP_404_NOT_FOUND)
