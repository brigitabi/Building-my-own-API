const PORT = process.env.PORT || 8090
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')
const app = express()
const pug = require('pug')

const newspapers = [
    {
        name: 'TechCrunch', 
        address: 'https://techcrunch.com/tag/chatgpt/', 
        base: ''
    }, 
    {
        name: 'The Guardian',
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
        name: 'IndianExpress', 
        address: 'https://indianexpress.com/section/technology/', 
        base: ''
    }, 
    {
        name: 'BATimes', 
        address: 'https://www.batimes.com.ar/topics/technology', 
        base: ''
    }, 
    { 
        name: 'Vox', 
        address: 'https://www.vox.com/technology', 
        base: ''
    }, 
    {
        name: 'SuddeutscheZeitung', 
        address: 'https://www.sueddeutsche.de/thema/Chat_GPT', 
        base: ''
    }, 
    { 
        name: 'LeFigaro', 
        address: 'https://www.lefigaro.fr/tag/chatgpt', 
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

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.json('Welcome to my ChatGPT News API')
})

app.get('/news', (req, res) => { 
    res.render('home', {articles})
})

app.get('/news/:newspaperId', (req, res) => { 
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
                const date = $(this).closest('.fc-item').find('.fc-item__timestamp').text();
                specificArticles.push({ 
                    title, 
                    url: newspaperBase + url, 
                    date,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))