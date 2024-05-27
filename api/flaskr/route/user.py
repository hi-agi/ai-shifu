import json
from flask import Flask, request, jsonify, make_response
from ..service.user import *
from functools import wraps
from .common import make_common_response,bypass_token_validation,by_pass_login_func


def register_user_handler(app:Flask,path_prefix:str)->Flask:


    @app.route(path_prefix+'/register', methods=['POST'])
    @bypass_token_validation
    def register():
        app.logger.info("register")
        username = request.get_json().get('username', '')
        password = request.get_json().get('password', '')
        email = request.get_json().get('email', '')
        name = request.get_json().get('name', '')
        mobile = request.get_json().get('mobile', '')
        user_token = create_new_user(app,username,name,password,email,mobile)
        resp = make_response(make_common_response(user_token.userInfo))
        resp.headers.add('Set-Cookie', 'token={};'.format(user_token.token))
        # resp.set_cookie('token', user_token.token,path="")
        return resp 
    
    @app.route(path_prefix+'/login', methods=['POST'])
    @bypass_token_validation
    def login():
        username = request.get_json().get('username', '')
        password = request.get_json().get('password', '')
        user_token = verify_user(app,username,password)
        resp = make_response(make_common_response(user_token))
        resp.headers.add('Set-Cookie', 'token={};'.format(user_token.token))
        return resp
    
    @app.before_request
    def before_request():
        app.logger.info("before_request")
        # 在这里进行其他预处理操作
        app.logger.info('request.endpoint:'+str(request.endpoint))
        if request.endpoint in ['login', 'register','require_reset_code','reset_password','invoke','update_lesson'] or request.endpoint in by_pass_login_func:
            # 在登录和注册处理函数中绕过登录态验证
            return
            # 检查装饰器标记，跳过Token校验
        if hasattr(request.endpoint, 'bypass_token_validation'):
            return
        # 在这里执行登录态验证逻辑
        token = request.cookies.get('token')
        if not token:
            token = request.args.get('token')
        if not token:
            token = request.headers.get('Token')
            # app.logger.info('headers token:'+str(token))
        token = str(token)
        user = validate_user(app,token)
        request.user = user
    

    @app.route(path_prefix+'/info', methods=['GET'])
    def info():
        return make_common_response(request.user)

    @app.route(path_prefix+'/update_info', methods=['POST'])
    def update_info():
        email = request.get_json().get('email', None)
        name = request.get_json().get('name', '')
        mobile = request.get_json().get('mobile', None)
        return make_common_response(update_user_info(app,request.user,name,email,mobile))
    @app.route(path_prefix+'/update_password', methods=['POST'])
    def update_password():
        old_password = request.get_json().get('old_password', None)
        new_password = request.get_json().get('new_password', None)
        return make_common_response(change_user_passwd(app,request.user,old_password,new_password))
    
    @app.route(path_prefix+'/require_reset_code', methods=['POST'])
    def require_reset_code():
        username = request.get_json().get('username', None)
        return make_common_response(require_reset_pwd_code(app,username))
    @app.route(path_prefix+'/reset_password', methods=['POST'])
    def reset_password():
        username = request.get_json().get('username', None)
        code = request.get_json().get('code', None)
        new_password = request.get_json().get('new_password', None)
        return make_common_response(reset_pwd(app,username,code,new_password))
    return app

