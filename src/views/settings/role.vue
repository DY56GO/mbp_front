<template>
  <div class="app-container">
    <el-container>
      <el-header height="@rowheight*10 !important">
        <SearchFilter label-width="100px" size="small" @search="fetchData" @reset="reset">
          <el-form-item label="角色名称">
            <el-input v-model="query.roleName" />
          </el-form-item>
          <el-form-item label="用户标识">
            <el-input v-model="query.roleIdentity" />
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
          style="width: 100%;"
          row-key="id"
          border
          default-expand-all
          :header-cell-style="{background:'#f5f7fa', color:'#606266', padding:'2px'}"
          :row-style="{color: '#2c3e50'}"
          :cell-style="{padding: '1px'}"
        >
          <el-table-column
            prop="roleName"
            label="角色名称"
            width="160"
          />
          <el-table-column
            prop="roleIdentity"
            label="角色标识"
            width="130"
          />
          <el-table-column
            prop="description"
            label="描述"
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
            width="400"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-menu"
                style="color: #ebb563;"
                @click="handleMenuFromShow(scope.row)"
              >菜单权限</el-button>
              <el-button
                type="text"
                style="color: #ebb563;"
                icon="el-icon-link"
                @click="handleInterfaceFromShow(scope.row)"
              >接口权限</el-button>
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
                  style="color: #f78989;"
                  icon="el-icon-delete"
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
    </el-container>

    <el-dialog title="菜单分配" :visible.sync="dialogMenuFormVisible" width="30%" @opened="openMenuDialog">
      <el-form ref="roleMenuForm" :label-width="formLabelWidth">
        <el-tree
          ref="tree"
          :data="menuListData"
          show-checkbox
          node-key="id"
          :default-expanded-keys="defaultExpandedMenu"
          :default-checked-keys="defaultCheckedMenu"
          :props="{
            children: 'children',
            label: 'menuTitle',
          }"
          @check-change="handleCheckChange"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleMenuFromShow">取 消</el-button>
        <el-button type="primary" @click="handleUpdateMenu">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="接口分配" :visible.sync="dialogInterfaceFormVisible" width="55%" @opened="openInterfaceDialog">
      <el-form
        ref="roleInterfaceForm"
        :label-width="formLabelWidth"
        class="from-element-centered"
      >
        <template>
          <div class="transfer">
            <el-transfer
              v-model="checkedInterfaceValue"
              filterable
              :filter-method="filterMethod"
              filter-placeholder="请输入接口名称"
              :titles="['可选接口', '当前接口']"
              :data="transferInterfaceData"
            />
          </div>
        </template>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleInterfaceFromShow">取 消</el-button>
        <el-button type="primary" @click="handleUpdateInterface">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增角色" :visible.sync="dialogAddFormVisible" width="30%">
      <el-form ref="roleAddForm" :rules="roleRules" :model="addForm" :label-width="formLabelWidth">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleIdentity">
          <el-input v-model="addForm.roleIdentity" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addForm.description" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddFromShow">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改角色" :visible.sync="dialogEditFormVisible" width="30%">
      <el-form ref="roleEditForm" :rules="roleRules" :model="editForm" :label-width="formLabelWidth">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleIdentity">
          <el-input v-model="editForm.roleIdentity" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditFromShow">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
/* .transfer >>> .el-transfer{
  padding: auto;
} */
.transfer >>> .el-transfer-panel {
  width: 350px;
}
</style>

<script>
import SearchFilter from '@/components/SearchFile'
import { getRoleListPage, addRole, updateRole, deleteRole, getRoleMenu, updateRoleMenu, getRoleSysInterface, updateRoleSysInterface } from '@/api/role'
import { getMenuList } from '@/api/menu'
import { getSysInterfaceList } from '@/api/sysInterface'

