<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('insect.typeManager')"
    >
      <template slot="extra">
        <a-button key="1" type="primary" @click="showAdd = true">
          {{ $t("insect.add") }}
        </a-button>
      </template>
    </a-page-header>

    <a-table :columns="columns" :data-source="types">

    </a-table>

    <a-modal
        :title="$t('insect.add')"
        :visible="showAdd"
        @ok="submitType"
        @cancel="showAdd = false"
    >
      <a-form-model
          ref="typeForm"
          :model="newType"
          :rules="rules"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item ref="vdomain" :label="$t('insect.domain')" prop="vdomain">
          <a-input v-model="newType.vdomain"/>
        </a-form-model-item>
        <a-form-model-item ref="vkingdom" :label="$t('insect.kingdom')" prop="vkingdom">
          <a-input v-model="newType.vkingdom"/>
        </a-form-model-item>
        <a-form-model-item ref="vphylum" :label="$t('insect.phylum')" prop="vphylum">
          <a-input v-model="newType.vphylum"/>
        </a-form-model-item>
        <a-form-model-item ref="vclass" :label="$t('insect.class')" prop="vclass">
          <a-input v-model="newType.vclass"/>
        </a-form-model-item>
        <a-form-model-item ref="vorder" :label="$t('insect.order')" prop="vorder">
          <a-input v-model="newType.vorder"/>
        </a-form-model-item>
        <a-form-model-item ref="vfamily" :label="$t('insect.family')" prop="vfamily">
          <a-input v-model="newType.vfamily"/>
        </a-form-model-item>
        <a-form-model-item ref="vgenus" :label="$t('insect.genus')" prop="vgenus">
          <a-input v-model="newType.vgenus"/>
        </a-form-model-item>
        <a-form-model-item ref="vspecies" :label="$t('insect.species')" prop="vspecies">
          <a-input v-model="newType.vspecies"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import util from "@/components/public/util";
import VLoading from "@/components/public/v-loading";

export default {
  name: "insectType",
  components: {VLoading},
  data : function (){
    return {
      columns : [],
      types : [],
      showAdd : false,
      loading : false,
      newType : {
        vdomain :"真核生物域",
        vkingdom : "动物界",
        vphylum : "节肢动物门",
        vclass : "昆虫纲",
        vorder : "鞘翅目",
        vfamily : "科皮蠹",
        vgenus : "",
        vspecies : ""
      },
      rules : {
        vdomain : [
          { required: true, message: 'Please input domain', trigger: 'blur' },
        ],
        vkingdom : [
          { required: true, message: 'Please input kingdom', trigger: 'blur' },
        ],
        vphylum : [
          { required: true, message: 'Please input phylum', trigger: 'blur' },
        ],
        vclass : [
          { required: true, message: 'Please input class', trigger: 'blur' },
        ],
        vorder : [
          { required: true, message: 'Please input order', trigger: 'blur' },
        ],
        vfamily : [
          { required: true, message: 'Please input family', trigger: 'blur' },
        ],
        vgenus : [
          { required: true, message: 'Please input genus', trigger: 'blur' },
        ],
        vspecies : [
          { required: true, message: 'Please input species', trigger: 'blur' },
        ],
      }
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods :{
    submitType :function (){
      var _this = this;
      this.$refs.typeForm.validate(valid =>{
        if (valid){
          var postData = {
            type : JSON.stringify(_this.newType)
          }
          _this.loading = true;
          _this.$axios.post("/admin/type/new",postData).then(function (res){
            _this.loading = false;
            if (res.data.code === util.SUCCESS){
              _this.showAdd = false;
              _this.initPage();
            }else {
              util.error(res.data.code)
            }
          }).catch(function (res){
            _this.loading = false;
            util.catchErr(res);
          })
        }else {
          util.error("err.enterForm");
        }
      });
    },
    initPage : function (){
      this.initCols();
      var _this = this;
      this.$axios.post("/admin/insect/typeInitPage").then(function (res){
        if (res.data.code === util.SUCCESS){
          _this.types = res.data.retMap.types;
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        util.catchErr(res);
      });
    },
    initCols : function (){
      var cols = new Array();

      cols.push({
        title: this.$t("insect.domain"),
        dataIndex: 'vdomain',
        key: 'vdomain',
      });

      cols.push({
        title: this.$t("insect.kingdom"),
        dataIndex: 'vkingdom',
        key: 'vkingdom',
      });

      cols.push({
        title: this.$t("insect.phylum"),
        dataIndex: 'vphylum',
        key: 'vphylum',
      });

      cols.push({
        title: this.$t("insect.class"),
        dataIndex: 'vclass',
        key: 'vclass',
      });

      cols.push({
        title: this.$t("insect.order"),
        dataIndex: 'vorder',
        key: 'vorder',
      });

      cols.push({
        title: this.$t("insect.family"),
        dataIndex: 'vfamily',
        key: 'vfamily',
      });

      cols.push({
        title: this.$t("insect.genus"),
        dataIndex: 'vgenus',
        key: 'vgenus',
      });
      cols.push({
        title: this.$t("insect.species"),
        dataIndex: 'vspecies',
        key: 'vspecies',
      });
      this.columns = cols;
    }
  }
}
</script>

<style scoped>

</style>