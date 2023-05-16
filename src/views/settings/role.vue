<template>
  <div class="app-container">
    <el-container>
      <el-header height="30px">
        <el-input
          v-model="list.roleName"
          placeholder="请输入角色名称"
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

    <el-dialog title="新增角色" :visible.sync="dialogAddFormVisible" width="30%">
      <el-form ref="roleAddForm" :rules="roleRules" :model="addForm" :label-width="formLabelWidth">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleIdentity">
          <el-input v-model="addForm.roleIdentity" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addForm.description" type="textarea" autocomplete="off" style="width: 260px;" />
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
          <el-input v-model="editForm.roleName" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleIdentity">
          <el-input v-model="editForm.roleIdentity" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" autocomplete="off" style="width: 260px;" />
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
import { getListPage, addRole, updateRole, deleteRole } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      list: {
        roleName: '',
        current: 1,
        pageSize: 100,
        total: 0
      },
      addForm: {
        roleName: '',
        roleIdentity: '',
        description: '',
        isUsing: 1
      },
      editForm: {
        roleName: '',
        roleIdentity: '',
        description: '',
        isUsing: 1
      },
      tableData: [],
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      visible: false,
      // deleteVisible: false,
      formLabelWidth: '120px',
      roleRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleIdentity: [{ required: true, message: '请输入角色标识', trigger: 'blur' }]
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
      updateRole(row).then(response => {
        // this.fetchData
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
        this.editForm = row
      }
      this.dialogEditFormVisible = !this.dialogEditFormVisible
      // form开始为隐藏状态，没有DOM对象，判单form关闭且DOM对象不为为undefined，重置表单
      if (!this.dialogEditFormVisible && this.$refs['roleEditForm']) {
        this.$refs['roleEditForm'].resetFields()
      }
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
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({ id: row.id }).then(() => {
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
