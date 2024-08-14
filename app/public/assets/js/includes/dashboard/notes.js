function displayNotes() {
    fetch('/admin/_api/v1/notes')
    .then(response => response.json())
    .then(data => {
        const notesDisplay = document.getElementById('noteDisplay');

        if (!Array.isArray(data) || data.length === 0) {
            return;
        }

        notesDisplay.innerHTML = data;
    })
    .catch(error => {
        const notesDisplay = document.getElementById('noteDisplay');
    });
}

window.onload = displayNotes;


function notes() {
    var firewall = document.getElementById('firewall');
    var firewalllink = document.getElementById('firewall-link');
    var summary = document.getElementById('summary');
    var summarylink = document.getElementById('summary-link');
    var notes = document.getElementById('notes');
    var noteslink = document.getElementById('notes-link');

    if (notes.style.display === "none") {
        firewall.style.display = "none";
        summary.style.display = "none";
        notes.style.display = "flex";

        firewalllink.classList.remove('active');
        summarylink.classList.remove('active');
        noteslink.classList.add('active');
    }
}

function editNotes() {
    document.getElementById("notesModal").style.display = "block";
    document.getElementById("notesTextarea").value = document.getElementById("noteDisplay").innerText;
  }
  
function saveNotes() {
    var note = document.getElementById('notesTextarea').value;
    
    var noteText = document.getElementById("notesTextarea").value;
    document.getElementById("noteDisplay").innerText = noteText;
    document.getElementById("notesModal").style.display = "none";

    fetch('/admin/_api/v1/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: note })
    })
    .then(response => response.text())
    .then(data => {
        closeModal();
    })//SELECT * FROM notes
    .catch(error => {
        console.error('Error:', error);
    });
}
  
  function closeNotes() {
    document.getElementById("notesModal").style.display = "none";
  }
  
  function refreshNotes() {
    document.getElementById("notesTextarea").value = '';
  }
  
  window.onclick = function(event) {
    var modal = document.getElementById("notesModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }