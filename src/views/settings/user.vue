<template>
  <div class="app-container">
    <el-container>
      <el-header height="30px">
        <el-input
          v-model="list.userName"
          placeholder="请输入用户名称"
          clearable
          style="width: 460px;"
          @clear="fetchData"
        >
          <el-button slot="append" icon="el-icon-search" @click="fetchData" />
        </el-input>
        <el-button
          type="primary"
          style="float: right"
          icon="el-icon-plus"
          @click="handleAddFromShow"
        >新增</el-button>
      </el-header>
      <el-main>
        <el-table
          :data="tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          default-expand-all
          :header-cell-style="{color:'#606266'}"
          :row-style="{color: '#2c3e50'}"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            prop="userName"
            label="用户名称"
            width="100"
          />
          <el-table-column
            prop="userAccount"
            label="用户账号"
            width="100"
          />
          <el-table-column
            prop="userAvatar"
            label="用户头像"
          />
          <el-table-column
            prop="gender"
            label="性别"
            width="50"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.gender === 1">男</span>
              <span v-else-if="scope.row.gender === 0">女</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userPassword"
            label="密码"
            width="180"
          />
          <el-table-column
            prop="isUsing"
            label="状态"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isUsing"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                @change="handleUsingChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="180"
            align="center"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="180"
            align="center"
          />
          <el-table-column
            prop="op"
            label="操作"
            width="260"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-edit"
                @click="handleEditFromShow(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          al
          hide-on-single-page
          background
          :current-page="list.current"
          :page-sizes="[ 100, 500, 1000]"
          :page-size="list.pageSize"
          layout="->,total, sizes, prev, pager, next, jumper"
          :total="list.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-main>
    </el-container>

    <el-dialog title="新增用户" :visible.sync="dialogAddFormVisible" width="30%">
      <el-form ref="userAddForm" :rules="userRules" :model="userAddForm" :label-width="formLabelWidth">
        <el-form-item label="用户名称">
          <el-input v-model="userAddForm.userName" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="用户账号" prop="userAccount">
          <el-input v-model="userAddForm.userAccount" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="用户头像">
          <el-input v-model="userAddForm.userAvatar" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="userAddForm.gender" placeholder="请选择性别">
            <el-option label="女" value="0" />
            <el-option label="男" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="userAddForm.userPassword" autocomplete="off" style="width: 260px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddFromShow">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="dialogEditFormVisible" width="30%">
      <el-form ref="userEditForm" :rules="userRules" :model="userEditForm" :label-width="formLabelWidth">
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="userEditForm.userName" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="用户账号" prop="userAccount">
          <el-input v-model="userEditForm.userAccount" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="用户头像">
          <el-input v-model="userEditForm.userAvatar" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="userEditForm.gender" placeholder="请选择性别">
            <el-option label="女" value="0" />
            <el-option label="男" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="userEditForm.userPassword" autocomplete="off" style="width: 260px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditFromShow">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getListPage, addUser, updateUser, deleteUser } from '@/api/user'

export default {
  name: 'User',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于8位'))
      } else {
        callback()
      }
    }
    return {
      list: {
        userName: '',
        current: 1,
        pageSize: 100,
        total: 0
      },
      userAddForm: {
        userName: '',
        userAccount: '',
        userAvatar: '',
        gender: '',
        userPassword: ''
      },
      userEditForm: {
        userName: '',
        userAccount: '',
        userAvatar: '',
        gender: '',
        userPassword: ''
      },
      tableData: [],
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      visible: false,
      // deleteVisible: false,
      formLabelWidth: '120px',
      userRules: {
        userAccount: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        userPassword: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getListPage(this.list).then(response => {
        const { data } = response
        this.tableData = data.records
        this.total = data.total
      })
    },
    handleCurrentChange(val) {
      this.current = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleUsingChange(row) {
      row.isUsing === 0 ? 1 : 0
      updateUser(row).then(response => {
        // this.fetchData
      })
    },
    handleAddFromShow() {
      this.dialogAddFormVisible = !this.dialogAddFormVisible
      // form开始为隐藏状态，没有DOM对象，判单form关闭且DOM对象不为为undefined，重置表单
      if (!this.dialogEditFormVisible && this.$refs['userAddForm']) {
        this.$refs['userAddForm'].resetFields()
      }
    },
    handleAdd() {
      this.$refs['userAddForm'].validate(valid => {
        if (valid) {
          addUser(this.userAddForm).then(() => {
            this.handleAddFromShow()
            this.fetchData()
            this.$message({
              showClose: true,
              message: '新增成功！',
              type: 'success',
              duration: 1500
            })
          })
        } else {
          return false
        }
      })
    },
    handleEditFromShow(row) {
      if (row) {
        this.userEditForm = row
      }
      this.dialogEditFormVisible = !this.dialogEditFormVisible
      // form开始为隐藏状态，没有DOM对象，判单form关闭且DOM对象不为为undefined，重置表单
      if (!this.dialogEditFormVisible && this.$refs['userEditForm']) {
        this.$refs['userEditForm'].resetFields()
      }
    },
    handleEdit() {
      this.$refs['userEditForm'].validate(valid => {
        if (valid) {
          updateUser(this.userEditForm).then(() => {
            this.handleEditFromShow()
            this.fetchData()
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
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ id: row.id }).then(() => {
          this.fetchData()
          this.$message({
            showClose: true,
            message: '删除成功！',
            type: 'success',
            duration: 1500
          })
        })
      }).catch(() => {

      })
    }
  }
}

</script>

