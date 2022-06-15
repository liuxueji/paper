<template>
  <div>
    <el-row>
      <el-col :span="16">
        <el-card>
          <div slot="header"
               class="clearfix">
            <span>创建课题</span>
          </div>
          <el-input style="width:200px"
                    placeholder="请输入需要创建的课题"
                    v-model="topic"></el-input>
          <div style="height:20px"></div>
          <el-date-picker v-model="leaveDate"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
          <div style="height:20px"></div>
          <el-input type="textarea"
                    placeholder="对课题的说明"
                    v-model="leaveReason"
                    maxlength="100"
                    show-word-limit>
          </el-input>
          <div style="height:20px"></div>
          <div style="float: right">
            <el-button type="primary"
                       @click="createBtn">创建</el-button>
            <div style="height:20px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="upload">
          <el-upload class="upload-demo"
                     drag
                     action="http://112.74.79.146:5000/paper/receivefile"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :on-success="handleSuccess"
                     :before-remove="beforeRemove"
                     :data="{id:token}"
                     multiple
                     :limit="3"
                     :on-exceed="handleExceed">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip"
                 slot="tip">只能上传docx文件，且不超过5M</div>
          </el-upload>
        </el-card>
      </el-col>
    </el-row>
    <el-divider><i class="el-icon-loading"></i></el-divider>
    <el-card>
      <h1>我的课题</h1>
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
        <el-table-column prop="uuid"
                         label="课程id">
        </el-table-column>
        <el-table-column label="审核结果">
          <template slot-scope="scope">
            {{scope.row.status | stateFilter}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="padding: 3px 0"
                       type="text"
                       @click="deleteBtnU(scope.$index, scope.row)">删除</el-button>
            <el-button style="padding: 3px 0"
                       type="text"
                       @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
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
    <el-dialog title="修改数据"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="editDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm"
               ref="editFormRef"
               label-width="100px">
        <el-form-item label="学生">
          <el-input v-model="editForm.student"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="课程id">
          <el-input v-model="editForm.uuid"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="课题名称">
          <el-input v-model="editForm.topicname"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editBtn">确 定</el-button>
      </span>
    </el-dialog>
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
      uploadData: { id: 0 },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      editForm: ''
    }
  },
  async created () {
    this.token = window.sessionStorage.getItem('token')
    const { data: res } = await this.$http.post('auth/getuserid', { id: this.token, role: 'Student' })
    this.username = res.studentinfo[0].username
    this.alltopic()
  },
  methods: {
    async alltopic () {
      const { data: res } = await this.$http.post('topic/stutopic', { id: this.token })
      this.allTopic = res
      console.log(this.allTopic)
    },
    async createBtn () {
      console.log(this.topic, this.username)
      const { data: res } = await this.$http.post('topic/createtopic', { topicname: this.topic, username: this.username })
      console.log(res)
      this.$message.success('课题创建成功')
      this.alltopic()
    },
    async getLeaveReason () {
      const { data: res } = await this.$http.get('admin/getuserLeave', { params: { token: this.token, currPage: this.currPage - 1, pageNum: this.pageNum } })
      this.tableData = res.data
      this.total = res.total
      console.log(res)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess (response, file, fileList) {
      console.log(response, file, fileList)
    },
    async downloadBtn (index, row) {
      const { data: res } = await this.$http.post('paper/downloadfile', { uuid: '4eb34169-d081-4de9-9172-c007dbc7e8de' })
      console.log(res)
    },
    async deleteBtnU () {
      const { data: res } = await this.$http.delete('topic/deletetopic', { data: { uuids: this.allTopic.uuid } })
      console.log(res)
      this.$message.success('删除成功')
      this.alltopic()
    },
    // 编辑按钮
    async showEditDialog (index, row) {
      // 根据id获取用户信息
      const { data: res } = await this.$http.post('topic/gettopicinfo', { uuids: row.uuid })
      console.log(res)
      this.editForm = res.topicinfo[0]
      this.editDialogVisible = true
    },
    // 点击按钮，修改参数信息
    async editBtn () {
      const { data: res } = await this.$http.put('topic/changetopicname', { uuids: this.editForm.uuid, topicname: this.editForm.topicname })
      console.log(res)
      this.$message.success('修改数据成功！')
      this.editDialogVisible = false
      this.alltopic()
    },
    // 重置修改的表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    }
  },
  filters: {
    stateFilter (state) {
      if (state === true) { return '审批通过' }
      if (state === false) { return '暂未通过审批' }
    },
    timeFilter (time) {
      time = dayjs(time).format('YYYY-MM-DD')
      return time
    }
  }
}
</script>

<style>
  .upload {
    margin-left: 30px;
    padding-left: 50px;
    padding-top: 30px;
    height: 300px;
  }
</style>
