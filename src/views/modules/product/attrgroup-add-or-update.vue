<template>
  <el-dialog
    :title="!dataForm.attrGroupId ? 'new' : 'update'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="clearDialogForm"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="150px">
      <el-form-item label="attr_group_name" prop="attrGroupName">
        <el-input v-model="dataForm.attrGroupName" placeholder="attr_group_name"></el-input>
      </el-form-item>
      <el-form-item label="sort" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="sort"></el-input>
      </el-form-item>
      <el-form-item label="descript" prop="descript">
        <el-input v-model="dataForm.descript" placeholder="descript"></el-input>
      </el-form-item>
      <el-form-item label="group icon" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="group icon"></el-input>
      </el-form-item>
      <el-form-item label="catelog_id" prop="catelogId">
        <el-cascader :options="menus" :props="props" v-model="dataForm.catelogPath" filterable clearable
                     placeholder="try search: phone"></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">cancel</el-button>
      <el-button type="primary" @click="dataFormSubmit()">save</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        attrGroupId: 0,
        attrGroupName: '',
        sort: '',
        descript: '',
        icon: '',
        catelogId: 0,
        catelogPath: []
      },
      menus: [],
      props: {
        value: 'catId',
        label: 'name',
        children: 'children'
      },
      dataRule: {
        attrGroupName: [
          {required: true, message: 'attr_group_name can not be null', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: 'sort can not be null', trigger: 'blur'}
        ],
        descript: [
          {required: true, message: 'descript can not be null', trigger: 'blur'}
        ],
        icon: [
          {required: true, message: 'group icon can not be null', trigger: 'blur'}
        ],
        catelogId: [
          {required: true, message: 'catelog_id can not be null', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getMenus()
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
    clearDialogForm () {
      this.dataForm.catelogPath = []
    },
    init (id) {
      this.dataForm.attrGroupId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.attrGroupId) {
          this.$http({
            url: this.$http.adornUrl(`/product/attrgroup/info/${this.dataForm.attrGroupId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.attrGroupName = data.attrGroup.attrGroupName
              this.dataForm.sort = data.attrGroup.sort
              this.dataForm.descript = data.attrGroup.descript
              this.dataForm.icon = data.attrGroup.icon
              this.dataForm.catelogId = data.attrGroup.catelogId
              // find all path of catelogId
              this.dataForm.catelogPath = data.attrGroup.catelogPath
            }
          })
        }
      })
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/product/attrgroup/${!this.dataForm.attrGroupId ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'attrGroupId': this.dataForm.attrGroupId || undefined,
              'attrGroupName': this.dataForm.attrGroupName,
              'sort': this.dataForm.sort,
              'descript': this.dataForm.descript,
              'icon': this.dataForm.icon,
              'catelogId': this.dataForm.catelogPath[this.dataForm.catelogPath.length - 1]
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: 'success',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
