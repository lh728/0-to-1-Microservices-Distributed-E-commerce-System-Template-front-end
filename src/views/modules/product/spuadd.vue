<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-steps :active="step" finish-status="success">
          <el-step title="Basic Info"></el-step>
          <el-step title="Specifications"></el-step>
          <el-step title="Sale Attribute"></el-step>
          <el-step title="SKU Info"></el-step>
          <el-step title="Save Success"></el-step>
        </el-steps>
      </el-col>
      <el-col :span="24" v-show="step===0">
        <el-card class="box-card" style="width:80%;margin:20px auto">
          <el-form ref="spuBaseForm" :model="spu" label-width="120px" :rules="spuBaseInfoRules">
            <el-form-item label="spuName" prop="spuName">
              <el-input v-model="spu.spuName"></el-input>
            </el-form-item>
            <el-form-item label="spuDescription" prop="spuDescription">
              <el-input v-model="spu.spuDescription"></el-input>
            </el-form-item>
            <el-form-item label="catalogId" prop="catalogId">
              <category-cascader></category-cascader>
            </el-form-item>
            <el-form-item label="brandId" prop="brandId">
              <brand-select></brand-select>
            </el-form-item>
            <el-form-item label="weight(Kg)" prop="weight">
              <el-input-number v-model.number="spu.weight" :min="0" :precision="3" :step="0.1"></el-input-number>
            </el-form-item>
            <el-form-item label="bounds" prop="bounds">
              <label>gold</label>
              <el-input-number
                style="width:130px"
                placeholder="gold"
                v-model="spu.bounds.buyBounds"
                :min="0"
                controls-position="right"
              ></el-input-number>
              <label style="margin-left:15px">growBounds</label>
              <el-input-number
                style="width:130px"
                placeholder="growBounds"
                v-model="spu.bounds.growBounds"
                :min="0"
                controls-position="right"
              >
                <template slot="prepend">growBounds</template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="decript" prop="decript">
              <multi-upload v-model="spu.decript"></multi-upload>
            </el-form-item>

            <el-form-item label="images" prop="images">
              <multi-upload v-model="spu.images"></multi-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="collectSpuBaseInfo">Next step: Set basic parameters</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="24" v-show="step===1">
        <el-card class="box-card" style="width:80%;margin:20px auto">
          <el-tabs tab-position="left" style="width:98%">
            <el-tab-pane
              :label="group.attrGroupName"
              v-for="(group,gidx) in dataResp.attrGroups"
              :key="group.attrGroupId"
            >
              <el-form ref="form" :model="spu">
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
                    placeholder="choose or input"
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
                  >quickly show
                  </el-checkbox>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <div style="margin:auto">
            <el-button type="primary" @click="step = 0">Previous Step</el-button>
            <el-button type="success" @click="generateSaleAttrs">Next step: Set up sales Attributes</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" v-show="step===2">
        <el-card class="box-card" style="width:80%;margin:20px auto">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Select sales attributes</span>
              <el-form ref="saleform" :model="spu">
                <el-form-item
                  :label="attr.attrName"
                  v-for="(attr,aidx) in dataResp.saleAttrs"
                  :key="attr.attrId"
                >
                  <el-input
                    v-model="dataResp.tempSaleAttrs[aidx].attrId"
                    type="hidden"
                    v-show="false"
                  ></el-input>
                  <el-checkbox-group v-model="dataResp.tempSaleAttrs[aidx].attrValues">
                    <el-checkbox
                      v-if="dataResp.saleAttrs[aidx].valueSelect !== ''"
                      :label="val"
                      v-for="val in dataResp.saleAttrs[aidx].valueSelect.split(';')"
                      :key="val"
                    ></el-checkbox>
                    <div style="margin-left:20px;display:inline">
                      <el-button
                        v-show="!inputVisible[aidx].view"
                        class="button-new-tag"
                        size="mini"
                        @click="showInput(aidx)"
                      >Customize
                      </el-button>
                      <el-input
                        v-show="inputVisible[aidx].view"
                        v-model="inputValue[aidx].val"
                        :ref="'saveTagInput'+aidx"
                        size="mini"
                        style="width:150px"
                        @keyup.enter.native="handleInputConfirm(aidx)"
                        @blur="handleInputConfirm(aidx)"
                      ></el-input>
                    </div>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </div>
            <el-button type="primary" @click="step = 1">Previous Step</el-button>
            <el-button type="success" @click="generateSkus">Next step: Set SKU Info</el-button>
          </el-card>
        </el-card>
      </el-col>
      <el-col :span="24" v-show="step===3">
        <el-card class="box-card" style="width:80%;margin:20px auto">
          <el-table :data="spu.skus" style="width: 100%">
            <el-table-column label="attribute combination">
              <el-table-column
                :label="item.attrName"
                v-for="(item,index) in dataResp.tableAttrColumn"
                :key="item.attrId"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.attr[index].attrValue }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="skuName" prop="skuName">
              <template slot-scope="scope">
                <el-input v-model="scope.row.skuName"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="skuTitle" prop="skuTitle">
              <template slot-scope="scope">
                <el-input v-model="scope.row.skuTitle"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="skuSubtitle" prop="skuSubtitle">
              <template slot-scope="scope">
                <el-input v-model="scope.row.skuSubtitle"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="price" prop="price">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price"></el-input>
              </template>
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="24">
                    <label style="display:block;float:left">Select gallery or</label>
                    <multi-upload
                      style="float:left;margin-left:10px;"
                      :showFile="false"
                      :listType="'text'"
                      v-model="uploadImages"
                    ></multi-upload>
                  </el-col>
                  <el-col :span="24">
                    <el-divider></el-divider>
                  </el-col>
                  <el-col :span="24">
                    <el-card
                      style="width:170px;float:left;margin-left:15px;margin-top:15px;"
                      :body-style="{ padding: '0px' }"
                      v-for="(img,index) in spu.images"
                      :key="index"
                    >
                      <img :src="img" style="width:160px;height:120px"/>
                      <div style="padding: 14px;">
                        <el-row>
                          <el-col :span="12">
                            <el-checkbox
                              v-model="scope.row.images[index].imgUrl"
                              :true-label="img"
                              false-label
                            ></el-checkbox>
                          </el-col>
                          <el-col :span="12">
                            <el-tag v-if="scope.row.images[index].defaultImg === 1">
                              <input
                                type="radio"
                                checked
                                :name="scope.row.skuName"
                                @change="checkDefaultImg(scope.row,index,img)"
                              />Set as Default
                            </el-tag>
                            <el-tag v-else>
                              <input
                                type="radio"
                                :name="scope.row.skuName"
                                @change="checkDefaultImg(scope.row,index,img)"
                              />Set as Default
                            </el-tag>
                          </el-col>
                        </el-row>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
                <!-- Discount，BOGOHO，Member Price -->
                <el-form :model="scope.row">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="Discount">
                        <label>满</label>
                        <el-input-number
                          style="width:160px"
                          :min="0"
                          controls-position="right"
                          v-model="scope.row.fullCount"
                        ></el-input-number>
                        <label>件</label>

                        <label style="margin-left:15px;">打</label>
                        <el-input-number
                          style="width:160px"
                          v-model="scope.row.discount"
                          :precision="2"
                          :max="1"
                          :min="0"
                          :step="0.01"
                          controls-position="right"
                        ></el-input-number>
                        <label>折</label>
                        <el-checkbox
                          v-model="scope.row.countStatus"
                          :true-label="1"
                          :false-label="0"
                        >Stackable discounts
                        </el-checkbox>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="BOGOHO">
                        <label>满</label>
                        <el-input-number
                          style="width:160px"
                          v-model="scope.row.fullPrice"
                          :step="100"
                          :min="0"
                          controls-position="right"
                        ></el-input-number>
                        <label>元</label>
                        <label style="margin-left:15px;">减</label>
                        <el-input-number
                          style="width:160px"
                          v-model="scope.row.reducePrice"
                          :step="10"
                          :min="0"
                          controls-position="right"
                        ></el-input-number>
                        <label>元</label>
                        <el-checkbox
                          v-model="scope.row.priceStatus"
                          :true-label="1"
                          :false-label="0"
                        >Stackable discounts
                        </el-checkbox>
                      </el-form-item>
                    </el-col>

                    <el-col :span="24">
                      <el-form-item label="memberPrice" v-if="scope.row.memberPrice.length>0">
                        <br/>
                        <el-form-item v-for="(mp,mpidx) in scope.row.memberPrice" :key="mp.id">
                          {{ mp.name }}
                          <el-input-number
                            style="width:160px"
                            v-model="scope.row.memberPrice[mpidx].price"
                            :precision="2"
                            :min="0"
                            controls-position="right"
                          ></el-input-number>
                        </el-form-item>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="step = 2">Previous Step</el-button>
          <el-button type="success" @click="submitSkus">Next step: Save Product Info</el-button>
        </el-card>
      </el-col>
      <el-col :span="24" v-show="step===4">
        <el-card class="box-card" style="width:80%;margin:20px auto">
          <h1>save success</h1>
          <el-button type="primary" @click="addAgian">keep new</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CategoryCascader from '../common/category-cascader'
