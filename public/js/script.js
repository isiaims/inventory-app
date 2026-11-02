document.querySelectorAll(".delete-item").forEach((button) => {
  button.addEventListener("click", () => {
    const confirmation = button
      .closest(".action")
      .querySelector(".confirm-delete");
    confirmation.classList.add("open");
  });
});

document.querySelectorAll(".confirm-delete .reject").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".confirm-delete").classList.remove("open");
  });
});

document.querySelectorAll(".save-edit").forEach((button) => {
  button.addEventListener("click", () => {
    const confirmation = document.querySelector(".confirm-update");
    const passwordInput = confirmation?.querySelector("#update-password");
    confirmation?.classList.add("open");
    if (passwordInput) {
      passwordInput.disabled = false;
      passwordInput.focus();
    }
  });
});

document.querySelectorAll(".cancel-update").forEach((button) => {
  button.addEventListener("click", () => {
    const confirmation = button.closest(".confirm-update");
    confirmation.classList.remove("open");
    const passwordInput = confirmation.querySelector("#update-password");
    passwordInput.value = "";
    passwordInput.disabled = true;
  });
});
