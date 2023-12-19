<template>
  <div>
    <el-tree :data="menus"
             :default-expanded-keys="expandedKeys"
             :expand-on-click-node="false"
             :props="defaultProps"
             node-key="catId"
             show-checkbox>
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level <= 2"
            size="mini"
            type="text"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="() => update(node, data)">
            Update
          </el-button>
          <el-button
            v-if="node.childNodes.length == 0"
            size="mini"
            type="text"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="title"
      width="30%">
      <el-form :model="category">
        <el-form-item label="category name">
          <el-input v-model="category.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="category icon">
          <el-input v-model="category.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="category unit">
          <el-input v-model="category.productUnit" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitData">Submit</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      dialogType: '', // update or add
      menus: [],
      dialogVisible: false,
      category: {
        catId: null,
        name: '',
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        icon: '',
        productUnit: ''
      },
      expandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
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
    // dialog confirm
    append (data) {
      this.title = 'new category'
      this.dialogType = 'add'
      this.dialogVisible = true
      this.category.parentCid = data.catId
      this.category.catLevel = data.catLevel * 1 + 1
      this.category = {
        catId: null,
        name: '',
        showStatus: 1,
        sort: 0,
        icon: '',
        productUnit: ''
      }
    },
    update (node, data) {
      this.title = 'update category'
      this.dialogType = 'update'
      this.dialogVisible = true
      // send request to get category info
      this.$http({
        url: this.$http.adornUrl('/product/category/info/' + data.catId),
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.category = data.category
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    submitData () {
      if (this.dialogType === 'add') {
        this.addCategory()
      } else {
        this.updateCategory()
      }
    },
    updateCategory () {
      const {catId, name, icon, productUnit} = this.category
      this.$http({
        url: this.$http.adornUrl('/product/category/update'),
        method: 'post',
        data: this.$http.adornData({
          catId, name, icon, productUnit
        },  false)
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: 'update success',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getMenus()
              this.dialogVisible = false
              // set default need to be expanded category
              this.expandedKeys = [this.category.parentCid]
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    addCategory () {
      this.$http({
        url: this.$http.adornUrl('/product/category/save'),
        method: 'post',
        data: this.$http.adornData(this.category, false)
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: 'add success',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getMenus()
              this.dialogVisible = false
              // set default need to be expanded category
              this.expandedKeys = [this.category.parentCid]
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    remove (node, data) {
      const ids = [data.catId]
      this.$confirm(`are you sure delete ${data.name} category?`, 'HINT', {
        confirmButtonText: 'yes',
        cancelButtonText: 'no',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/product/category/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: 'delete success',
              type: 'success',
              duration: 500,
              onClose: () => {
                this.getMenus()
                // set default need to be expanded category
                this.expandedKeys = [node.parent.data.catId]
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'cancel delete'
        })
      })
    }
  },
  created () {
    this.getMenus()
  }
}
</script>

<style>

</style>
