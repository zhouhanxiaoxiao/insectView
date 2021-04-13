<template>
  <div>
    <a-divider orientation="left">
      {{ $t("recognition.defaultImage") }}
    </a-divider>
    <div class="row">
      <div class="col-3" v-for="item in images" :key="item.id"  style="margin-bottom: 30px;">
        <img
            style="width: 100%"
            alt="example"
            :src="fileImag(item.id)"
        />
      </div>
    </div>
    <a-divider orientation="left">
      {{ $t("recognition.recImage") }}
    </a-divider>
    <div class="row">
      <div class="col-3" style="margin-bottom: 30px;" v-for="item in buss" :key="item.id">
        <a-card hoverable style="width: 100%">
          <img
              slot="cover"
              alt="example"
              :src="fileImag(item.fileid)"
          />
          <a-card-meta>
            <template slot="description">
              <div>
                地点：{{item.vadress}}
              </div>
              <a-select style="width: 60%" v-model="item.animalid">
                <a-select-option v-for="ani in animals" :key="ani.id" :value="ani.id">
                  {{ ani.name }}
                </a-select-option>
              </a-select>
              <a-button type="primary" style="width: 30%;margin-left: 5%" size="small" @click="updateBuniss(item)">
                {{ $t("confirm") }}
              </a-button>
            </template>
          </a-card-meta>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/components/public/util";

export default {
  name: "recognition",
  props : {
    animalId : String,
    animals : Array
  },
  data : function (){
    return{
      buss : [],
      images : []
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    fileImag : function (id){
      return this.$axios.defaults.baseURL + "/file/image/" + id;
    },
    initPage : function (){
      if (this.animalId === null || this.animalId === undefined){
        return;
      }

      var postData = {
        animalId : this.animalId
      }
      var _this = this;
      this.$axios.post("/admin/animal/init", postData).then(function (res){
        if (res.data.code === util.SUCCESS){
          _this.buss = res.data.retMap.buss;
          _this.images = res.data.retMap.images;
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        util.catchErr(res);
      })
    },
    updateBuniss : function (idt){
      if (idt.animalid === null || idt.animalid === undefined){
        util.error("recognition.type");
        return;
      }
      var postData = {
        idt : JSON.stringify(idt),
        status : "04"
      }
      this.loading = true;
      var _this = this;
      this.$axios.post("/admin/buss/update", postData).then(function (res){
        _this.loading = false;
        if (res.data.code === util.SUCCESS){
          _this.initPage();
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        _this.loading = false;
        util.catchErr(res);
      })
    }
  },
  watch : {
    animalId(){
      this.initPage();
    }
  }
}
</script>

<style scoped>

</style>