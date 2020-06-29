<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 系统首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <h1>系统首页</h1>
    </div>
  </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
      return {
        name: localStorage.getItem('ms_username')
      }
    },
    computed: {
      role() {
        return this.name === 'admin' ? '超级管理员' : '普通用户';
      }
    },
    methods: {
    }
}
</script>


<style scoped>
</style>