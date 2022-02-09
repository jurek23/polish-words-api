const PORT = process.env.PORT || 3000

const express = require('express')
const fs = require('fs');

const getAllFiles = require('get-all-files');
const app = express()

// let asyncModule = require('./async-module');

const ADJECTIVES_PER_LENGTH = new Map()
const NOUNS_PER_LENGTH = new Map()
const VERBS_PER_LENGTH = new Map()
const OTHERS_PER_LENGTH = new Map()

function getRandomWordWithLengthGeneral(length, response) {
    let allMaps = [NOUNS_PER_LENGTH, ADJECTIVES_PER_LENGTH, VERBS_PER_LENGTH, OTHERS_PER_LENGTH]

    let filtered = allMaps.filter(coll => coll.has(length));

    if (filtered.length === 0) {
        response.status(400).send('[HTTP 400] Have no words with length ' + length)
        return
    }

    let collection = filtered[Math.floor(Math.random() * (filtered.length - 1))]
    let wordsByLength = collection.get(length)
    const responseData = {
        word: collection.get(length)[Math.floor(Math.random() * (wordsByLength.length - 1))]
    }
    let totalCount = 0
    filtered.forEach(coll => {
        totalCount += coll.get(length).length
    })
    response.setHeader('X-Total-Count', totalCount - filtered.length)
    response.type('application/json').end(JSON.stringify(responseData))
}

function getRandomWordWithLength(length, type, response) {
    if ('general' === type) {
        getRandomWordWithLengthGeneral(length, response)
        return
    }

    let collection = obtainCollection(type)
    if (!collection.has(length))
        response.status(400).send('[HTTP 400] Have no word of type ' + type + ' with length ' + length)

    let wordsByLength = collection.get(length)
    const responseData = {
        word: collection.get(length)[Math.floor(Math.random() * (wordsByLength.length - 1))]
    }
    response.setHeader('X-Total-Count', wordsByLength.length - 1)
    response.type('application/json').end(JSON.stringify(responseData))
}

function obtainCollection(type) {
    switch (type) {
        case 'noun' :
            return NOUNS_PER_LENGTH
        case 'verb' :
            return VERBS_PER_LENGTH
        case 'adjective' :
            return ADJECTIVES_PER_LENGTH
        case 'other' :
            return OTHERS_PER_LENGTH
        default :
            console.log('Have no words with type ' + type)
    }

    return undefined;
}

function handleAllCategories(word, response) {
    let wordLength = word.length.toString()
    let valid = false
    let allMaps = [NOUNS_PER_LENGTH, ADJECTIVES_PER_LENGTH, VERBS_PER_LENGTH, OTHERS_PER_LENGTH]

    if (!allMaps.find(coll => coll.has(wordLength))) {
        response.status(400).send('[HTTP 400] Have no words with length ' + wordLength)
        return
    }

    allMaps.find(coll => {
        if (coll.has(wordLength)) {
            if (coll.get(wordLength).includes(word))
                valid = true
        }
    })

    response.status(valid ? 200 : 404).send()
}

function validateWord(word, type, response) {
    if ('general' === type) {
        handleAllCategories(word, response)
        return
    }

    let wordLength = word.length.toString()

    let collection = obtainCollection(type)
    if (!collection.has(wordLength))
        response.status(400).send('[HTTP 400] Have no word of type ' + type + ' with length ' + length)

    if (!collection.has(wordLength)) {
        response.status(404).send()
        return
    }
    response.status(collection.get(wordLength).includes(word) ? 200 : 404).send()
}

app.get('/noun/random/:length', function (req, res) {
    getRandomWordWithLength(req.params.length, 'noun', res)

    // asyncModule(req.params.length.toString()).then(r => {
    //     console.log('asynchronously got word ' + r)
    //     res.type('application/json').json('content: ' + r)
    // })
})

app.get('/noun/check/:word', function (req, res) {
    validateWord(req.params.word, 'noun', res)
})

app.get('/adjective/random/:length', function (req, res) {
    getRandomWordWithLength(req.params.length, 'adjective', res)
})

app.get('/adjective/check/:word', function (req, res) {
    validateWord(req.params.word, 'adjective', res)
})

app.get('/verb/random/:length', function (req, res) {
    getRandomWordWithLength(req.params.length, 'verb', res)
})

app.get('/verb/check/:word', function (req, res) {
    validateWord(req.params.word, 'verb', res)
})

app.get('/other/random/:length', function (req, res) {
    getRandomWordWithLength(req.params.length, 'other', res)
})

app.get('/other/check/:word', function (req, res) {
    validateWord(req.params.word, 'other', res)
})

app.get('/word/random/:length', function (req, res) {
    getRandomWordWithLength(req.params.length, 'general', res)
})

app.get('/word/check/:word', function (req, res) {
    validateWord(req.params.word, 'general', res)
})

function init() {
    const allWordsFileNames = getAllFiles.getAllFilesSync(`resources/`).toArray()
    allWordsFileNames.forEach(fn => {
        //locally \ in path, on heroku / in path...
        let type = fn.substring(fn.indexOf('type-') + 5, fn.lastIndexOf('-list'))
        let letters = fn.substring(fn.lastIndexOf('-list') + 6, fn.indexOf('-letters'))
        let fileContent = fs.readFileSync(fn)
        switch (type) {
            case 'others' : {
                OTHERS_PER_LENGTH.set(letters, fileContent.toString().split('\n'))
                break
            }
            case 'adjectives' : {
                ADJECTIVES_PER_LENGTH.set(letters, fileContent.toString().split('\n'))
                break
            }
            case 'nouns' : {
                NOUNS_PER_LENGTH.set(letters, fileContent.toString().split('\n'))
                break
            }
            case 'verbs' : {
                VERBS_PER_LENGTH.set(letters, fileContent.toString().split('\n'))
                break
            }
        }
    })
    console.log('memory used ', process.memoryUsage().heapUsed / 1024 / 1024)
    console.log('server running on port ', PORT)
}

app.listen(PORT, () => init())

