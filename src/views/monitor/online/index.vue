<template>
  <div class="">
    <a-form
      :model="state.queryForm"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      layout="inline"
      ref="formRef"
    >
      <a-row class="w-full">
        <a-col span="6">
          <a-form-item label="登陆地址" name="ipaddr">
            <a-input
              v-model:value="state.queryForm.ipaddr"
              placeholder="请输入登录地址"
              allow-clear
            ></a-input>
          </a-form-item>
        </a-col>

        <a-col span="6">
          <a-form-item label="用户名称" name="userName">
            <a-input
              v-model:value="state.queryForm.userName"
              placeholder="请输入用户名称"
              allow-clear
            ></a-input>
          </a-form-item>
        </a-col>

        <a-col span="6">
          <a-space>
            <a-button type="primary" @click="getList">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
            <a-button @click="resetHandler">
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
  import { defineComponent, onMounted, reactive, Ref, ref } from 'vue';
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
        try {
          let { code, rows }: any = await list(state.queryForm);
          if (code == 200) {
            tableData.value = rows;
            loading.value = false;
          }
        } catch (err) {
          loading.value = false;
          console.log(err);
        }
      };

      let parseTime = (value: string | number) => {
        return dayjs(value).format('YYYY-MM-DD');
      };

      let formRef = ref();
      let resetHandler = () => {
        formRef.value.resetFields();
        getList();
      };

      onMounted(() => {
        getList();
      });

      return {
        state,
        columns,
        tableData,
        loading,
        parseTime,
        getList,
        resetHandler,
        formRef
      };
    }
  });
</script>

<style></style>
