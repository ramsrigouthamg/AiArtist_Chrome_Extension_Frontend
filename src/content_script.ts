document.onmouseup = () => {
  let textSelection = window.getSelection().toString()
  if (!textSelection) return
  chrome.storage.local.set({
    textSelection,
  })
}
