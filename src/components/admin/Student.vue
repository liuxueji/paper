<template>
  <div>
    <el-col>
      <el-card>
        <el-select v-model="value"
                   placeholder="请选择查询字段"
                   style="width: 15%">
          <el-option label="工号"
                     value="id"></el-option>
          <el-option label="姓名"
                     value="username"></el-option>
          <el-option label="籍贯"
                     value="address"></el-option>
        </el-select>
        <el-input placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="input"
                  style="width:20%">
        </el-input>
        <el-select v-model="selectType"
                   placeholder="请选择查询身份"
                   style="width: 8%">
          <el-option label="管理员"
                     value="1"></el-option>
          <el-option label="教师"
                     value="2"></el-option>
          <el-option label="学生"
                     value="3"></el-option>
        </el-select>
        <el-button type="primary"
                   size="small"
                   style="margin-left:10px"
                   @click="select">搜索</el-button>
        <el-button type="primary"
                   size="small"
                   style="margin-left:10px"
                   @click="clearvalue">重置</el-button>
        <el-button type="primary"
                   size="small"
                   style="margin-left:600px"
                   @click="createRole">创建角色</el-button>
      </el-card>
      <el-card>
        <el-table :data="studentinfo"
                  border>
          <el-table-column prop="id"
                           sortable
                           label="id">
          </el-table-column>
          <el-table-column prop="role"
                           label="角色">
          </el-table-column>
          <el-table-column prop="username"
                           label="用户名">
          </el-table-column>
          <el-table-column prop="password"
                           label="密码">
          </el-table-column>
          <el-table-column label="类型">
            学生
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button style="padding: 3px 0"
                         type="text"
                         @click="deleteBtnS(scope.$index, scope.row)">删除</el-button>
              <el-button style="padding: 3px 0"
                         type="text"
                         @click="showEditDialogS(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <!-- 修改数据的对话框-学生 -->
    <el-dialog title="修改数据"
               :visible.sync="editDialogVisibleS"
               width="50%"
               @close="editDialogClosedS">
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm"
               ref="editFormRef"
               label-width="100px">
        <el-form-item label="id">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="editForm.role"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="课题">
          <el-input v-model="editForm.topics"></el-input>
        </el-form-item>
        <el-form-item label="论文">
          <el-input v-model="editForm.papers"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisibleS = false">取 消</el-button>
        <el-button type="primary"
                   @click="editBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改数据的对话框-教师 -->
    <el-dialog title="修改数据"
               :visible.sync="editDialogVisibleT"
               width="50%"
               @close="editDialogClosedT">
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm"
               ref="editFormRef"
               label-width="100px">
        <el-form-item label="id">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="editForm.role"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="学生">
          <el-input v-model="editForm.students"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisibleT = false">取 消</el-button>
        <el-button type="primary"
                   @click="editBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改数据的对话框-管理员 -->
    <el-dialog title="修改数据"
               :visible.sync="editDialogVisibleU"
               width="50%"
               @close="editDialogClosedU">
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm"
               ref="editFormRef"
               label-width="100px">
        <el-form-item label="id">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="editForm.role"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisibleU = false">取 消</el-button>
        <el-button type="primary"
                   @click="editBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建角色对话框 -->
    <el-dialog title="创建角色"
               :visible.sync="createDialogVisible"
               width="50%"
               @close="createDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="roleInfo"
               label-width="100px">
        <el-form-item label="角色">
          <el-input v-model="roleInfo.role"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="roleInfo.permissions"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="createBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '姓名',
      tableData: [],
      input: '',
      type: 3,
      selectType: 3,
      editForm: [],
      // 控制修改对话框的显示与隐藏
      editDialogVisibleS: false,
      editDialogVisibleT: false,
      editDialogVisibleU: false,
      createDialogVisible: false,
      info: '',
      userinfo: '',
      teacherinfo: [],
      studentinfo: [],
      roleInfo: {
        role: 'Test',
        permissions: 0
      }
    }
  },
  async created () {
    this.update()
  },
  methods: {
    // 删除按钮-S
    async deleteBtnS (index, row) {
      this.$confirm('此操作将继续, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // this.deleteById(index, row)
        const { data: res } = await this.$http.delete('auth/deleteuser', { data: { id: row.id, role: row.role } })
        console.log(res)
        this.$message.success('删除成功！')
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    },
    // 编辑按钮-学生
    async showEditDialogS (index, row) {
      // 根据id获取用户信息
      const { data: res } = await this.$http.post('auth/getuserid', { id: row.id, role: row.role })
      console.log(res)
      this.editForm = res.studentinfo[0]
      this.editDialogVisibleS = true
    },
    // 重置修改的表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改参数信息
    async editBtn () {
      const { data: res } = await this.$http.put('auth/updateuserinfo', { id: this.editForm.id, role: this.editForm.role, username: this.editForm.username })
      const { data: res1 } = await this.$http.put('auth/updateuserrole', { id: this.editForm.id, role: 'Student', updaterole: this.editForm.role })
      console.log(res)
      console.log(res1)
      this.update()
      this.$message.success('修改数据成功！')
      this.editDialogVisibleS = false
      this.editDialogVisibleT = false
    },
    // 创建角色
    async createRole () {
      this.createDialogVisible = true
      console.log(111)
    },
    // 创建角色模态框确认按钮
    async createBtn () {
      const { data: res } = await this.$http.post('auth/createrole', this.roleInfo)
      console.log(res)
    },
    // 更新列表
    async update () {
      const { data: res } = await this.$http.post('auth/alluser')
      console.log(res)
      res.info.forEach(e => {
        if ('studentinfo' in e) { this.studentinfo.push(e.studentinfo[0]) }
        if ('teacherinfo' in e) { this.teacherinfo.push(e.teacherinfo[0]) }
      })
    }
  }
}
</script>

<style>
</style>
