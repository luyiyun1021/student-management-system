# student-management-system
航校学生管理系统

## 前端
安装npm，nodejs
`npm install`
`npm start`

## 数据库
### 安装 PostgreSQL
- macOS
    安装postgresql
    ```
    brew install postgresql
    ```
    安装完成后，启动 PostgreSQL：
    ```
    brew services start postgresql
    ```

- Ubuntu/Linux
    在 Linux 上，你可以使用以下命令来安装 PostgreSQL：
    ```
    sudo apt update
    sudo apt install postgresql postgresql-contrib
    ```

    安装完成后，启动 PostgreSQL 服务：
    ```
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    ```
- Windows
    访问 PostgreSQL 官方网站，下载适用于 Windows 的安装程序。
    运行安装程序，按照步骤安装 PostgreSQL。
### 设置 PostgreSQL 数据库用户和数据库
```
运行以下命令来创建一个新用户（例如 myuser），并设置一个密码：
CREATE USER myuser WITH PASSWORD 'mypassword';

为新用户授予创建数据库的权限：
ALTER USER myuser CREATEDB;

创建一个新的数据库（例如 mydatabase）：
CREATE DATABASE mydatabase OWNER myuser;

退出 PostgreSQL 控制台：
\q

测试连接：
你可以用以下命令测试能否连接到新数据库：
psql -U myuser -d mydatabase
系统会提示你输入密码，输入你在上面设置的 mypassword，如果连接成功，说明数据库配置正确。
```

## 后端
安装python环境
```
conda create -n pilot
conda activate pilot
conda install django
conda install psycopg2
conda install django-cors-headers
conda install djangorestframework
```

migrate
```
python manage.py makemigrations myapp
python manage.py migrate
```

python manage.py createsuperuser
