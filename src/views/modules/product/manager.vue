<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form :inline="true" :model="dataForm">
        <el-form-item label="CATEGORY">
          <category-cascader :catelogPath.sync="catelogPath"></category-cascader>
        </el-form-item>
        <el-form-item label="BRAND">
          <brand-select style="width:160px"></brand-select>
        </el-form-item>
        <el-form-item label="PRICE">
          <el-input-number style="width:160px" v-model="dataForm.price.min" :min="0"></el-input-number>-
          <el-input-number style="width:160px" v-model="dataForm.price.max" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="KEY:">
          <el-input style="width:160px" v-model="dataForm.key" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSkuInfo">SEARCH</el-button>
        </el-form-item>
      </el-form>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
      @expand-change="getSkuDetails"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          skuTitle：{{scope.row.skuTitle}}
          <br />
          skuSubtitle：{{scope.row.skuSubtitle}}
          <br />
          skuDesc：{{scope.row.skuDesc}}
          <br />
          catalogId：{{scope.row.catalogId}}
          <br />
          SpuID：{{scope.row.spuId}}
          <br />
          brandId：{{scope.row.brandId}}
          <br />
        </template>
      </el-table-column>
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="skuId" header-align="center" align="center" label="skuId"></el-table-column>
      <el-table-column prop="skuName" header-align="center" align="center" label="skuName"></el-table-column>
      <el-table-column prop="skuDefaultImg" header-align="center" align="center" label="skuDefaultImg">
        <template slot-scope="scope">
          <img :src="scope.row.skuDefaultImg" style="width:80px;height:80px;" />
        </template>
      </el-table-column>
      <el-table-column prop="price" header-align="center" align="center" label="price"></el-table-column>
      <el-table-column prop="saleCount" header-align="center" align="center" label="saleCount"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="action">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="previewHandle(scope.row.skuId)">preview</el-button>
          <el-button type="text" size="small" @click="commentHandle(scope.row.skuId)">comment</el-button>
          <el-dropdown
            @command="handleCommand(scope.row,$event)"
            size="small"
            split-button
            type="text"
          >
            <span>More:</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="uploadImages">uploadImages</el-dropdown-item>
              <el-dropdown-item command="seckillSettings">seckillSettings</el-dropdown-item>
              <el-dropdown-item command="reductionSettings">reductionSettings</el-dropdown-item>
              <el-dropdown-item command="discountSettings">discountSettings</el-dropdown-item>
              <el-dropdown-item command="memberPriceSettings">memberPriceSettings</el-dropdown-item>
              <el-dropdown-item command="stockSettings">stockSettings</el-dropdown-item>
              <el-dropdown-item command="couponSettings">couponSettings</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import CategoryCascader from '../common/category-cascader'
import BrandSelect from '../common/brand-select'
export default {
  data () {
    return {
      catPathSub: null,
      brandIdSub: null,
      dataForm: {
        key: '',
        brandId: '',
        catelogId: '',
        price: {
          min: 0,
          max: 0
        }
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      catelogPath: []
    }
  },
  components: {
    CategoryCascader,
    BrandSelect
  },
  activated () {
    this.getDataList()
  },
  methods: {
    getSkuDetails (row, expand) {
    },
    handleCommand (row, command) {
      if (command === 'stockSettings') {
        this.$router.push({ path: '/ware-sku', query: { skuId: row.skuId } })
      }
    },
    searchSkuInfo () {
      this.getDataList()
    },
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/product/skuinfo/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          catelogId: this.dataForm.catelogId,
          brandId: this.dataForm.brandId,
          min: this.dataForm.price.min,
          max: this.dataForm.price.max
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    selectionChangeHandle (val) {
      this.dataListSelections = val
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
