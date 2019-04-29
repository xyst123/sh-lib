<template>
  <label>
    <slot/>
    <input type="file" :name="name" :accept="accept" @change="submit" @click="active">
  </label>
</template>

<script>
let xhr;
export default {
  props: {
    url: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: "video"
    },
    method: {
      type: String,
      default: "POST"
    },
    accept: {
      type: String,
      default: "*/*"
    },
    size: {
      type: Number,
      default: 500 * 1024 * 1024
    },
    types: {
      type: Array,
      default: []
    },
    timeout: {
      type: Number,
      default: 20000
    }
  },
  data() {
    return {};
  },
  methods: {
    active() {
      this.$emit("active");
    },
    abort() {
      if (xhr && xhr.readyState > 0) {
        xhr.abort();
      }
    },
    submit(e) {
      const file = e.target.files[0];

      // 检查文件大小
      if (file.size > this.size) {
        this.$emit("uploadFail", {
          type: "size",
          error: file
        });
        return;
      }

      // 检查文件类型
      if (this.types.length > 0) {
        const reg = new RegExp(`\\.(${this.types.join("|")})$`, "i");
        if (!reg.test(file.name)) {
          this.$emit("uploadFail", {
            type: "type",
            error: file
          });
          return;
        }
      }

      xhr = window.ActiveXObject
        ? new ActiveXObject("Microsoft.XMLHTTP")
        : new XMLHttpRequest();
      console.log("xhr", xhr);
      // xhr.timeout = this.timeout;
      xhr.open(this.method.toUpperCase(), this.url, true);

      // 上传错误
      xhr.onerror = error => {
        this.$emit("uploadFail", {
          type: "beforeSend",
          error
        });
      };

      // 上传进度
      const updateProgress = e => {
        if (e.lengthComputable) {
          this.$emit("uploading", e);
        }
      };
      // xhr.onprogress = updateProgress;
      xhr.upload.onprogress = updateProgress;

      // 上传成功
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            this.$emit("uploadSuccess", { file, xhr });
          } else {
            this.$emit("uploadFail", {
              type: "afterSend",
              error: xhr
            });
          }
        }
      };

      const data = new FormData();
      data.append(this.name, file);

      // 开始上传
      this.$emit("uploadStart", file);
      xhr.send(data);
    }
  }
};
</script>

<style scoped lang="scss">
label {
  position: relative;
  input {
    background: rgba(255, 255, 255, 0);
    overflow: hidden;
    position: fixed;
    width: 1px;
    height: 1px;
    z-index: -1;
    opacity: 0;
  }
}
</style>

