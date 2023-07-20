<template>
  <div class="app-container">
    <el-container>
      <el-header height="@rowheight*10 !important">
        <SearchFilter label-width="100px" size="small" :max-show="4" @search="fetchData" @reset="reset">
          <el-form-item label="用户名称">
            <el-input v-model="query.userName" />
          </el-form-item>
          <el-form-item label="用户账号">
            <el-input v-model="query.userAccount" />
          </el-form-item>
          <el-form-item label="用户分组">
            <ElSelectTree
              v-model="query.userGroupIdList"
              :data="userGroupTreeData"
              multiple
            />
          </el-form-item>
        </SearchFilter>
      </el-header>
      <el-main>
        <el-button
          type="primary"
          style="float: right; margin-bottom: 10px;"
          icon="el-icon-plus"
          size="small"
          @click="handleAddFromShow"
        >新增</el-button>

        <el-table
          v-loading="loading"
          :data="tableData"
          row-key="id"
          border
          default-expand-all
          :header-cell-style="{background:'#f5f7fa', color:'#606266', padding:'2px'}"
          :row-style="{color: '#2c3e50'}"
          :cell-style="{padding: '1px'}"
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
            width="80"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.gender === 1">男</span>
              <span v-else-if="scope.row.gender === 0">女</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userGroupName"
            label="用户分组"
            width="150"
            align="center"
          />
          <el-table-column
            prop="usingStart"
            label="状态"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.usingStart"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                @change="handleUsingChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="gmtCreate"
            label="创建时间"
            width="180"
            align="center"
          />
          <el-table-column
            prop="op"
            label="操作"
            width="300"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-s-custom"
                style="color: #ebb563;"
                @click="handleRoleFromShow(scope.row)"
              >权限</el-button>
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEditFromShow(scope.row)"
              >修改</el-button>
              <el-popconfirm
                title="确定删除吗？"
                style="margin-left: 10px;"
                @confirm="handleDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  type="text"
                  icon="el-icon-delete"
                  style="color: #f78989;"
                >删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page="query.current"
          :page-sizes="[ 10, 100, 500, 1000]"
          :page-size="query.pageSize"
          layout="->,total, sizes, prev, pager, next, jumper"
          :total="query.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-main>

      <el-dialog title="角色分配" :visible.sync="dialogRoleFormVisible" width="30%">
        <el-form ref="userRoleForm" :label-width="formLabelWidth">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
            <el-checkbox v-for="role in roles" :key="role.id" :label="role.id">{{ role.roleIdentity }}</el-checkbox>
          </el-checkbox-group>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleRoleFromShow">取 消</el-button>
          <el-button type="primary" @click="handleUpdateRole">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="新增用户" :visible.sync="dialogAddFormVisible" width="30%">
        <el-form ref="userAddForm" :rules="userRules" :model="userAddForm" :label-width="formLabelWidth">
          <el-form-item label="用户名称">
            <el-input v-model="userAddForm.userName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="用户账号" prop="userAccount">
            <el-input v-model="userAddForm.userAccount" autocomplete="off" />
          </el-form-item>
          <el-form-item label="用户头像">
            <el-input v-model="userAddForm.userAvatar" autocomplete="off" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="userAddForm.gender" placeholder="请选择性别">
              <el-option label="女" value="0" />
              <el-option label="男" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model="userAddForm.userPassword" autocomplete="off" />
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
            <el-input v-model="userEditForm.userName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="用户账号" prop="userAccount">
            <el-input v-model="userEditForm.userAccount" autocomplete="off" />
          </el-form-item>
          <el-form-item label="用户头像">
            <el-input v-model="userEditForm.userAvatar" autocomplete="off" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="userEditForm.gender" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model="userEditForm.userPassword" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleEditFromShow()">取 消</el-button>
          <el-button type="primary" @click="handleEdit">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import SearchFilter from '@/components/SearchFile'
import ElSelectTree from 'el-select-tree'
import { getUserListPage, addUser, updateUser, deleteUser, getUserRole, updateUserRole } from '@/api/user'
import { getRoleList } from '@/api/role'
import { getUserGroupList } from '@/api/userGroup'

