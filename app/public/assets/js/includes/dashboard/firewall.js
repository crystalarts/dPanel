function firewall() {
  var api = document.getElementById("apitokens");
  var apilink = document.getElementById("apitokens-link");
  var firewall = document.getElementById("firewall");
  var firewalllink = document.getElementById("firewall-link");
  var summary = document.getElementById("summary");
  var summarylink = document.getElementById("summary-link");
  var notes = document.getElementById("notes");
  var noteslink = document.getElementById("notes-link");
  var user = document.getElementById("users");
  var userlink = document.getElementById("users-link");
  var support = document.getElementById("support");
  var supportlink = document.getElementById("support-link");

  if (firewall.style.display === "none") {
    firewall.style.display = "flex";
    api.style.display = "none";
    summary.style.display = "none";
    notes.style.display = "none";
    user.style.display = "none";
    support.style.display = "none";

    apilink.classList.remove("active");
    firewalllink.classList.add("active");
    summarylink.classList.remove("active");
    noteslink.classList.remove("active");
    userlink.classList.remove("active");
    supportlink.classList.remove("active");
  }
}

$(document).ready(function () {
  $("#add-firewall-btn").click(function () {
    $("#modal-title").text("Add: Rule");
    $("#firewall-form")[0].reset();
    $("#firewall-modal").fadeIn();
  });

  $(".edit-firewall-btn").click(function () {
    const tr = $(this).closest("tr");
    const id = tr.data("id");

    $("#modal-title").text("Edit: Rule");
    $('#firewall-form input[name="id"]').val(id);
    var icon = tr.find("td:eq(0) i");
    var onValue;

    if (
      icon.hasClass("fa-check-circle") &&
      icon.css("color") === "rgb(135, 255, 119)"
    ) {
      onValue = "on";
    } else if (
      icon.hasClass("fa-times-circle") &&
      icon.css("color") === "rgb(255, 119, 119)"
    ) {
      onValue = "off";
    }
    $('#firewall-form select[name="type"]').val(tr.find("td:eq(1)").text());
    $('#firewall-form input[name="interfaces"]').val(
      tr.find("td:eq(2)").text(),
    );
    $('#firewall-form select[name="direction"]').val(
      tr.find("td:eq(3)").text(),
    );
    $('#firewall-form select[name="protocol"]').val(tr.find("td:eq(4)").text());
    $('#firewall-form input[name="comment"]').val(tr.find("td:eq(5)").text());

    $("#firewall-modal").fadeIn();
  });

  $(".close-modal").click(function () {
    $("#firewall-modal").fadeOut();
  });

  $("#firewall-form").submit(function (e) {
    e.preventDefault();
    const formData = $(this).serialize();

    $.ajax({
      url: "/save",
      method: "POST",
      data: formData,
      success: function (response) {
        if (response.success) {
          location.reload();
        } else {
          alert("Wystąpił błąd podczas zapisywania danych.");
        }
      },
      error: function (xhr) {
        console.error("Błąd zapisu:", xhr.status);
        alert("Wystąpił błąd podczas zapisywania danych.");
      },
    });
  });

  $(".delete-firewall-btn").click(function () {
    if (confirm("Are you sure you want to remove this firewall??")) {
      const id = $(this).closest("tr").data("id");

      $.ajax({
        url: "/delete/" + id,
        method: "POST",
        success: function (response) {
          if (response.success) {
            location.reload();
          } else {
            alert("Wystąpił błąd podczas zapisywania danych.");
          }
        },
        error: function (xhr) {
          alert("An error occurred while removing the firewall.");
        },
      });
    }
  });
});
