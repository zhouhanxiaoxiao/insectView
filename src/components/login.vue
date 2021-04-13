<template>
  <div style="width: 100%;">
    <a-card class="loginCard" title="login" hoverable >
      <a-form-model
          ref="userForm"
          :model="user"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
      >

        <a-form-model-item ref="name" :label="$t('email')" prop="email">
          <a-input v-model="user.email"/>
        </a-form-model-item>

        <a-form-model-item ref="password" :label="$t('password')" prop="password">
          <a-input-password v-model="user.password"/>
        </a-form-model-item>

      </a-form-model>
      <a-button type="primary" @click="login" block>
        {{ $t("login") }}
      </a-button>
    </a-card>
  </div>
</template>

<script>
import util from "@/components/public/util";

export default {
  name: "login",
  data : function (){
    return{
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      user : {
        email : "",
        password : ""
      }
    }
  },
  methods :{
    login : function (){
      var _this = this;
      this.$refs.userForm.validate(valid =>{
        if (valid){
          var postData = {
            user : JSON.stringify(_this.user)
          }
          _this.$axios.post("/login", postData).then(function (res){
            if (res.data.code === "success"){
              _this.$cookies.set("token", res.data.retMap.token, '1d');
              _this.$cookies.set("user", res.data.retMap.user, '1d');
              _this.$store.commit("saveUser", res.data.retMap.user);
              _this.$router.push("/home")
            }else {
              util.error(res.data.code);
            }
          }).catch(function (res){
            console.log(res);
            util.error("err.enterForm")
          });
        }else {
          _this.$message.error(_this.$t("err.enterForm"));
        }
      });
    }
  },
  computed : {
    rules : function (){
      return {
        email : [
          { required: true, message: 'Please input email', trigger: 'blur' },
        ],
        password : [
          { required: true, message: 'Please input password', trigger: 'blur' },
        ]
      }
    }
  }
}
</script>

<style scoped>
.loginCard{
  display: inline-block;
  width: 30%;
  margin-left: 35%;
  margin-top: 25vh;
}
</style>