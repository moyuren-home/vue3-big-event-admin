<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article.js'
import { baseURL } from '@/utils/request'
import axios from 'axios'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

// 默认空白数据
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}

// 准备数据
const formModel = ref({
  ...defaultForm
})

// 图片上传逻辑
const imageUrl = ref('')
const onselectFile = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  // 立刻将图片对象，存入 formModel.value.cover_img 将来用于提交
  formModel.value.cover_img = uploadFile.raw
}

// 将网络图片地址转换为 File 对象的函数
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    console.error('Error converting image URL to File object:', error)
    return null
  }
}

const editorRef = ref()
const open = async (row) => {
  visibleDrawer.value = true // 显示抽屉

  if (row.id) {
    // 需要基于 row.id 发送请求，获取编辑对应的详情数据，进行回显
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    // 图片需要单独处理回显
    imageUrl.value = baseURL + formModel.value.cover_img
    // 注意：提交给后台，需要的数据格式，是file对象格式
    // 需要将网络图片地址 => 转换成 file对象，存储起来, 将来便于提交
    const file = await imageUrlToFileObject(
      imageUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    formModel.value = { ...defaultForm }
    imageUrl.value = ''
    editorRef.value.setHTML('')
  }
}

const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将已发布还是草稿状态，存入 state
  formModel.value.state = state

  // 转换 formData 数据
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  if (formModel.value.id) {
    // 编辑操作
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加请求
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    emit('success', 'add')
  }
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onselectFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            contentType="html"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
