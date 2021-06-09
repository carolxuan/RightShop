import '../style/all.scss'
import 'bootstrap/dist/js/bootstrap.min.js'
import axios from 'axios'
import c3 from 'c3'
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

// 顯示 c3
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
    type: 'pie',
    columns: [
      ['data1', 30, 200, 100, 400, 150, 250],
      ['data2', 50, 20, 10, 40, 15, 25],
    ],
  },
})

// DOM
const orderList = document.querySelector('.js-orderList')

// API Data
let orders = []

// 初始
function init() {
  getOrders()
}
init()

// 取得訂單列表
function getOrders() {
  const url = `${baseUrl}/api/livejs/v1/admin/${apiPath}/orders`
  loading('run')
  axios
    .get(url, config)
    .then((res) => {
      orders = res.data.orders
      loading()
      orderDataProcess()
      // renderOrders()
    })
    .catch((error) => {
      console.log(error)
    })
}

// 訂單數據處理
function orderDataProcess() {
  const newOrderData = []
  const data = {}
  orders.forEach((item) => {
    let str = ''
    const time = new Date(item.createdAt * 1000)
    data.newCreatedAt = `${time.getFullYear()}/${
      time.getMonth() + 1
    }/${time.getDate()} `
    item.products.forEach((product) => {
      str += `<tr>
                <td>${product.title}</td>
                <td>${product.quantity}</td>
                <td>${product.quantity * product.price}</td>
              </tr>`
      data.view = `<table>
                      <thead>
                        <tr>
                          <th>品項</th>
                          <th>數量</th>
                          <th>金額</th>
                        </tr>
                      </thead>
                      <tbody>${str}</tbody>
                    </table>`
    })
    newOrderData.push({ ...item, ...data })
  })
  renderOrder(newOrderData)
}

// 渲染訂單
function renderOrder(newOrderData) {
  let list = ''
  if (newOrderData.length > 0) {
    newOrderData.forEach((item, idx) => {
      list += `<tr>
                <td>${item.id}</td>
                <td>
                  <p>${item.user.name}</p>
                  <p>${item.user.tel}</p>
                </td>
                <td>${item.user.address}</td>
                <td>${item.user.email}</td>
                <td>${item.newCreatedAt}</td>
                <td>${item.user.textarea}</td>
                <td class="order-status">
                  <a
                    href="javascript:void(0);"
                    data-id="${item.id}"
                    class="${item.paid ? 'Processed' : 'Untreated'}"
                    data-action="paid"
                    >未處理</a
                  >
                </td>
                <td>
                  <span data-bs-toggle="modal" data-bs-target="#exampleModal${
                    idx + 1
                  }">
                    <a
                    href="javascript:void(0);"
                    class="material-icons"
                    style="font-size: 28px"
                    >visibility</a
                  >
                  </span>
                  <!-- Modal -->
                  <div class="modal fade" id="exampleModal${
                    idx + 1
                  }" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">訂單項目</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          ${item.view}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <a
                    href="javascript:void(0);"
                    class="material-icons"
                    style="font-size: 28px"
                    >delete_forever</a
                  >
                </td>
              </tr>
              `
    })
  } else {
    list = `<tr><td>目前沒有訂單</td></tr>`
  }
  orderList.innerHTML = list
}
