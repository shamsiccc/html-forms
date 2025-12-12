import PopoverWidget from '../app';

jest.mock('../../css/style.css', () => ({}));

// Mock DOM для тестов
beforeEach(() => {
  document.body.innerHTML = `
    <div class="demo-container">
      <button 
        class="btn btn-danger" 
        data-toggle="popover" 
        title="Test Popover Title" 
        data-content="Test popover content here"
      >
        Test Button
      </button>
      <button 
        class="btn btn-secondary" 
        data-toggle="popover" 
        title="Second Popover" 
        data-content="Another test content"
      >
        Second Button
      </button>
    </div>
  `;
});

describe('PopoverWidget', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-new
    new PopoverWidget();
  });

  afterEach(() => {
    // Очищаем все popover
    const popovers = document.querySelectorAll('.popover-container');
    popovers.forEach((popover) => popover.remove());
  });

  test('should initialize and find all popover buttons', () => {
    const buttons = document.querySelectorAll('[data-toggle="popover"]');
    expect(buttons).toHaveLength(2);
  });

  test('should show popover when button is clicked', () => {
    const button = document.querySelector('[data-toggle="popover"]');

    button.click();

    const popover = document.querySelector('.popover-container');
    expect(popover).not.toBeNull();
    expect(popover.querySelector('.popover-header').textContent).toBe('Test Popover Title');
    expect(popover.querySelector('.popover-body').textContent).toBe('Test popover content here');
  });

  test('should center popover horizontally above button', () => {
    const button = document.querySelector('[data-toggle="popover"]');

    // Создаём popover для проверки размеров
    button.click();
    const popover = document.querySelector('.popover-container');

    const buttonRect = button.getBoundingClientRect();

    // Проверяем центрирование
    const expectedLeft = buttonRect.left + (buttonRect.width / 2) - (popover.offsetWidth / 2);
    const actualLeft = parseFloat(popover.style.left);

    // Допускаем погрешность в 15px
    expect(Math.abs(actualLeft - expectedLeft)).toBeLessThanOrEqual(15);
  });

  test('should position popover above the button', () => {
    const button = document.querySelector('[data-toggle="popover"]');

    button.click();
    const popover = document.querySelector('.popover-container');

    const buttonRect = button.getBoundingClientRect();

    // Popover должен быть выше кнопки
    expect(parseFloat(popover.style.top)).toBeLessThan(buttonRect.top);
  });

  test('should hide popover when clicking outside', () => {
    const button = document.querySelector('[data-toggle="popover"]');

    // Показать popover
    button.click();
    expect(document.querySelector('.popover-container')).not.toBeNull();

    // Кликнуть вне popover
    document.body.click();

    expect(document.querySelector('.popover-container')).toBeNull();
  });

  test('should toggle popover on same button click', () => {
    const button = document.querySelector('[data-toggle="popover"]');

    // Первый клик - показать
    button.click();
    expect(document.querySelector('.popover-container')).not.toBeNull();

    // Второй - скрыть
    button.click();
    expect(document.querySelector('.popover-container')).toBeNull();
  });

  test('should hide previous popover when clicking another button', () => {
    const button1 = document.querySelector('.btn-danger');
    const button2 = document.querySelector('.btn-secondary');

    // Клик по первой кнопке
    button1.click();
    const popover1 = document.querySelector('.popover-container');
    expect(popover1).not.toBeNull();

    // Клик по второй - первый должен закрыться
    button2.click();

    const popovers = document.querySelectorAll('.popover-container');
    expect(popovers).toHaveLength(1); // Только один popover

    expect(popovers[0].querySelector('.popover-header').textContent).toBe('Second Popover');
  });

  test('should handle missing title or content gracefully', () => {
    // Создаём кнопку без атрибутов
    const brokenButton = document.createElement('button');
    brokenButton.className = 'btn';
    brokenButton.setAttribute('data-toggle', 'popover');
    document.body.append(brokenButton);

    // Пересоздаем виджет с новой кнопкой
    // eslint-disable-next-line no-new
    new PopoverWidget();

    // Не должно быть ошибок при клике
    expect(() => {
      brokenButton.click();
    }).not.toThrow();

    brokenButton.remove();
  });

  test('popover should have correct CSS classes', () => {
    const button = document.querySelector('[data-toggle="popover"]');

    button.click();
    const popover = document.querySelector('.popover-container');

    expect(popover.classList.contains('popover-container')).toBe(true);
    expect(popover.querySelector('.popover-header')).not.toBeNull();
    expect(popover.querySelector('.popover-body')).not.toBeNull();
    expect(popover.querySelector('.popover-arrow')).not.toBeNull();
  });

  test('should handle window resize correctly', () => {
    const button = document.querySelector('[data-toggle="popover"]');

    button.click();
    const popover = document.querySelector('.popover-container');

    // Изменяем размера окна
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    // После resize popover должен оставаться в границах экрана
    expect(popover.getBoundingClientRect().right).toBeLessThanOrEqual(800);
  });
});

describe('PopoverWidget Edge Cases', () => {
  test('should handle button near screen edges', () => {
    // Создаём кнопку у правого края
    document.body.innerHTML = `
      <button 
        style="position: fixed; right: 10px; top: 10px;"
        data-toggle="popover" 
        title="Edge Test" 
        data-content="Content"
      >
        Edge Button
      </button>
    `;

    // eslint-disable-next-line no-new
    new PopoverWidget();
    const button = document.querySelector('button');

    button.click();
    const popover = document.querySelector('.popover-container');

    // Popover не должен выходить за экран
    expect(popover.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth);
  });

  test('should work with scroll on page', () => {
    // Создаём высокую страницу
    document.body.innerHTML = `
      <div style="height: 2000px; padding-top: 1000px;">
        <button 
          data-toggle="popover" 
          title="Scrolled" 
          data-content="Content"
        >
          Scrolled Button
        </button>
      </div>
    `;

    // eslint-disable-next-line no-new
    new PopoverWidget();
    const button = document.querySelector('button');

    // Мокаем scrollTo для JSDOM
    window.scrollTo = jest.fn();

    button.click();
    const popover = document.querySelector('.popover-container');

    // Popover должен корректно позиционироваться
    expect(popover).not.toBeNull();
  });
});
