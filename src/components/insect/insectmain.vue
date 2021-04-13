<template>
  <div>
    <a-tabs type="card" v-model="tab">
      <a-tab-pane key="manager" :tab="$t('insect.manager')">
        <insect-manager></insect-manager>
      </a-tab-pane>
      <a-tab-pane key="type" :tab="$t('insect.typeManager')">
        <insect-type></insect-type>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import InsectManager from "@/components/insect/insectManager";
import InsectType from "@/components/insect/insectType";
export default {
  name: "insectmain",
  components: {InsectType, InsectManager},
  data : function (){
    return {
      tab : "manager"
    }
  }
}
</script>

<style scoped>

</style>