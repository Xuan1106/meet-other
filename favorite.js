const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const userList = JSON.parse(localStorage.getItem('favoriteRegions')) || []

function renderUserList(data) {//渲染使用者卡片
  let rawHTML = ''
  data.forEach((item) => {
    //name,surname,avatar,
    //console.log(item)
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-3">
          <div class="card py-5 px-4">
            <img src="${item.avatar}" class="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm" alt="user avatar">
            <div class="card-body">
              <h5 class="card-title text-center">${item.name} ${item.surname}</h5>
              <div class="row justify-content-around">
                <button class="btn btn-danger bi bi-person-dash-fill btn-remove-favorite" data-id="${item.id}"> Remove</button>
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



function showInfoModal(id) {//使用者資訊modal
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

function removeFromFavorite(id) {
  if (!userList) return
  const userIndex = userList.findIndex((user) => user.id === id)
  if (userIndex === -1) return

  userList.splice(userIndex, 1)
  localStorage.setItem('favoriteRegions', JSON.stringify(userList))
  renderUserList(userList)
}


dataPanel.addEventListener('click', function ckickPanelInfo(event) {//點擊使用者資訊
  if (event.target.matches('.btn-show-info')) {
    showInfoModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})


renderUserList(userList)
