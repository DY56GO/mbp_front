<template>
  <div class="app-container">
    <el-container>
      <el-header height="@rowheight*10 !important">
        <SearchFilter label-width="100px" size="small" @search="fetchData" @reset="reset">
          <el-form-item label="用户组名称">
            <el-input v-model="query.groupName" />
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
          :header-cell-style="{background:'#f5f7fa', color:'#606266', padding:'2px'}"
          :row-style="{color: '#2c3e50'}"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          :cell-style="{padding: '1px'}"
        >
          <el-table-column
            prop="groupName"
            label="用户组名称"
            width="140"
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
            prop="groupSort"
            label="排序"
            width="60"
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
                type="text"
                icon="el-icon-plus"
                @click="handleAddFromShow(scope.row)"
              >新增</el-button>
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
          :page-sizes="[ 100, 500, 1000]"
          :page-size="query.pageSize"
          layout="->,total, sizes, prev, pager, next, jumper"
          :total="query.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-main>
    </el-container>

    <el-dialog title="新增用户组" :visible.sync="dialogAddFormVisible" width="30%">
      <el-form ref="userGroupAddForm" :rules="userGroupRules" :model="addForm" :label-width="formLabelWidth">
        <el-form-item label="用户组名称" prop="groupName">
          <el-input v-model="addForm.groupName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户组排序" prop="groupSort">
          <el-input v-model="addForm.groupSort" autocomplete="off" />
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

    <el-dialog title="修改用户组" :visible.sync="dialogEditFormVisible" width="30%">
      <el-form ref="userGroupEditForm" :rules="userGroupRules" :model="editForm" :label-width="formLabelWidth">
        <el-form-item label="用户组名称" prop="groupName">
          <el-input v-model="editForm.groupName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户组排序" prop="groupSort">
          <el-input v-model="editForm.groupSort" autocomplete="off" />
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
::v-deep .el-dialog{
       display: flex;
       flex-direction: column;
       margin:0 !important;
       position:absolute;
       top:50%;
       left:50%;
       transform:translate(-50%,-50%);
       max-height:calc(100% - 30px);
       max-width:calc(100% - 30px);
   }
  ::v-deep  .el-dialog .el-dialog__body{
       flex:1;
       overflow: auto;
   }

</style>

<script>
import SearchFilter from '@/components/SearchFile'
import { getUserGroupListPage, addUserGroup, updateUserGroup, deleteUserGroup } from '@/api/userGroup'

export default {
  name: 'UserGroup',
  components: { SearchFilter },
  data() {
    return {
      loading: false,
      tableData: [],
      query: {
        groupName: '',
        current: 0,
        pageSize: 100,
        total: 0
      },
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      visible: false,
      formLabelWidth: '120px',
      userGroupRules: {
        groupName: [{ required: true, message: '请输入用户组名称', trigger: 'blur' }],
        routePath: [{ required: true, message: '请输入路由path', trigger: 'blur' }]
      },
      row: {},
      addForm: {
        parentId: 0,
        groupName: '',
        routePath: '',
        description: '',
        usingStart: 0,
        groupSort: 1
      },
      editForm: {
        parentId: 0,
        groupName: '',
        routePath: '',
        description: '',
        usingStart: 0,
        groupSort: 1
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getUserGroupListPage(this.query).then(response => {
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
      updateUserGroup(row).then(response => {
        // this.fetchData
      })
    },
    handleAddFromShow(row) {
      // 存在父节点，有则设置
      if (row && row.id) {
        this.addForm.parentId = row.id
      }
      this.dialogAddFormVisible = !this.dialogAddFormVisible
      // form开始为隐藏状态，没有DOM对象，判单form关闭且DOM对象不为为undefined，重置表单
      if (!this.dialogEditFormVisible && this.$refs['userGroupAddForm']) {
        this.$refs['userGroupAddForm'].resetFields()
      }
    },
    handleAdd() {
      this.$refs['userGroupAddForm'].validate(valid => {
        if (valid) {
          addUserGroup(this.addForm).then(() => {
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
        this.editForm = { ...row }
      }
      this.dialogEditFormVisible = !this.dialogEditFormVisible
    },
    handleEdit() {
      this.$refs['userGroupEditForm'].validate(valid => {
        if (valid) {
          updateUserGroup(this.editForm).then(() => {
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
      deleteUserGroup({ id: row.id }).then(() => {
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
