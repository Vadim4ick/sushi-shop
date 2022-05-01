//Div внутри корзины, для отображения товаров
const cartWrapper = document.querySelector(".cart-wrapper");

//============= "Корзина пуста" и оформить заказ ====================
//Функция отвечающая за надпись "Корзина пуста" и оформить заказ
function toggleCartStatus() {
  //Забираем надпись "Корзина пуста"
  const cartEmptyBadge = document.querySelector("[data-cart-empty]");

  //Забираем надпись оформить заказ
  const orderForm = document.querySelector("#order-form");

  //Если в корзине общее количество эл. больше нуля, то скрываем
  if (cartWrapper.children.length > 0) {
    cartEmptyBadge.classList.add("none");
    orderForm.classList.remove("none");
  } else {
    //Иначе если у нас общее количество эл. меньше или = нулю, то добавляем табличку на стр.
    cartEmptyBadge.classList.remove("none");
    orderForm.classList.add("none");
  }
}
//===================================================================

//============= Подсчет стоимости товара и доставки =================
//Функция подсчета стоимости
function calcCartPriceAndDelivery() {
  //Забираем все карточки товара из корзины которые есть
  const cartItems = document.querySelectorAll(".cart-item");
  //Забираем написание итоговой цены, что б вывести ее
  const totalPriceEl = document.querySelector(".total-price");

  //Забираем написание доставка: в корзине
  const deliveryCost = document.querySelector(".delivery-cost");
  //Забираем дата элемент надписи доставка: и Итого:
  const cartDeliver = document.querySelector("[data-cart-delivery]");

  //Создаем итоговую цену по подсчетам всех карточек
  let totalPrice = 0;

  //Перебираем каждую карточку и забираем у нее значения
  cartItems.forEach(function (item) {
    //Забираем количество штук и цену, и просто получаем общую стоимость каждого товара, перемножив кол-во и цену
    const amoutEl = item.querySelector("[data-counter]");
    const priceEl = item.querySelector(".price__currency");
    const currentPrice =
      parseInt(amoutEl.innerText) * parseInt(priceEl.innerText);

    //Добавляем в итоговую цену сумму всех общих подсчетов каждой карточки
    totalPrice += currentPrice;
  });
  //Выводим итоговую цену
  totalPriceEl.innerHTML = totalPrice + 250;

  //Скрываем/показываем блок со стоимостью доставки
  if (totalPrice > 0) {
    cartDeliver.classList.remove("none");
  } else {
    cartDeliver.classList.add("none");
  }

  //Указываем стоимость доставки, если больше 600, то бесплатная
  if (totalPrice >= 600) {
    deliveryCost.classList.add("free");
    deliveryCost.innerHTML = "Бесплатно";
    totalPriceEl.innerHTML = totalPrice;
  } else {
    deliveryCost.classList.remove("free");
    deliveryCost.innerHTML = "250 ₽";
  }
}
//===================================================================

//======== Cчетчик, кнопки + и - ====================================
//Добавляем прослушку на все окно
window.addEventListener("click", (event) => {
  // объявляем счетчик
  let counter;

  //Проверка нахождения родителя только при клике на эти 2 кнопки
  if (
    event.target.dataset.action === `plus` ||
    event.target.dataset.action === `minus`
  ) {
    //Находим обертку счетчика, через метод closest (Находит весь родитель)
    const counterWrapper = event.target.closest(".counter-wrapper");

    //Находим див с числом счетчика
    counter = counterWrapper.querySelector("[data-counter]");
  }

  //Проверяем, явл. ли элемент по которому мы совершили клик кнопкой плюс
  if (event.target.dataset.action === `plus`) {
    //Увеличиваем счетчик на 1
    counter.innerHTML = ++counter.innerHTML;
  }

  //Проверяем, явл. ли элемент по которому мы совершили клик кнопкой минус
  if (event.target.dataset.action === `minus`) {
    //Делаем проверку, что не может быть меньше 1 и уменьшаем при клике
    if (parseInt(counter.innerHTML) > 1) {
      counter.innerHTML = --counter.innerHTML;
    } else if (
      //Проверка на товар который находится в корзине, 0 - удаление товара из корзины.
      event.target.closest(".cart-wrapper") &&
      parseInt(counter.innerHTML) === 1
    ) {
      //удаляем товар из корзины
      event.target.closest(".cart-item").remove();

      //Отображение статуса корзины Пустая / Полная, отвечающая уже за удаление самого последнего товара.
      toggleCartStatus();

      //Пересчет общей стоимости товаров в корзине
      calcCartPriceAndDelivery();
    }
  }

  //Проверяем клик по + или - внутри корзины, обязательно они иммеют дата акшин в родителе корзине - карт-враппер
  if (
    event.target.hasAttribute("data-action") &&
    event.target.closest(".cart-wrapper")
  ) {
    //Пересчет общей стоимости товаров в корзине
    calcCartPriceAndDelivery();
  }
});
//===================================================================

