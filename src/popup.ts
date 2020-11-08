import * as $ from 'jquery'
import * as Masonry from 'masonry-layout'
import * as imagesLoaded from 'imagesloaded'
import { extractKeywords } from './api/keywords'
import { searchPhotos } from './api/image'

function notify(msg: string = 'Something went wrong, try again!'): void {
  $('.logger').empty().show().append(`<span class="logText">${msg}</span>`)
}

function load(): void {
  $('.container').hide()
  $('.logger').empty().show().append(`<img class="loader"
         width="75px"
         src="./assets/icons/arrow-repeat.svg" />`)
}

function hideLogger(): void {
  $('.logger').hide()
}

function createChips(words: string[]): void {
  if (!words.length) {
    notify('Please highlight some text')
    return
  }
  $('.header').empty()
  $('<span>Keywords</span>')
    .css({
      color: '#666666',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      fontSize: '12px',
      paddingRight: '5px',
      fontWeight: 'bold',
    })
    .appendTo('.header')
  words.forEach(word => {
    $(`<span class="chip">${word}</span>`).appendTo('.header')
  })

  $(
    `<div class="sup-alt"><a target="_blank"
    href="https://www.patreon.com/ramsri"><img src="./assets/img/logo_patreon.png"></a><a target="_blank"
    href="https://buymeacoffee.com/ramsri"><img src="./assets/img/logo_bmac.png" /></a></div>`
  ).appendTo('.header')
}

function previewImage(photo: any): void {
  if (!photo) return
  let controls = $(`<div class="controls"></div>`)
  let goBackEl = $(`<span class="go-back">&lt; BACK</span>`)
  let downloadEl = $(`<span class="download">DOWNLOAD</span>`)
  let credits = $(
    `<span class="credits">Photo by ${photo.user} on ${photo.source}</span>`
  )

  $(downloadEl).on('click', function () {
    chrome.downloads.download({ url: photo.large })
  })

  $(goBackEl).on('click', function () {
    $('.preview').hide()
    $('.search-container, .header, .content').show()
    $(controls).remove()
  })

  $(controls).append(goBackEl, downloadEl)
  $('.preview .preview-box').empty()
  $('.header, .content, .search-container').hide()
  $('.preview').prepend(controls)
  $('.preview').show()
  $(`<img class="original" src='${photo.large}' />`).appendTo(
    '.preview .preview-box'
  )
  $('.preview .preview-box').append(credits)
}

function updatePhotos(photoSet: any): void {
  console.log(photoSet)
  $('.content').empty()
  $('.content').hide()
  $(
    `<div>Images from <a target="_blank" href="${photoSet.urls[0].sourceurl}">${photoSet.urls[0].source}</a></div>`
  )
    .css({
      textAlign: 'center',
      fontSize: '0.9em',
      color: '#787878',
      fontStyle: 'italic',
      paddingBottom: '4px',
    })
    .appendTo('.content')

  let gridLayout = $(`<div class="grid"></div>`)
  photoSet.urls.forEach(photo => {
    $(`<div class="grid-item"><img src="${photo.small}" /></div>`)
      .on('click', () => {
        previewImage(photo)
      })
      .appendTo(gridLayout)
  })
  $('.content').append(gridLayout)
}

async function getKeywords(text: string): Promise<string[] | null> {
  return new Promise((resolve, reject) => {
    if (text.split(' ').length === 1) {
      resolve([text])
      return
    }
    extractKeywords(text)
      .then(result => {
        resolve(result)
      })
      .catch(err => reject(err))
  })
}

async function fetchImages(): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('textSelection', async ({ textSelection }) => {
      if (!textSelection) {
        notify('Please highlight some text')
        return
      }

      let keywords: string[] | null = await getKeywords(textSelection)
      if (!keywords) {
        notify('No relevant keywords found, try again!')
        return
      }

      const searchTerms = keywords.slice(
        0,
        keywords.length > 3 ? 3 : keywords.length
      )

      createChips(searchTerms)
      searchPhotos(searchTerms)
        .then(photos => {
          if (photos) {
            $('.support, .aiartist').remove()
            updatePhotos(photos)
            imagesLoaded(document.querySelector('.content'), () => {
              $('.content').show()
              new Masonry('.grid', {
                gutter: 3,
                columnWidth: 3
              })
              resolve()
            })
          } else {
            notify('No relevant images found, try again!')
            resolve()
          }
        })
        .catch(err => reject(err))
    })
  })
}

function init(): void {
  fetchImages()
    .then(() => {
      hideLogger()
      $('.preview').hide()
      $('.container').show('slow')
      chrome.storage.local.set({
        textSelection: null,
      })
    })
    .catch(err => {
      notify('Something went wrong, please try again!')
      console.log(err)
    })
}

function registerCustomPhrase(): void {
  const keywords = $('.search-tags').val().toString()
  if (keywords) {
    chrome.storage.local.set({
      textSelection: keywords,
    })
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  $('.search-btn').on('click', e => {
    e.preventDefault()
    registerCustomPhrase()
  })

  $('.search-tags').on('keyup', e => {
    if (e.key === 'Enter') {
      registerCustomPhrase()
    }
  })

  load()
  init()

  chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === 'local') {
      if (changes.textSelection.newValue) {
        load()
        init()
      }
    }
  })
})
