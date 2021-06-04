// menu 漢堡選單
const menuOpenBtn = document.querySelector('.menuToggle')
const linkBtn = document.querySelectorAll('.topBar-menu a')
const menu = document.querySelector('.topBar-menu')
const menuCloseBtn = document.querySelector('.closeToggle')
menuOpenBtn.addEventListener('click', menuToggle)

linkBtn.forEach((item) => {
  item.addEventListener('click', closeMenu)
})

function menuToggle(e) {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu')
  } else {
    menu.classList.add('openMenu')
  }
}

menuOpenBtn.addEventListener('click', function () {
  this.classList.toggle('is-opened')
})

function closeMenu() {
  menu.classList.remove('openMenu')
  menuOpenBtn.classList.remove('is-opened')
}
