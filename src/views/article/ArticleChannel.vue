<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { artGetChannelsService, artDelChannelService } from '../../api/article'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessageBox } from 'element-plus'

const channelList = ref([])

const dialog = ref()
const loading = ref(false)

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  // channelList.value = []
  loading.value = false
  console.log(channelList.value)
}
getChannelList()

const onDeleteChannel = async (row) => {
  await ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
const onEditChannel = (row) => {
  dialog.value.open(row)
}

const onAddChannel = () => {
  dialog.value.open({})
}

const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        prop=""
        width="180"
      ></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            @click="onEditChannel(row, $index)"
            circle
            type="primary"
            plain
          ></el-button>
          <el-button
            :icon="Delete"
            @click="onDeleteChannel(row, $index)"
            circle
            type="danger"
            plain
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="description" />
      </template>
    </el-table>
    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
