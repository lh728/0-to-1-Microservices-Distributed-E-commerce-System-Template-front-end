<template>
  <el-dialog
    :title="!dataForm.id ? 'NEW' : 'UPDATE'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="200PX">
    <el-form-item label="order_id" prop="orderId">
      <el-input v-model="dataForm.orderId" placeholder="order_id"></el-input>
    </el-form-item>
    <el-form-item label="order_sn" prop="orderSn">
      <el-input v-model="dataForm.orderSn" placeholder="order_sn"></el-input>
    </el-form-item>
    <el-form-item label="consignee" prop="consignee">
      <el-input v-model="dataForm.consignee" placeholder="consignee"></el-input>
    </el-form-item>
    <el-form-item label="consigneeTel" prop="consigneeTel">
      <el-input v-model="dataForm.consigneeTel" placeholder="consigneeTel"></el-input>
    </el-form-item>
    <el-form-item label="deliveryAddress" prop="deliveryAddress">
      <el-input v-model="dataForm.deliveryAddress" placeholder="deliveryAddress"></el-input>
    </el-form-item>
    <el-form-item label="orderComment" prop="orderComment">
      <el-input v-model="dataForm.orderComment" placeholder="orderComment"></el-input>
    </el-form-item>
    <el-form-item label="paymentWay" prop="paymentWay">
      <el-input v-model="dataForm.paymentWay" placeholder="paymentWay【 1:ONLINE PAY 2:CASH DELIVERY】"></el-input>
    </el-form-item>
    <el-form-item label="taskStatus" prop="taskStatus">
      <el-input v-model="dataForm.taskStatus" placeholder="taskStatus"></el-input>
    </el-form-item>
    <el-form-item label="orderBody" prop="orderBody">
      <el-input v-model="dataForm.orderBody" placeholder="orderBody"></el-input>
    </el-form-item>
    <el-form-item label="trackingNo" prop="trackingNo">
      <el-input v-model="dataForm.trackingNo" placeholder="trackingNo"></el-input>
    </el-form-item>
    <el-form-item label="create_time" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="create_time"></el-input>
    </el-form-item>
    <el-form-item label="wareId" prop="wareId">
      <el-input v-model="dataForm.wareId" placeholder="wareId"></el-input>
    </el-form-item>
    <el-form-item label="taskComment" prop="taskComment">
      <el-input v-model="dataForm.taskComment" placeholder="taskComment"></el-input>
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
          orderId: '',
          orderSn: '',
          consignee: '',
          consigneeTel: '',
          deliveryAddress: '',
          orderComment: '',
          paymentWay: '',
          taskStatus: '',
          orderBody: '',
          trackingNo: '',
          createTime: '',
          wareId: '',
          taskComment: ''
        },
        dataRule: {
          orderId: [
            { required: true, message: 'order_id can not be null', trigger: 'blur' }
          ],
          orderSn: [
            { required: true, message: 'order_sn can not be null', trigger: 'blur' }
          ],
          consignee: [
            { required: true, message: 'consignee can not be null', trigger: 'blur' }
          ],
          consigneeTel: [
            { required: true, message: 'consigneeTel can not be null', trigger: 'blur' }
          ],
          deliveryAddress: [
            { required: true, message: 'deliveryAddress can not be null', trigger: 'blur' }
          ],
          orderComment: [
            { required: true, message: 'orderComment can not be null', trigger: 'blur' }
          ],
          paymentWay: [
            { required: true, message: 'paymentWay can not be null', trigger: 'blur' }
          ],
          taskStatus: [
            { required: true, message: 'taskStatus can not be null', trigger: 'blur' }
          ],
          orderBody: [
            { required: true, message: 'orderBody can not be null', trigger: 'blur' }
          ],
          trackingNo: [
            { required: true, message: 'trackingNo can not be null', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: 'create_time can not be null', trigger: 'blur' }
          ],
          wareId: [
            { required: true, message: 'wareId can not be null', trigger: 'blur' }
          ],
          taskComment: [
            { required: true, message: 'taskComment can not be null', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/warehouse/wareordertask/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.orderId = data.wareOrderTask.orderId
                this.dataForm.orderSn = data.wareOrderTask.orderSn
                this.dataForm.consignee = data.wareOrderTask.consignee
                this.dataForm.consigneeTel = data.wareOrderTask.consigneeTel
                this.dataForm.deliveryAddress = data.wareOrderTask.deliveryAddress
                this.dataForm.orderComment = data.wareOrderTask.orderComment
                this.dataForm.paymentWay = data.wareOrderTask.paymentWay
                this.dataForm.taskStatus = data.wareOrderTask.taskStatus
                this.dataForm.orderBody = data.wareOrderTask.orderBody
                this.dataForm.trackingNo = data.wareOrderTask.trackingNo
                this.dataForm.createTime = data.wareOrderTask.createTime
                this.dataForm.wareId = data.wareOrderTask.wareId
                this.dataForm.taskComment = data.wareOrderTask.taskComment
              }
            })
          }
        })
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/warehouse/wareordertask/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'orderId': this.dataForm.orderId,
                'orderSn': this.dataForm.orderSn,
                'consignee': this.dataForm.consignee,
                'consigneeTel': this.dataForm.consigneeTel,
                'deliveryAddress': this.dataForm.deliveryAddress,
                'orderComment': this.dataForm.orderComment,
                'paymentWay': this.dataForm.paymentWay,
                'taskStatus': this.dataForm.taskStatus,
                'orderBody': this.dataForm.orderBody,
                'trackingNo': this.dataForm.trackingNo,
                'createTime': this.dataForm.createTime,
                'wareId': this.dataForm.wareId,
                'taskComment': this.dataForm.taskComment
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
