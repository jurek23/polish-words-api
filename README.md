# polish-words-api
An API to provide random Polish word from one of 4 types (noun, verb, adjective and other)
and to validate if a word exists in a dictionary. Dictionary used to obtain all the words
available is https://sjp.pl/slownik/en/

## To run this project

You can run this project on your local machine. Just pull it down and do the following:

```bash
npm i
```

1. Run the command above to install all the packages

### Start the Project

2. Now run the server:

```bash
npm run start
```

3. Use on of the endpoints available
   1. [/word/random/:length](http://localhost:3000/word/random/:length)
      1. gets word with no category selected - randomly from all the categories with words of specified length
   2. [/word/check/:word](http://localhost:3000/word/check/:word)
      1. checks if word exists in any of category doctionaries
   3. [/noun/random/:length](http://localhost:3000/noun/random/:length)
   4. [/noun/check/:word](http://localhost:3000/noun/check/:word)
   5. [/verb/random/:length](http://localhost:3000/verb/random/:length)
   6. [/verb/check/:word](http://localhost:3000/verb/check/:word)
   7. [/adjective/random/:length](http://localhost:3000/adjective/random/:length)
   8. [/adjective/check/:word](http://localhost:3000/adjective/check/:word)
   9. [/other/random/:length](http://localhost:3000/other/random/:length)
   10. [/other/check/:word](http://localhost:3000/other/check/:word)

where **:length** is the length of word to get (from 3 to 30+ - longest Polish adjective is 33 letters long)
<br/> and **:word** is a word to validate against the dictionary

Example GET /noun/random/5 response:
```
{
  "word": "akson"
}
```
Response of GET /*/random word contains X-Total-Count header with a number of all words for a category and length

**HTTP 404** response for /*/check endpoint means word doesn't exist in application dictionary<br/>
**HTTP 200** means it does exists

## MIT Licence

Copyright (c) 2022 Michal Swoboda

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*Translation: Of course you can use this for you project! Just make sure to say where you got this from :)

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