export default {
  name: 'User',
  components: { SearchFilter, ElSelectTree },
  data() {
    const validateAccount = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('账号不能少于4个字'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value && value.length < 6) {
        callback(new Error('密码不能少于8位'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      tableData: [],
      query: {
        userName: '',
        userAccount: '',
        userGroupIdList: [],
        current: 0,
        pageSize: 10,
        total: 0
      },
      userGroupTreeData: [],
      defaultCheckedMenu: [],
      defaultCheckedMenuOld: [],
      options: [{
        value: 1,
        label: '男'
      }, {
        value: 0,
        label: '女'
      }],
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      dialogRoleFormVisible: false,
      formLabelWidth: '120px',
      userRules: {
        userAccount: [{ required: true, trigger: 'blur', validator: validateAccount }],
        userPassword: [{ required: false, trigger: 'blur', validator: validatePassword }]
      },
      checkAll: false,
      checkedRoles: [],
      checkedRolesOld: [],
      roles: [],
      rolesId: [],
      isIndeterminate: true,
      updateUserRole: {
        id: '',
        addRoleList: [],
        deleteRoleList: []
      },
      userAddForm: {
        userName: '',
        userAccount: '',
        userAvatar: '',
        gender: '',
        userPassword: ''
      },
      row: {},
      userEditFormOld: {},
      userEditForm: {
        userName: '',
        userAccount: '',
        userAvatar: '',
        gender: '',
        userPassword: ''
      }
    }
  },
  created() {
    this.fetchData()
    this.handUserGroupTree()
  },
  methods: {
    fetchData() {
      this.loading = true
      const query = { ...this.query }
      query.userGroupIdList = query.userGroupIdList.join(',')
      getUserListPage(query).then(response => {
        const { data } = response
        this.tableData = data.records
        this.query.total = data.total
        this.loading = false
      })
    },
    reset() {
      Object.assign(this.$data.query, this.$options.data().query)
      this.fetchData()
    },
    handUserGroupTree() {
      getUserGroupList().then(response => {
        const { data } = response
        this.userGroupTreeData = data
      })
    },
    handleCurrentChange(val) {
      this.query.current = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.query.pageSize = val
      this.fetchData()
    },
    handleUsingChange(row) {
      row.usingStart === 0 ? 1 : 0
      updateUser(row).then(response => {
        // this.fetchData
      })
    },
    handleCheckAllChange(val) {
      this.checkedRoles = val ? this.rolesId : []
      this.isIndeterminate = false
    },
    handleCheckedRolesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.roles.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length
    },
    handleRoleFromShow(row) {
      this.updateUserRole.id = ''
      this.roles = []
      this.rolesId = []
      this.checkedRoles = []
      this.checkedRolesOld = []

      if (!this.dialogRoleFormVisible) {
        this.updateUserRole.id = row.id
        // 获取角色列表
        getRoleList({ usingStart: 1 }).then(response => {
          const { data } = response
          for (const role of data) {
            this.roles.push({ id: role.id, roleIdentity: role.roleIdentity })
            this.rolesId.push(role.id)
          }

          // 获取用户角色
          getUserRole({ id: row.id }).then(response => {
            row = null
            const { data } = response
            for (const role of data) {
              this.checkedRoles.push(role.id)
              this.checkedRolesOld.push(role.id)
            }
            this.handleCheckedRolesChange(this.checkedRoles)
          })
        })
      }

      this.dialogRoleFormVisible = !this.dialogRoleFormVisible
    },
    handleUpdateRole() {
      this.updateUserRole.addRoleList = []
      this.updateUserRole.deleteRoleList = []

      // 通过与旧选中比较，生成要新增和删除的角色列表
      for (const role of this.checkedRoles) {
        if (this.checkedRolesOld.indexOf(role) === -1) {
          this.updateUserRole.addRoleList.push(role)
        }
      }
      for (const role of this.checkedRolesOld) {
        if (this.checkedRoles.indexOf(role) === -1) {
          this.updateUserRole.deleteRoleList.push(role)
        }
      }

      updateUserRole(this.updateUserRole).then(() => {
        this.handleRoleFromShow()
        this.$message({
          showClose: true,
          message: '修改成功！',
          type: 'success',
          duration: 1500
        })
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
        this.userEditForm = { ...row }
      }
      this.dialogEditFormVisible = !this.dialogEditFormVisible
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
      deleteUser({ id: row.id }).then(() => {
        this.fetchData()
        this.$message({
          showClose: true,
          message: '删除成功！',
          type: 'success',
          duration: 1500
        })
      })
    }
  }
}

</script>

