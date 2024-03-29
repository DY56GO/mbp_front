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

      <el-form-item prop="captcha" style="width: 70%; display: inline-block;">
        <span class="svg-container">
          <svg-icon icon-class="shield" />
        </span>
        <el-input
          ref="captcha"
          v-model="registerForm.captcha"
          placeholder="验证码"
          name="captcha"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-image :src="captchaSrc" alt="验证码" style="float: right;width: 28%;padding: 2px;border-radius: 5px;" @click="refreshCaptcha" />

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>

      <div class="tips">
        <span>已注册，<a @click="$router.push('/login')">立即登录</a></span>
      </div>
    </el-form>
    <div v-show="hidshow" class="waves-footer">
      <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(64, 158, 255,0.7)" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255, 255, 255,0.5)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(64, 158, 255,0.3)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import { getCaptcha, getCaptchaId } from '@/api/user'

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
      captchaSrc: '',
      docmHeight: '0', // 初始状态可视区高度
      showHeight: '0', // 实时可视区高度
      hidshow: true, // 是否显示底部
      registerForm: {
        username: '',
        password: '',
        checkPassword: '',
        captchaId: -1,
        captcha: ''
      },
      registerRules: {
        username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        checkPassword: [{ required: true, trigger: 'blur', validator: validateCheckPassword }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
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
  created() {
    this.docmHeight = document.documentElement.clientHeight
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.showHeight = document.body.clientHeight
        if (this.docmHeight > this.showHeight) {
          this.hidshow = false
        } else {
          this.hidshow = true
        }
      })()
    }
    this.refreshCaptcha()
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
    refreshCaptcha() {
      getCaptchaId().then(response => {
        const { data } = response
        this.registerForm.captchaId = data
        getCaptcha({ captchaId: this.registerForm.captchaId }).then(response => {
          this.captchaSrc = window.URL.createObjectURL(new Blob([response]))
        })
      })
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
.waves-footer {
  height: 20%;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.waves {
  height: 100%;
  width: 100%;
}

/* Animation */
.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}

.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}

.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}

.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }

  100% {
    transform: translate3d(85px, 0, 0);
  }
}

/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #2d3a4b;
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
    // background: transparent;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #eeeeeebc;
$light_gray: #eee;
$customColor_a: #409eff;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        float: right;
        margin-right: 16px;
      }
    }

    a {
      color: $customColor_a;
    }
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
