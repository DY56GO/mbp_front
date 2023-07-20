<template>
  <div class="root">
    <el-select v-model="selectShowLabel" :clearable="clearable" :placeholder="placeholder" multiple :collapse-tags="collapseTags" @blur="handleBlur" @change="changeHandle" @clear="clear" @remove-tag="removeTag">
      <el-option disabled :style="'margin:5px'">
        <el-input v-model="filterText" size="small" prefix-icon="el-icon-search" clearable placeholder="输入关键字进行查找" />
      </el-option>
      <el-tree ref="tree" :data="treeData" show-checkbox :node-key="defaultProps.value" :props="defaultProps" :default-expand-all="expandAll" :filter-node-method="filterNode" @check-change="checkChange" />
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'SelectTree',
  model: {
    prop: 'checkedArray', // 把父组件传过来的值重命名为checkedArray
    event: 'changeChecked' // 把父组件传过来的方法重命名为changeChecked 其实就是 input
  },
  props: {
    // 选中节点的值
    checkedArray: {
      type: Array,
      default: () => { return [] }
    },
    // 树数据
    treeData: {
      type: Array,
      required: true
    },
    // 设置指定的label,value,children
    nodeConfig: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value',
          children: 'children'
        }
      }
    },
    // 是否展开所有节点
    expandAll: {
      type: Boolean,
      default: false
    },
    // 下拉框tag是否折叠
    collapseTags: {
      type: Boolean,
      default: true
    },
    // 开启下拉框一键清空
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      // 用于下拉列表展示
      selectShowLabel: '',
      // 筛选输入框绑定值
      filterText: ''
    }
  },
  computed: {
    defaultProps() {
      return Object.assign({
        label: 'label',
        value: 'value',
        children: 'children'
      }, this.nodeConfig)
    }
  },
  watch: {
    // 设置回显
    checkedArray: {
      handler(val) {
        if (val && val.length > 0) {
          this.setCheckedNodes(val)
        }
      },
      // 监听第一次数据更改
      immediate: true
    },
    // 筛选符合条件选项
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 清空树选择的内容
    clear() {
      this.$refs.tree.setCheckedKeys([])
    },
    // select移除选中标签
    removeTag(label) {
      // 选中项的value
      const selectedValueArray = this.getCheckedNodes().filter(o => o[this.defaultProps.label] !== label).map(o => o[this.defaultProps.value])
      // 移除的节点
      const removeNode = this.$refs.tree.getCheckedNodes(true).filter(o => o[this.defaultProps.label] === label)
      // 更新树选中节点
      removeNode.forEach(o => {
        this.$refs.tree.setChecked(o, false, true)
      })
      // 更新父组件绑定值
      this.$emit('changeChecked', selectedValueArray)
    },
    // 树节点过滤方法
    filterNode(value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    // 获取选中节点
    getCheckedNodes() {
      const onlyLeaf = true
      return this.$refs.tree.getCheckedNodes(onlyLeaf).map(node => ({ [this.defaultProps.label]: node[this.defaultProps.label], [this.defaultProps.value]: node[this.defaultProps.value] }))
    },
    // 设置选中节点
    async setCheckedNodes(selectedArray) {
      if (!selectedArray || selectedArray.length === 0) {
        this.clear()
        return
      }

      // 外层"this.$nextTick"处理第一次回显dom可能未加载导致setCheckedKeys报错
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(selectedArray)
      })
    },
    // 节点选中状态更改
    checkChange() {
      // 获取选中的node节点
      const selectedArray = this.getCheckedNodes()
      // 设置select展示的label
      this.selectShowLabel = selectedArray.map(node => node[this.defaultProps.label])
      // 更新model绑定值
      const selectValueArray = selectedArray.map(node => node[this.defaultProps.value])
      this.$emit('changeChecked', selectValueArray)
    },
    // 提供表单校验
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root
      var name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    // 失去焦点后校验
    handleBlur(val) {
      this.$emit('blur', val.target.value)
      this.dispatch('ElFormItem', 'el.form.blur', [this.checkedArray])
    },
    // 选择值发生改变后校验
    changeHandle() {
      this.dispatch('ElFormItem', 'el.form.change', [this.checkedArray])
    }
  }
}
</script>
