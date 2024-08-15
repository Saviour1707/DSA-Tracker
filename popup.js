document.addEventListener('DOMContentLoaded', function() {
  const topicContainer = document.querySelector('.topic-container');
  const totalCounter = document.createElement('p');
  totalCounter.id = 'total-counter';
  totalCounter.style.textAlign = 'center';
  totalCounter.style.marginTop = '20px';
  totalCounter.style.fontSize = '18px';
  topicContainer.after(totalCounter);

  const topics = JSON.parse(localStorage.getItem('topics')) || [
    { id: 'arrays', name: 'Arrays', key: 'arrays' },
    { id: 'linked-lists', name: 'Linked Lists', key: 'linkedLists' },
    { id: 'trees', name: 'Trees', key: 'trees' },
    { id: 'graphs', name: 'Graphs', key: 'graphs' },
    { id: 'dp', name: 'Dynamic Programming', key: 'dp' }
  ];

  function saveTopics() {
    localStorage.setItem('topics', JSON.stringify(topics));
  }

  topics.forEach(topic => {
    if (!localStorage.getItem(topic.key)) localStorage.setItem(topic.key, 0);
  });

  function updateAndReorderButtons() {
    let total = 0;

    topics.sort((a, b) => parseInt(localStorage.getItem(b.key)) - parseInt(localStorage.getItem(a.key)));

    topicContainer.innerHTML = '';

    topics.forEach(topic => {
      const count = parseInt(localStorage.getItem(topic.key));
      total += count;

      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Reduce';
      removeButton.classList.add('remove-button');
      if (count === 0) {
        removeButton.classList.add('disabled'); 
      }
      removeButton.addEventListener('click', function() {
        if (count > 0) {
          localStorage.setItem(topic.key, count - 1);
          updateAndReorderButtons();
        }
      });

      const incrementButton = document.createElement('button');
      incrementButton.textContent = `${topic.name} (${count})`; 
      incrementButton.classList.add('increment-button');
      incrementButton.addEventListener('click', function() {
        localStorage.setItem(topic.key, count + 1);
        updateAndReorderButtons();
      });

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit-button');
      editButton.addEventListener('click', function() {
        const newTopicName = prompt('Enter new name for the topic:', topic.name);
        if (newTopicName) {
          topic.name = newTopicName;
          saveTopics();
          updateAndReorderButtons();
        }
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-button');
      deleteButton.addEventListener('click', function() {
        if (confirm(`Are you sure you want to delete the topic '${topic.name}'?`)) {
          topics.splice(topics.indexOf(topic), 1);
          localStorage.removeItem(topic.key);
          saveTopics();
          updateAndReorderButtons();
        }
      });

      buttonContainer.appendChild(removeButton);
      buttonContainer.appendChild(incrementButton);
      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(deleteButton);

      topicContainer.appendChild(buttonContainer);
    });

    totalCounter.textContent = `Total Problems Solved: ${total}`;
  }

  const addTopicButton = document.getElementById('add-topic-button');
  addTopicButton.addEventListener('click', function() {
    const newTopicInput = document.getElementById('new-topic-input');
    const newTopicName = newTopicInput.value.trim();

    // Check if the topic name already exists
    const isDuplicate = topics.some(topic => topic.name.toLowerCase() === newTopicName.toLowerCase());

    if (newTopicName) {
      if (isDuplicate) {
        alert('Topic with the same name already exists. Please enter a different name.');
      } else {
        const newTopicKey = newTopicName.toLowerCase().replace(/\s+/g, '-');
        const newTopic = { id: newTopicKey, name: newTopicName, key: newTopicKey };

        // Add new topic to the topics array
        topics.push(newTopic);

        // Initialize the counter for the new topic in localStorage
        localStorage.setItem(newTopic.key, 0);

        // Save the updated topics list
        saveTopics();

        // Update the UI
        updateAndReorderButtons();

        // Clear the input field
        newTopicInput.value = '';
      }
    }
  });

  updateAndReorderButtons();
});
