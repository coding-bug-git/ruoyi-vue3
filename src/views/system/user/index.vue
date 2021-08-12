<template>
  <div>
    <a-row :gutter="20">
      <a-col span="4">
        <a-tree
          :tree-data="treeData"
          :replace-fields="replaceFields"
          :defaultExpandAll="true"
          v-if="treeData.length"
        >
        </a-tree>
      </a-col>
      <a-col span="20">
        <div>
          <a-form
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            labelAlign="left"
            ref="formRef"
            :model="queryForm"
          >
            <a-row class="w-full" :gutter="20">
              <a-col span="8">
                <a-form-item label="用户名称" name="userName">
                  <a-input
                    v-model:value="queryForm.userName"
                    placeholder="请输入用户名称"
                    allow-clear
                    autocomplete="off"
                  ></a-input>
                </a-form-item>
              </a-col>

              <a-col span="8">
                <a-form-item label="手机号码" name="phonenumber">
                  <a-input
                    v-model:value="queryForm.phonenumber"
                    placeholder="请输入手机号码"
                    allow-clear
                    autocomplete="off"
                  ></a-input>
                </a-form-item>
              </a-col>

              <a-col span="8">
                <a-form-item label="状态" name="status">
                  <a-select
                    v-model:value="queryForm.status"
                    placeholder="用户状态"
                    allow-clear
                  >
                    <a-select-option
                      v-for="item in statusOptions"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      >{{ item.dictLabel }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col span="8">
                <a-form-item label="创建时间">
                  <a-range-picker v-model:value="dateRange" :locale="locale" />
                </a-form-item>
              </a-col>

              <a-col span="8">
                <a-space>
                  <a-button type="primary" @click="searchHandler">
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

        <div>
          <a-space>
            <a-button type="primary">
              <template #icon>
                <PlusOutlined />
              </template>
              新增
            </a-button>

            <a-button>
              <template #icon>
                <EditOutlined />
              </template>
              修改
            </a-button>

            <a-button>
              <template #icon>
                <CloudDownloadOutlined />
              </template>
              导入
            </a-button>

            <a-button>
              <template #icon>
                <CloudUploadOutlined />
              </template>
              导出
            </a-button>

            <a-button danger>
              <template #icon>
                <DeleteOutlined />
              </template>
              删除
            </a-button>
          </a-space>
        </div>

        <div class="mt-3">
          <a-table
            :columns="columns"
            :data-source="tableData"
            :row-key="(record) => record.userId"
            size="middle"
            bordered
            :loading="loading"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange
            }"
          >
            <template #action="{ record }">
              <a-space>
                <a-button type="link" size="mini">
                  <template #icon>
                    <EditOutlined />
                  </template>
                  修改
                </a-button>

                <a-button type="link" size="mini">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                  删除
                </a-button>

                <a-button type="link" size="mini">
                  <template #icon>
                    <KeyOutlined />
                  </template>
                  重置密码
                </a-button>
              </a-space>
            </template>
          </a-table>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    getCurrentInstance,
    onMounted,
    reactive,
    ref,
    toRefs
  } from 'vue';
  import {
    SyncOutlined,
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CloudUploadOutlined,
    CloudDownloadOutlined,
    KeyOutlined
  } from '@ant-design/icons-vue';
  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
  import { getTreeSelect, getUserList } from '@/api/system/user';
  export default defineComponent({
    components: {
      SyncOutlined,
      SearchOutlined,
      PlusOutlined,
      EditOutlined,
      DeleteOutlined,
      CloudUploadOutlined,
      CloudDownloadOutlined,
      KeyOutlined
    },
    setup() {
      let treeData = ref([]);

      const replaceFields = {
        children: 'children',
        title: 'label'
      };

      let getTreeSelectHandler = async () => {
        let { code, data }: any = await getTreeSelect();
        if (code == 200) {
          treeData.value = data;
        }
      };

      let state = reactive({
        queryForm: {},
        dateRange: [],
        selectedRowKeys: []
      });

      let onSelectChange = (selectedRowKeys: any) => {
        state.selectedRowKeys = selectedRowKeys;
      };

      let tableData = ref([]);
      let loading = ref(false);

      let getUserListHandler = async () => {
        try {
          loading.value = true;
          let { code, rows }: any = await getUserList(state.queryForm);
          if (code == 200) {
            tableData.value = rows;
          }
          loading.value = false;
        } catch (err) {
          loading.value = false;
        }
      };

      let columns = ref([
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'userId',
          key: 'userId',
          title: '用户编号'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'userName',
          key: 'userName',
          title: '用户名称'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'nickName',
          key: 'nickName',
          title: '用户昵称'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'dept.deptName',
          key: 'dept.deptName',
          title: '部门'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'phonenumber',
          key: 'phonenumber',
          title: '手机号码'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'status',
          key: 'status',
          title: '状态'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'createTime',
          key: 'createTime',
          title: '创建时间'
        },
        {
          align: 'center',
          ellipsis: true,
          dataIndex: 'action',
          key: 'action',
          title: '操作',
          width: '200px',
          slots: { customRender: 'action' }
        }
      ]);

      const { proxy }: any = getCurrentInstance();
      let statusOptions = ref([]);

      const formRef = ref();
      let searchHandler = () => {};
      let resetHandler = () => {
        formRef.value.resetFields();
      };

      onMounted(() => {
        proxy.getDicts('sys_normal_disable').then((response: any) => {
          statusOptions.value = response.data;
        });
        getTreeSelectHandler();
        getUserListHandler();
      });

      return {
        treeData,
        replaceFields,
        ...toRefs(state),
        statusOptions,
        searchHandler,
        resetHandler,
        formRef,
        locale,
        columns,
        tableData,
        loading,
        onSelectChange
      };
    }
  });
</script>

<style></style>
