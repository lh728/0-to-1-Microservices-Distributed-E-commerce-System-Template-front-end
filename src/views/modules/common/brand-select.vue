<template>
  <div>
    <el-select placeholder="Please choose" v-model="brandId" filterable clearable>
      <el-option
        v-for="item in brands"
        :key="item.brandId"
        :label="item.brandName"
        :value="item.brandId"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      catId: 0,
      brands: [
        {
          label: 'a',
          value: 1
        }
      ],
      brandId: '',
      subscribe: null
    }
  },
  computed: {},
  watch: {
    brandId (val) {
      // eslint-disable-next-line no-undef
      PubSub.publish('brandId', val)
    }
  },
  methods: {
    getCatBrands () {
      this.$http({
        url: this.$http.adornUrl('/product/categorybrandrelation/brands/list'),
        method: 'get',
        params: this.$http.adornParams({
          catId: this.catId
        })
      }).then(({ data }) => {
        this.brands = data.page
      })
    }
  },
  mounted () {
    // eslint-disable-next-line no-undef
    this.subscribe = PubSub.subscribe('catPath', (msg, val) => {
      this.catId = val[val.length - 1]
      this.getCatBrands()
    })
  },
  beforeDestroy () {
    // eslint-disable-next-line no-undef
    PubSub.unsubscribe(this.subscribe)
  }
}
</script>
<style scoped>
</style>
