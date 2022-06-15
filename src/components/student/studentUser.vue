<template>
  <div>
    <el-row>
      <el-col>
        <el-card>
          <el-select v-model="value"
                     placeholder="请选择老师"
                     style="width: 15%">
            <el-option v-for="item in teacherinfo"
                       :key="item.id"
                       :label="item.username"
                       :value="item.username"></el-option>
          </el-select>
          <el-button type="primary"
                     size="small"
                     style="margin-left:10px"
                     @click="select">确定</el-button>
        </el-card>
        <el-card>
          <h2>个人信息</h2>
          <el-table :data="studentinfo"
                    border
                    style="width: 100%">
            <el-table-column prop="id"
                             label="id">
            </el-table-column>
            <el-table-column prop="role"
                             label="角色">
            </el-table-column>
            <el-table-column prop="username"
                             label="用户名">
            </el-table-column>
            <el-table-column prop="teacher"
                             label="指导老师">
            </el-table-column>
            <el-table-column label="课题">
              <template slot-scope="scope">
                <el-popover placement="right"
                            width="400"
                            trigger="click">
                  <template>
                    <div v-for="(item,index) in topicName"
                         :key="index">
                      {{item}}
                    </div>
                  </template>
                  <el-button slot="reference"
                             @click="active(scope.row)">查看</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="papers"
                             label="论文">
              <template slot-scope="scope">
                <el-popover placement="right"
                            width="400"
                            trigger="click">
                  <template>
                    <div v-for="(item,index) in studentinfo[0].papers"
                         :key="index">
                      {{item}}
                    </div>
                  </template>
                  <el-button slot="reference"
                             @click="active(scope.row)">查看</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <el-divider></el-divider>
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
      tableData: [],
      token: '',
      id: 0,
      imageUrl: '',
      oldPwd: '',
      newPwd: '',
      newRePwd: '',
      studentinfo: [],
      teacherinfo: [],
      value: '',
      // topicName1: [111],
      topicName: []
    }
  },
  async created () {
    this.update()
  },
  methods: {
    async getUserById () {
      const { data: res } = await this.$http.get('admin/getUserById', { params: { id: this.id } })
      this.tableData = res
      console.log(res)
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    async EditPwdBtn () {
      await this.$http.post('users/upPwd', { token: this.token, oldpassword: this.oldPwd, newpassword: this.newPwd })
      this.$message.success('修改成功')
    },
    // 更新列表
    async update () {
      this.token = window.sessionStorage.getItem('token')
      // console.log(this.token)
      // this.getIdByToken()
      const { data: res1 } = await this.$http.post('auth/getuserid', { id: this.token, role: 'Student' })
      console.log(res1)
      this.studentinfo = res1.studentinfo
      const { data: res } = await this.$http.post('auth/alluser')
      console.log(res)
      res.info.forEach(e => {
        // if ('studentinfo' in e) this.studentinfo.push(e.studentinfo[0])
        if ('teacherinfo' in e) this.teacherinfo.push(e.teacherinfo[0])
        // if ('studentinfo' in e) this.studentinfo.push(e.studentinfo[0])
      })
      this.getTopicName()
    },
    getTopicName () {
      this.studentinfo[0].topics.forEach(async e => {
        const { data: res2 } = await this.$http.post('topic/gettopicinfo', { uuids: e })
        this.topicName.push(res2.topicinfo[0].topicname)
      })
    },
    async select () {
      const { data: res } = await this.$http.put('auth/selectteacher', { stuid: this.token, teaname: this.value })
      console.log(res)
      this.$message.success('选择成功')
      this.update()
    }
  },
  filters: {
    timeFilter (time) {
      time = dayjs(time).format('YYYY-MM-DD')
      return time
    },
    typeFilter (type) {
      if (type === 1) { return '管理员' }
      if (type === 2) { return '学生' }
      if (type === 3) { return '老师' }
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
