<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="STATUS">
        <el-select style="width:120px;" v-model="dataForm.status" placeholder="Please choose status" clearable>
          <el-option label="NEW" :value="0"></el-option>
          <el-option label="ASSIGNED" :value="1"></el-option>
          <el-option label="RECEIVED" :value="2"></el-option>
          <el-option label="COMPLETED" :value="3"></el-option>
          <el-option label="ERROR" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="keyword: ">
        <el-input style="width:120px;" v-model="dataForm.key" placeholder="keyword" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">SEARCH</el-button>
        <el-button
          v-if="isAuth('ware:purchase:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >NEW</el-button>
        <el-button
          v-if="isAuth('ware:purchase:delete')"
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
      <el-table-column prop="id" header-align="center" align="center" label="id"></el-table-column>
      <el-table-column prop="assigneeId" header-align="center" align="center" label="assigneeId"></el-table-column>
      <el-table-column prop="assigneeName" header-align="center" align="center" label="assigneeName"></el-table-column>
      <el-table-column prop="phone" header-align="center" align="center" label="phone"></el-table-column>
      <el-table-column prop="priority" header-align="center" align="center" label="priority"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0">NEW</el-tag>
          <el-tag type="info" v-if="scope.row.status === 1">ASSIGNED</el-tag>
          <el-tag type="warning" v-if="scope.row.status === 2">RECEIVED</el-tag>
          <el-tag type="success" v-if="scope.row.status === 3">COMPLETED</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 4">ERROR</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="wareId" header-align="center" align="center" label="wareId"></el-table-column>
      <el-table-column prop="amount" header-align="center" align="center" label="amount"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="createTime"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="updateTime"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="action">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="scope.row.status===0||scope.row.status===1"
            @click="opendrawer(scope.row)"
          >ASSIGN</el-button>
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
    <el-dialog title="Assign purchasing personnel" :visible.sync="caigoudialogVisible" width="30%">
      <el-select v-model="userId" filterable placeholder="Please choose">
        <el-option
          v-for="item in userList"
          :key="item.userId"
          :label="item.username"
          :value="item.userId"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="caigoudialogVisible = false">CANCEL</el-button>
        <el-button type="primary" @click="assignUser">SAVE</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from './purchase-add-or-update'
export default {
  data () {
    return {
      currentRow: {},
      dataForm: {
        key: '',
        status: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      caigoudialogVisible: false,
      userId: '',
      userList: []
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getDataList()
  },
  created () {

  },
  methods: {
    opendrawer (row) {
      this.getUserList()
      this.currentRow = row
      this.caigoudialogVisible = true
    },
    assignUser () {
      let _this = this
      let user = {}
      this.userList.forEach(item => {
        if (item.userId === _this.userId) {
          user = item
        }
      })
      this.caigoudialogVisible = false
      this.$http({
        url: this.$http.adornUrl(
          `/warehouse/purchase/update`
        ),
        method: 'post',
        data: this.$http.adornData({
          id: this.currentRow.id || undefined,
          assigneeId: user.userId,
          assigneeName: user.username,
          phone: user.mobile,
          status: 1
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: 'success',
            type: 'success',
            duration: 1500
          })

          this.userId = ''
          this.getDataList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    getUserList () {
      this.$http({
        url: this.$http.adornUrl('/sys/user/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: 1,
          limit: 500
        })
      }).then(({ data }) => {
        this.userList = data.page.list
      })
    },
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/warehouse/purchase/list'),
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
          return item.id
        })
      this.$confirm(
        `are you sure to delete the selected data?`,
        'HINT',
        {
          confirmButtonText: 'YES',
          cancelButtonText: 'CANCEL',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/warehouse/purchase/delete'),
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
