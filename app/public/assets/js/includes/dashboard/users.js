function users() {
  var firewall = document.getElementById("firewall");
  var firewalllink = document.getElementById("firewall-link");
  var summary = document.getElementById("summary");
  var summarylink = document.getElementById("summary-link");
  var notes = document.getElementById("notes");
  var noteslink = document.getElementById("notes-link");
  var user = document.getElementById("users");
  var userlink = document.getElementById("users-link");

  if (user.style.display === "none") {
    summary.style.display = "none";
    firewall.style.display = "none";
    notes.style.display = "none";
    user.style.display = "flex";

    summarylink.classList.remove("active");
    firewalllink.classList.remove("active");
    noteslink.classList.remove("active");
    userlink.classList.add("active");
  }
}

function showEditForm(id, name, email, isVerified) {
  document.querySelector("#edit-form").style.display = "block";
  document.querySelector('#edit-form input[name="name"]').value = name;
  document.querySelector('#edit-form input[name="email"]').value = email;
  document.querySelector('#edit-form input[name="password"]').value = "";
  document.querySelector('#edit-form input[name="erified"]').checked =
    isVerified;
  document.querySelector("#edit-form").action = "/edit-user/" + id;
}
