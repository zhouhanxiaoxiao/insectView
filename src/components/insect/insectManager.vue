<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('insect.manager')"
    >
      <template slot="extra">
        <a-button key="1" type="primary" @click="showAlert('add')">
          {{ $t("insect.add") }}
        </a-button>
      </template>
    </a-page-header>
<!-- 昆虫列表 -->
    <a-table :columns="columns" :data-source="insects" bordered>
      <div slot="typeid" slot-scope="text">{{ showType(text) }}</div>
      <template slot="operation" slot-scope="text, record">
        <a-button @click="editInsect(record)" size="small" style="margin: 2px 2px">{{ $t("edit") }}</a-button>
        <a-button @click="showImage(record.id)" size="small" style="margin: 2px 2px">{{ $t("showImages") }}</a-button>
      </template>
    </a-table>

<!--  新增弹窗  -->
    <a-modal
        :title="$t('insect.add')"
        :visible="showAdd"
        @ok="submitInsect"
        @cancel="showAdd = false"
    >
      <a-form-model
          ref="insectForm"
          :model="newInsect"
          :rules="rules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item ref="name" :label="$t('insect.name')" prop="name">
          <a-input v-model="newInsect.name"/>
        </a-form-model-item>
        <a-form-model-item ref="typeid" :label="$t('insect.type')" prop="typeid">
          <a-select v-model="newInsect.typeid">
            <a-select-option v-for="item in types" :value="item.id" :key="item.id" >
