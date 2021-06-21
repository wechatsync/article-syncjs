<template>
  <div class="appsync-wrapper">
    <!-- <el-button type="text" @click="dialogVisible = true">Sync</el-button> -->
    <el-dialog
      title="同步文章"
      class="dialogClass"
      :visible.sync="dialogVisible"
      width="500"
    >
      <el-container class="syncpost-block">
        <el-aside
          width="150px"
          style="display: flex; justify-content: center; align-items: center"
        >
          <img
            class="align-self-center mr-3"
            :src="currentArtitle.thumb"
            width="150"
            referrerPolicy="no-referrer"
            alt="Generic placeholder image"
          />
        </el-aside>
        <el-main>
          <h5
            style="
              font-weight: bold;
              font-weight: bold;
              font-size: 16px;
              margin: 0;
            "
          >
            {{ currentArtitle.title }}
          </h5>
          <p>
            {{ currentArtitle.desc }}
          </p>
        </el-main>
      </el-container>

      <div
        class=""
        v-if="!extensionInstalled"
        style="padding-top: 30px; padding-bottom: 30px; padding-left: 10px"
      >
        <div v-if="checkCount > 2">
          未检测到插件<br />
          请安装文章同步助手Chrome插件 <br />
          <a
            href="https://www.wechatsync.com/?utm_source=syncicon#install"
            target="_blank"
            >点击安装</a
          >
        </div>
      </div>

      <div v-if="extensionInstalled">
        <h6>账号</h6>
        <div class="all-pubaccounts" v-if="!submitting">
          <div class="account-item" v-for="account in allAccounts">
            <el-checkbox v-model="account.checked">
              <img
                :src="account.icon ? account.icon : ''"
                class="icon"
                height="20"
                style="vertical-align: -6px; height: 20px !important"
              />
              {{ account.title }}
            </el-checkbox>
          </div>
        </div>
        <div class="all-pubaccounts" v-if="submitting && taskStatus">
          <p v-if="!taskStatus.accounts">等待发布..</p>
          <div
            class="account-item taskStatus"
            v-for="account in taskStatus.accounts"
          >
            <img
              :src="account.icon ? account.icon : ''"
              class="icon"
              height="20"
              style="vertical-align: -6px; height: 20px !important"
            />
            <span class="name-block">{{ account.title }}</span>
            <span
              style="margin-left: 15px"
              :class="account.status + ' message'"
            >
              <template v-if="account.status == 'uploading'">
                <div class="lds-dual-ring"></div>
                {{ account.msg || '发布中' }}
              </template>

              <template v-if="account.status == 'failed'">
                同步失败, 错误内容：{{ account.error }}
              </template>

              <template v-if="account.status == 'done' && account.editResp">
                同步成功
                <a
                  :href="account.editResp.draftLink"
                  v-if="account.type != 'wordpress' && account.editResp"
                  style="margin-left: 5px"
                  referrerPolicy="no-referrer"
                  target="_blank"
                  >查看草稿</a
                >
              </template>
            </span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          v-if="!submitting"
          type="primary"
          @click="doSubmit"
          >同步</el-button
        >
        <el-button
          size="small"
          v-if="submitting"
          type="primary"
          @click="
            submitting = false
            dialogVisible = false
          "
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
export default {
  name: '',
  components: { ScaleLoader },
  data() {
    return {
      visible: false,
      submitting: false,
      list: [],
      value: '',
      dialogVisible: false,
      extensionInstalled: false,
      checkCount: 0,
      allAccounts: [],
      currentArtitle: {
        content: '',
      },
      taskStatus: {},
      markdownOption: {},
    }
  },
  mounted() {
    var self = this
    ;(function check() {
      self.extensionInstalled = typeof window.$syncer != 'undefined'
      self.checkCount++
      if (self.extensionInstalled) {
        self.loadAccounts()
        return
      }
      setTimeout(check, 800)
    })()

    function checkPost(post) {
      if (!post.title) throw new Error('title不能为空')
      if (!post.content) throw new Error('content不能为空')
    }

    window.setupPost = function (post) {
      checkPost(post)
      self.currentArtitle = post
    }
    window.syncPost = function (post) {
      checkPost(post)
      self.currentArtitle = post
      self.dialogVisible = true
    }
  },
  methods: {
    loadAccounts() {
      var allAccounts = []
      var accounts = []
      var self = this
      function getAccounts() {
        window.$syncer.getAccounts(function (resp) {
          console.log('allAccounts', resp)
          self.allAccounts = resp
        })
      }
      getAccounts()
    },
    async doSubmit() {
      var self = this

      function getPost() {
        var post = {}
        var article = self.currentArtitle
        post.title = article.title
        if (article.content) {
          post.content = article.content
        } else if (article.markdown) {
          post.markdown = article.content
        }
        if (article.thumb) {
          post.thumb = article.thumb
        }

        post.desc = article.desc
          ? article.desc
          : article.content.substring(0, 20)
        // post.desc = document.body.getAttribute('data-msg_desc');
        console.log(post)
        return post
      }

      var selectedAc = this.allAccounts.filter((a) => {
        return a.checked
      })
      // console.log(selectedAc, this.$refs.editor.d_render);
      // return;
      this.$message('准备同步')
      window.$syncer.addTask(
        {
          post: getPost(),
          accounts: selectedAc,
        },
        function (status) {
          self.taskStatus = status
          console.log('status', status)
        },
        function () {
          console.log('send')
        }
      )

      //   chrome.extension.sendMessage(
      //     {
      //       action: 'addTask',
      //       task: {
      //         post: getPost(),
      //         accounts: selectedAc,
      //       },
      //     },
      //     function (resp) {}
      //   )

      this.submitting = true
      this.taskStatus = {}
    },

    async imgAdd(pos, $file) {
      var sortOrderTypes = [
        'toutiao',
        'jianshu',
        'zhihu',
        'weibo',
        'douban',
        'segmentfault',
        'weixin',
      ]
        .map((_) => this.allAccounts.filter((a) => a.type === _)[0])
        .filter((_) => _)

      if (sortOrderTypes.length === 0) {
        this.$message('当前未登陆任何自媒体平台，无法自动上传图片')
        return
      }

      var base64Url = await toBase64($file)
      var accountCurrent = sortOrderTypes[0]
      var actionData = {
        src: base64Url,
        account: accountCurrent,
      }
      console.log('actionData', actionData)
      window.$syncer.uploadImage(actionData, (res) => {
        console.log('res', res)
        if (accountCurrent.type === 'zhihu') {
          res.result.url = [res.result.url, '_r.jpg'].join('')
        }
        this.$refs.editor.$img2Url(pos, res.result.url)
      })
      console.log('imgAdd', pos, $file, sortOrderTypes, this.allAccounts)
    },
  },
}
</script>
<style>
.all-pubaccounts {
}

.account-item img {
  margin-right: 5px;
}

.account-item {
  line-height: 30px;
  padding: 0 0px;
  font-size: 14px;
  margin-bottom: 5px;
}

.syncpost-block {
  border-bottom: 1px solid rgb(233, 236, 239);
}

.dialogClass .el-dialog__header {
  border-bottom: 1px solid rgb(233, 236, 239);
  padding-bottom: 20px;
}

.dialogClass .el-dialog__footer {
  border-top: 1px solid rgb(233, 236, 239);
}

.dialogClass .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
