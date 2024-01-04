<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card">
          <el-tabs tab-position="left" style="width:98%">
            <el-tab-pane
              :label="group.attrGroupName"
              v-for="(group,gidx) in dataResp.attrGroups"
              :key="group.attrGroupId"
            >
              <el-form ref="form" :model="dataResp">
                <el-form-item
                  :label="attr.attrName"
                  v-for="(attr,aidx) in group.attrs"
                  :key="attr.attrId"
                >
                  <el-input
                    v-model="dataResp.baseAttrs[gidx][aidx].attrId"
                    type="hidden"
                    v-show="false"
                  ></el-input>
                  <el-select
                    v-model="dataResp.baseAttrs[gidx][aidx].attrValues"
                    :multiple="attr.valueType === 1"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="Please choose or input"
                  >
                    <el-option
                      v-for="(val,vidx) in attr.valueSelect.split(';')"
                      :key="vidx"
                      :label="val"
                      :value="val"
                    ></el-option>
                  </el-select>
                  <el-checkbox
                    v-model="dataResp.baseAttrs[gidx][aidx].showDesc"
                    :true-label="1"
                    :false-label="0"
                  >show quicklu</el-checkbox>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <div style="margin:auto">
            <el-button type="success" style="float:right" @click="submitSpuAttrs">Confirm</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      spuId: '',
      catalogId: '',
      dataResp: {
        attrGroups: [],
        baseAttrs: []
      },
      spuAttrsMap: {}
    }
  },
  computed: {},
  methods: {
    clearData () {
      this.dataResp.attrGroups = []
      this.dataResp.baseAttrs = []
      this.spuAttrsMap = {}
    },
    getSpuBaseAttrs () {
      this.$http({
        url: this.$http.adornUrl(`/product/attr/base/listforspu/${this.spuId}`),
        method: 'get'
      }).then(({ data }) => {
        data.page.forEach(item => {
          this.spuAttrsMap['' + item.attrId] = item
        })
      })
    },
    getQueryParams () {
      this.spuId = this.$route.query.spuId
      this.catalogId = this.$route.query.catalogId
    },
    showBaseAttrs () {
      let _this = this
      this.$http({
        url: this.$http.adornUrl(
          `/product/attrgroup/${this.catalogId}/withattr`
        ),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        data.page.forEach(item => {
          let attrArray = []
          item.attrs.forEach(attr => {
            let v = ''
            if (_this.spuAttrsMap['' + attr.attrId]) {
              v = _this.spuAttrsMap['' + attr.attrId].attrValue.split(';')
              if (v.length === 1 && attr.valueType === 0) {
                v = v[0] + ''
              }
            }
            attrArray.push({
              attrId: attr.attrId,
              attrName: attr.attrName,
              attrValues: v,
              showDesc: _this.spuAttrsMap['' + attr.attrId]
                ? _this.spuAttrsMap['' + attr.attrId].quickShow
                : attr.showDesc
            })
          })
          this.dataResp.baseAttrs.push(attrArray)
        })
        this.dataResp.attrGroups = data.page
      })
    },
    submitSpuAttrs () {
      let submitData = []
      this.dataResp.baseAttrs.forEach(item => {
        item.forEach(attr => {
          let val = ''
          if (attr.attrValues instanceof Array) {
            val = attr.attrValues.join(';')
          } else {
            val = attr.attrValues
          }

          if (val !== '') {
            submitData.push({
              attrId: attr.attrId,
              attrName: attr.attrName,
              attrValue: val,
              quickShow: attr.showDesc
            })
          }
        })
      })

      this.$confirm('modify specification of product, continue?', 'HINT', {
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCEL',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/product/attr/update/${this.spuId}`),
            method: 'post',
            data: this.$http.adornData(submitData, false)
          }).then(({ data }) => {
            this.$message({
              type: 'success',
              message: 'success!'
            })
          })
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '' + e
          })
        })
    }
  },
  created () {},
  activated () {
    this.clearData()
    this.getQueryParams()
    if (this.spuId && this.catalogId) {
      this.showBaseAttrs()
      this.getSpuBaseAttrs()
    }
  }
}
</script>
<style scoped>
</style>
