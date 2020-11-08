import image_api from '../config/image_api'

async function searchPhotos(keywords: string[]): Promise<any> {
  console.log('Requesting for', keywords)
  return new Promise(async (resolve, reject) => {
    if (!keywords) {
      resolve(null)
      return
    }
    try {
      const response = await fetch(image_api.url, {
        method: 'POST',
        body: JSON.stringify({ keywords: keywords }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      if (json.urls.length) {
        resolve(json)
      } else {
        resolve(null)
      }
    } catch (e) {
      reject(e)
    }
  })
}

export { searchPhotos }
