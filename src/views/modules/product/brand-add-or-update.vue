<template>
  <el-dialog
    :title="!dataForm.brandId ? 'new brand' : 'update'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="200px">
    <el-form-item label="name" prop="name">
      <el-input v-model="dataForm.name" placeholder="name"></el-input>
    </el-form-item>
    <el-form-item label="logo address" prop="logo">
      <el-input v-model="dataForm.logo" placeholder="logo address"></el-input>
    </el-form-item>
    <el-form-item label="descript" prop="descript">
      <el-input v-model="dataForm.descript" placeholder="descript"></el-input>
    </el-form-item>
    <el-form-item label="show_status" prop="showStatus">
      <el-switch v-model="dataForm.showStatus" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
    </el-form-item>
    <el-form-item label="Retrieving initials" prop="firstLetter">
      <el-input v-model="dataForm.firstLetter" placeholder="Retrieving initials"></el-input>
    </el-form-item>
    <el-form-item label="sort" prop="sort">
      <el-input v-model="dataForm.sort" placeholder="sort"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">cancel</el-button>
      <el-button type="primary" @click="dataFormSubmit()">yea</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          brandId: 0,
          name: '',
          logo: '',
          descript: '',
          showStatus: '',
          firstLetter: '',
          sort: ''
        },
        dataRule: {
          name: [
            { required: true, message: 'name can not be null', trigger: 'blur' }
          ],
          logo: [
            { required: true, message: 'logo address can not be null', trigger: 'blur' }
          ],
          descript: [
            { required: true, message: 'descript can not be null', trigger: 'blur' }
          ],
          showStatus: [
            { required: true, message: 'show_status[0-no display；1-display] can not be null', trigger: 'blur' }
          ],
          firstLetter: [
            { required: true, message: 'Retrieving initials can not be null', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: 'sort can not be null', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.brandId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.brandId) {
            this.$http({
              url: this.$http.adornUrl(`/product/brand/info/${this.dataForm.brandId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.brand.name
                this.dataForm.logo = data.brand.logo
                this.dataForm.descript = data.brand.descript
                this.dataForm.showStatus = data.brand.showStatus
                this.dataForm.firstLetter = data.brand.firstLetter
                this.dataForm.sort = data.brand.sort
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/product/brand/${!this.dataForm.brandId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'brandId': this.dataForm.brandId || undefined,
                'name': this.dataForm.name,
                'logo': this.dataForm.logo,
                'descript': this.dataForm.descript,
                'showStatus': this.dataForm.showStatus,
                'firstLetter': this.dataForm.firstLetter,
                'sort': this.dataForm.sort
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
