//! Düzenleme modu değişkenleri
let editMode = false; //* Düzenleme modunu belirleyecek değişken
let editItem; //* Düzenleme elemanını belirleyecek değişken
let editItemId; //* Düzenleme elemanının 'ID' bilgisi

//! Html'den elemanları çağırma
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");

//! FONKSİYONLAR
// * Form gönderildiğinde çalışacak fonksiyon
const addItem = (e) => {
  //* Sayfanın yenilenmesini iptal et
  e.preventDefault();
  const value = input.value;
  if (value !== "" && !editMode) {
    //* Silme işlemleri için benzersiz değere ihtiyaç vardır bu nedenle 'id' tanımlandı
    const id = new Date().getTime().toString();
    createElement(id, value);
    setToDefault();
    showAlert("Eleman Eklendi", "success");
    addToLocalStorage(id, value);
  } else if (value !== "" && editMode) {
    editItem.innerHTML = value;
    updateLocalStorage(editItemId, value);
    showAlert("Eleman Güncellendi", "success");
    setToDefault();
  }
};

//! Uyarı vermesi istenen fonksiyon
const showAlert = (text, action) => {
  //* Alert içeriğini belirler.
  alert.textContent = `${text}`;
  //*Alert'e class ekler
  alert.classList.add(`alert-${action}`);
  //*Alert'in içeriğini günceller ve eklenen classı kaldırır.
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};

//* Elamanları silen fonksiyon
const deleteItem = (e) => {
  //* Silmek istenen elemana ulaşma
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;

  //* Bu elemanı kaldır
  itemList.removeChild(element);
  removeFromLocalStorage(id);
  showAlert("Eleman Silindi", "danger");
  //* Eğer eleman yoksa 'clear List'i kaldırmak için
  if (itemList.children.length === 0) {
    clearButton.style.display = "none";
  }
};

//*Elemanları güncelleyecek fonksiyon
const editItems = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editItem = e.target.parentElement.parentElement.previousElementSibling;
  input.value = editItem.innerText;
  editMode = true;
  editItemId = element.dataset.id;
  addButton.textContent = "Düzenle";
};

//*Varsayılan değerlere döndürme fonksiyonu
const setToDefault = () => {
  input.value = "";
  editMode = false;
  editItemId = "";
  addButton.textContent = "Ekle";
};

//* Sayfa yüklendiğinde elemanları render edecek fonksiyon
const renderItems = () => {
  let items = getFromLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => createElement(item.id, item.value));
    clearButton.style.display = "block"; //  ! Eğer eleman varsa butonu göster
  }
};

//* Eleman oluşturan fonksiyon
const createElement = (id, value) => {
  //* Yeni bir div oluştur
  const newDiv = document.createElement("div");
  //* Bu div'e attribute ekle
  newDiv.setAttribute("data-id", id);
  //* Bu div'e class ekle
  newDiv.classList.add("items-list-item");

  //* Bu div'in HTML içeriğini belirle
  newDiv.innerHTML = ` 
            <p class="item-name">${value}</p>
            <div class="btn-container">
              <button class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
        `;

  //* Delete butonuna erişmek için kullanılır
  const deleteBtn = newDiv.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  //* Edit butonuna eriş
  const editBtn = newDiv.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItems);
  itemList.appendChild(newDiv);
  showAlert("Eleman Eklendi", "success");

  // Clear button her yeni eklemede görünmeli
  clearButton.style.display = "block";
};

//*Sıfırlama yapan fonksiyon
const clearItems = () => {
  const items = document.querySelectorAll(".items-list-item");
  if (items.length > 0) {
    items.forEach((item) => {
      itemList.removeChild(item);
    });
    clearButton.style.display = "none";
    showAlert("Liste Boş", "danger");
    localStorage.removeItem("items");
  }
};

//*LocalStorage'a kayıt yapan fonksiyon
const addToLocalStorage = (id, value) => {
  const item = { id, value };
  let items = getFromLocalStorage();
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
};

//*LocalStorage'dan veri alan fonksiyon
const getFromLocalStorage = () => {
  return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
};

//*LocalStorage'dan verileri kaldıran fonksiyon
const removeFromLocalStorage = (id) => {
  let items = getFromLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
};

//*LocalStorage'ı güncelleyen fonksiyon
const updateLocalStorage = (id, newValue) => {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      return { ...item, value: newValue };
    }
    return item;
  });
  localStorage.setItem("items", JSON.stringify(items));
};

// ? Olay izleyicileri
form.addEventListener("submit", addItem);
window.addEventListener("DOMContentLoaded", renderItems);
clearButton.addEventListener("click", clearItems);
