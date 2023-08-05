<template>
  <div class="app-container">
    <el-container>
      <el-header height="@rowheight*10 !important">
        <SearchFilter label-width="100px" size="small" @search="fetchData" @reset="reset">
          <el-form-item label="IP">
            <el-input v-model="query.requestIp" />
          </el-form-item>
        </SearchFilter>
      </el-header>

      <el-main>
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
            prop="requestIp"
            width="200"
            label="请求ip"
            align="center"
          />
          <el-table-column
            prop="userId"
            width="100"
            label="用户id"
            align="center"
          />
          <el-table-column
            prop="requestArea"
            width="200"
            label="请求地区"
            align="center"
          />
          <el-table-column
            prop="errorMessage"
            label="失败信息"
          />
          <el-table-column
            prop="gmtCreate"
            label="创建时间"
            width="200"
            align="center"
          />
          <el-table-column
            prop="requestResult"
            label="请求结果"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.requestResult === 1" type="success">成功</el-tag>
              <el-tag v-else-if="scope.row.requestResult === 0" type="danger">失败</el-tag>
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
import { getSysLoginLogListPage } from '@/api/sysLoginLog'

export default {
  name: 'SysLoginLog',
  components: { SearchFilter },
  data() {
    return {
      loading: false,
      tableData: [],
      query: {
        requestIp: '',
        current: 0,
        pageSize: 10,
        total: 0,
        sortOrder: 'descend'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getSysLoginLogListPage(this.query).then(response => {
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
    }
  }
}

</script>
