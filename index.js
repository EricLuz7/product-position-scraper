const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
const urlencodedparser = bodyParser.urlencoded({ extended: false });

// Function to perform scraping based on keyword, page number, and items per page
async function scrapeAmazon(keyword, page = 1, itemsPerPage = 10) {
    try {
        const response = await axios.get(`https://www.amazon.com/s?k=${keyword}&page=${page}`, {
            headers: {
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                Host: 'www.amazon.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            },
        });

        const $ = cheerio.load(response.data);

        let titles = [];
        $('h2 a span').each((index, element) => {
            titles.push($(element).text());
        });

        let ratings = [];
        $('i span').each((index, element) => {
            ratings.push($(element).text());
        });

        let numberOfReviews = [];
        $('span.a-size-base.s-underline-text').each((index, element) => {
            numberOfReviews.push($(element).text());
        });

        const produtos = [];

        for (let i = 0; i < titles.length; i++) {
            try {
                const produto = {
                    title: titles[i],
                    ratings: ratings[i],
                    numberOfReviews: numberOfReviews[i],
                };
                produtos.push(produto);
            } catch (error) {
                console.log(error, "Algo deu errado no scraping");
            }
        }

        return produtos;
    } catch (error) {
        console.error(error);
        throw new Error('Erro no scraping');
    }
}

// GET route to use the scraper based on a keyword and page range
// GET route to use the scraper based on a keyword and page range
app.get('/api/scraper', urlencodedparser, async (req, res) => {
    const keyword = req.query.keyword;
    const itemsPerPage = 10; // You can adjust this based on your needs

    try {
        const allProducts = [];

        // Scrape data from pages 1 to 5
        for (let page = 1; page <= 5; page++) {
            const pageProducts = await scrapeAmazon(keyword, page, itemsPerPage);
            allProducts.push(...pageProducts);
        }

        const totalPages = Math.ceil(allProducts.length / itemsPerPage);

        res.render('results', { produtos: allProducts, currentPage: 1, totalPages, keyword });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no scraping');
    }
});


// Runs the server
app.listen(3000, () => {
    console.log('Servidor rodando');
});
