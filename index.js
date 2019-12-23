(function () {
  //new variable
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  const modeSelector = document.querySelector('#mode-condition')
  let modeCondition = 'cardMode'
  let nowPage = '1'
  let nowData = []
  axios.get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)
      //displayDataList(data)
      getTotalPages(data)
      getPageData(1, data)
      nowData = data
      // listen to data panel
      dataPanel.addEventListener('click', (event) => {
        if (event.target.matches('.btn-show-movie')) {
          showMovie(event.target.dataset.id)
        } else if (event.target.matches('.btn-add-favorite')) {
          console.log(event.target.dataset.id)
          addFavoriteItem(event.target.dataset.id)
        }
      })
    })
    .catch((err) => console.log(err))



  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')

  // listen to search form submit event

  searchForm.addEventListener('submit', event => {
    let results = []
    event.preventDefault()

    const regex = new RegExp(searchInput.value, 'i')


    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    getTotalPages(results)
    getPageData(1, results)
    nowData = results

  })
  let paginationData = []
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayData(pageData)
  }
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      // 記錄所轉換的頁數
      nowPage = event.target.dataset.page
      getPageData(event.target.dataset.page)
    }
  })
  function displayData(data) {
    let htmlContent;
    if (modeCondition === "cardMode") {
      htmlContent = displayDataList(data);

    } else if (modeCondition === "listMode") {
      htmlContent = cardDisplayPanel(data);

    }
    dataPanel.innerHTML = htmlContent;
  }
  modeSelector.addEventListener("click", function (e) {
    if (e.target.matches("#mode-card")) {
      modeCondition = "cardMode";
      // 轉換時以目前頁數進行轉換，而不是回到第1頁
      getPageData(nowPage, nowData);
    } else if (e.target.matches("#mode-list")) {
      modeCondition = "listMode";
      // 轉換時以目前頁數進行轉換，而不是回到第1頁
      getPageData(nowPage, nowData);

    }
  })
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
     <div class="col-sm-3">
       <div class="card mb-2">
         <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
         <div class="card-body movie-item-body">
          <h6 class="card-title">${item.title}</h6>
         </div>
            <!-- "More" button -->
         <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
         </div>
        </div>
      </div>
      
`
    })
    return htmlContent
  }
  function cardDisplayPanel(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
      
     <div class="container border-top py-3 ">
      <div class="row justify-content-between">
        <div class="col-8">
            <h6 class="title">${item.title}</h6>
        </div>
        <div class="col-4">
            <!-- "More" button -->
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <!-- favorite button -->
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
     </div>`
    })
    return htmlContent

  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] // []:如果沒有資料進來，以[]取代
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }


  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

})()