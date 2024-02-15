const { ipcRenderer } = require('electron');

window.onload = () => {
    document.getElementById('workInput').focus();
  };

document.getElementById('workInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      document.getElementById('saveButton').click(); // Trigger the click event of the save button
    }
  });

document.getElementById('saveButton').addEventListener('click', () => {
  const workLog = document.getElementById('workInput').value;
  if (workLog) {
    ipcRenderer.send('save-log', workLog);
    document.getElementById('workInput').value = ''; // Clear input after saving
  } else {
    alert('Please enter what you are working on.');
  }
});

ipcRenderer.on('prompt-for-log', () => {
  const userLog = prompt('What are you working on?');
  if (userLog) {
    ipcRenderer.send('save-log', userLog);
  }
});

document.getElementById('exitButton').addEventListener('click', () => {
    ipcRenderer.send('quit-app');
});
