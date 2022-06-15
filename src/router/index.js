import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/menu/LogReg'
import Admin from '../components/menu/Admin'
import adminStudent from '../components/admin/Student'
import adminTeacher from '../components/admin/Teacher'
import Teacher from '../components/menu/Teacher'
import User from '../components/teacher/User'
import showTopic from '../components/teacher/showTopic'
import paper from '../components/teacher/paper'
import Student from '../components/menu/Student'
import studentUser from '../components/student/studentUser'
import createTopic from '../components/student/createTopic'
import showPaper from '../components/student/showPaper'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/admin',
    component: Admin,
    children: [{
        path: 'student',
        component: adminStudent
      },
      {
        path: 'teacher',
        component: adminTeacher
      }
    ]
  },
  {
    path: '/teacher',
    component: Teacher,
    children: [{
        path: 'user',
        component: User
      },
      {
        path: 'showTopic',
        component: showTopic
      },
      {
        path: 'paper',
        component: paper
      }
    ]
  },
  {
    path: '/student',
    component: Student,
    children: [{
        path: 'user',
        component: studentUser
      },
      {
        path: 'createTopic',
        component: createTopic
      },
      {
        path: 'showPaper',
        component: showPaper
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