<!--              item.vdomain + "-" + item.vkingdom + "-" + item.vphylum + "-" + -->
              {{  item.vclass
            + "-" + item.vorder + item.vfamily + "-" + item.vgenus + "-" + item.vspecies}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="description" :label="$t('insect.description')" prop="description">
          <a-textarea v-model="newInsect.description"/>
        </a-form-model-item>
        <a-form-model-item ref="feature" :label="$t('insect.feature')" prop="feature">
          <a-textarea :rows="2" v-model="newInsect.feature"/>
        </a-form-model-item>
        <a-form-model-item ref="biofeature" :label="$t('insect.biofeature')" prop="biofeature">
          <a-textarea :rows="2" v-model="newInsect.biofeature"/>
        </a-form-model-item>
        <a-form-model-item ref="economic" :label="$t('insect.economic')" prop="economic">
          <a-textarea :rows="2" v-model="newInsect.economic"/>
        </a-form-model-item>
        <a-form-model-item ref="distributed" :label="$t('insect.distributed')" prop="distributed">
          <a-textarea :rows="2" v-model="newInsect.distributed"/>
        </a-form-model-item>
      </a-form-model>
      <div class="clearfix">
        <a-upload
            :action="uploadFile"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
            name="file"
        >
          <div>
            <a-icon type="plus" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>
    </a-modal>

    <a-modal
        :title="$t('showImages')"
        :visible="showImageFlag"
        @cancel="showImageFlag = false"
        :footer="null"
    >
      <a-carousel arrows dots-class="slick-dots slick-thumb" style="margin-bottom: 60px">
        <a slot="customPaging" slot-scope="props">
          <img :src="imageUrl(images[props.i].id)" />
        </a>
        <div v-for="image in images.length" :key="image">
          <img :src="imageUrl(images[image - 1].id)"/>
        </div>
      </a-carousel>
<!--      <a-carousel>-->
<!--        <div style="height: 100%;" v-for="image in images" :key="image.id">-->
<!--          <img :src="imageUrl(image.id)" style="height: 100%;width: 100%"/>-->
<!--        </div>-->
<!--      </a-carousel>-->
    </a-modal>

    <v-loading :show="loading"></v-loading>
  </div>
</template>
<script>
import util from "@/components/public/util";
import VLoading from "@/components/public/v-loading";

export default {
  name: "insectManager",
  components: {VLoading},
  data : function (){
    return {
      defaultFileList : [],
      showAdd : false,
      insects : [],
      types : [],
      columns : [],
      alertFlag : "",
      loading : false,
      images : [],
      showImageFlag : false,
      newInsect : {
        name : "",
        typeid : "",
        description : "",
        feature : "",
        biofeature : "",
        economic : "",
        distributed : "",
      },
      rules : {
        name : [
          { required: true, message: this.$t("err.placeEnter") + this.$t("insect.name"), trigger: 'blur' },
        ],
        typeid : [
          { required: true, message: this.$t("err.placeEnter") + this.$t("insect.type"), trigger: 'blur' },
        ],
        description : [
          { required: true, message: this.$t("err.placeEnter") + this.$t("insect.description"), trigger: 'blur' },
        ],
        feature : [
          { required: true, message: this.$t("err.placeEnter") + this.$t("insect.feature"), trigger: 'blur' },
        ],
        biofeature : [
          { required: true, message: this.$t("err.placeEnter") + this.$t("insect.biofeature"), trigger: 'blur' },
        ],
        economic : [
          { required: true, message: this.$t("err.placeEnter") + this.$t("insect.economic"), trigger: 'blur' },
        ],
        distributed : [
          { required: true, message: this.$t("err.placeEnter") + this.$t("insect.distributed"), trigger: 'blur' },
        ],
      },
      previewVisible: false,
      previewImage: '',
      fileList : []
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    showImage : function (detailId){
      var postData = {
        detailId : detailId
      }
      this.loading = true;
      var _this = this;
      this.$axios.post("/admin/insect/showImages",postData).then(function (res){
        _this.loading = false;
        if (res.data.code === util.SUCCESS){
          _this.images = res.data.retMap.images;
          _this.showImageFlag = true;
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        _this.loading = false;
        util.catchErr(res);
      })
    },
    imageUrl : function (id){
      return this.$axios.defaults.baseURL + "/file/image/" + id;
    },
    editInsect : function (record){
      this.alertFlag = "edit";
      this.newInsect = record;
      this.showAdd = true;
    },
    showType : function (id){
      let filter = this.types.filter(item => item.id = id);
      var item = filter[0];
      return item.vdomain + "-" + item.vkingdom + "-" + item.vphylum + "-" + item.vclass
          + "-" + item.vorder + item.vfamily + "-" + item.vgenus + "-" + item.vspecies
    },
    submitInsect : function (){
      var _this = this;
      this.$refs.insectForm.validate(valid =>{
        if (valid){
          var fileIds = new Array();
          _this.fileList.map(item => {
            fileIds.push(item.response.id)
          })
          var postData = {
            inesct : JSON.stringify(_this.newInsect),
            fileIds : JSON.stringify(fileIds),
            alertFlag : _this.alertFlag
          }
          _this.loading = true;
          _this.$axios.post("/admin/insect/addNew",postData).then(function (res){
            _this.loading = false;
            if (res.data.code === util.SUCCESS){
              _this.initPage();
              _this.showAdd = false;
              _this.fileList = new Array();
            }else {
              util.error(res.data.code);
            }
          }).catch(function (res){
            util.catchErr(res);
          });
        }else {
          util.error("err.enterForm");
        }
      })
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      this.previewImage = this.$axios.defaults.baseURL + "/file/image/" + file.response.id;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
    },
    showAlert : function (flag){
      this.alertFlag = flag;
      this.showAdd = true;
    },
    initPage :function (){
      this.initCols();
      var _this = this;
      this.$axios.post("/admin/insect/initPage").then(function (res){
        if (res.data.code === util.SUCCESS){
          _this.insects = res.data.retMap.insects;
          _this.types = res.data.retMap.types;
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        util.catchErr(res);
      })
    },
    initCols : function (){
      var cols = new Array();

      cols.push({
        title: this.$t("insect.name"),
        dataIndex: 'name',
        key: 'name',
      });

      cols.push({
        title: this.$t("insect.type"),
        dataIndex: 'typeid',
        key: 'typeid',
        scopedSlots: { customRender: 'typeid' },
      });


      cols.push({
        title: this.$t("insect.description"),
        dataIndex: 'description',
        key: 'description',
      });

      cols.push({
        title: this.$t("insect.feature"),
        dataIndex: 'feature',
        key: 'feature',
      });

      cols.push({
        title: this.$t("insect.biofeature"),
        dataIndex: 'biofeature',
        key: 'biofeature',
      });

      cols.push({
        title: this.$t("insect.economic"),
        dataIndex: 'economic',
        key: 'economic',
      });

      cols.push({
        title: this.$t("insect.distributed"),
        dataIndex: 'distributed',
        key: 'distributed',
      });

      cols.push({
        title: 'operation',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
      })
      this.columns = cols;
    }
  },
  computed : {
    uploadFile : function (){
      return this.$axios.defaults.baseURL + "/file/upload";
    },
  }
}
</script>

<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -60px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 60px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>