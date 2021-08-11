import request from '@/utils/request';

enum Api {
  login = '/login',
  loginByPhone = '/login',
  loginByVisitor = '/visitor/login',
  sendSmsVisitor = '/getSmsCode',
  sendSms = '/captchaSms',
  getInfo = '/getInfo',
  logout = '/logout',
  getCodeImg = '/captchaImage'
}

// 登录方法
export function login(
  username: string,
  password: string,
  code: string,
  uuid: string
) {
  const data = {
    username,
    password,
    code,
    uuid
  };
  return request({
    url: Api.login,
    method: 'post',
    data: data
  });
}

// 验证码登录
export function loginByPhone(phonenumber: string, code: string) {
  const data = {
    phonenumber,
    code
  };
  return request({
    url: Api.login,
    method: 'post',
    data: data
  });
}

// 游客登陆
export function loginByVisitor(phonenumber: string, code: string) {
  const data = {
    phonenumber,
    code
  };
  return request({
    url: Api.loginByVisitor,
    method: 'post',
    data: data
  });
}

// 游客获取验证码
export function sendSmsVisitor(phoneNumbers: string) {
  return request({
    url: Api.sendSmsVisitor + `/${phoneNumbers}`,
    method: 'get'
  });
}

// 发送验证码
export function sendSms(userInfo: any) {
  return request({
    url: Api.sendSms + `/${userInfo.phonenumber}/${userInfo.loginSystem}`,
    method: 'get'
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: Api.getInfo,
    method: 'get'
  });
}

// 退出方法
export function logout() {
  return request({
    url: Api.logout,
    method: 'post'
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: Api.getCodeImg,
    method: 'get'
  });
}
