<template>
  <div>
    <el-row>
      <el-col>
        <el-card>
          <h2>个人信息</h2>
          <el-table :data="teacherinfo"
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
            <el-table-column prop="students"
                             label="指导的学生">
            </el-table-column>
          </el-table>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="12">
              <el-card style="width: 80%;position: relative;left: 50%;transform: translateX(-50%)">
                <div slot="header"
                     class="clearfix"
                     style="text-align:center">
                  <span>修改头像</span>
                </div>
                <el-upload class="avatar-uploader"
                           action="https://jsonplaceholder.typicode.com/posts/"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl"
                       :src="imageUrl"
                       class="avatar">
                  <i v-else
                     class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card style="width: 80%;position: relative;left: 50%;transform: translateX(-50%);">
                <div slot="header"
                     class="clearfix"
                     style="text-align:center">
                  <span>解除与学生关系</span>
                </div>
                <el-form style="text-align:center;">
                  <el-form-item>
                    <el-input prefix-icon="el-icon-user"
                              placeholder="请输入学生"
                              v-model="studentUsername"
                              style="margin-top:10px;"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary"
                               style="margin-top:10px"
                               @click="removeBtn">确定解除</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
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
      studentUsername: '',
      newRePwd: '',
      teacherinfo: [],
      studentId: 0
    }
  },
  async created () {
    // console.log(this.studentinfo)
    this.update()
  },
  methods: {
    async getIdByToken () {
      const { data: res } = await this.$http.get('users/getUserDataByToken', { params: { token: this.token } })
      this.id = res.id
      this.getUserById()
    },
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
    async removeBtn () {
      const { data: res } = await this.$http.post('auth/getuser', { username: this.studentUsername, role: 'Student' })
      this.studentId = res.studentinfo[0].id
      console.log(this.studentId)
      await this.$http.put('auth/relievestu', { stuid: this.studentId })
      this.$message.success('解绑成功')
      this.update()
    },
    // 更新列表
    async update () {
      this.token = window.sessionStorage.getItem('token')
      console.log(this.token)
      // this.getIdByToken()
      const { data: res1 } = await this.$http.post('auth/getuserid', { id: this.token, role: 'Teacher' })
      this.teacherinfo = res1.teacherinfo
      console.log(this.teacherinfo)
    },
    async select () {
      const { data: res } = await this.$http.put('auth/selectteacher', { stuid: this.token, teaname: this.value })
      console.log(res)
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
