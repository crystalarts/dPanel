function firewall() {
    var firewall = document.getElementById('firewall');
    var firewalllink = document.getElementById('firewall-link');
    var summary = document.getElementById('summary');
    var summarylink = document.getElementById('summary-link');
    var notes = document.getElementById('notes');
    var noteslink = document.getElementById('notes-link');

    if (firewall.style.display === "none") {
        firewall.style.display = "flex";
        summary.style.display = "none";
        notes.style.display = "none";

        firewalllink.classList.add('active');
        summarylink.classList.remove('active');
        noteslink.classList.remove('active');
    }
}