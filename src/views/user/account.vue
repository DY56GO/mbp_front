<template>
  <div class="app-container" style="padding-left: 8%;">
    <el-form ref="form" :model="form" label-width="100px" style="width: 460px;">
      <el-form-item label="用户账号">
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
import { getInfo, updateInfo } from '@/api/user'

export default {
  name: 'Account',
  data() {
    return {
      form: {
        userAccount: '',
        userName: ''
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
      console.log('submit!')
      return new Promise((resolve, reject) => {
        updateInfo(this.form).then(() => {
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
    }
  }
}
</script>

