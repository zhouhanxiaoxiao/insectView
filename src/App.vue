<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>

export default {
  name: 'App',
  components: {
  },
  beforeMount() {
    this.resetUser();
  },
  methods : {
    resetUser : function (){
      this.$store.commit("saveUser", this.$cookies.get("user"));
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

}
body{
  background-image: url("./assets/back.jpg");
  -moz-background-size: 100%;
  background-size: 100%;
}
</style>
