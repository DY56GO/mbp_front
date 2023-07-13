<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="updateRules" label-width="100px">
      <el-form-item prop="userOldPassword" label="旧密码">
        <el-input
          v-model="form.userOldPassword"
          placeholder="旧密码"
          show-password
        />
      </el-form-item>

      <el-form-item prop="userNewPassword" label="新密码">
        <el-input
          v-model="form.userNewPassword"
          placeholder="新密码"
          name="userNewPassword"
          tabindex="2"
          show-password
        />
      </el-form-item>

      <el-form-item prop="newCheckPassword" label="新确认密码">
        <el-input
          ref="password"
          v-model="form.newCheckPassword"
          placeholder="新确认密码"
          name="newCheckPassword"
          tabindex="2"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { updatePassword } from '@/api/user'

export default {
  name: 'Password',
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('新密码不能少于8位'))
      } else {
        callback()
      }
    }

    const validateNewCheckPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('新确认密码不能少于8位'))
      } else if (value !== this.form.userNewPassword) {
        callback(new Error('新确认密码与密码不一致'))
      } else {
        callback()
      }
    }

    return {
      form: {
        userOldPassword: '',
        userNewPassword: '',
        newCheckPassword: ''
      },
      updateRules: {
        userOldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        userNewPassword: [{ required: true, trigger: 'blur', validator: validateNewPassword }],
        newCheckPassword: [{ required: true, trigger: 'blur', validator: validateNewCheckPassword }]
      },
      loading: false,
      newPasswordType: 'password',
      newCheckPasswordType: 'password',
      redirect: undefined
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          updatePassword(this.form).then(() => {
            this.$message({
              showClose: true,
              message: '修改成功！',
              type: 'success',
              duration: 1500
            })
            this.$refs['form'].resetFields()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
