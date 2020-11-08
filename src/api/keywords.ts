import config from '../config/algorithms'

async function extractKeywords(text: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fetch(config.algos.extractKeyword, {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(json => {
        if (json.keywords.length) {
          resolve(json.keywords)
        } else {
          resolve(null)
        }
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

export { extractKeywords }
