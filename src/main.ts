import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/tailwind.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './permission';
import { getDicts } from '@/api/system/dict/data';

const app = createApp(App);

// 全局方法挂载
app.config.globalProperties.getDicts = getDicts;

app.use(store).use(Antd).use(store).use(router).mount('#app');
