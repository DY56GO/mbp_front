<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="width: 460px;">
      <el-form-item label="用户账号" prop="userAccount">
        <el-input
          v-model="form.userAccount"
          placeholder="用户账号"
        />
      </el-form-item>
      <el-form-item label="用户名称">
        <el-input
          v-model="form.userName"
          placeholder="用户名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getInfo, updateUserOneself } from '@/api/user'

export default {
  name: 'Account',
  data() {
    return {
      form: {
        userAccount: '',
        userName: ''
      },
      rules: {
        userAccount: [{ required: true, message: '请输入用户账号', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getInfo().then(response => {
        const { data } = response
        this.form.userAccount = data.userAccount
        this.form.userName = data.userName
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          return new Promise((resolve, reject) => {
            updateUserOneself(this.form).then(() => {
              this.fetchData()
              this.$message({
                showClose: true,
                message: '修改成功！',
                type: 'success',
                duration: 1500
              })
              resolve()
            }).catch(error => {
              reject(error)
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

