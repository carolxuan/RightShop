import '../style/all.scss'
import '../js/layout.js'
import axios from 'axios'
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'
import Swal from 'sweetalert2'
import { Pagination, Autoplay } from 'swiper/swiper.esm.js'
Swiper.use([Pagination, Autoplay])

// Swal
const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  background: 'black',
  showConfirmButton: false,
  timer: 2500,
})

// swiper
const swiper = new Swiper('.swiper-container', {
  slidesPerView: 'auto',
  spaceBetween: 30,
  autoplay: {
    delay: 1500,
  },
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
})

// 訂閱項目
const inputText = document.querySelector('#emailInput')
const subscribeBtn = document.querySelector('.subscribe-btn')
const reg =
  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
subscribeBtn.addEventListener('click', () => {
  if (inputText.value === '') {
    Toast.fire({
      title: `請輸入信箱`,
      icon: 'warning',
    })
  } else {
    if (reg.test(inputText.value)) {
      Toast.fire({
        title: `訂閱成功`,
        icon: 'success',
      })
      inputText.value = ''
    } else {
      Toast.fire({
        title: `信箱格式錯誤`,
        icon: 'error',
      })
    }
  }
})
