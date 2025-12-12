import '../css/style.css';

const form = document.querySelector('form');
let error = null;

if (form) {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (error !== null) {
      error.remove();
      error = null;
    }

    const isValid = evt.currentTarget.checkValidity();
    if (!isValid) {
      const firstInvalid = [...form.elements].find((element) => !element.validity.valid);

      if (firstInvalid) {
        firstInvalid.focus();

        error = document.createElement('div');
        error.dataset.id = 'error';
        error.className = 'form-error';

        let errorMessage = 'Пожалуйста, исправьте это поле';

        if (firstInvalid.validity.valueMissing) {
          errorMessage = 'Это поле обязательно для заполнения';
        } else if (firstInvalid.validity.typeMismatch) {
          errorMessage = 'Пожалуйста, введите корректное значение';
        } else if (firstInvalid.validity.tooShort) {
          errorMessage = `Минимальная длина: ${firstInvalid.minLength} символов`;
        } else if (firstInvalid.validity.tooLong) {
          errorMessage = `Максимальная длина: ${firstInvalid.maxLength} символов`;
        } else if (firstInvalid.validity.patternMismatch) {
          errorMessage = 'Значение не соответствует требуемому формату';
        } else if (firstInvalid.validity.customError) {
          errorMessage = firstInvalid.validationMessage || 'Неверное значение';
        }

        error.textContent = errorMessage;

        const parent = firstInvalid.offsetParent || document.body;
        parent.append(error);

        error.style.top = `${firstInvalid.offsetTop + firstInvalid.offsetHeight / 2 - error.offsetHeight / 2}px`;
        error.style.left = `${firstInvalid.offsetLeft + firstInvalid.offsetWidth}px`;
      }
    } else {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('Форма валидна, данные для отправки:', {
          name: form.name.value,
          email: form.email.value,
          phone: form.phone.value,
        });
      }

      const successMsg = document.createElement('div');
      successMsg.className = 'success-message';
      successMsg.textContent = 'Форма успешно отправлена!';
      document.body.append(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    }
  });

  form.addEventListener('input', (evt) => {
    if (error !== null && evt.target.validity.valid) {
      error.remove();
      error = null;
    }
  });
}

class PopoverWidget {
  constructor() {
    this.activePopover = null;
    this.init();
  }

  init() {
    const buttons = document.querySelectorAll('[data-toggle="popover"]');

    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.togglePopover(button);
      });
    });

    document.addEventListener('click', (e) => {
      if (this.activePopover
                && !e.target.closest('.popover-container')
                && !e.target.hasAttribute('data-toggle')) {
        this.hidePopover();
      }
    });
  }

  togglePopover(button) {
    if (this.activePopover && this.activePopover.button === button) {
      this.hidePopover();
      return;
    }

    this.showPopover(button);
  }

  showPopover(button) {
    this.hidePopover();

    const title = button.getAttribute('title');
    const content = button.getAttribute('data-content');

    const popover = this.createPopover(title, content);
    this.positionPopover(popover, button);

    this.activePopover = { element: popover, button };
  }

  /* eslint-disable class-methods-use-this */
  createPopover(title, content) {
    const popover = document.createElement('div');
    popover.className = 'popover-container';

    const arrow = document.createElement('div');
    arrow.className = 'popover-arrow';

    const header = document.createElement('h3');
    header.className = 'popover-header';
    header.textContent = title;

    const body = document.createElement('div');
    body.className = 'popover-body';
    body.textContent = content;

    popover.append(arrow, header, body);
    return popover;
  }
  /* eslint-disable class-methods-use-this */

  positionPopover(popover, button) {
    document.body.append(popover);

    const buttonRect = button.getBoundingClientRect();

    const popoverStyles = {
      maxWidth: '276px',
      minWidth: '150px',
    };

    Object.assign(popover.style, popoverStyles);

    const finalPopoverRect = popover.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    const buttonCenterX = buttonRect.left + (buttonRect.width / 2);
    let leftPosition = buttonCenterX - (finalPopoverRect.width / 2) + scrollX;
    const topPosition = buttonRect.top - finalPopoverRect.height - 10 + scrollY;

    const margin = 15;
    if (leftPosition < margin) {
      leftPosition = margin;
    }

    const maxLeft = window.innerWidth - finalPopoverRect.width - margin;
    if (leftPosition > maxLeft) {
      leftPosition = maxLeft;
    }

    const finalStyles = {
      top: `${topPosition}px`,
      left: `${leftPosition}px`,
    };

    Object.assign(popover.style, finalStyles);
  }

  hidePopover() {
    if (this.activePopover) {
      this.activePopover.element.remove();
      this.activePopover = null;
    }
  }
}
const initApp = () => {
  const popoverButtons = document.querySelectorAll('[data-toggle="popover"]');
  if (popoverButtons.length > 0) {
    const widget = new PopoverWidget();
    return widget;
  }
  return null;
};

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
}

export default PopoverWidget;
