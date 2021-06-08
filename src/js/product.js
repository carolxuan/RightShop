import '../style/all.scss'
import './layout.js'
import axios from 'axios'
import Swal from 'sweetalert2'
import { apiPath, baseUrl, token, config } from './config.js'

// loading
const load = document.querySelector('.loading-icon')
function loading(status) {
  const loading = load.classList.toggle('d-none')
  status === 'run' ? loading : loading
}

// Swal
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  background: 'black',
  showConfirmButton: false,
  timer: 2500,
})

// DOM
const productWrap = document.querySelector('.product-wrap')
const sideMenuItem = document.querySelector('.side-menu')
const sideMenuItemLi = document.querySelectorAll('.side-menu li')
const cartList = document.querySelector('.cart-list')
const cartTotal = document.querySelector('.cart-total')
const nextBtn = document.querySelector('.next-btn')

// 監聽
sideMenuItem.addEventListener('click', handleItem)
productWrap.addEventListener('click', addCartBtn)
cartList.addEventListener('click', changeCart)
nextBtn.addEventListener('click', nextPage)

// 初始化
function init() {
  getProducts()
  getCarts()
}
init()

// API Data
let products = []
let carts = []
let finalTotal

// 取得商品列表
function getProducts() {
  loading('run')
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/products`
  axios
    .get(url)
    .then((res) => {
      products = res.data.products
      renderProducts('全部')
      loading()
    })
    .catch((error) => {
      console.log(error)
    })
}

// 取得購物車列表
function getCarts() {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`
  axios
    .get(url)
    .then((res) => {
      carts = res.data.carts
      finalTotal = res.data.finalTotal
      renderCarts()
    })
    .catch((error) => {
      console.log(error)
    })
}

// 加入購物車
function addCartBtn(e) {
  if (e.target.nodeName !== 'A') return
  const productId = e.target.dataset.id
  let num = 1
  carts.forEach((item) => {
    if (productId === item.product.id) {
      num = item.quantity += 1
    }
  })
  loading('run')
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`
  const data = {
    data: {
      productId: productId,
      quantity: num,
    },
  }
  axios
    .post(url, data)
    .then((res) => {
      getCarts()
      loading()
      Toast.fire({
        title: `加入購物車成功`,
        icon: 'success',
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

// 刪除購物車產品
function deleteCartItem(cardId) {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts/${cardId}`
  loading('run')
  axios
    .delete(url)
    .then((res) => {
      getCarts()
      loading()
      Toast.fire({
        title: `刪除成功`,
        icon: 'success',
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

// 編輯購物車產品數量
function cartPatch(cardId, num) {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`
  const data = {
    data: {
      id: cardId,
      quantity: num,
    },
  }
  loading('run')
  axios
    .patch(url, data)
    .then((res) => {
      getCarts()
      loading()
    })
    .catch((error) => {
      console.log(error)
    })
}

// 渲染產品列表
function renderProducts(category) {
  let list = ''
  products.forEach((item) => {
    if (item.category === category || category === '全部') {
      list += `<li>
                <img
                  src="${item.images}" alt="${item.title}"
                />
                <h3 class="display-10 mb-3">${item.title}</h3>
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <del>NT ${item.origin_price}</del>
                  <p class="text-red display-9">NT ${item.price}</p>
                </div>
                <a href="javascript:void(0)" class="btn btn-primary w-100 fw-bold" data-id="${item.id}">
                  加入購物車
                </a>
              </li>`
    }
  })
  productWrap.innerHTML = list
}

// 渲染購物車列表
function renderCarts() {
  let list = ''
  if (carts.length >= 1) {
    carts.forEach((item) => {
      list += `<tr>
                <td>
                  <a
                    href="javascript:void(0);"
                    class="material-icons deleteBtn"
                    style="font-size: 32px"
                    data-id="${item.id}"
                    data-action="deleteItem"
                    >clear</a
                  >
                </td>
                  <td>
                  <div class="card-table-title">
                    <img src="${item.product.images}" alt="${
        item.product.title
      }" />
                    <p>${item.product.title}</p>
                  </div>
                </td>
                <td data-title="單價" class="td-before">NT $${
                  item.product.price
                }</td>
                <td data-title="數量" class="td-before">
                  <a
                    href="javascript:void(0);"
                    class="material-icons minus align-middle"
                    data-action="minus"
                    data-id="${item.id}"
                    >remove</a
                  >
                  <input
                    type="text"
                    value="${item.quantity}"
                    style="width: 30px"
                    readonly="readonly"
                  />
                  <a
                    href="javascript:void(0);"
                    class="material-icons add align-middle"
                    data-action="add"
                    data-id="${item.id}"
                    >add</a
                  >
                </td>
                <td data-title="金額" class="td-before">NT $${
                  item.product.price * item.quantity
                }</td>
                
              </tr>`
    })
  } else {
    list = `<tr><td>目前購物車是空的</td></tr>`
  }
  cartList.innerHTML = list
  cartTotal.textContent = finalTotal
}

// 點擊產品料表
function handleItem(e) {
  if (e.target.nodeName === 'UL') {
    return
  }
  let value = e.target.dataset.item
  renderProducts(value)
}

// li active
sideMenuItemLi.forEach((el) => {
  el.addEventListener('click', openMenu)
})

function openMenu(e) {
  const itemTarget = e.currentTarget
  const valueTarget = itemTarget.dataset.item
  sideMenuItemLi.forEach(function (el) {
    el.classList.remove('active')
  })
  itemTarget.classList.add('active')
}

// 購物車觸發按鈕
function changeCart(e) {
  const cardId = e.target.dataset.id
  let num = 0
  carts.forEach((item) => {
    if (item.id === cardId) {
      num = item.quantity
    }
  })
  if (e.target.dataset.action === 'deleteItem') {
    deleteCartItem(cardId)
  } else if (e.target.dataset.action === 'add') {
    num += 1
    cartPatch(cardId, num)
  } else if (e.target.dataset.action === 'minus') {
    if (num === 1) {
      Toast.fire({
        title: `產品數量不可以小於 1`,
        icon: 'warning',
      })
    } else {
      num -= 1
      cartPatch(cardId, num)
    }
  }
}

// 下一步
function nextPage(e) {
  e.preventDefault()
  if (carts.length < 1) {
    Toast.fire({
      title: `請加入產品`,
      icon: 'warning',
    })
  } else {
    window.location.href = './information.html'
  }
}