import BrandSelect from '../common/brand-select'
import MultiUpload from '@/components/upload/multiUpload'

export default {
  components: {CategoryCascader, BrandSelect, MultiUpload},
  props: {},
  data () {
    return {
      catPathSub: null,
      brandIdSub: null,
      uploadDialogVisible: false,
      uploadImages: [],
      step: 0,
      spu: {
        spuName: '',
        spuDescription: '',
        catalogId: 0,
        brandId: '',
        weight: '',
        publishStatus: 0,
        decript: [],
        images: [],
        bounds: {
          buyBounds: 0,
          growBounds: 0
        },
        baseAttrs: [],
        skus: []
      },
      spuBaseInfoRules: {
        spuName: [
          {required: true, message: 'please input spuName', trigger: 'blur'}
        ],
        spuDescription: [
          {required: true, message: 'please input spuDescription', trigger: 'blur'}
        ],
        catalogId: [
          {required: true, message: 'please choose a category', trigger: 'blur'}
        ],
        brandId: [
          {required: true, message: 'please choose a brand', trigger: 'blur'}
        ],
        decript: [
          {required: true, message: 'please upload right decript', trigger: 'blur'}
        ],
        images: [
          {required: true, message: 'please upload right images', trigger: 'blur'}
        ],
        weight: [
          {
            type: 'number',
            required: true,
            message: 'please input right weight',
            trigger: 'blur'
          }
        ]
      },
      dataResp: {
        attrGroups: [],
        baseAttrs: [],
        saleAttrs: [],
        tempSaleAttrs: [],
        tableAttrColumn: [],
        memberLevels: [],
        steped: [false, false, false, false, false]
      },
      inputVisible: [],
      inputValue: []
    }
  },
  computed: {},
  watch: {
    uploadImages (val) {
      // Expand imgs options in each skus
      let imgArr = Array.from(new Set(this.spu.images.concat(val)))

      // {imgUrl:"",defaultImg:0} Since concat iterates last time, there are a lot of duplications.
      // So we have to get the total length of last time + this time

      this.spu.skus.forEach((item, index) => {
        let len = imgArr.length - this.spu.skus[index].images.length
        if (len > 0) {
          let imgs = new Array(len)
          imgs = imgs.fill({imgUrl: '', defaultImg: 0})
          this.spu.skus[index].images = item.images.concat(imgs)
        }
      })

      this.spu.images = imgArr
      console.log('this.spu.skus', this.spu.skus)
    }
  },
  methods: {
    addAgian () {
      this.step = 0
      this.resetSpuData()
    },
    resetSpuData () {
      this.spu = {
        spuName: '',
        spuDescription: '',
        catalogId: 0,
        brandId: '',
        weight: '',
        publishStatus: 0,
        decript: [],
        images: [],
        bounds: {
          buyBounds: 0,
          growBounds: 0
        },
        baseAttrs: [],
        skus: []
      }
    },
    handlePriceChange (scope, mpidx, e) {
      this.spu.skus[scope.$index].memberPrice[mpidx].price = e
    },
    getMemberLevels () {
      this.$http({
        url: this.$http.adornUrl('/member/memberlevel/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: 1,
          limit: 500
        })
      })
        .then(({data}) => {
          this.dataResp.memberLevels = data.page.list
        })
        .catch(e => {
          console.log(e)
        })
    },
    showInput (idx) {
      console.log('``````', this.view)
      this.inputVisible[idx].view = true
    },
    checkDefaultImg (row, index, img) {
      row.images[index].imgUrl = img
      row.images[index].defaultImg = 1
      row.images.forEach((item, idx) => {
        if (idx !== index) {
          row.images[idx].defaultImg = 0
        }
      })
    },
    handleInputConfirm (idx) {
      let inputValue = this.inputValue[idx].val
      if (inputValue) {
        if (this.dataResp.saleAttrs[idx].valueSelect === '') {
          this.dataResp.saleAttrs[idx].valueSelect = inputValue
        } else {
          this.dataResp.saleAttrs[idx].valueSelect += ';' + inputValue
        }
      }
      this.inputVisible[idx].view = false
      this.inputValue[idx].val = ''
    },
    collectSpuBaseInfo () {
      this.$refs.spuBaseForm.validate(valid => {
        if (valid) {
          this.step = 1
          this.showBaseAttrs()
        } else {
          return false
        }
      })
    },
    generateSaleAttrs () {
      this.spu.baseAttrs = []
      this.dataResp.baseAttrs.forEach(item => {
        item.forEach(attr => {
          let {attrId, attrValues, showDesc} = attr
          if (attrValues !== '') {
            if (attrValues instanceof Array) {
              attrValues = attrValues.join(';')
            }
            this.spu.baseAttrs.push({attrId, attrValues, showDesc})
          }
        })
      })
      console.log('baseAttrs', this.spu.baseAttrs)
      this.step = 2
      this.getShowSaleAttr()
    },
    generateSkus () {
      this.step = 3

      let selectValues = []
      this.dataResp.tableAttrColumn = []
      this.dataResp.tempSaleAttrs.forEach(item => {
        if (item.attrValues.length > 0) {
          selectValues.push(item.attrValues)
          this.dataResp.tableAttrColumn.push(item)
        }
      })

      let descartes = this.descartes(selectValues)
      let skus = []

      descartes.forEach((descar, descaridx) => {
        let attrArray = [] // sku属性组
        descar.forEach((de, index) => {
          let saleAttrItem = {
            attrId: this.dataResp.tableAttrColumn[index].attrId,
            attrName: this.dataResp.tableAttrColumn[index].attrName,
            attrValue: de
          }
          attrArray.push(saleAttrItem)
        })
        let imgs = []
        this.spu.images.forEach((img, idx) => {
          imgs.push({imgUrl: '', defaultImg: 0})
        })

        let memberPrices = []
        if (this.dataResp.memberLevels.length > 0) {
          for (let i = 0; i < this.dataResp.memberLevels.length; i++) {
            if (this.dataResp.memberLevels[i].priviledgeMemberPrice === 1) {
              memberPrices.push({
                id: this.dataResp.memberLevels[i].id,
                name: this.dataResp.memberLevels[i].name,
                price: 0
              })
            }
          }
        }
        let res = this.hasAndReturnSku(this.spu.skus, descar)
        if (res === null) {
          skus.push({
            attr: attrArray,
            skuName: this.spu.spuName + ' ' + descar.join(' '),
            price: 0,
            skuTitle: this.spu.spuName + ' ' + descar.join(' '),
            skuSubtitle: '',
            images: imgs,
            descar: descar,
            fullCount: 0,
            discount: 0,
            countStatus: 0,
            fullPrice: 0.0,
            reducePrice: 0.0,
            priceStatus: 0,
            memberPrice: [].concat(memberPrices)
          })
        } else {
          skus.push(res)
        }
      })
      this.spu.skus = skus
    },
    hasAndReturnSku (skus, descar) {
      let res = null
      if (skus.length > 0) {
        for (let i = 0; i < skus.length; i++) {
          if (skus[i].descar.join(' ') === descar.join(' ')) {
            res = skus[i]
          }
        }
      }
      return res
    },
    getShowSaleAttr () {
      if (!this.dataResp.steped[1]) {
        this.$http({
          url: this.$http.adornUrl(
            `/product/attr/sale/list/${this.spu.catalogId}`
          ),
          method: 'get',
          params: this.$http.adornParams({
            page: 1,
            limit: 500
          })
        }).then(({data}) => {
          this.dataResp.saleAttrs = data.page.list
          data.page.list.forEach(item => {
            this.dataResp.tempSaleAttrs.push({
              attrId: item.attrId,
              attrValues: [],
              attrName: item.attrName
            })
            this.inputVisible.push({view: false})
            this.inputValue.push({val: ''})
          })
          this.dataResp.steped[1] = true
        })
      }
    },
    showBaseAttrs () {
      if (!this.dataResp.steped[0]) {
        this.$http({
          url: this.$http.adornUrl(
            `/product/attrgroup/${this.spu.catalogId}/withattr`
          ),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          data.data.forEach(item => {
            let attrArray = []
            item.attrs.forEach(attr => {
              attrArray.push({
                attrId: attr.attrId,
                attrValues: '',
                showDesc: attr.showDesc
              })
            })
            this.dataResp.baseAttrs.push(attrArray)
          })
          this.dataResp.steped[0] = 0
          this.dataResp.attrGroups = data.data
        })
      }
    },

    submitSkus () {
      this.$confirm('Product data is about to be submitted. It will take a while. Do you want to continue?', 'HINT', {
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCEL',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/product/spuinfo/save'),
            method: 'post',
            data: this.$http.adornData(this.spu, false)
          }).then(({data}) => {
            if (data.code === 0) {
              this.$message({
                type: 'success',
                message: 'success!'
              })
              this.step = 4
            } else {
              this.$message({
                type: 'error',
                message: 'error 【' + data.msg + '】'
              })
            }
          })
        })
        .catch(e => {
          console.log(e)
          this.$message({
            type: 'info',
            message: 'canceled'
          })
        })
    },
    descartes (list) {
      var point = {}

      var result = []
      var pIndex = null
      var tempCount = 0
      var temp = []

      for (var item in list) {
        if (typeof list[item] === 'object') {
          point[item] = {parent: pIndex, count: 0}
          pIndex = item
        }
      }

      if (pIndex == null) {
        return list
      }

      while (true) {
        for (var index in list) {
          tempCount = point[index]['count']
          temp.push(list[index][tempCount])
        }

        result.push(temp)
        temp = []

        while (true) {
          if (point[index]['count'] + 1 >= list[index].length) {
            point[index]['count'] = 0
            pIndex = point[index]['parent']
            if (pIndex == null) {
              return result
            }
            index = pIndex
          } else {
            point[index]['count']++
            break
          }
        }
      }
    }
  },
  created () {
  },
  mounted () {
    // eslint-disable-next-line no-undef
    this.catPathSub = PubSub.subscribe('catPath', (msg, val) => {
      this.spu.catalogId = val[val.length - 1]
    })
    // eslint-disable-next-line no-undef
    this.brandIdSub = PubSub.subscribe('brandId', (msg, val) => {
      this.spu.brandId = val
    })
    this.getMemberLevels()
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
