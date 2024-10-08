<template>
  <div class="voting-list">
    <ul>
      <li v-for="voting in activeVotings" :key="voting.id" :class="getStatusClass(voting) + (selectedVotingId == voting.id ? ' selected' : '')">
        <div @click="selectVoting(voting.id)" class="voting-item">
          <span class="status-icon" :class="getStatusIconClass(voting)"></span>
          {{ voting.name }}
        </div>
        <button
          @click="deleteVoting(voting.id)"
          class="delete-button"
          :disabled="voting.finishAt > currentTimestamp"
          :title="voting.finishAt > currentTimestamp ? 'Voting has not ended yet' : ''"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
  <PreloaderComponent v-if="loading" />
  <NotificationMessage
    v-if="notification.show"
    :message="notification.message"
    :type="notification.type"
    :duration="3000"
  />
</template>

<script>
import PreloaderComponent from "./PreloaderComponent.vue";
import NotificationMessage from "./NotificationMessage.vue";

export default {
  name: "VotingList",
  components: {
    PreloaderComponent,
    NotificationMessage,
  },
  props: {
    votings: {
      type: Array,
      required: true,
    },
    contract: {
      type: Object,
      required: true,
    },
    web3: {
      type: Object,
      required: true,
    },
    accounts: {
      type: Array,
      required: true,
    },
    selectedVotingId: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      notification: {
        show: false,
        message: "",
        type: "success",
      },
    };
  },
  computed: {
    activeVotings() {
      return this.votings.filter(voting => !voting.isDeleted);
    },
    currentTimestamp() {
      return Date.now();
    },
  },
  methods: {
    selectVoting(votingId) {
      this.$emit("select-voting", votingId);
    },
    async deleteVoting(votingId) {
      this.loading = true;
      try {
        await this.$emit("delete-voting", votingId);

        // Показываем сообщение об успешном удалении
        this.notification.show = true;
        this.notification.message = "Voting deleted successfully!";
        this.notification.type = "success";
      } catch (error) {
        console.error("Error deleting voting:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);

        // Показываем сообщение о неуспешном удалении
        this.notification.show = true;
        this.notification.message = "Voting deletion failed!";
        this.notification.type = "error";
      } finally {
        this.loading = false;
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    getStatusClass(voting) {
      return voting.finishAt > this.currentTimestamp ? 'active' : 'inactive';
    },
    getStatusIconClass(voting) {
      return voting.finishAt > this.currentTimestamp ? 'active-icon' : 'inactive-icon';
    },
  },
};
</script>

<style scoped>
.voting-list {
  width: 50%;
  background-color: #f0f0f0;
  padding: 20px;
  box-sizing: border-box;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.voting-item {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.status-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
}

.active-icon {
  background-color: green;
}

.inactive-icon {
  background-color: red;
}

.delete-button {
  padding: 5px 10px;
  cursor: pointer;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 10px;
}

.delete-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.delete-button:hover:not(:disabled) {
  background-color: #e60000;
}

.active {
  background-color: #e0ffe0; /* Светло-зеленый фон для активных голосований */
}

.inactive {
  background-color: #f0f0f0; /* Светло-серый фон для неактивных голосований */
}

.selected {
  border: 2px solid #42b983; /* Контур для выбранного голосования */
}
</style>