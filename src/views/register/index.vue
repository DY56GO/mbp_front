<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="用户账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd('passwordType')">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="checkPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="checkPasswordType"
          ref="password"
          v-model="registerForm.checkPassword"
          :type="checkPasswordType"
          placeholder="确认密码"
          name="checkPassword"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwd('checkPasswordType')">
          <svg-icon :icon-class="checkPasswordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>

    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Register',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于8位'))
      } else {
        callback()
      }
    }
    const validateCheckPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('确认密码不能少于8位'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('确认密码与密码不一致'))
      } else {
        callback()
      }
    }

    return {
      registerForm: {
        username: '',
        password: '',
        checkPassword: ''
      },
      registerRules: {
        username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        checkPassword: [{ required: true, trigger: 'blur', validator: validateCheckPassword }]
      },
      loading: false,
      passwordType: 'password',
      checkPasswordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd(data) {
      if (data === 'passwordType') {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      }
      if (data === 'checkPasswordType') {
        if (this.checkPasswordType === 'password') {
          this.checkPasswordType = ''
        } else {
          this.checkPasswordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.checkPassword.focus()
        })
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/register', this.registerForm).then(() => {
            this.$message({
              showClose: true,
              message: '注册成功！',
              type: 'success',
              duration: 1500
            })
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.$message({
              showClose: true,
              message: '注册失败！',
              type: 'error',
              duration: 1500
            })
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

// 当使用图片为背景时，颜色与图片不符
// @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//   .register-container .el-input input {
//     color: $cursor;
//   }
// }

/* 修复input 使用图片背景时，不协调和光标变色 */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition-delay: 99999s;
  -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      // 当使用图片为背景时，颜色与图片不符
      // &:-webkit-autofill {
      //   box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: $cursor !important;
      // }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #eeeeeebc;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background-image: url(../../static/register.jpg);
  background-size: 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

