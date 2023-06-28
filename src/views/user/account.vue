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
      <el-form-item label="性别">
        <el-select v-model="form.gender" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getInfo, updateUserSelf } from '@/api/user'

export default {
  name: 'Account',
  data() {
    const validateAccount = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('账号不能少于4个字'))
      } else {
        callback()
      }
    }
    return {
      options: [{
        value: 1,
        label: '男'
      }, {
        value: 0,
        label: '女'
      }],
      form: {
        userAccount: '',
        userName: '',
        gender: ''
      },
      rules: {
        userAccount: [{ required: true, trigger: 'blur', validator: validateAccount }]
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
        this.form.gender = data.gender
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateUserSelf(this.form).then(() => {
            // this.fetchData()
            this.$message({
              showClose: true,
              message: '修改成功！',
              type: 'success',
              duration: 1500
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

