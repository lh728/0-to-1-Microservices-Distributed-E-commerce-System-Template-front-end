<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="dataForm">
          <el-form-item label="CATEGORY">
            <category-cascader :catelogPath.sync="catelogPath"></category-cascader>
          </el-form-item>
          <el-form-item label="BRAND">
            <brand-select style="width:160px"></brand-select>
          </el-form-item>
          <el-form-item label="STATUS">
            <el-select style="width:160px" v-model="dataForm.status" clearable>
              <el-option label="NEW" :value="0"></el-option>
              <el-option label="LIST NEW" :value="1"></el-option>
              <el-option label="REMOVE" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="KEY:">
            <el-input style="width:160px" v-model="dataForm.key" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSpuInfo">SEARCH</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <spuinfo :catId="catId"></spuinfo>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CategoryCascader from '../common/category-cascader'
import BrandSelect from '../common/brand-select'
import Spuinfo from './spuinfo'
export default {
  components: { CategoryCascader, Spuinfo, BrandSelect },
  props: {},
  data () {
    return {
      catId: 0,
      catelogPath: [],
      dataForm: {
        status: '',
        key: '',
        brandId: '',
        catelogId: ''
      },
      catPathSub: null,
      brandIdSub: null

    }
  },
  computed: {},
  watch: {},
  methods: {
    searchSpuInfo () {
      // eslint-disable-next-line no-undef
      PubSub.publish('dataForm', this.dataForm)
    }
  },
  mounted () {
    // eslint-disable-next-line no-undef
    this.catPathSub = PubSub.subscribe('catPath', (msg, val) => {
      this.dataForm.catelogId = val[val.length - 1]
    })
    // eslint-disable-next-line no-undef
    this.brandIdSub = PubSub.subscribe('brandId', (msg, val) => {
      this.dataForm.brandId = val
    })
  },
  beforeDestroy () {
    // eslint-disable-next-line no-undef
    PubSub.unsubscribe(this.catPathSub)
    // eslint-disable-next-line no-undef
    PubSub.unsubscribe(this.brandIdSub)
  }
}
</script>
<style scoped>
</style>
