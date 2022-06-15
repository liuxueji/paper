<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-select v-model="value"
                     placeholder="请选择学生"
                     style="width: 15%">
            <el-option v-for="item in teacherinfo"
                       :key="item.id"
                       :label="item"
                       :value="item"></el-option>
          </el-select>
          <el-button type="primary"
                     size="small"
                     style="margin-left:10px"
                     @click="select">确定</el-button>
        </el-card>
        <el-card>
          <h1>查看课题</h1>
          <el-table :data="allTopic"
                    border>
            <el-table-column sortable
                             label="申请时间">
              <template slot-scope="scope">
                {{scope.row.createtime | timeFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="topicname"
                             label="课题名称">
            </el-table-column>
            <el-table-column prop="student"
                             label="学生">
            </el-table-column>
            <el-table-column prop="uuid"
                             label="课程id">
            </el-table-column>
            <el-table-column label="审核结果">
              <template slot-scope="scope">
                {{scope.row.status | stateFilter}}
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button style="padding: 3px 0"
                           type="text"
                           @click="isOk(scope.row)">通过</el-button>
                <el-button style="padding: 3px 0"
                           type="text"
                           @click="isNoOk(scope.$index, scope.row)">不通过</el-button>
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
      allTopic: '',
      teacherinfo: '',
      id: ''
    }
  },
  async created () {
    this.token = window.sessionStorage.getItem('token')
    this.alltopic()
    this.update()
  },
  methods: {
    async alltopic () {
      const { data: res } = await this.$http.post('topic/alltopic', { id: this.token })
      this.allTopic = res
      console.log(this.allTopic)
    },
    async createBtn () {
      const { data: res } = await this.$http.post('topic/createtopic', { topicname: this.topic, username: this.username })
      console.log(res)
    },
    async isOk (row) {
      const { data: res } = await this.$http.put('topic/truestatus', { uuids: row.uuid })
      console.log(res)
      this.select()
    },
    async isNoOk (index, row) {
      const { data: res } = await this.$http.put('topic/falsestatus', { uuids: row.uuid })
      console.log(res)
      this.select()
    },
    // 更新列表
    async update () {
      this.token = window.sessionStorage.getItem('token')
      console.log(this.token)
      // this.getIdByToken()
      const { data: res1 } = await this.$http.post('auth/getuserid', { id: this.token, role: 'Teacher' })
      this.teacherinfo = res1.teacherinfo[0].students
      console.log(this.teacherinfo)
    },
    async select () {
      const { data: res } = await this.$http.post('auth/getuser', { username: this.value, role: 'Student' })
      this.id = res.studentinfo[0].id
      console.log(this.id)
      const { data: res1 } = await this.$http.post('topic/stutopic', { id: this.id })
      this.allTopic = res1
      console.log(this.allTopic)
    }
  },
  filters: {
    stateFilter (state) {
      if (state === true) { return '审批通过' }
      if (state === false) { return '审批不通过' }
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
