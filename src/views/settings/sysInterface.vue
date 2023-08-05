<template>
  <div class="app-container">
    <el-container>
      <el-header height="@rowheight*10 !important">
        <SearchFilter label-width="100px" size="small" @search="fetchData" @reset="reset">
          <el-form-item label="接口名称">
            <el-input v-model="query.interfaceName" />
          </el-form-item>
        </SearchFilter>
      </el-header>

      <el-main>
        <el-button
          type="primary"
          style="float: right; margin-bottom: 10px;"
          icon="el-icon-refresh"
          size="small"
          @click="handleRefresh"
        >刷新</el-button>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%;"
          row-key="id"
          border
          default-expand-all
          :header-cell-style="{background:'#f5f7fa', color:'#606266', padding:'2px'}"
          :row-style="{color: '#2c3e50'}"
          :cell-style="{padding: '9px'}"
        >
          <el-table-column
            prop="interfaceName"
            label="接口名称"
          />
          <el-table-column
            prop="interfaceMethod"
            label="接口方法"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.interfaceMethod !== ''"
                :type="scope.row.interfaceMethod === 'GET' ? '' : 'success'"
                effect="dark"
                style="width: 55px; height: 20px; text-align: center; line-height: 20px;"
              >
                {{ scope.row.interfaceMethod }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="interfaceUrl"
            label="接口url"
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
  </div>
</template>

<script>
import SearchFilter from '@/components/SearchFile'
import { getSysInterfaceListPage, refreshSysInterface, updateSysInterface } from '@/api/sysInterface'

export default {
  name: 'SysInterface',
  components: { SearchFilter },
  data() {
    return {
      loading: false,
      tableData: [],
      query: {
        interfaceName: '',
        current: 0,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getSysInterfaceListPage(this.query).then(response => {
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
    handleRefresh() {
      this.loading = true
      refreshSysInterface().then(response => {
        this.fetchData()
        this.loading = false
        this.$message({
          showClose: true,
          message: '刷新成功！',
          type: 'success',
          duration: 1500
        })
      })
    },
    handleUsingChange(row) {
      row.usingStart === 0 ? 1 : 0
      updateSysInterface(row).then(response => {
        // this.fetchData
      })
    }
  }
}

</script>
