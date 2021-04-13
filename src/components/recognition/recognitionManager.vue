<template>
  <div>
    <a-tabs v-model="tab" tab-position="left">
      <a-tab-pane key="noFind" :tab="$t('recognition.noFind')">
        <no-recogintion></no-recogintion>
      </a-tab-pane>
      <a-tab-pane v-for="item in allAnimal" :key="item.id" :tab="item.name">
        <recognition :animal-id="item.id" :animals="allAnimal"></recognition>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import NoRecogintion from "@/components/recognition/noRecogintion";
import util from "@/components/public/util";
import Recognition from "@/components/recognition/recognition";
export default {
  name: "recognitionManager",
  components: {Recognition, NoRecogintion},
  data : function (){
    return {
      tab : "noFind",
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
          _this.allAnimal = res.data.retMap.allAnimal;
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        util.catchErr(res);
      })
    }
  }
}
</script>

<style scoped>

</style>