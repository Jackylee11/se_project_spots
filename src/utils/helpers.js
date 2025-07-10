export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  LoadingText = "Saving...") {
  if(isLoading){
    btn.textContent = LoadingText;
  } else {
    btn.textContent = defaultText;
  }
}


export function deletingText(
  btn,
  isLoading,
  defaultText = "Delete",
  loadingText = "Deleting..."
) {
  if(isLoading){
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
  }
}