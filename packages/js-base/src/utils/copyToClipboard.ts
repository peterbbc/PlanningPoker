/**
 * Selects the content from an input
 * @param input input element with the text to be copied
 */
export function selectInputContents(input: HTMLInputElement) {
  const isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

  if (isiOSDevice) {
    const editable = input.contentEditable;
    const readOnly = input.readOnly;

    input.contentEditable = "true";
    input.readOnly = false;

    const range = document.createRange();
    range.selectNodeContents(input);

    const selection = window.getSelection();

    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(range);

    input.setSelectionRange(0, 999999);
    input.contentEditable = editable;
    input.readOnly = readOnly;
  } else {
    input.select();
  }
}

/**
 * Selects and copies to clipboard the content from an input
 * @param input input element with the text to be copied
 */
export function copyToClipboard(input: HTMLInputElement) {
  selectInputContents(input);

  document.execCommand("copy");
}
