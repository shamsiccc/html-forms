const form = document.querySelector('form');
let error = null;

// form.noValidate = true;
form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  // old error removing
  if (error !== null) {
    error.remove();
    error = null;
  }

  const isValid = evt.currentTarget.checkValidity();
  if (!isValid) {
    const first = [...form.elements].find((o) => !o.validity.valid);
    // console.log(form.elements);
    first.focus();
    error = document.createElement('div');
    error.dataset.id = 'error';
    error.className = 'form-error';
    error.textContent = 'Большой текст сообщения об ошибке на основании ValidityState';

    // for relative positioning inside container
    first.offsetParent.append(error);
    error.style.top = `${first.offsetTop + first.offsetHeight / 2 - error.offsetHeight / 2}px`;
    error.style.left = `${first.offsetLeft + first.offsetWidth}px`;

    // for absolute positioning inside body
    // document.body.append(error);
    // const { top, left } = first.getBoundingClientRect();
    // error.style.top =
    // `${window.scrollY + top + first.offsetHeight / 2 - error.offsetHeight / 2}px`;
    // error.style.left = `${window.scrollX + left + first.offsetWidth}px`;
  }
});
