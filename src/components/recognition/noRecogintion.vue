<template>
  <div>
    <a-empty v-if="noFinds.length === 0"  style="margin-top: 100px"/>
    <div class="row">
      <div class="col-3" style="margin-bottom: 30px;" v-for="item in noFinds" :key="item.id">
        <a-card hoverable style="width: 100%">
          <img
              slot="cover"
              alt="example"
              :src="fileImag(item.fileid)"
          />
          <a-card-meta :title="$t('recognition.type')">
            <template slot="description">
              <a-select style="width: 60%" v-model="item.animalid">
                <a-select-option v-for="ani in allAnimal" :key="ani.id" :value="ani.id">
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
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import util from "@/components/public/util";
import VLoading from "@/components/public/v-loading";

export default {
  name: "noRecogintion",
  components: {VLoading},
  data : function (){
    return {
      loading : false,
      noFinds : [],
      allAnimal : [],
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      var _this = this;
      this.$axios.post("/admin/insect/noFinds/init").then(function (res){
        if (res.data.code === util.SUCCESS){
          _this.noFinds = res.data.retMap.noFinds;
          _this.allAnimal = res.data.retMap.allAnimal;
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        util.catchErr(res)
      });
    },
    fileImag : function (id){
      return this.$axios.defaults.baseURL + "/file/image/" + id;
    },
    updateBuniss : function (idt){
      if (idt.animalid === null || idt.animalid === undefined){
        util.error("recognition.type");
        return;
      }
      var postData = {
        idt : JSON.stringify(idt),
        status : "03"
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
  computed : {

  }
}
</script>

<style scoped>

</style>