<script setup>
import { ref } from 'vue'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

const open = (row) => {
  visibleDrawer.value = true // 显示抽屉
  console.log(row)
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer v-model="visibleDrawer" title="大标题" size="50%" direction="rtl">
    <span>Hi</span>
  </el-drawer>
</template>
