<template>
  <el-dialog
    :title="!dataForm.id ? 'NEW' : 'UPDATE'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="200px"
    >
      <el-form-item label="Brand Name" prop="name">
        <el-input v-model="dataForm.name" placeholder="Brand Name"></el-input>
      </el-form-item>
      <el-form-item label="Brand logo Address" prop="logo">
        <single-upload v-model="dataForm.logo"></single-upload>
      </el-form-item>
      <el-form-item label="Brand Descr" prop="descript">
        <el-input v-model="dataForm.descript" placeholder="Descr"></el-input>
      </el-form-item>
      <el-form-item label="Show Status" prop="showStatus">
        <el-switch
          v-model="dataForm.showStatus"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item label="Brand First Letter" prop="firstLetter">
        <el-input v-model="dataForm.firstLetter" placeholder="Brand First Letter"></el-input>
      </el-form-item>
      <el-form-item label="Sort" prop="sort">
        <el-input v-model.number="dataForm.sort" placeholder="Sort"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">CANCEL</el-button>
      <el-button type="primary" @click="dataFormSubmit()">YES</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SingleUpload from '@/components/upload/singleUpload'
export default {
  components: { SingleUpload },
  data () {
    return {
      visible: false,
      dataForm: {
        brandId: 0,
        name: '',
        logo: '',
        descript: '',
        showStatus: 1,
        firstLetter: '',
        sort: 0
      },
      dataRule: {
        name: [{ required: true, message: 'Brand Name can not be null', trigger: 'blur' }],
        logo: [
          { required: true, message: 'Brand logo can not be null', trigger: 'blur' }
        ],
        descript: [
          { required: true, message: 'Descr can not be null', trigger: 'blur' }
        ],
        showStatus: [
          {
            required: true,
            message: 'Show Status can not be null',
            trigger: 'blur'
          }
        ],
        firstLetter: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('First Letter can not be null'))
              } else if (!/^[a-zA-Z]$/.test(value)) {
                callback(new Error('First Letter must be a letter'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        sort: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('Sort can not be null'))
              } else if (!Number.isInteger(value) || value < 0) {
                callback(new Error('Sort must be a positive integer'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
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
            url: this.$http.adornUrl(
              `/product/brand/info/${this.dataForm.brandId}`
            ),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/brand/${!this.dataForm.brandId ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              brandId: this.dataForm.brandId || undefined,
              name: this.dataForm.name,
              logo: this.dataForm.logo,
              descript: this.dataForm.descript,
              showStatus: this.dataForm.showStatus,
              firstLetter: this.dataForm.firstLetter,
              sort: this.dataForm.sort
            })
          }).then(({ data }) => {
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
