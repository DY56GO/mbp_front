<template>
  <Form ref="form" :label-width="labelWidth" :size="size">
    <div id="searchFilter" :gutter="10" style="display: flex; flex-wrap: wrap;">
      <slot />
      <FormItem style="margin-left:auto;">
        <Button type="primary" icon="el-icon-search" @click="handleQuery">查询</Button>
        <Button icon="el-icon-refresh" @click="handleReset">重置</Button>
        <Button v-show="collapsiable" type="text" @click="shiftCollapsiable">
          <span>
            {{ fold ? '收起' : '展开' }}
            <i :class="fold ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
          </span>
        </Button>
      </FormItem>
    </div>
  </Form>
</template>
<script>
import { Form, FormItem, Button } from 'element-ui'
export default {
  name: 'SearchFilter',
  components: { Form, FormItem, Button },
  props: {
    // 最大展示数，默认3个，超过则隐藏，为0时不限制
    maxShow: {
      type: Number,
      default: 3
    },
    labelWidth: {
      type: String,
      default: '110px'
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      collapsiable: false,
      fold: false
    }
  },
  created() {},
  mounted() {
    // 通过最大显示个数控制展开/折叠
    if (this.maxShow > 0) {
      this.minShowCtrol()
    }
  },
  methods: {
    shiftCollapsiable() {
      this.fold = !this.fold
      this.minShowCtrol()
    },
    // 通过maxShow控制元素显示/折叠
    minShowCtrol() {
      const group = window.document.querySelectorAll(`#searchFilter .el-form-item.el-form-item--${this.size}`)
      const len = group?.length ? group?.length - 1 : 0
      if (this.maxShow < len) {
        group.forEach((item, index) => {
          if (index > this.maxShow - 1 && index < len) {
            item.hidden = !this.fold
          }
        })
        this.collapsiable = true
      } else {
        this.collapsiable = false
      }
    },
    handleQuery() {
      this.$emit('search')
    },
    handleReset() {
      this.$emit('reset')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
