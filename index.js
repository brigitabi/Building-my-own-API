const PORT = 8090
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'TechCrunch', 
        address: 'https://techcrunch.com/tag/chatgpt/', 
        base: ''
    }, 
    {
        name: 'Guardian',
        address: 'https://www.theguardian.com/technology/chatgpt', 
        base: ''
    },
    {
        name: 'Wired', 
        address: 'https://www.wired.com/',
        base: ''
    }, 
    {
        name: 'The Verge', 
        address: 'https://www.theverge.com/',
        base: ''
    }, 
    {
        name: 'NewYorkTimes', 
        address: 'https://www.nytimes.com/', 
        base: ''
    }, 
    {
        name: 'TheEconomist',
        address: 'https://www.economist.com/', 
        base: ''
    },
    {
        name: 'MITTechnologyReview', 
        address: 'https://www.technologyreview.com/',
        base: ''
    }, 
    {
        name: 'The Verge', 
        address: 'https://www.theverge.com/',
        base: ''
    }
]

const articles = []

newspapers.forEach(newspaper => { 
    axios.get(newspaper.address)
        .then(response => { 
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("ChatGPT")', html).each(function () { 
                const title = $(this).text()
                const url = $(this).attr('href')
                const date = $(this).parent().find('.date').text();

                articles.push({ 
                    title, 
                    url: newspaper.base + url,
                    date,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my ChatGPT News API')
})

app.get('/news', (req, res) => { 
    res.json(articles)
})

app.get('/news/:newspaperId', async (req) => { 
    const newspaperId = req.params.newspaperId   

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
    
    axios.get(newspaperAddress)
        .then(response => { 
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("ChatGPT")', html).each(function () { 
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({ 
                    title, 
                    url: newspaperBase + url, 
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err = console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))