<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :laze="true" label="金价箱型图" name="tab_1" style="width: 100%;">
        <div id="boxplotChart" style="width: 98%;height: 630px;" />
      </el-tab-pane>
      <el-tab-pane :laze="true" label="金价折线图" name="tab_2" style="width: 100%;">
        <el-carousel :interval="1000 * 60 * 5" arrow="always" height="630px" indicator-position="outside">
          <el-carousel-item v-for="itme in yearData" :key="itme">
            <div :id="'lineChart' + itme" style="width: 98%;height: 100%;" />
          </el-carousel-item>
        </el-carousel>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import { getTradeListPage } from '@/api/trade'
import { computeStatistics } from '@/utils/utils'

export default {
  name: 'Echats',
  data() {
    return {
      echarts: require('echarts'),
      boxplotChart: null,
      lineChart: [],
      showTagName: [],
      tradeDate: [],
      yearData: [],
      boxplotData: [],
      activeName: 'tab_1',
      query: {
        tsCode: '',
        startTradeDate: '',
        endTradeDate: '',
        current: 0,
        pageSize: 20,
        total: 0
      }
    }
  },
  mounted: function() {
    this.handleBasicData()
    this.handleClick({ paneName: 'tab_1' }, null)
  },
  methods: {
    handleClick(tag, event) {
      if (this.showTagName.indexOf(tag.paneName) === -1) {
        setTimeout(() => {
          this.showTagName.push(tag.paneName)
          if (tag.paneName === 'tab_1') {
            this.handleBoxplot()
          } else if (tag.paneName === 'tab_2') {
            this.handleLine()
          }
        }, 300)
      }
    },
    async handleBasicData() {
      await getTradeListPage(this.query).then(response => {
        const { data } = response
        this.query.total = data.total
      })

      const queryParam = { ...this.query }
      queryParam.pageSize = 1000
      let pageCount = parseInt(queryParam.total / queryParam.pageSize)
      if (queryParam.total % queryParam.pageSize !== 0) {
        pageCount = pageCount + 1
      }

      for (let pageNum = 0; pageNum < pageCount; pageNum++) {
        queryParam.current++
        await getTradeListPage(queryParam).then(response => {
          const { data } = response
          const oneData = data.records
          this.tradeDate = this.tradeDate.concat(oneData)
          for (let i = 0; i < oneData.length; i++) {
            if (this.yearData.indexOf(oneData[i].tradeDate.substr(0, 4)) === -1) {
              this.yearData.push(oneData[i].tradeDate.substr(0, 4))
            }
          }
        })
      }
      this.yearData.sort()
    },
    async handleBoxplotDate() {
      if (this.tradeDate.length === 0) {
        await this.handleBasicData()
      }

      for (let j = 0; j < this.yearData.length; j++) {
        const yearDate = []
        for (let i = 0; i < this.tradeDate.length; i++) {
          if (this.tradeDate[i].tradeDate.substr(0, 4) === this.yearData[j]) {
            yearDate.push(this.tradeDate[i].priceAvg)
          }
        }
        const boxplotDate = computeStatistics(yearDate)
        this.boxplotData.push(boxplotDate)
      }
    },
    async handleBoxplot() {
      await this.handleBoxplotDate()
      // 初始化echarts实例
      if (this.boxplotChart === null) {
        this.boxplotChart = this.echarts.init(document.getElementById('boxplotChart'))
      }
      const myChart = this.boxplotChart

      // 配置参数
      const option = {
        title: {
          text: '2015年至2022金价箱型图',
          left: 'center'
        },
        toolbox: {
          show: true,
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          formatter: function(params) {
          // 在tooltip的格式化函数中自定义显示内容
            const dataIndex = params.dataIndex // 获取当前数据的索引
            const xValue = option.xAxis.data[dataIndex] // 获取对应的x轴信息
            const data = params.data // 获取当前数据

            // 拼接提示信息
            let tooltipContent = '年份：' + xValue + '<br>'
            tooltipContent += '最小值：' + data[1] + '<br>'
            tooltipContent += '下四分位数：' + data[2] + '<br>'
            tooltipContent += '中位数：' + data[3] + '<br>'
            tooltipContent += '上四分位数：' + data[4] + '<br>'
            tooltipContent += '最大值：' + data[5]

            return tooltipContent
          }
        },
        xAxis: {
          type: 'category',
          data: this.yearData
        },
        yAxis: {
          type: 'value',
          min: 200
        },
        series: [
          {
            name: 'boxplot',
            type: 'boxplot',
            data: this.boxplotData,
            itemStyle: {
              borderWidth: 1.5
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    handleLinetDate(year) {
      const yearXDate = []
      const yearYDate = []
      for (let i = 0; i < this.tradeDate.length; i++) {
        if (this.tradeDate[i].tradeDate.substr(0, 4) === year) {
          yearXDate.push(this.tradeDate[i].tradeDate)
          yearYDate.push(this.tradeDate[i].priceAvg)
        }
      }
      return { 'yearXDate': yearXDate, 'yearYDate': yearYDate }
    },
    async handleLine() {
      // 配置参数
      const option = {
        title: {
          text: '金价折线图',
          left: 'center'
        },
        toolbox: {
          show: true,
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          min: 200
        },
        tooltip: {
          trigger: 'axis' // 配置触发类型为坐标轴轴线触发
        },
        series: [{
          data: [],
          type: 'line'
        }]
      }
      for (let i = 0; i < this.yearData.length; i++) {
        let itmeLineChart = null
        if (this.lineChart.indexOf(this.yearData[i]) === -1) {
          itmeLineChart = this.echarts.init(document.getElementById('lineChart' + this.yearData[i]))
          this.lineChart.push(itmeLineChart)
          option.title.text = this.yearData[i] + '金价折线图'
          const lineData = this.handleLinetDate(this.yearData[i])
          option.xAxis.data = lineData.yearXDate
          option.series[0].data = lineData.yearYDate
        }
        itmeLineChart.setOption(option)
      }
    }
  }
}
</script>
