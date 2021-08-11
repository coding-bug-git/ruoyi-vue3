<template>
  <div
    class="
      w-screen
      h-screen
      flex
      items-center
      justify-center
      relative
      bg-no-repeat bg-cover
      login-bg
    "
  >
    <div class="login-form rounded w-96 pt-6 px-6 pb-1 shadow-lg bg-white">
      <div class="text-xl font-bold text-center mb-7">{{ webName }}</div>
      <div>
        <!-- 账号密码登录 -->
        <a-form :model="loginForm" :rules="loginRules" ref="FormRef">
          <a-form-item ref="username" name="username">
            <a-input
              v-model:value.trim="loginForm.username"
              placeholder="账号"
              @keyup.enter="handleLogin"
              size="large"
            >
              <template #prefix>
                <user-outlined type="user" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item ref="password" name="password">
            <a-input
              v-model:value.trim="loginForm.password"
              placeholder="密码"
              type="password"
              size="large"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <LockOutlined type="user" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item ref="code" name="code">
            <div class="flex h-10">
              <a-input
                v-model:value.trim="loginForm.code"
                placeholder="验证码"
                size="large"
                class="flex-1"
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <VerifiedOutlined type="user" />
                </template>
              </a-input>

              <div
                class="ml-3 h-10 overflow-hidden"
                @click="getCode"
                style="flex: 0 0 33%"
              >
                <img
                  :src="codeUrl"
                  @click="getCode"
                  alt="验证码"
                  class="w-full h-full"
                />
              </div>
            </div>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              @click="handleLogin"
              block
              size="large"
              :loading="loading"
              >登录</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, Ref, ref, watch } from 'vue';
  import { getCodeImg } from '@/api/login';
  import { UserInfo } from '@/types/user.interface';
  import { useRoute, RouteLocation, useRouter, Router } from 'vue-router';
  import Cookies from 'js-cookie';
  import { encrypt, decrypt } from '@/utils/jsencrypt';
  import { useStore, Store } from 'vuex';
  import { message } from 'ant-design-vue';
  import 'ant-design-vue/lib/message/style/index.css';
  import {
    UserOutlined,
    LockOutlined,
    VerifiedOutlined
  } from '@ant-design/icons-vue';
  export default defineComponent({
    name: 'Login',
    components: {
      UserOutlined,
      LockOutlined,
      VerifiedOutlined
    },
    setup() {
      let codeUrl: Ref<string> = ref('');
      let loginForm: Ref<UserInfo> = ref({
        username: 'admin',
        password: 'admin123',
        rememberMe: 'false',
        code: '',
        uuid: ''
      });

      let loginRules = reactive({
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
        code: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      });

      let loading: Ref<boolean> = ref(false);
      let redirect: Ref<any> = ref(undefined);

      const store: Store<any> = useStore();
      const router: Router = useRouter();

      // 监听route变量redirect
      const route: RouteLocation = useRoute();
      watch(
        route,
        (route) => {
          redirect.value = route.query && route.query.redirect;
        },
        { immediate: true }
      );

      // 获取验证图片
      let getCode = () => {
        getCodeImg().then((res: any) => {
          codeUrl.value = 'data:image/gif;base64,' + res.img;
          loginForm.value.uuid = res.uuid;
        });
      };

      // 获取本地cookies
      let getCookie = () => {
        const username = Cookies.get('username');
        const password = Cookies.get('password');
        const rememberMe = Cookies.get('rememberMe');
        loginForm.value = {
          username:
            username === undefined ? loginForm.value.username : username,
          password:
            password === undefined
              ? loginForm.value.password
              : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        };
      };

      const FormRef = ref();
      let handleLogin = () => {
        FormRef.value.validate().then(() => {
          loading.value = true;
          if (loginForm.value.rememberMe) {
            Cookies.set('username', loginForm.value.username, { expires: 30 });
            Cookies.set(
              'password',
              encrypt(loginForm.value.password as string),
              {
                expires: 30
              }
            );
            Cookies.set('rememberMe', loginForm.value.rememberMe, {
              expires: 30
            });
          } else {
            Cookies.remove('username');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          store
            .dispatch('Login', loginForm.value)
            .then(() => {
              router.push({ path: redirect.value || '/' });
              message.success('登陆成功！');
            })
            .catch(() => {
              loading.value = false;
              getCode();
            });
        });
      };

      let webName = process.env.VUE_APP_WEBNAME;

      onMounted(() => {
        getCode();
        getCookie();
      });

      return {
        handleLogin,
        loginForm,
        loginRules,
        codeUrl,
        FormRef,
        webName,
        loading
      };
    }
  });
</script>

<style lang="scss" scoped>
  .login-bg {
    background-image: url('../assets/images/login-background.jpg');
    padding: 0 10%;
  }
</style>