export default {
  name: 'Role',
  components: { SearchFilter },
  data() {
    return {
      loading: false,
      tableData: [],
      query: {
        roleName: '',
        roleIdentity: '',
        current: 0,
        pageSize: 10,
        total: 0
      },
      dialogMenuFormVisible: false,
      dialogInterfaceFormVisible: false,
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      visible: false,
      formLabelWidth: '120px',
      roleRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleIdentity: [{ required: true, message: '请输入角色标识', trigger: 'blur' }]
      },
      menuListData: [],
      defaultCheckedMenu: [],
      defaultCheckedMenuOld: [],
      defaultExpandedMenu: [],
      updateRoleMenu: {
        id: '',
        addMenuList: [],
        deleteMenuList: []
      },
      transferInterfaceData: [],
      checkedInterfaceValue: [],
      checkedInterfaceValueOld: [],
      updateRoleSysInterface: {
        id: '',
        addSysInterfaceList: [],
        deleteSysInterfaceList: []
      },
      addForm: {
        roleName: '',
        roleIdentity: '',
        description: '',
        usingStart: 1
      },
      row: {},
      editForm: {
        roleName: '',
        roleIdentity: '',
        description: '',
        usingStart: 1
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getRoleListPage(this.query).then(response => {
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
      updateRole(row).then(response => {
        // this.fetchData
      })
    },
    handleMenuFromShow(row) {
      this.updateRoleMenu.id = ''
      this.menuListData = []
      this.defaultCheckedMenu = []
      this.defaultExpandedMenu = []

      if (!this.dialogMenuFormVisible) {
        this.updateRoleMenu.id = row.id
        // 获取菜单列表
        getMenuList({ hidden: 0 }).then(response => {
          const { data } = response
          this.menuListData = data
          // 获取角色菜单（由于选中bug，这里不包含父节点）
          getRoleMenu({ id: row.id }).then(response => {
            row = null
            const { data } = response
            const checkedMenu = data
            for (const menu of checkedMenu) {
              this.defaultCheckedMenu.push(menu.id.toString())
              this.defaultExpandedMenu.push(menu.id.toString())
            }
            // 手动设置选中
            this.$refs.tree.setCheckedKeys(this.defaultCheckedMenu, true)
          })
        })
      }
      this.dialogMenuFormVisible = !this.dialogMenuFormVisible
    },
    openMenuDialog() {
      this.defaultCheckedMenuOld = []
      // 打开对话框回调获取选中节点（包含父节点）
      this.defaultCheckedMenuOld = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
    },
    handleCheckChange(data, checked, indeterminate) {
      const node = this.$refs.tree.getNode(data)
      if (!indeterminate) {
        node.expanded = checked
      }
    },
    handleUpdateMenu() {
      this.updateRoleMenu.addMenuList = []
      this.updateRoleMenu.deleteMenuList = []

      // 通过与旧选中比较，生成要新增和删除的菜单列表
      const checkedMenu = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      for (const menu of checkedMenu) {
        if (this.defaultCheckedMenuOld.indexOf(menu) === -1) {
          this.updateRoleMenu.addMenuList.push(menu)
        }
      }

      for (const menu of this.defaultCheckedMenuOld) {
        if (checkedMenu.indexOf(menu) === -1) {
          this.updateRoleMenu.deleteMenuList.push(menu)
        }
      }
      updateRoleMenu(this.updateRoleMenu).then(() => {
        this.handleMenuFromShow()
        this.$message({
          showClose: true,
          message: '修改成功！',
          type: 'success',
          duration: 1500
        })
      })
    },
    handleInterfaceFromShow(row) {
      this.updateRoleSysInterface.id = ''
      this.transferInterfaceData = []
      this.checkedInterfaceValue = []
      this.checkedInterfaceValueOld = []

      if (!this.dialogInterfaceFormVisible) {
        this.updateRoleSysInterface.id = row.id

        // 获取系统接口列表
        getSysInterfaceList({ usingStart: 1 }).then(response => {
          const { data } = response
          const sysInterfaceList = data
          sysInterfaceList.forEach((item, index) => {
            this.transferInterfaceData.push({
              label: item.interfaceName,
              key: item.id
            })
          })

          // 获取角色系统接口
          getRoleSysInterface({ id: row.id }).then(response => {
            row = null
            const { data } = response
            const roleSysInterfaceList = data
            roleSysInterfaceList.forEach((item, index) => {
              this.checkedInterfaceValue.push(item.id)
              this.checkedInterfaceValueOld.push(item.id)
            })
          })
        })
      }
      this.dialogInterfaceFormVisible = !this.dialogInterfaceFormVisible
    },
    openInterfaceDialog() {
      // 清空搜索框内容
      if (this.$refs.roleInterfaceForm.$children) {
        this.$refs.roleInterfaceForm.$children[0].$children[0].query = ''
        this.$refs.roleInterfaceForm.$children[0].$children[3].query = ''
      }
    },
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1
    },

    handleUpdateInterface() {
      this.updateRoleSysInterface.addSysInterfaceList = []
      this.updateRoleSysInterface.deleteSysInterfaceList = []

      // 通过与旧选中比较，生成要新增和删除的菜单列表
      for (const sysInterface of this.checkedInterfaceValue) {
        if (this.checkedInterfaceValueOld.indexOf(sysInterface) === -1) {
          this.updateRoleSysInterface.addSysInterfaceList.push(sysInterface)
        }
      }

      for (const sysInterface of this.checkedInterfaceValueOld) {
        if (this.checkedInterfaceValue.indexOf(sysInterface) === -1) {
          this.updateRoleSysInterface.deleteSysInterfaceList.push(sysInterface)
        }
      }

      console.log(this.updateRoleSysInterface)
      updateRoleSysInterface(this.updateRoleSysInterface).then(() => {
        this.handleInterfaceFromShow()
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
      if (!this.dialogEditFormVisible && this.$refs['roleAddForm']) {
        this.$refs['roleAddForm'].resetFields()
      }
    },
    handleAdd() {
      this.$refs['roleAddForm'].validate(valid => {
        if (valid) {
          addRole(this.addForm).then(() => {
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
        row.usingStart = null
        this.editForm = { ...row }
      }
      this.dialogEditFormVisible = !this.dialogEditFormVisible
    },
    handleEdit() {
      this.$refs['roleEditForm'].validate(valid => {
        if (valid) {
          updateRole(this.editForm).then(() => {
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
      deleteRole({ id: row.id }).then(() => {
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
