/*jslint browser */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("calc-form");
    const quantityInput = document.getElementById("quantity");
    const optionsField = document.getElementById("options-field");
    const optionSelect = document.getElementById("option");
    const propertyField = document.getElementById("property-field");
    const propertyCheckbox = document.getElementById("property");
    const errorBox = document.getElementById("error");
    const resultBox = document.getElementById("result");

    // Цена за штуку и набор доступных настроек для каждого типа услуги
    const services = {
        cards: {price: 15, hasOptions: false, hasProperty: false},
        posters: {price: 40, hasOptions: true, hasProperty: false},
        brochures: {price: 25, hasOptions: false, hasProperty: true}
    };

    // Доплата за свойство (ламинацию), руб. за штуку
    const propertyPrice = 8;

    // Только целое число от 1, без пробелов, букв и других символов
    const quantityPattern = /^[1-9][0-9]*$/;

    function showError(message) {
        resultBox.textContent = "";
        errorBox.textContent = message;
    }

    function showResult(total) {
        errorBox.textContent = "";
        resultBox.textContent = "Стоимость заказа: " +
                total.toLocaleString("ru-RU") + " ₽";
    }

    function getService() {
        return services[form.elements.service.value];
    }

    // Показывает или скрывает селект и чекбокс в зависимости от типа услуги
    function updateFields() {
        const service = getService();

        optionsField.hidden = !service.hasOptions;
        propertyField.hidden = !service.hasProperty;

        if (!service.hasOptions) {
            optionSelect.selectedIndex = 0;
        }
        if (!service.hasProperty) {
            propertyCheckbox.checked = false;
        }
    }

    function calculate() {
        const quantityText = quantityInput.value.trim();

        if (!quantityPattern.test(quantityText)) {
            showError(
                "Введите количество цифрами: целое число от 1, " +
                "без букв, пробелов и других символов."
            );
            return;
        }

        const service = getService();
        let unitPrice = service.price;

        if (service.hasOptions) {
            unitPrice += parseInt(optionSelect.value, 10);
        }
        if (service.hasProperty && propertyCheckbox.checked) {
            unitPrice += propertyPrice;
        }

        showResult(unitPrice * parseInt(quantityText, 10));
    }

    // Пересчёт при вводе цифр в поле количества
    quantityInput.addEventListener("input", calculate);

    // Пересчёт при смене типа услуги, опции или свойства
    form.addEventListener("change", function () {
        updateFields();
        calculate();
    });

    // Enter в поле ввода не должен перезагружать страницу
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        calculate();
    });

    updateFields();
    calculate();
});
