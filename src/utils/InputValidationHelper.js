export function validateGenericInput(
  keyInput,
  value,
  prefix,
  validationFields,
) {
  let inputError = {};

    console.log("validateGenericInput start", keyInput, value, prefix, validationFields);
  if (validationFields.includes(keyInput.key)) {
    const trimmed = value && typeof value === 'string' ? value.trim() : value;
    console.log("validateGenericInput trimmed", trimmed, !trimmed || trimmed === '');
    if (!trimmed || trimmed === '') {
      inputError[prefix + keyInput.key] = `Please enter ${keyInput.label}`;
    console.log("validateGenericInput error 15", inputError);
      return inputError;
    }

    switch (keyInput.key) {
      case 'id':
        if (
          trimmed === '' ||
          isNaN(trimmed) ||
          !Number.isInteger(Number(trimmed))
        ) {
          inputError[
            prefix + keyInput.key
          ] = `${keyInput.label} must be a valid integer.`;
        }
        break;
      case 'amount':
      case 'paidAmount':
      case 'itemPrice':
      case 'interestRate':
      case 'investmentAmount':
      case 'itemQty':
        if (trimmed === '' || isNaN(Number(trimmed))) {
          inputError[
            prefix + keyInput.key
          ] = `${keyInput.label} must be a valid number.`;
        }
        break;
      case 'paidDate':
      case 'spentDate':
      case 'investmentDate':
      case 'maturityDate':
        if (!trimmed || isNaN(Date.parse(trimmed))) {
          inputError[
            prefix + keyInput.key
          ] = `${keyInput.label} must be a valid date.`;
        }
        break;
    }
    console.log("validateGenericInput error", inputError);
    return inputError;
  }

  //   if (
  //     prefix &&
  //     prefix !== 'null-' &&
  //     intentToValidationMap[prefix.split('-')[0]].includes(input.key)
  //   ) {
  //     if (!inputValue || !inputValue.trim() || inputValue.trim() === '') {
  //       inputError[prefix + input.key] = `${input.label} is required`;
  //     }
  //     if (
  //       prefix === updateItemIntent + '-' &&
  //       inputValue?.trim() &&
  //       input.key === 'id' &&
  //       isNaN(Number(inputValue))
  //     ) {
  //       inputError[prefix + input.key] = `Not a valid ${input.label}`;
  //     }
  //     if (
  //       prefix === addItemIntent + '-' ||
  //       prefix === addBulkItemDetailIntent + '-' ||
  //       prefix === addItemDetailIntent + '-'
  //     ) {
  //       delete inputError[prefix + 'id'];
  //     }
  //   }
  //   return inputError;
}
