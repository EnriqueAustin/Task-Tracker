<template>
  <div id="app">
    <h1>Work Tracker</h1>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div class="input-group">
      <input
        type="text"
        v-model="workInput"
        @keyup.enter="saveLog"
        placeholder="What are you working on?"
        ref="inputField"
      />
      <button @click="saveLog">Save Log</button>
      <button @click="exitApp">Exit</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      workInput: '',
      errorMessage: '', // Added for displaying error messages
    };
  },
  mounted() {
    this.$refs.inputField.focus();
  },
  methods: {
    saveLog() {
      if (this.workInput.trim()) {
        window.electronAPI.saveLog(this.workInput);
        this.workInput = ''; // Clear input after saving
        this.errorMessage = ''; // Clear any previous error message
      } else {
        this.errorMessage = 'Please enter what you are working on.';
        this.$nextTick(() => {
          this.$refs.inputField.focus(); // Refocus on the input field
        });
      }
    },
    exitApp() {
      window.electronAPI.quitApp();
    },
  },
};
</script>

<style scoped>
#app {
  max-width: 600px;
  margin: 20px auto;
  text-align: center;
}

.error-message {
  color: #f44336;
  margin-bottom: 15px;
}

.input-group {
  margin-top: 10px;
}

input {
  width: 70%;
  padding: 10px;
  margin: 10px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:active {
  background-color: #3e8e41;
}

button:nth-child(3) {
  background-color: #f44336;
}

button:nth-child(3):hover {
  background-color: #da3b2b;
}

button:nth-child(3):active {
  background-color: #c73224;
}
</style>