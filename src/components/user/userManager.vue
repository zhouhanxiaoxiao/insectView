<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('user.manager')"
    >
      <template slot="extra">
        <a-button key="1" type="primary" @click="showAdd = true">
          {{ $t("user.add") }}
        </a-button>
      </template>
    </a-page-header>
    <a-table :columns="columns" :data-source="users" bordered>
      <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          style="padding: 8px"
      >
        <a-input
            v-ant-ref="c => (searchInput = c)"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block;"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
            type="primary"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          Search
        </a-button>
        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
          Reset
        </a-button>
      </div>
      <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template
          v-for="col in colNames"
          :slot="col"
          slot-scope="text, record"
      >
        <div :key="col">

          <a-select style="width: 120px" @change="handleChangeRole(record)"
                    v-model="record[col]"
                    v-if="col === 'roletype'">
            <a-select-option value="admin">
              {{ $t("user.admin") }}
            </a-select-option>
            <a-select-option value="operator">
              {{ $t("user.operator") }}
            </a-select-option>
          </a-select>

          <div v-else-if="col === 'userstatus'">
            <a-tag color="#87d068" v-if="record[col] === '01'">
              {{ $t("user.normal") }}
            </a-tag>
            <a-tag color="#f50" v-else-if="record[col] === '09'">
              {{ $t("user.stop") }}
            </a-tag>
          </div>
          <div v-else>
            {{ text }}
          </div>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
            v-if="record.userstatus === '01'"
            :title="$t('user.sureStop')"
            @confirm="() => stopUser(record)"
        >
          <a href="javascript:;">{{ $t("user.stop") }}</a>
        </a-popconfirm>
        &nbsp;
        <a href="javascript:;" v-if="record.userstatus === '09'" @click="startUser(record)">
          {{ $t("user.startUse") }}
        </a>
      </template>
    </a-table>
<!-- 新增用户  -->
    <a-modal
        title="Title"
        :visible="showAdd"
        @ok="submitNewUser"
        @cancel="showAdd = false"
    >
      <a-form-model
          ref="addNewUser"
          :model="newUser"
          :rules="rules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 14 }"
      >
        <a-form-model-item ref="name" :label="$t('user.name')" prop="name">
          <a-input v-model="newUser.name" />
        </a-form-model-item>
        <a-form-model-item ref="email" :label="$t('user.email')" prop="email">
          <a-input v-model="newUser.email" />
        </a-form-model-item>
        <a-form-model-item ref="password" :label="$t('user.password')" prop="password">
          <a-input v-model="newUser.password" />
        </a-form-model-item>
        <a-form-model-item ref="roletype" :label="$t('user.roletype')" prop="roletype">
          <a-select v-model="newUser.roletype">
            <a-select-option value="admin">
              {{ $t("user.admin") }}
            </a-select-option>
            <a-select-option value="operator">
              {{ $t("user.operator") }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import VLoading from "@/components/public/v-loading";
import util from "@/components/public/util";
export default {
  name: "userManager",
  components: {VLoading},
  data : function (){
    return {
      searchText: '',
      searchInput: null,
      searchedColumn: '',
      columns : [],
      users : [],
      colNames : [],
      loading : false,
      showAdd : false,

      newUser : {
        name : "",
        email : "",
        password : "",
        roletype : "operator",
      },
      rules : {
        email : [
          { required: true, type : 'email', message: 'Please input email', trigger: 'blur' },
        ],
        password : [
          { required: true, message: 'Please input password', trigger: 'blur' },
        ],
        name : [
          { required: true, message: 'Please input name', trigger: 'blur' },
        ],
        roletype : [
          { required: true, message: 'Please input role type', trigger: 'blur' },
        ]
      }
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    submitNewUser : function (){
      var _this = this;
      this.$refs.addNewUser.validate(valid =>{
        if (valid){
          _this.loading = true;
          var postData = {
            user : JSON.stringify(this.newUser)
          }
          _this.$axios.post("/admin/user/addNew", postData).then(function (res){
            _this.loading = false;
            if (res.data.code === util.SUCCESS){
              _this.showAdd = false;
              _this.newUser = {
                name : "",
                email : "",
                password : "",
                roletype : "operator",
              };
              _this.initPage();
            }else {
              util.error(res.data.code);
            }
          }).catch(function (res){
            _this.loading = false;
            util.catchErr(res);
          });
        }else {
          util.error("err.enterForm");
        }
      });
    },
    startUser : function (user){
      user.userstatus = "01";
      this.handleChangeRole(user);
    },
    stopUser : function (user){
      user.userstatus = "09";
      this.handleChangeRole(user);
    },
    handleChangeRole : function (user){
      var postData = {
        user : JSON.stringify(user)
      };
      this.loading = true;
      var _this = this;
      this.$axios.post("/admin/user/update",postData).then(function (res){
        _this.loading = false;
        if (res.data.code === util.SUCCESS){
          _this.initPage();
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        _this.loading = false;
        util.catchErr(res);
      });
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    initPage : function (){
      this.initCols();
      this.loading = true;
      var _this = this;
      this.$axios.post("/admin/user/initPage").then(function (res){
        console.log(res);
        _this.loading = false;
        if (res.data.code === util.SUCCESS){
          _this.users = res.data.retMap.users;
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        _this.loading = false;
        console.log(res);
        util.error("err.systemErr");
      });
    },
    initCols : function (){
      var cols = new Array();
      cols.push({
        title: this.$t("user.name"),
        dataIndex: 'name',
        key : "name",
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'name'
        },
        onFilter: (value, record) =>
            record.name
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });

      cols.push({
        title: this.$t("user.email"),
        dataIndex: 'email',
        key : "email",
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'email'
        },
        onFilter: (value, record) =>
            record.email
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });

      cols.push({
        title: this.$t("user.userstatus"),
        dataIndex: 'userstatus',
        key : "userstatus",
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'userstatus'
        },
        onFilter: (value, record) =>
            record.userstatus
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });

      cols.push({
        title: this.$t("user.roletype"),
        dataIndex: 'roletype',
        key : "roletype",
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'roletype'
        },
        onFilter: (value, record) =>
            record.roletype
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      var colNames = new Array();
      cols.map(item =>{
        colNames.push(item.dataIndex)
      });
      this.colNames = colNames;

      cols.push({
        title: 'operation',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
      })

      this.columns = cols;
    }
  }
}
</script>

<style scoped>

</style>