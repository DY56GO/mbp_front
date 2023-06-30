<template>
  <div class="app-container">
    <el-container>

      <el-header height="@rowheight*10 !important">
        <SearchFilter label-width="100px" size="small" :max-show="4" @search="fetchData" @reset="reset">
          <el-form-item label="市场代码">
            <el-input v-model="list.tsCode" />
          </el-form-item>
          <el-form-item label="交易日期">
            <el-date-picker
              v-model="list.startTradeDate"
              align="right"
              type="date"
              placeholder="选择开始日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
            至
            <el-date-picker
              v-model="list.endTradeDate"
              align="right"
              type="date"
              placeholder="选择结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
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
          style="width: 100%;"
          row-key="id"
          border
          default-expand-all
          :header-cell-style="{background:'#f5f7fa', color:'#606266'}"
          :row-style="{color: '#2c3e50'}"
          :cell-style="{padding: '5px'}"
        >
          <el-table-column
            prop="tsCode"
            label="交易所市场代码"
          />
          <el-table-column
            prop="tradeDate"
            label="交易日期"
            width="120"
            align="center"
          />
          <el-table-column
            prop="openPrice"
            label="开盘价"
            width="100"
            align="center"
          />
          <el-table-column
            prop="closePrice"
            label="收盘价"
            width="100"
            align="center"
          />
          <el-table-column
            prop="highPrice"
            label="最高价格"
            width="100"
            align="center"
          />
          <el-table-column
            prop="lowPrice"
            label="最低价格"
            width="100"
            align="center"
          />
          <el-table-column
            prop="priceAvg"
            label="平均价"
            width="100"
            align="center"
          />
          <el-table-column
            prop="pipChange"
            label="变化点数"
            width="100"
            align="center"
          />
          <el-table-column
            prop="pctChange"
            label="变化百分比"
            width="100"
            align="center"
          />
          <el-table-column
            prop="vol"
            label="交易量"
            width="100"
            align="center"
          />
          <el-table-column
            prop="amount"
            label="金额"
            width="110"
            align="center"
          />
          <el-table-column
            prop="op"
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
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
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                >删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page="list.current"
          :page-sizes="[ 10, 20, 100, 500, 1000]"
          :page-size="list.pageSize"
          layout="->,total, sizes, prev, pager, next, jumper"
          :total="list.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-main>
    </el-container>

    <el-dialog title="新增交易" :visible.sync="dialogAddFormVisible" width="50%">
      <el-form ref="tradeAddForm" :rules="tradeRules" :model="tradeAddForm" :label-width="formLabelWidth" style="display: flex; flex-wrap: wrap;">
        <el-form-item label="交易所市场代码" prop="tsCode">
          <el-input v-model="tradeAddForm.tsCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="交易日期" prop="tradeDate">
          <el-date-picker
            v-model="tradeAddForm.tradeDate"
            align="right"
            type="date"
            placeholder="选择结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="width: 260px;"
          />
        </el-form-item>
        <el-form-item label="开盘价" prop="openPrice">
          <el-input v-model="tradeAddForm.openPrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="收盘价" prop="closePrice">
          <el-input v-model="tradeAddForm.closePrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="最高价格" prop="highPrice">
          <el-input v-model="tradeAddForm.highPrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="最低价格" prop="lowPrice">
          <el-input v-model="tradeAddForm.lowPrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="平均价" prop="price_avg">
          <el-input v-model="tradeAddForm.priceAvg" autocomplete="off" />
        </el-form-item>
        <el-form-item label="变化的点数" prop="pip_change">
          <el-input v-model="tradeAddForm.pipChange" autocomplete="off" />
        </el-form-item>
        <el-form-item label="变化的百分比" prop="pct_change">
          <el-input v-model="tradeAddForm.pctChange" autocomplete="off" />
        </el-form-item>
        <el-form-item label="交易量" prop="vol">
          <el-input v-model="tradeAddForm.vol" autocomplete="off" />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="tradeAddForm.amount" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddFromShow">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改交易" :visible.sync="dialogEditFormVisible" width="50%">
      <el-form ref="tradeEditForm" :rules="tradeRules" :model="tradeEditForm" :label-width="formLabelWidth" style="display: flex; flex-wrap: wrap;">
        <el-form-item label="交易所市场代码" prop="tsCode">
          <el-input v-model="tradeEditForm.tsCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="交易日期" prop="tradeDate">
          <el-date-picker
            v-model="tradeEditForm.tradeDate"
            align="right"
            type="date"
            placeholder="选择结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="width: 260px;"
          />
        </el-form-item>
        <el-form-item label="开盘价" prop="openPrice">
          <el-input v-model="tradeEditForm.openPrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="收盘价" prop="closePrice">
          <el-input v-model="tradeEditForm.closePrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="最高价格" prop="highPrice">
          <el-input v-model="tradeEditForm.highPrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="最低价格" prop="lowPrice">
          <el-input v-model="tradeEditForm.lowPrice" autocomplete="off" />
        </el-form-item>
        <el-form-item label="平均价" prop="price_avg">
          <el-input v-model="tradeEditForm.priceAvg" autocomplete="off" />
        </el-form-item>
        <el-form-item label="变化的点数" prop="pip_change">
          <el-input v-model="tradeEditForm.pipChange" autocomplete="off" />
        </el-form-item>
        <el-form-item label="变化的百分比" prop="pct_change">
          <el-input v-model="tradeEditForm.pctChange" autocomplete="off" />
        </el-form-item>
        <el-form-item label="交易量" prop="vol">
          <el-input v-model="tradeEditForm.vol" autocomplete="off" />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="tradeEditForm.amount" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditFromShow()">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTradeListPage, addTrade, updateTrade, deleteTrade } from '@/api/trade'
