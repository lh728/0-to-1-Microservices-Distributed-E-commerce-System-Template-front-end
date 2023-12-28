<template>
  <el-dialog
    :title="!dataForm.id ? 'NEW' : 'UPDATE'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="levelId" prop="levelId">
      <el-input v-model="dataForm.levelId" placeholder="levelId"></el-input>
    </el-form-item>
    <el-form-item label="username" prop="username">
      <el-input v-model="dataForm.username" placeholder="username"></el-input>
    </el-form-item>
    <el-form-item label="password" prop="password">
      <el-input v-model="dataForm.password" placeholder="password"></el-input>
    </el-form-item>
    <el-form-item label="nickname" prop="nickname">
      <el-input v-model="dataForm.nickname" placeholder="nickname"></el-input>
    </el-form-item>
    <el-form-item label="mobile" prop="mobile">
      <el-input v-model="dataForm.mobile" placeholder="mobile"></el-input>
    </el-form-item>
    <el-form-item label="email" prop="email">
      <el-input v-model="dataForm.email" placeholder="email"></el-input>
    </el-form-item>
    <el-form-item label="avatar" prop="header">
      <el-input v-model="dataForm.header" placeholder="avatar"></el-input>
    </el-form-item>
    <el-form-item label="gender" prop="gender">
      <el-input v-model="dataForm.gender" placeholder="gender"></el-input>
    </el-form-item>
    <el-form-item label="birth" prop="birth">
      <el-input v-model="dataForm.birth" placeholder="birth"></el-input>
    </el-form-item>
    <el-form-item label="city" prop="city">
      <el-input v-model="dataForm.city" placeholder="city"></el-input>
    </el-form-item>
    <el-form-item label="job" prop="job">
      <el-input v-model="dataForm.job" placeholder="job"></el-input>
    </el-form-item>
    <el-form-item label="sign" prop="sign">
      <el-input v-model="dataForm.sign" placeholder="sign"></el-input>
    </el-form-item>
    <el-form-item label="sourceType" prop="sourceType">
      <el-input v-model="dataForm.sourceType" placeholder="sourceType"></el-input>
    </el-form-item>
    <el-form-item label="point" prop="integration">
      <el-input v-model="dataForm.integration" placeholder="point"></el-input>
    </el-form-item>
    <el-form-item label="growth" prop="growth">
      <el-input v-model="dataForm.growth" placeholder="growth"></el-input>
    </el-form-item>
    <el-form-item label="status" prop="status">
      <el-input v-model="dataForm.status" placeholder="status"></el-input>
    </el-form-item>
    <el-form-item label="createTime" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="createTime"></el-input>
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
          levelId: '',
          username: '',
          password: '',
          nickname: '',
          mobile: '',
          email: '',
          header: '',
          gender: '',
          birth: '',
          city: '',
          job: '',
          sign: '',
          sourceType: '',
          integration: '',
          growth: '',
          status: '',
          createTime: ''
        },
        dataRule: {
          levelId: [
            { required: true, message: 'levelId can not be null', trigger: 'blur' }
          ],
          username: [
            { required: true, message: 'username can not be null', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'password can not be null', trigger: 'blur' }
          ],
          nickname: [
            { required: true, message: 'nickname can not be null', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: 'mobile can not be null', trigger: 'blur' }
          ],
          email: [
            { required: true, message: 'email can not be null', trigger: 'blur' }
          ],
          header: [
            { required: true, message: 'avatar can not be null', trigger: 'blur' }
          ],
          gender: [
            { required: true, message: 'gender can not be null', trigger: 'blur' }
          ],
          birth: [
            { required: true, message: 'birth can not be null', trigger: 'blur' }
          ],
          city: [
            { required: true, message: 'city can not be null', trigger: 'blur' }
          ],
          job: [
            { required: true, message: 'job can not be null', trigger: 'blur' }
          ],
          sign: [
            { required: true, message: 'sign can not be null', trigger: 'blur' }
          ],
          sourceType: [
            { required: true, message: 'sourceType can not be null', trigger: 'blur' }
          ],
          integration: [
            { required: true, message: 'point can not be null', trigger: 'blur' }
          ],
          growth: [
            { required: true, message: 'growth can not be null', trigger: 'blur' }
          ],
          status: [
            { required: true, message: 'status can not be null', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: 'createTime can not be null', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/member/member/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.levelId = data.member.levelId
                this.dataForm.username = data.member.username
                this.dataForm.password = data.member.password
                this.dataForm.nickname = data.member.nickname
                this.dataForm.mobile = data.member.mobile
                this.dataForm.email = data.member.email
                this.dataForm.header = data.member.header
                this.dataForm.gender = data.member.gender
                this.dataForm.birth = data.member.birth
                this.dataForm.city = data.member.city
                this.dataForm.job = data.member.job
                this.dataForm.sign = data.member.sign
                this.dataForm.sourceType = data.member.sourceType
                this.dataForm.integration = data.member.integration
                this.dataForm.growth = data.member.growth
                this.dataForm.status = data.member.status
                this.dataForm.createTime = data.member.createTime
              }
            })
          }
        })
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/member/member/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'levelId': this.dataForm.levelId,
                'username': this.dataForm.username,
                'password': this.dataForm.password,
                'nickname': this.dataForm.nickname,
                'mobile': this.dataForm.mobile,
                'email': this.dataForm.email,
                'header': this.dataForm.header,
                'gender': this.dataForm.gender,
                'birth': this.dataForm.birth,
                'city': this.dataForm.city,
                'job': this.dataForm.job,
                'sign': this.dataForm.sign,
                'sourceType': this.dataForm.sourceType,
                'integration': this.dataForm.integration,
                'growth': this.dataForm.growth,
                'status': this.dataForm.status,
                'createTime': this.dataForm.createTime
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
