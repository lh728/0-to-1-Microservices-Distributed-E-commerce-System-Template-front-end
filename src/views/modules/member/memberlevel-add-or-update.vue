<template>
  <el-dialog
    :title="!dataForm.id ? 'NEW' : 'UPDATE'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="200px">
      <el-form-item label="name" prop="name">
        <el-input v-model="dataForm.name" placeholder="name"></el-input>
      </el-form-item>
      <el-form-item label="growthPoint" prop="growthPoint">
        <el-input-number v-model="dataForm.growthPoint" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="defaultStatus" prop="defaultStatus">
        <el-checkbox v-model="dataForm.defaultStatus" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
      <el-form-item label="freeFreightPoint" prop="freeFreightPoint">
        <el-input-number :min="0" v-model="dataForm.freeFreightPoint"></el-input-number>
      </el-form-item>
      <el-form-item label="commentGrowthPoint" prop="commentGrowthPoint">
        <el-input-number :min="0" v-model="dataForm.commentGrowthPoint"></el-input-number>
      </el-form-item>
      <el-form-item label="privilegeFreeFreight" prop="priviledgeFreeFreight">
        <el-checkbox v-model="dataForm.priviledgeFreeFreight" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
      <el-form-item label="privilegeMemberPrice" prop="priviledgeMemberPrice">
        <el-checkbox v-model="dataForm.priviledgeMemberPrice" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
      <el-form-item label="privilegeBirthday" prop="priviledgeBirthday">
        <el-checkbox v-model="dataForm.priviledgeBirthday" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
      <el-form-item label="note" prop="note">
        <el-input v-model="dataForm.note" placeholder="note"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">CANCEL</el-button>
      <el-button type="primary" @click="dataFormSubmit()">YES</el-button>
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
        name: '',
        growthPoint: 0,
        defaultStatus: 0,
        freeFreightPoint: 0,
        commentGrowthPoint: 0,
        priviledgeFreeFreight: 0,
        priviledgeMemberPrice: 0,
        priviledgeBirthday: 0,
        note: ''
      },
      dataRule: {
        name: [
          {required: true, message: 'name can not be null', trigger: 'blur'}
        ],
        growthPoint: [
          {required: true, message: 'growthPoint can not be null', trigger: 'blur'}
        ],
        defaultStatus: [
          {required: true, message: 'defaultStatus can not be null', trigger: 'blur'}
        ],
        freeFreightPoint: [
          {required: true, message: 'freeFreightPoint can not be null', trigger: 'blur'}
        ],
        commentGrowthPoint: [
          {required: true, message: 'commentGrowthPoint can not be null', trigger: 'blur'}
        ],
        priviledgeFreeFreight: [
          {required: true, message: 'privilegeFreeFreight can not be null', trigger: 'blur'}
        ],
        priviledgeMemberPrice: [
          {required: true, message: 'privilegeMemberPrice can not be null', trigger: 'blur'}
        ],
        priviledgeBirthday: [
          {required: true, message: 'privilegeBirthday can not be null', trigger: 'blur'}
        ],
        note: [
          {required: true, message: 'note can not be null', trigger: 'blur'}
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
            url: this.$http.adornUrl(`/member/memberlevel/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.memberLevel.name
              this.dataForm.growthPoint = data.memberLevel.growthPoint || 0
              this.dataForm.defaultStatus = data.memberLevel.defaultStatus || 0
              this.dataForm.freeFreightPoint = data.memberLevel.freeFreightPoint || 0
              this.dataForm.commentGrowthPoint = data.memberLevel.commentGrowthPoint || 0
              this.dataForm.priviledgeFreeFreight = data.memberLevel.priviledgeFreeFreight || 0
              this.dataForm.priviledgeMemberPrice = data.memberLevel.priviledgeMemberPrice || 0
              this.dataForm.priviledgeBirthday = data.memberLevel.priviledgeBirthday || 0
              this.dataForm.note = data.memberLevel.note
            }
          })
        }
      })
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/member/memberlevel/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'growthPoint': this.dataForm.growthPoint,
              'defaultStatus': this.dataForm.defaultStatus,
              'freeFreightPoint': this.dataForm.freeFreightPoint,
              'commentGrowthPoint': this.dataForm.commentGrowthPoint,
              'priviledgeFreeFreight': this.dataForm.priviledgeFreeFreight,
              'priviledgeMemberPrice': this.dataForm.priviledgeMemberPrice,
              'priviledgeBirthday': this.dataForm.priviledgeBirthday,
              'note': this.dataForm.note
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
