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

// 監聽
sideMenuItem.addEventListener('click', handleItem)
productWrap.addEventListener('click', addCartBtn)

// 初始化
function init() {
  getProducts()
  getCarts()
}
init()

// API Data
let products = []
let carts = []

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
  let itemTarget = e.currentTarget
  let valueTarget = itemTarget.dataset.item
  sideMenuItemLi.forEach(function (el) {
    el.classList.remove('active')
  })
  itemTarget.classList.add('active')
}
