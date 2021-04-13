<template>
  <div style="width: 100%;height: 100vh">
    <a-layout id="components-layout-demo-custom-trigger" style="height: 100vh">
      <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
        <div class="logo">
          {{ "hello," + userName }}
        </div>
        <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['user']" @click="changeMenu">
          <!--    用户管理      -->
          <a-menu-item key="user">
            <a-icon type="user"/>
            <span>{{ $t("user.manager") }}</span>
          </a-menu-item>
          <!--    昆虫管理      -->
          <a-menu-item key="insect">
            <a-icon type="bug"/>
            <span>{{ $t("insect.manager") }}</span>
          </a-menu-item>
          <!--    识别管理      -->
          <a-sub-menu key="recognition">
            <span slot="title"><a-icon type="video-camera"/><span>{{ $t("recognition.manager") }}</span></span>
            <a-menu-item key="noReco">
              <a-icon type="question-circle" />
              <span>{{ $t("recognition.noFind") }}</span>
            </a-menu-item>

            <a-menu-item v-for="item in allAnimal" :key="'animal-' + item.id">
              <a-icon type="check-circle" />
              <span>{{ item.name }}</span>
            </a-menu-item>

          </a-sub-menu>
          <!--统计-->
          <a-menu-item key="statistics">
            <a-icon type="area-chart"/>
            <span>{{ $t("statistics.manager") }}</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="() => (collapsed = !collapsed)"
          />
          <div style="display: inline-block;float: right">
            <language style="display: inline-block"></language>
            <a-button style="display: inline-block;margin: 0px 10px" @click="exit">{{ $t("exit") }}</a-button>
          </div>
        </a-layout-header>
        <a-layout-content
            :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
            class="content-main"
        >
          <user-manager v-if="menu === 'user'"></user-manager>
          <insectmain v-if="menu === 'insect'"></insectmain>
          <no-recogintion v-if="menu === 'noReco'"></no-recogintion>
          <recognition v-if="menu === 'animal'" :animals="allAnimal" :animal-id="animalId"></recognition>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Language from "@/components/public/language";
import UserManager from "@/components/user/userManager";
import Insectmain from "@/components/insect/insectmain";
import NoRecogintion from "@/components/recognition/noRecogintion";
import Recognition from "@/components/recognition/recognition";
import util from "@/components/public/util";

export default {
  name: "home",
  components: {Recognition, NoRecogintion, Insectmain, UserManager, Language},
  data: function () {
    return {
      collapsed: false,
      menu: 'user',
      allAnimal : [],
      animalId : ""
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
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
    },
    changeMenu: function (item) {
      console.log(item.key)
      if (item.key.startsWith("animal-")){
        this.menu = "animal";
        this.animalId = item.key.replaceAll("animal-","");
      }else {
        this.menu = item.key
      }
    },
    exit : function (){
      this.$cookies.remove("token");
      this.$cookies.remove("user");
      window.location.reload();
    }
  },
  computed: {
    userName: function () {
      return this.$store.getters.getUser.name;
    }
  }
}
</script>

<style scoped>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  color: white;
  text-align: center;
  line-height: 32px;
  overflow: hidden;
}

.content-main {
  overflow-y: scroll;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.content-main::-webkit-scrollbar {
  width: 0 !important
}

</style>