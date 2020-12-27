# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Go to localhost:3000 on your browser, enjoy!

## How To Use TinyApp

#### Register/Login

Users must be logged in to create new links, view them, and edit them.

Just click Register on right top, put in your email and password, and you're good to go.

#### Create New Links

Either click Create a New Short Link in My URLs page, or Create New URL on navigation bar.

Then simply enter the long URL you want to shorten.

#### Edit or Delete Short Links

In My URLs, you can delete any link you want.

You can also click Edit, and then enter a new long URL to update your link. It will be the same short URL, but redirect to an updated long URL.

#### Use Your Short Link

The path to use any short link is /u/:shortLink. This will redirect you to the long URL.

You can also reach this by clicking edit on a link, and using the link corresponding to the short URL.

## Screenshot

### Login Page

!["Screenshot of Login Page"](https://github.com/ngunner15/tinyapp/blob/master/docs/login.png?raw=true)

### Registration Page

!["Screenshot of Register Page"](https://github.com/ngunner15/tinyapp/blob/master/docs/register.png?raw=true)

### URLs Page

!["Screenshot of URLs Page"](https://github.com/ngunner15/tinyapp/blob/master/docs/my_urls.png?raw=true)

### TinyURL Page

!["Screenshot of Create TinyURL Page"](https://github.com/ngunner15/tinyapp/blob/master/docs/tiny_url.png?raw=true)