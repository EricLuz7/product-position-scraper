# Search Position Web Scraping App

A simple [Amazon](https://amazon.com/) search position web scraping application using Node.js, Express, Axios, Cheerio and Body-parser.

## Setup

Make sure you have [Node.js](https://nodejs.org/) installed
  
1. Clone the repository:

    ```bash
    git clone https://github.com/EricLuz7/product-position-scraper.git
    ```

2. Navigate to the project folder:

    ```bash
    cd product-position-scraper
    ```

3. Install dependencies:

    ```bash
    npm install express axios cheerio nodemon body-parser
    npm init
    ```

## Running the App

Run the following command to start the server:

```bash
node index.js
```
Open your browser and go to http://localhost:3000 to access the app.

# How to use
1. Enter a search keyword and an ASIN in the input fields on the home page.
2. Click the "Send" button.
3. The results will be displayed on the page.
4. If you want to search again just repeat the process.

# Dependencies 
[Express](https://expressjs.com/)
[Axios](https://axios-http.com/)
[Cheerio](https://cheerio.js.org/)
[Body-parser](https://www.npmjs.com/package/body-parser)

# Note 
The scraping results are not guaranteed to be 100% reliable.

# License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT)

