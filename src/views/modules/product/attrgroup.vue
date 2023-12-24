<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <Category @tree-node-click="handleTreeNodeClick"></Category>
      </el-col>
      <el-col :span="18">
        <div class="mod-config">
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
              <el-input v-model="dataForm.key" placeholder="attr name" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="getDataList()">search</el-button>
              <el-button v-if="isAuth('product:attrgroup:save')" type="primary" @click="addOrUpdateHandle()">new
              </el-button>
              <el-button v-if="isAuth('product:attrgroup:delete')" type="danger" @click="deleteHandle()"
                         :disabled="dataListSelections.length <= 0">batch del
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="attrGroupId"
              header-align="center"
              align="center"
              label="attr_group_id">
            </el-table-column>
            <el-table-column
              prop="attrGroupName"
              header-align="center"
              align="center"
              label="attr_group_name">
            </el-table-column>
            <el-table-column
              prop="sort"
              header-align="center"
              align="center"
              label="sort">
            </el-table-column>
            <el-table-column
              prop="descript"
              header-align="center"
              align="center"
              label="descript">
            </el-table-column>
            <el-table-column
              prop="icon"
              header-align="center"
              align="center"
              label="group icon">
            </el-table-column>
            <el-table-column
              prop="catelogId"
              header-align="center"
              align="center"
              label="catelog_id">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.attrGroupId)">update</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row.attrGroupId)">delete</el-button>
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
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
          <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Category from '../common/category'
import AddOrUpdate from './attrgroup-add-or-update'
export default {
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
      addOrUpdateVisible: false
    }
  },
  components: {
    Category,
    AddOrUpdate
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/product/attrgroup/list/${this.catId}`),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'key': this.dataForm.key
        })
      }).then(({data}) => {
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
    handleTreeNodeClick (data, node, instance) {
      if (node.level === 3) {
        this.catId = data.catId
        this.getDataList()
      }
    },
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.attrGroupId
      })
      this.$confirm('are you sure you want to delete?', 'HINT', {
        confirmButtonText: 'yes',
        cancelButtonText: 'no',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/product/attrgroup/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({data}) => {
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
  },
  activated () {
    this.getDataList()
  }
}
</script>
