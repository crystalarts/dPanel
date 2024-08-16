function summary() {
  var firewall = document.getElementById("firewall");
  var firewalllink = document.getElementById("firewall-link");
  var summary = document.getElementById("summary");
  var summarylink = document.getElementById("summary-link");
  var notes = document.getElementById("notes");
  var noteslink = document.getElementById("notes-link");
  var user = document.getElementById("users");
  var userlink = document.getElementById("users-link");

  if (summary.style.display === "none") {
    summary.style.display = "flex";
    firewall.style.display = "none";
    notes.style.display = "none";
    user.style.display = "none";

    summarylink.classList.add("active");
    firewalllink.classList.remove("active");
    noteslink.classList.remove("active");
    userlink.classList.remove("active");
  }
}
