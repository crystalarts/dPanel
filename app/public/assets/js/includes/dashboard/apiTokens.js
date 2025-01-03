document.addEventListener("DOMContentLoaded", () => {
  setupFormButton();
  closeFormButton();
  setupDeleteButtons();
});

function setupDeleteButtons() {
  const tableBody = document.getElementById("apitokens-table-body");

  if (!tableBody) {
    console.error("Table body not found.");
    return;
  }

  tableBody.addEventListener("click", async (event) => {
    if (event.target && event.target.matches(".delete-apitokens-btn")) {
      const button = event.target;
      const tokenKey = button.getAttribute("data-key");
      const row = button.closest("tr");

      try {
        const response = await fetch(
          `/_api/v1/keygenerator/delete?key=${encodeURIComponent(tokenKey)}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          row.remove();
        } else {
          console.log(response);
          const errorText = await response.text();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });
}

function closeFormButton() {
  document.addEventListener("click", (event) => {
    if (event.target.matches(".close-modal")) {
      document.getElementById("apitoken-modal").style.display = "none";
    }
  });
}

function setupFormButton() {
  const modal = document.getElementById("apitoken-modal");
  const openModalBtn = document.getElementById("add-apitokens-btn");
  const form = document.getElementById("create-apitoken-form");

  openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/_api/v1/keygenerator/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        modal.style.display = "none";
        location.reload();
      } else {
        const errorText = await response.text();
        console.log(errorText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
}
