# student-management-system
航校学生管理系统

## 前端
安装npm，nodejs
安装依赖
`npm install`
启动前端
`npm start`
默认会弹出窗口， 如果没有弹出，浏览器输入 http://localhost:3000/
## 后端
安装python环境
```
conda create -n pilot
conda activate pilot
conda install django
conda install django-cors-headers
conda install djangorestframework
conda install pandas
conda install matplotlib
conda install neurokit2
conda install scipy
conda install patool
```

migrate迁移数据库
```
python manage.py makemigrations myapp
python manage.py migrate

创建管理员
```python manage.py createsuperuser```
根据提示创建admin，可以访问http://127.0.0.1:8000/admin管理所有数据

```
启动后端
```python manage.py runserver```


