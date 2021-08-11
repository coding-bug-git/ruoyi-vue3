<template>
  <div class="">
    <a-form
      :model="state.queryForm"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      layout="inline"
    >
      <a-row class="w-full">
        <a-col span="6">
          <a-form-item label="登陆地址">
            <a-input
              v-model:value="state.queryForm.ipaddr"
              placeholder="请输入登录地址"
              allow-clear
            ></a-input>
          </a-form-item>
        </a-col>

        <a-col span="6">
          <a-form-item label="用户名称">
            <a-input
              v-model:value="state.queryForm.userName"
              placeholder="请输入用户名称"
              allow-clear
            ></a-input>
          </a-form-item>
        </a-col>

        <a-col span="6">
          <a-space>
            <a-button type="primary">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
            <a-button>
              <template #icon>
                <SyncOutlined />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
  </div>

  <div class="mt-3">
    <a-table
      :columns="columns"
      :data-source="tableData"
      :row-key="(record) => record.tokenId"
      size="middle"
      bordered
      :loading="loading"
    >
      <template #loginSystem="{ text }">
        <a>{{ systemFormate(text) }}</a>
      </template>

      <template #loginMode="{ text }">
        {{ loginModeFormate(text) }}
      </template>

      <template #loginTime="{ text }">
        {{ parseTime(text) }}
      </template>

      <template #action="{ record }">
        <span>
          <a-button size="small" type="link">
            <template #icon>
              <DeleteOutlined />
            </template>
            强退
          </a-button>
        </span>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    getCurrentInstance,
    onMounted,
    reactive,
    Ref,
    ref
  } from 'vue';
  import {
    SyncOutlined,
    SearchOutlined,
    DeleteOutlined
  } from '@ant-design/icons-vue';
  import { list } from '@/api/monitor/online/index';
  import dayjs from 'dayjs';
  export default defineComponent({
    components: {
      SyncOutlined,
      SearchOutlined,
      DeleteOutlined
    },
    setup() {
      let state = reactive({
        queryForm: {
          ipaddr: '',
          userName: ''
        },
        pageParams: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        }
      });

      let columns: Ref<any[]> = ref([
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'tokenId',
          key: 'tokenId',
          title: '会话编号'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'userName',
          key: 'userName',
          title: '登录名称'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'deptName',
          key: 'deptName',
          title: '部门名称'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'ipaddr',
          key: 'ipaddr',
          title: '主机'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'loginLocation',
          key: 'loginLocation',
          title: '登录地点'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'loginSystem',
          key: 'loginSystem',
          title: '登录系统',
          slots: { customRender: 'loginSystem' }
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'loginMode',
          key: 'loginMode',
          title: '登录方式',
          slots: { customRender: 'loginMode' }
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'phonenumber',
          key: 'phonenumber',
          title: '登录手机号'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'browser',
          key: 'browser',
          title: '浏览器'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'os',
          key: 'os',
          title: '操作系统'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'loginTime',
          key: 'loginTime',
          title: '登录时间',
          slots: { customRender: 'loginTime' }
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'action',
          key: 'action',
          title: '操作',
          width: '100px',
          slots: { customRender: 'action' }
        }
      ]);

      let tableData: Ref<any[]> = ref([]);
      let loading = ref(false);

      // 获取表格数据
      let getList = async () => {
        loading.value = true;
        let params = Object.assign({}, state.queryForm, state.pageParams);
        try {
          let { code, rows }: any = await list(params);
          if (code == 200) {
            tableData.value = rows;
            loading.value = false;
          }
        } catch (err) {
          loading.value = false;
          console.log(err);
        }
      };

      const { proxy }: any = getCurrentInstance();
      // 获取登陆系统
      let loginSystemList = ref([]);
      let loginSystemDict = () => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
          let { code, data } = await proxy.getDicts('login_system');
          code == 200 && (loginSystemList.value = data);
          resolve('');
        });
      };

      let systemFormate = (cellValue: any) => {
        let temp: any = loginSystemList.value.filter(
          (item: any) => item.dictValue == cellValue
        );

        return temp && temp.length ? temp[0].dictLabel : '暂无数据';
      };

      let loginModeList = ref([]);
      let loginModeDict = () => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
          let { code, data } = await proxy.getDicts('login_mode');
          code == 200 && (loginModeList.value = data);
          resolve('');
        });
      };

      let loginModeFormate = (cellValue: string) => {
        let temp: any = loginModeList.value.filter(
          (item: any) => item.dictValue == cellValue
        );

        return temp && temp.length ? temp[0].dictLabel : '暂无数据';
      };

      let parseTime = (value: string | number) => {
        return dayjs(value).format('YYYY-MM-DD');
      };

      onMounted(() => {
        getList();
        loginSystemDict();
        loginModeDict();
      });

      return {
        state,
        columns,
        tableData,
        systemFormate,
        loginModeFormate,
        loading,
        parseTime
      };
    }
  });
</script>

<style></style>
