import '../style/all.scss'
import '../js/layout.js'
import axios from 'axios'
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'
import { Pagination, Autoplay } from 'swiper/swiper.esm.js'
Swiper.use([Pagination, Autoplay])

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
