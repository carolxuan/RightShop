import '../style/all.scss'
import './layout.js'
import axios from 'axios'
import Swal from 'sweetalert2'
import validate from 'validate.js'
import { apiPath, baseUrl, token, config } from './config.js'
import toThousands from './util.js'

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
const orderList = document.querySelector('.orderList-item')
const total = document.querySelector('.total')
const orderInfo = document.querySelector('.orderInfo-btn')
const form = document.querySelector('.orderInfo-form')
const input = document.querySelectorAll('input[type=text], input[type=tel]')
const message = document.querySelectorAll('[data-msg]')

// 監聽
orderInfo.addEventListener('click', verification)

// 初始化
getCarts()

// API Data
let carts = []

// 變數
let finalTotal
const constraints = {
  姓名: {
    presence: {
      allowEmpty: false,
      message: '是必填欄位',
    },
  },
  電話: {
    presence: {
      allowEmpty: false,
      message: '是必填欄位',
    },
    length: {
      minimum: 8,
      allowEmpty: false,
      message: '號碼長度要超過 8 碼',
    },
  },
  信箱: {
    presence: {
      allowEmpty: false,
      message: '是必填欄位',
    },
    email: {
      allowEmpty: false,
      message: '格式錯誤',
    },
  },
  地址: {
    presence: {
      allowEmpty: false,
      message: '是必填欄位',
    },
  },
}

// 取得購物車列表
function getCarts() {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/carts`
  loading('run')
  axios
    .get(url)
    .then((res) => {
      carts = res.data.carts
      finalTotal = res.data.finalTotal
      loading()
      let list = ''
      carts.forEach((item) => {
        list += `<tr>
                  <td>${item.product.title}</td>
                  <td>${item.quantity}</td>
                  <td>NT $${toThousands(item.product.price)}</td>
                </tr>`
      })
      orderList.innerHTML = list
      total.textContent = toThousands(finalTotal)
    })
    .catch((error) => {
      console.log(error)
    })
}

// 送出購買訂單
function addOrder() {
  const url = `${baseUrl}/api/livejs/v1/customer/${apiPath}/orders`
  let data = {
    data: {
      user: {
        name: document.querySelector('#customerName').value.trim(),
        tel: document.querySelector('#customerPhone').value.trim(),
        email: document.querySelector('#customerEmail').value.trim(),
        address: document.querySelector('#customerAddress').value.trim(),
        payment: document.querySelector('#tradeWay').value.trim(),
        textarea: document.querySelector('#textarea').value.trim(),
      },
    },
  }
  loading('run')
  axios
    .post(url, data)
    .then((res) => {
      getCarts()
      form.reset()
      loading()
      Swal.fire({
        title: '感謝您的訂購',
        text: '即將回到首頁',
        icon: 'success',
        background: 'black',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
      })
      setTimeout(() => {
        window.location.href = './index.html'
      }, 2000)
    })
    .catch((error) => {
      console.log(error)
    })
}

// validate.js 驗證
function verification(e) {
  let error = validate(form, constraints)
  if (error) {
    showError(error)
  } else {
    addOrder()
  }
}

function showError(error) {
  message.forEach((item) => {
    item.textContent = ''
    item.textContent = error[item.dataset.msg]
  })
}

input.forEach((item) => {
  item.addEventListener('change', function (e) {
    e.preventDefault()
    let targetName = item.name
    let error = validate(form, constraints)
    item.nextElementSibling.textContent = ''
    if (error) {
      document.querySelector(`[data-msg = '${targetName}']`).textContent =
        error[targetName]
    }
  })
})
