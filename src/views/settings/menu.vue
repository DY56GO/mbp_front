<template>
  <div class="app-container">
    <el-container>
      <el-header height="30px">
        <el-input
          v-model="list.menuName"
          placeholder="请输入菜单名称"
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
            prop="menuName"
            label="菜单名称"
            width="160"
          />
          <el-table-column
            prop="menuIcon"
            label="菜单图标"
            width="130"
          />
          <el-table-column
            prop="routeUrl"
            label="路由Url"
            width="180"
          />
          <el-table-column
            prop="componentName"
            label="组件名称"
            width="110"
          />
          <el-table-column
            prop="componentPath"
            label="组件路径"
            width="180"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            prop="isHidden"
            label="状态"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isHidden"
                :active-value="1"
                :inactive-value="0"
                active-text="隐藏"
                @change="handleHiddenChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="menuSort"
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
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="handleAddFromShow(scope.row)"
              >新增</el-button>
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

    <el-dialog title="新增菜单" :visible.sync="dialogAddFormVisible" width="30%">
      <el-form ref="menuAddForm" :rules="menuRules" :model="addForm" :label-width="formLabelWidth">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="addForm.menuName" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="menuIcon">
          <el-input v-model="addForm.menuIcon" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="路由Url" prop="routeUrl">
          <el-input v-model="addForm.routeUrl" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="组件名称" prop="componentName">
          <el-input v-model="addForm.componentName" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="组件路径" prop="componentPath">
          <el-input v-model="addForm.componentPath" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menuSort">
          <el-input v-model="addForm.menuSort" autocomplete="off" style="width: 260px;" />
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

    <el-dialog title="修改菜单" :visible.sync="dialogEditFormVisible" width="30%">
      <el-form ref="menuEditForm" :rules="menuRules" :model="editForm" :label-width="formLabelWidth">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="editForm.menuName" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="menuIcon">
          <el-input v-model="editForm.menuIcon" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="路由Url" prop="routeUrl">
          <el-input v-model="editForm.routeUrl" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="组件名称" prop="componentName">
          <el-input v-model="editForm.componentName" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="组件路径" prop="componentPath">
          <el-input v-model="editForm.componentPath" autocomplete="off" style="width: 260px;" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menuSort">
          <el-input v-model="editForm.menuSort" autocomplete="off" style="width: 260px;" />
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
import { getListPage, addMenu, updateMenu, deleteMenu } from '@/api/menu'

export default {
  name: 'Menu',
  data() {
    return {
      list: {
        menuName: '',
        current: 1,
        pageSize: 100,
        total: 0
      },
      addForm: {
        parentId: 0,
        menuName: '',
        menuIcon: '',
        routeUrl: '',
        componentName: '',
        componentPath: '',
        description: '',
        isHidden: 0,
        menuSort: 1
      },
      editForm: {
        parentId: 0,
        menuName: '',
        menuIcon: '',
        routeUrl: '',
        componentName: '',
        componentPath: '',
        description: '',
        isHidden: 0,
        menuSort: 1
      },
      tableData: [],
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      visible: false,
      // deleteVisible: false,
      formLabelWidth: '120px',
      menuRules: {
        menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        routeUrl: [{ required: true, message: '请输入路由Url', trigger: 'blur' }],
        componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
        componentPath: [{ required: true, message: '请输入组件路径', trigger: 'blur' }]
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
    handleHiddenChange(row) {
      row.isHidden === 0 ? 1 : 0
      updateMenu(row).then(response => {
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
      if (!this.dialogEditFormVisible && this.$refs['menuAddForm']) {
        this.$refs['menuAddForm'].resetFields()
      }
    },
    handleAdd() {
      this.$refs['menuAddForm'].validate(valid => {
        if (valid) {
          addMenu(this.addForm).then(() => {
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
      if (!this.dialogEditFormVisible && this.$refs['menuEditForm']) {
        this.$refs['menuEditForm'].resetFields()
      }
    },
    handleEdit() {
      this.$refs['menuEditForm'].validate(valid => {
        if (valid) {
          updateMenu(this.editForm).then(() => {
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
        deleteMenu({ id: row.id }).then(() => {
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
