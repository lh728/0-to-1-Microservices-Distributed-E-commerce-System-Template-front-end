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
      label-width="120px"
    >
      <el-form-item label="skuId" prop="skuId">
        <el-input v-model="dataForm.skuId" placeholder="skuId"></el-input>
      </el-form-item>
      <el-form-item label="skuNum" prop="skuNum">
        <el-input v-model="dataForm.skuNum" placeholder="skuNum"></el-input>
      </el-form-item>
      <el-form-item label="wareId" prop="wareId">
        <el-select v-model="dataForm.wareId" placeholder="Please choose ware" clearable>
          <el-option :label="w.name" :value="w.id" v-for="w in wareList" :key="w.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- [0NEW，1ASSIGNED，2PURCHASING，3COMPLETED，4FAILED] -->
      <!-- <el-form-item label="status" prop="status">
        <el-select v-model="dataForm.status" placeholder="status" clearable>
          <el-option label="NEW" :value="0"></el-option>
          <el-option label="ASSIGNED" :value="1"></el-option>
          <el-option label="PURCHASING" :value="2"></el-option>
          <el-option label="COMPLETED" :value="3"></el-option>
          <el-option label="FAILED" :value="4"></el-option>
        </el-select>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">CANCEL</el-button>
      <el-button type="primary" @click="dataFormSubmit()">SAVE</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      wareList: [],
      dataForm: {
        id: 0,
        purchaseId: '',
        skuId: '',
        skuNum: '',
        skuPrice: '',
        wareId: '',
        status: 0
      },
      dataRule: {
        skuId: [
          { required: true, message: 'skuId can not be null', trigger: 'blur' }
        ],
        skuNum: [
          { required: true, message: 'skuNum can not be null', trigger: 'blur' }
        ],
        wareId: [{ required: true, message: 'wareId can not be null', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getWares()
  },
  methods: {
    getWares () {
      this.$http({
        url: this.$http.adornUrl('/warehouse/wareinfo/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: 1,
          limit: 500
        })
      }).then(({ data }) => {
        this.wareList = data.page.list
      })
    },
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/warehouse/purchasedetail/info/${this.dataForm.id}`
            ),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.purchaseId = data.purchaseDetail.purchaseId
              this.dataForm.skuId = data.purchaseDetail.skuId
              this.dataForm.skuNum = data.purchaseDetail.skuNum
              this.dataForm.skuPrice = data.purchaseDetail.skuPrice
              this.dataForm.wareId = data.purchaseDetail.wareId
              this.dataForm.status = data.purchaseDetail.status
            }
          })
        }
      })
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/warehouse/purchasedetail/${!this.dataForm.id ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              purchaseId: this.dataForm.purchaseId,
              skuId: this.dataForm.skuId,
              skuNum: this.dataForm.skuNum,
              skuPrice: this.dataForm.skuPrice,
              wareId: this.dataForm.wareId,
              status: this.dataForm.status
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: 'success',
                type: 'success',
                duration: 500,
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
