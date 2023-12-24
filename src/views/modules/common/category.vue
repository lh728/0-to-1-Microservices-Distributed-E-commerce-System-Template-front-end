<template>
  <div>
    <el-tree :data="menus"
             :props="defaultProps"
             node-key="catId"
             ref="categoryTree"
             @node-click="nodeClickHandle"
    >
    </el-tree>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  components: {
  },
  methods: {
    getMenus () {
      this.$http({
        url: this.$http.adornUrl('/product/category/list/tree'),
        method: 'get'
      }).then(({data}) => {
        this.menus = data.page
      })
    },
    nodeClickHandle (data, node, instance) {
      this.$emit('tree-node-click', data, node, instance)
    }
  },
  created () {
    this.getMenus()
  }
}
</script>