//============= Добавление в корзину ================================
//Добавляем прослушку на все окно
window.addEventListener("click", (e) => {
  // Делаем проверку, если кликнутый элемент имеет атрибут дата-карт (Добавить в корзину)
  if (e.target.hasAttribute("data-cart")) {
    //Находим родителя кнопки корзины, а именно сама, целая карточка товара
    const card = e.target.closest(".card");

    //Собираем все данные с данной карточки и записываем их
    const productInfo = {
      id: card.dataset.id,
      imgSrc: card.querySelector(".product-img").getAttribute("src"),
      title: card.querySelector(".item-title").innerHTML,
      itemInBox: card.querySelector("[data-items-in-box]").innerHTML,
      weight: card.querySelector(".price__weight").innerHTML,
      price: card.querySelector(".price__currency").innerHTML,
      counter: card.querySelector("[data-counter]").innerHTML,
    };

    //Проверять есть ли товар уже в корзине?
    const itemInCart = cartWrapper.querySelector(
      `[data-id="${productInfo.id}"]`
    );

    //Если товар есть в корзине, то ищем сколько штук есть в корзине и отпарсить их (Превратить в числа) вместе со штуками которые мы хотим добавить на странице и складывать числа. Не дублируя товары в корзине, то:
    if (itemInCart) {
      const counterEl = itemInCart.querySelector("[data-counter]");
      counterEl.innerHTML =
        parseInt(counterEl.innerHTML) + parseInt(`${productInfo.counter}`);
    } else {
      //Если товара нет в корзине, то:

      //Собранные данные подставим в шаблон для товара в корзине (Исходник из html, который потом закомментировал)
      const cartItemHTML = `<div class="cart-item" data-id="${productInfo.id}">
            <div class="cart-item__top">
         <div class="cart-item__img">
        <img src="${productInfo.imgSrc}" alt="${productInfo.title}">
      </div>
      <div class="cart-item__desc">
        <div class="cart-item__title">${productInfo.title}</div>
        <div class="cart-item__weight">${productInfo.itemInBox} / ${productInfo.weight}</div>

        <!-- cart-item__details -->
        <div class="cart-item__details">

          <div class="items items--small counter-wrapper">
            <div class="items__control" data-action="minus">-</div>
            <div class="items__current" data-counter="">${productInfo.counter}</div>
            <div class="items__control" data-action="plus">+</div>
          </div>

          <div class="price">
            <div class="price__currency">${productInfo.price}</div>
          </div>

        </div>`;

      //Отобразим товар в корзине,через этот метод,который принимает 2 значения. 1-й куда добавляем (В конец), 2-й - что добавляем(код)
      cartWrapper.insertAdjacentHTML("beforeend", cartItemHTML);
    }

    //После того, как добавили товар, сбросим его счетчик до 1
    card.querySelector("[data-counter]").innerHTML = "1";

    //Отображение статуса корзины Пустая / Полная, нужна для children в функции, считывать общее кол-во товара
    toggleCartStatus();

    //Пересчет общей стоимости товаров в корзине
    calcCartPriceAndDelivery();
  }
});
//===================================================================
