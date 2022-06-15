<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <h1>查看论文</h1>
          <el-table :data="allStuPaper"
                    border>
            <el-table-column sortable
                             label="创建时间">
              <template slot-scope="scope">
                {{scope.row.date | timeFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="student"
                             label="学生名称">
            </el-table-column>
            <el-table-column prop="filename"
                             label="论文名称">
            </el-table-column>
            <el-table-column label="审核结果">
              <template slot-scope="scope">
                {{scope.row.status | stateFilter}}
              </template>
            </el-table-column>
            <el-table-column label="审批">
              <template slot-scope="scope">
                <el-button style="padding: 3px 0"
                           type="text"
                           @click="isOk(scope.row)">通过</el-button>
                <el-button style="padding: 3px 0"
                           type="text"
                           @click="isNoOk(scope.$index, scope.row)">不通过</el-button>
              </template>
            </el-table-column>
            <el-table-column label="下载">
              <template slot-scope="scope">
                <el-button style="padding: 3px 0"
                           type="text"
                           @click="downLoad(scope.row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页区域 -->
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="currPage"
                         :page-sizes="[3, 5, 10, 15]"
                         :page-size="pageNum"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data () {
    return {
      token: '',
      topic: '',
      value: '',
      leaveDate: '',
      leaveReason: '',
      tableData: [],
      pageNum: 5,
      currPage: 1,
      total: 0,
      username: '',
      allStuPaper: ''
    }
  },
  async created () {
    this.token = window.sessionStorage.getItem('token')
    this.allstupaper()
  },
  methods: {
    async allstupaper () {
      const { data: res } = await this.$http.post('paper/allstupaper', { id: this.token })
      this.allStuPaper = res
      console.log(this.allStuPaper)
      this.getTopicName()
    },
    async getTopicName () {
      this.allStuPaper.forEach(async ele => {
        const { data: res } = await this.$http.post('topic/gettopicinfo', { uuids: '51761875-3f5c-46b4-8b71-8ba3a836b21c' })
        console.log(res)
      })
    },
    async createBtn () {
      const { data: res } = await this.$http.post('topic/createtopic', { topicname: this.topic, username: this.username })
      console.log(res)
    },
    // 监听 pagesize 改变
    handleSizeChange (newSize) {
      this.pageNum = newSize
      this.getLeaveReason()
    },
    // 监听 pagenum 改变
    handleCurrentChange (newPage) {
      this.currPage = newPage
      this.getLeaveReason()
    },
    async isOk (row) {
      const { data: res } = await this.$http.put('paper/truepaper', { uuid: row.uuid })
      console.log(res)
      this.allstupaper()
    },
    async isNoOk (index, row) {
      const { data: res } = await this.$http.put('paper/falsepaper', { uuid: row.uuid })
      console.log(res)
      this.allstupaper()
    },
    async downLoad (row) {
      const uuid = {
        uuid: row.uuid
      }
      const filename = row.filename
      const { data: res } = await this.$http.post('paper/downloadfile', uuid, { responseType: 'blob' })
      const blob = new Blob([res], { type: 'application/msword' })
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    }
  },
  filters: {
    stateFilter (state) {
      if (state === true) { return '审批通过' }
      if (state === false) { return '审批暂未通过' }
    },
    timeFilter (time) {
      time = dayjs(time).format('YYYY-MM-DD')
      return time
    }
  }
}
</script>

<style>
</style>
