const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
app.set('view engine', 'ejs')

const bodyParser = require('body-parser')
const urlencodedparser = bodyParser.urlencoded({ extended: false })

// Sets a home page for the default route
app.get('/', (req, res) => {
    res.render('index')
})

// GET route to use the scraper based on a keyword
app.get('/api/scraper', urlencodedparser, async (req, res) => {
    const keyword = req.query.keyword
    const asin = req.query.asin

    try {
        const products = []

        for (let page = 1; page <= 5; page++) {
            const response = await axios.get(`https://www.amazon.com/s?k=${keyword}&page=${page}`, {
                headers: {
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    Host: 'www.amazon.com',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
                },
            })

            const $ = cheerio.load(response.data)

            // Sets an array for each one of the info wanted
            let asins = []
            $('div[data-asin]').each((index, element) => {
                const dataAsin = $(element).attr('data-asin')
                if (dataAsin) {
                    asins.push(dataAsin)
                }
            })

            let titles = []
            $('h2 a span').each((index, element) => {
                titles.push($(element).text())
            })

            let ratings = []
            $('i span').each((index, element) => {
                ratings.push($(element).text())
            })

            let numberOfReviews = []
            $('span.a-size-base.s-underline-text').each((index, element) => {
                numberOfReviews.push($(element).text())
            })

            // Fills the product array for the current page
            for (let i = 0; i < titles.length; i++) {
                try {
                    const product = {
                        page: page,
                        index: i + 1,
                        asin: asins[i],
                        title: titles[i],
                        ratings: ratings[i],
                        numberOfReviews: numberOfReviews[i],
                    }
                    products.push(product)
                } catch (error) {
                    console.log(error, "Something went wrong with the scraping")
                }
            }
        }

        const targetIndex = products.findIndex(product => product.asin === asin)

        if (targetIndex !== -1) {
            res.json({ products, targetIndex })
            console.log(`The product with the ASIN ${asin} is in the ${targetIndex} position`)
        } else {
            res.json({ products })
            console.log(`The product with the ASIN ${asin} wasn't found in the pages 1 to 5`)
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Error in the scraping')
    }
})

// Runs the server
app.listen(3000, () => {
    console.log('Server running')
})
