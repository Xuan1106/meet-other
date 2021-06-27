const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const USERLIST_PER_PAGE = 16

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

const userList = [] //使用者清單
let filterRegion = []//查詢地區儲存

//渲染使用者卡片
function renderUserList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    //name,surname,avatar,
    //console.log(item)
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-3">
          <div class="card py-5 px-4">
            <img src="${item.avatar}" class="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"  id="avatar" data-id="${item.id}" data-toggle="modal" data-target="#info-modal"alt="user avatar">
            <div class="card-body">
              <h4 class="card-title text-center">${item.name} ${item.surname}</h4>
              <p class="region text-center">region:${item.region}</p>
              <div class="row justify-content-around">
                <button class="btn btn-danger bi bi-person-plus-fill btn-add-favorite" data-id="${item.id}"> Favorite</button>
              <button class="btn btn-secondary bi bi-info-circle-fill  btn-show-info" data-toggle="modal" data-target="#info-modal" data-id="${item.id}"> info</button>
              </div>
              </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

//計算頁數
function getUserlistByPage(page) {
  const data = filterRegion.length ? filterRegion : userList
  const startIndex = (page - 1) * USERLIST_PER_PAGE
  return data.slice(startIndex, startIndex + USERLIST_PER_PAGE)
}

//render分頁器
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERLIST_PER_PAGE)
  let raw = ''
  for (let page = 1; page <= numberOfPages; page++) {
    raw += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = raw
}

//使用者資訊modal
function showInfoModal(id) {
  const modalTitle = document.querySelector('#info-modal-title')
  const modalBody = document.querySelector('#info-modal-body')

  axios.get(INDEX_URL + id).then(response => {
    //console.log(response)
    const data = response.data
    modalTitle.innerText = `${data.name} ${data.surname}`
    modalBody.innerHTML = `
      <div class="row">
           <div class="col-sm-4" id="info-modal-image">
             <img src="${data.avatar}" alt="avatar" class="image rounded-circle ">
           </div>
           <div class="col-sm-8">
             <p id="info-modal-age">Age: ${data.age}</p>
             <p id="info-modal-birthday">Birthday: ${data.birthday}</p>
             <p id="info-modal-email">Email: ${data.email}</p>
             <p id="info-modal-region">region: ${data.region}</p>
           </div>
         </div>
    `
  })
}

//最愛
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteRegions')) || []
  const user = userList.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('此用戶已加到最愛')
  }
  list.push(user)
  localStorage.setItem('favoriteRegions', JSON.stringify(list))
}

//點擊使用者資訊
dataPanel.addEventListener('click', function ckickPanelInfo(event) {
  if (event.target.matches('.btn-show-info') || event.target.matches('#avatar')) {
    showInfoModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//分頁器
paginator.addEventListener('click', function paginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUserlistByPage(page))
})

//搜尋功能
searchForm.addEventListener('submit', function searchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toUpperCase()

  filterRegion = userList.filter(user =>
    user.region.toUpperCase().includes(keyword))
  if (filterRegion.length === 0) {
    return alert(`您輸入的關鍵字${keyword}，沒有符合的結果`)
  }
  renderPaginator(filterRegion.length)
  renderUserList(getUserlistByPage(1))
})


axios.get(INDEX_URL).then((response) => {
  const result = response.data.results
  // console.log(result)
  userList.push(...result)
  renderPaginator(userList.length)
  renderUserList(getUserlistByPage(1))
})
