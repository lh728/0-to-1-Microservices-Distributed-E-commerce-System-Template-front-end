<template>
  <el-dialog
    :title="!dataForm.id ? 'NEW' : 'UPDATE'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="priority" prop="priority">
      <el-input v-model="dataForm.priority" placeholder="priority"></el-input>
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
        dataForm: {
          id: 0,
          assigneeId: '',
          assigneeName: '',
          phone: '',
          priority: '',
          status: 0,
          wareId: '',
          amount: '',
          createTime: '',
          updateTime: ''
        },
        dataRule: {
          assigneeId: [
            { required: true, message: 'assigneeId can not be null', trigger: 'blur' }
          ],
          assigneeName: [
            { required: true, message: 'assigneeName can not be null', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: 'phone can not be null', trigger: 'blur' }
          ],
          priority: [
            { required: true, message: 'priority can not be null', trigger: 'blur' }
          ],
          status: [
            { required: true, message: 'status can not be null', trigger: 'blur' }
          ],
          wareId: [
            { required: true, message: 'wareId can not be null', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: 'amount can not be null', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: 'createTime can not be null', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: 'updateTime can not be null', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/warehouse/purchase/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.assigneeId = data.purchase.assigneeId
                this.dataForm.assigneeName = data.purchase.assigneeName
                this.dataForm.phone = data.purchase.phone
                this.dataForm.priority = data.purchase.priority
                this.dataForm.status = data.purchase.status
                this.dataForm.wareId = data.purchase.wareId
                this.dataForm.amount = data.purchase.amount
                this.dataForm.createTime = data.purchase.createTime
                this.dataForm.updateTime = data.purchase.updateTime
              }
            })
          }
        })
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/warehouse/purchase/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'assigneeId': this.dataForm.assigneeId,
                'assigneeName': this.dataForm.assigneeName,
                'phone': this.dataForm.phone,
                'priority': this.dataForm.priority,
                'status': this.dataForm.status,
                'wareId': this.dataForm.wareId,
                'amount': this.dataForm.amount,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime
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
