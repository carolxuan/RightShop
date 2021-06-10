import '../style/all.scss'
import 'bootstrap/dist/js/bootstrap.min.js'
import axios from 'axios'
import c3 from 'c3'
import Swal from 'sweetalert2'
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
const orderList = document.querySelector('.js-orderList')
const adminList = document.querySelector('.admin')

adminList.addEventListener('click', changeOrder)

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
      renderC3()
    })
    .catch((error) => {
      console.log(error)
    })
}

// 修改訂單狀態
function editOrderList(orderId, paidStatus) {
  let id = orderId
  let paid = paidStatus === '未處理' ? true : false
  const url = `${baseUrl}/api/livejs/v1/admin/${apiPath}/orders`
  const data = {
    data: {
      id: id,
      paid: paid,
    },
  }
  axios
    .put(url, data, config)
    .then((res) => {
      getOrders()
    })
    .catch((error) => {
      console.log(error)
    })
}

// 刪除特定訂單
function deleteItemOrder(orderId) {
  const url = `${baseUrl}/api/livejs/v1/admin/${apiPath}/orders/${orderId}`
  axios
    .delete(url, config)
    .then((res) => {
      getOrders()
      Toast.fire({
        title: `訂單刪除成功`,
        icon: 'success',
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

// 清除購物車內全部產品
function deleteAllOrder() {
  if (orders.length <= 0) {
    Toast.fire({
      title: `訂單已清空，請勿重複點擊！`,
      icon: 'warning',
    })
    return
  }
  const url = `${baseUrl}/api/livejs/v1/admin/${apiPath}/orders`
  axios
    .delete(url, config)
    .then((res) => {
      getOrders()
      Toast.fire({
        title: `刪除全部訂單成功`,
        icon: 'success',
      })
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
      str += `<tr class="tr-css">
                <td>${product.title}</td>
                <td>${product.quantity}</td>
                <td>${toThousands(product.quantity * product.price)}</td>
              </tr>`
      data.view = `<table class="table-css">
                      <thead>
                        <tr class="thead-tr-css">
                          <th>品項</th>
                          <th>數量</th>
                          <th>金額</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${str}
                        <tr class="tr-css">
                          <td class="fw-bold display-10">總金額</td>
                          <td></td>
                          <td class="fw-bold display-10">${toThousands(
                            item.total
                          )}</td>
                        </tr>
                      </tbody>
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
                    >${item.paid ? '已處理' : '未處理'}</a
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
                    data-action="deleteItem"
                    data-id="${item.id}"
                    >delete_forever</a
                  >
                </td>
              </tr>
              `
    })
  } else {
    list = `<tr><td colspan="10"><h4>目前沒有訂單</h4></td></tr>`
  }
  orderList.innerHTML = list
}

// 訂單狀態、刪除
function changeOrder(e) {
  const orderId = e.target.dataset.id
  let paidStatus = ''
  orders.forEach((item) => {
    if (item.id === orderId) {
      paidStatus = item.paid ? '已處理' : '未處理'
    }
  })
  if (e.target.dataset.action === 'paid') {
    editOrderList(orderId, paidStatus)
  } else if (e.target.dataset.action === 'deleteItem') {
    deleteItemOrder(orderId)
  } else if (e.target.dataset.action === 'deleteAll') {
    deleteAllOrder()
  }
}

// c3.js
function renderC3() {
  let productObj = {}
  let newData = []
  orders.forEach((item) => {
    item.products.forEach((productItem) => {
      if (productObj[productItem.title] === undefined) {
        productObj[productItem.title] = productItem.price * productItem.quantity
      } else {
        productObj[productItem.title] +=
          productItem.price * productItem.quantity
      }
    })
  })
  let objAry = Object.keys(productObj)
  objAry.forEach((item) => {
    let ary = []
    ary.push(item)
    ary.push(productObj[item])
    newData.push(ary)
  })
  let sortAry = newData.sort((a, b) => {
    return b[1] - a[1]
  })
  if (sortAry.length > 3) {
    let otherTotal = 0
    sortAry.forEach((item, idx) => {
      if (idx > 2) {
        otherTotal += sortAry[idx][1]
      }
    })
    sortAry.splice(3, sortAry.length - 1)
    sortAry.push(['其他', otherTotal])
  }
  let chart = c3.generate({
    bindto: '#chart',
    data: {
      type: 'donut',
      columns: sortAry,
    },
  })
}
