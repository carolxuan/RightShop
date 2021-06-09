import '../style/all.scss'
import Swal from 'sweetalert2'

// Swal
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  background: 'black',
  showConfirmButton: false,
  timer: 2500,
})

const signBtn = document.querySelector('.sign-btn')
const exampleInputEmail = document.querySelector('#exampleInputEmail')
const exampleInputPassword = document.querySelector('#exampleInputPassword')
const signForm = document.querySelector('.sign-form')
signBtn.addEventListener('click', sign)

function sign() {
  const email = 'good123@gmail.com'
  const password = '123456'
  const inputEmail = exampleInputEmail.value
  const inputPassword = exampleInputPassword.value
  if (inputEmail === email && inputPassword === password) {
    Swal.fire({
      title: '登入成功',
      text: '即將跳轉到後台',
      icon: 'success',
      background: 'black',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2000,
    })
    signForm.reset()
    setTimeout(() => {
      window.location.href = './admin.html'
    }, 2000)
  } else {
    Swal.fire({
      text: '請依照提示登入後台哦!',
      icon: 'error',
      background: 'black',
      timer: 2000,
    })
  }
}
