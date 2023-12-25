<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <category @tree-node-click="treenodeclick"></category>
    </el-col>
    <el-col :span="18">
      <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.key" placeholder="Attribute Name" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">SEARCH</el-button>
            <el-button type="success" @click="getAllDataList()">SEARCH ALL</el-button>
            <el-button
              v-if="isAuth('product:attrgroup:save')"
              type="primary"
              @click="addOrUpdateHandle()"
            >NEW</el-button>
            <el-button
              v-if="isAuth('product:attrgroup:delete')"
              type="danger"
              @click="deleteHandle()"
              :disabled="dataListSelections.length <= 0"
            >BATCH DEL</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          style="width: 100%;"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="attrGroupId" header-align="center" align="center" label="Group Id"></el-table-column>
          <el-table-column prop="attrGroupName" header-align="center" align="center" label="Group Name"></el-table-column>
          <el-table-column prop="sort" header-align="center" align="center" label="Sort"></el-table-column>
          <el-table-column prop="descript" header-align="center" align="center" label="Group DESCR"></el-table-column>
          <el-table-column prop="icon" header-align="center" align="center" label="Group Icon"></el-table-column>
          <el-table-column prop="catelogId" header-align="center" align="center" label="catelogId"></el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="ACTION"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="relationHandle(scope.row.attrGroupId)">ASSOCIATE</el-button>
              <el-button
                type="text"
                size="small"
                @click="addOrUpdateHandle(scope.row.attrGroupId)"
              >UPDATE</el-button>
              <el-button type="text" size="small" @click="deleteHandle(scope.row.attrGroupId)">DELETE</el-button>
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
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

        <relation-update v-if="relationVisible" ref="relationUpdate" @refreshData="getDataList"></relation-update>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Category from '../common/category'
import AddOrUpdate from './attrgroup-add-or-update'
import RelationUpdate from './attr-group-relation'
export default {
  components: { Category, AddOrUpdate, RelationUpdate },
  props: {},
  data () {
    return {
      catId: 0,
      dataForm: {
        key: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      relationVisible: false
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    relationHandle (groupId) {
      this.relationVisible = true
      this.$nextTick(() => {
        this.$refs.relationUpdate.init(groupId)
      })
    },
    treenodeclick (data, node, component) {
      if (node.level === 3) {
        this.catId = data.catId
        this.getDataList()
      }
    },
    getAllDataList () {
      this.catId = 0
      this.getDataList()
    },
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/product/attrgroup/list/${this.catId}`),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key
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
    },
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.attrGroupId
        })
      this.$confirm(
        `Are you sure to delete the selected ${ids.length} items?`,
        'HINT',
        {
          confirmButtonText: 'YES',
          cancelButtonText: 'CANCEL',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/product/attrgroup/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: 'success',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