import SearchFilter from '@/components/SearchFile'

export default {
  name: 'Trade',
  components: { SearchFilter },
  data() {
    return {
      loading: false,
      tableData: [],
      list: {
        tsCode: '',
        startTradeDate: '',
        endTradeDate: '',
        current: 0,
        pageSize: 10,
        total: 0
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      tradeRules: {
        tsCode: [{ required: true, message: '请输入交易所市场代码', trigger: 'blur' }],
        tradeDate: [{ required: true, message: '请输入交易日期', trigger: 'blur' }]
      },
      tradeAddForm: {
        tsCode: '',
        tradeDate: '',
        closePrice: '',
        openPrice: '',
        highPrice: '',
        lowPrice: '',
        priceAvg: '',
        pipChange: '',
        pctChange: '',
        vol: '',
        amount: ''
      },
      tradeEditFormOld: {},
      tradeEditForm: {
        tsCode: '',
        tradeDate: '',
        closePrice: '',
        openPrice: '',
        highPrice: '',
        lowPrice: '',
        priceAvg: '',
        pipChange: '',
        pctChange: '',
        vol: '',
        amount: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.list.tsCode = ''
      this.list.startTradeDate = ''
      this.list.endTradeDate = ''
      this.fetchData()
    },
    fetchData() {
      this.loading = true
      getTradeListPage(this.list).then(response => {
        const { data } = response
        this.tableData = data.records
        this.list.total = data.total
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.list.current = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.list.pageSize = val
      this.fetchData()
    },
    handleAddFromShow() {
      this.dialogAddFormVisible = !this.dialogAddFormVisible
      // form开始为隐藏状态，没有DOM对象，判单form关闭且DOM对象不为为undefined，重置表单
      if (!this.dialogEditFormVisible && this.$refs['tradeAddForm']) {
        this.$refs['tradeAddForm'].resetFields()
      }
    },
    handleAdd() {
      this.$refs['tradeAddForm'].validate(valid => {
        if (valid) {
          addTrade(this.tradeAddForm).then(() => {
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
        this.tradeEditForm = { ...row }
      }
      this.dialogEditFormVisible = !this.dialogEditFormVisible
    },
    handleEdit() {
      this.$refs['tradeEditForm'].validate(valid => {
        if (valid) {
          updateTrade(this.tradeEditForm).then(() => {
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
      deleteTrade({ id: row.id }).then(() => {
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

