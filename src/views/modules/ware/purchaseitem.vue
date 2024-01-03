<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="Warehouse">
        <el-select style="width:120px;" v-model="dataForm.wareId" placeholder="please choose warehouse" clearable>
          <el-option :label="w.name" :value="w.id" v-for="w in wareList" :key="w.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="status">
        <el-select style="width:120px;" v-model="dataForm.status" placeholder="choose status" clearable>
          <el-option label="NEW" :value="0"></el-option>
          <el-option label="ASSIGNED" :value="1"></el-option>
          <el-option label="PURCHASING" :value="2"></el-option>
          <el-option label="COMPLETED" :value="3"></el-option>
          <el-option label="FAILED" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="KEYWORD">
        <el-input style="width:120px;" v-model="dataForm.key" placeholder="KEYWORD" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">SEARCH</el-button>
        <el-button
          v-if="isAuth('ware:purchasedetail:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >NEW</el-button>
        <el-dropdown @command="handleBatchCommand" :disabled="dataListSelections.length <= 0">
          <el-button type="danger">
            BATCH OPERATION
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="delete">BATCH DEL</el-dropdown-item>
            <el-dropdown-item command="merge">MERGE</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
      <el-table-column prop="id" header-align="center" align="center" label="id"></el-table-column>
      <el-table-column prop="purchaseId" header-align="center" align="center" label="purchaseId"></el-table-column>
      <el-table-column prop="skuId" header-align="center" align="center" label="skuId"></el-table-column>
      <el-table-column prop="skuNum" header-align="center" align="center" label="skuNum"></el-table-column>
      <el-table-column prop="skuPrice" header-align="center" align="center" label="skuPrice"></el-table-column>
      <el-table-column prop="wareId" header-align="center" align="center" label="wareId"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===0">NEW</el-tag>
          <el-tag type="info" v-if="scope.row.status===1">ASSIGNED</el-tag>
          <el-tag type="wanring" v-if="scope.row.status===2">PURCHASING</el-tag>
          <el-tag type="success" v-if="scope.row.status===3">COMPLETED</el-tag>
          <el-tag type="danger" v-if="scope.row.status===4">FAILED</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">UPDATE</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">DELETE</el-button>
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
    <el-dialog title="MERGE" :visible.sync="mergedialogVisible">
      <el-select v-model="purchaseId" placeholder="Please choose" clearable filterable>
        <el-option
          v-for="item in purchasetableData"
          :key="item.id"
          :label="item.id"
          :value="item.id"
        >
          <span style="float: left">{{ item.id }}</span>
          <span
            style="float: right; color: #8492a6; font-size: 13px"
          >{{ item.assigneeName }}：{{item.phone}}</span>
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mergedialogVisible = false">CANCEL</el-button>
        <el-button type="primary" @click="mergeItem">YES</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from './purchasedetail-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        key: '',
        status: '',
        wareId: ''
      },
      wareList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      mergedialogVisible: false,
      purchaseId: '',
      purchasetableData: []
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getDataList()
    this.getWares()
  },
  methods: {
    mergeItem () {
      let items = this.dataListSelections.map(item => {
        return item.id
      })
      if (!this.purchaseId) {
        this.$confirm(
          'you dont have choose any purchase order, A new order will be automatically created for merging, are you sure?',
          'HINT',
          {
            confirmButtonText: 'YES',
            cancelButtonText: 'CANCEL',
            type: 'warning'
          }
        )
          .then(() => {
            this.$http({
              url: this.$http.adornUrl('/warehouse/purchase/merge'),
              method: 'post',
              data: this.$http.adornData({ items: items }, false)
            }).then(({ data }) => {
              this.getDataList()
            })
          })
          .catch(() => {})
      } else {
        this.$http({
          url: this.$http.adornUrl('/warehouse/purchase/merge'),
          method: 'post',
          data: this.$http.adornData(
            { purchaseId: this.purchaseId, items: items },
            false
          )
        }).then(({ data }) => {
          this.getDataList()
        })
      }
      this.mergedialogVisible = false
    },
    getUnreceivedPurchase () {
      this.$http({
        url: this.$http.adornUrl('/warehouse/purchase/unreceive/list'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        this.purchasetableData = data.page.list
      })
    },
    handleBatchCommand (cmd) {
      if (cmd === 'delete') {
        this.deleteHandle()
      }
      if (cmd === 'merge') {
        if (this.dataListSelections.length !== 0) {
          this.getUnreceivedPurchase()
          this.mergedialogVisible = true
        } else {
          this.$alert('Please select the requirements to be merged first', 'HINT', {
            confirmButtonText: 'YES',
            callback: action => {}
          })
        }
      }
    },
    getWares () {
      this.$http({
        url: this.$http.adornUrl('/warehouse/wareinfo/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: 1,
          limit: 500
        })
      }).then(({ data }) => {
        this.wareList = data.page.list
      })
    },
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/warehouse/purchasedetail/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          status: this.dataForm.status,
          wareId: this.dataForm.wareId
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
          return item.id
        })
      this.$confirm(
        `Are you sure to delete the selected ${ids.length} records?`,
        'HINT',
        {
          confirmButtonText: 'YES',
          cancelButtonText: 'CANCEL',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/warehouse/purchasedetail/delete'),
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
