<template>
  <div class="notification" :class="type" v-if="show">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "NotificationMessage",
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "success",
    },
    duration: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.show = false;
    }, this.duration);
  },
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: opacity 0.5s ease-in-out;
}

.success {
  background-color: #4caf50;
}

.error {
  background-color: #f44336;
}

.notification.fade-out {
  opacity: 0;
}
</style>
