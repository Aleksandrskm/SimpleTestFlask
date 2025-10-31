export class Loader {
    /**
     * Конструктор класса загрузчика.
     *
     * @param {string} selector - селектор элемента загрузчика.
     */
    constructor(selector, delay = 300) {
        this.delay = delay;
        /**
         * DOM-элемент, представляющий загрузчик.
         * @type {HTMLElement}
         */
        this.element = document.querySelector(selector);
        /**
         * DOM-элемент, представляющий заголовок загрузчика.
         * @type {HTMLElement}
         */
        this.titleElement = this.element.querySelector('.loader-container__title');

        this.isLoading = false;
    }

    /**
     * Открывает загрузчик.
     *
     * Этот метод удаляет класс 'loder-container--hidden' у элемента загрузчика,
     * что приведет к его отображению.
     */
    open() {
        this.isLoading = true;
        console.log(this.isLoading);

        setTimeout(() => { // Используем стрелочную функцию
            if (!this.isLoading) return;
            console.log(this);
            this.element.classList.remove('loader-container--hidden');
        }, this.delay);
    }

    /**
     * Скрывает загрузчик.
     *
     * Этот метод добавляет класс 'loder-container--hidden' к элементу загрузчика,
     * что приведет к его скрытию.
     */
    close() {
        this.isLoading = false;
        this.element.classList.add('loader-container--hidden');

    }

    /**
     * Устанавливает заголовок загрузчика и открывает его.
     *
     * @param {string} title - Заголовок загрузчика.
     */
    show(title) {
        // Устанавливаем заголовок загрузчика
        this.titleElement.innerText = title;
        this.open()
    }
}