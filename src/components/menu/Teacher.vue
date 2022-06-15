<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>论文管理系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside>
        <!-- 侧边栏菜单区域 -->
        <el-menu @open="handleOpen"
                 default-active="0">
          <!-- 一级菜单 -->
          <el-submenu v-for="(item,index) in menulist"
                      :index="item.path"
                      :key="index">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.icon"></i>
              <!-- 文本 -->
              <span>{{item.title}}</span>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [
        {
          path: '/teacher/user',
          title: '个人信息',
          icon: ''
        },
        {
          path: '/teacher/showTopic',
          title: '查看课题',
          icon: ''
        },
        {
          path: '/teacher/paper',
          title: '论文审批',
          icon: ''
        },
        {
          path: '/teacher/user',
          title: '发布通知',
          icon: ''
        }
      ],
      active: true
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    handleOpen (key, keyPath) {
      this.$router.push(key)
    }
  }
}
</script>

<style lang="scss" scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #276fba;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #eee;
    .el-menu {
      margin-top: 20px;
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .active-color {
    color: #409eff;
  }
</style>
