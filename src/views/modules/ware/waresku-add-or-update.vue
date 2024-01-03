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
      <el-form-item label="sku_id" prop="skuId">
        <el-input v-model="dataForm.skuId" placeholder="sku_id"></el-input>
      </el-form-item>
      <el-form-item label="wareId" prop="wareId">
        <el-select v-model="dataForm.wareId" placeholder="Please choose warehouse" clearable>
          <el-option :label="w.name" :value="w.id" v-for="w in wareList" :key="w.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="stock" prop="stock">
        <el-input v-model="dataForm.stock" placeholder="stock"></el-input>
      </el-form-item>
      <el-form-item label="sku_name" prop="skuName">
        <el-input v-model="dataForm.skuName" placeholder="sku_name"></el-input>
      </el-form-item>
      <el-form-item label="stockLocked" prop="stockLocked">
        <el-input v-model="dataForm.stockLocked" placeholder="stockLocked"></el-input>
      </el-form-item>
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
        skuId: '',
        wareId: '',
        stock: 0,
        skuName: '',
        stockLocked: 0
      },
      dataRule: {
        skuId: [{ required: true, message: 'sku_id can not be null', trigger: 'blur' }],
        wareId: [
          { required: true, message: 'wareId can not be null', trigger: 'blur' }
        ],
        stock: [{ required: true, message: 'stock can not be null', trigger: 'blur' }],
        skuName: [
          { required: true, message: 'sku_name ku_id can not be null', trigger: 'blur' }
        ]
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
            url: this.$http.adornUrl(`/warehouse/waresku/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.skuId = data.wareSku.skuId
              this.dataForm.wareId = data.wareSku.wareId
              this.dataForm.stock = data.wareSku.stock
              this.dataForm.skuName = data.wareSku.skuName
              this.dataForm.stockLocked = data.wareSku.stockLocked
            }
          })
        }
      })
    },
    dataFormSubmit () {
      console.log(this.dataForm)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/warehouse/waresku/${!this.dataForm.id ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              skuId: this.dataForm.skuId,
              wareId: this.dataForm.wareId,
              stock: this.dataForm.stock,
              skuName: this.dataForm.skuName,
              stockLocked: this.dataForm.stockLocked
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
