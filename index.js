const express = require('express');
const path = require('path');
request = require('request')
const rp    = require('request-promise');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const apiKey = "&apikey=f5ee992e";
const apiUrl = "http://www.omdbapi.com/?s=";
const apiId = 'https://www.omdbapi.com/?i=';

app.get('/',(req,res)=>{
    res.render('index')
});

app.get('/results', (req,res)=>{
    var searchElement = apiUrl+req.query.movie+apiKey;
    var movieDetails = [];
    var results;
    rp(searchElement)
    .then((body)=>{
        results = JSON.parse(body);
        if(results['Response']=='True'){
            for(let i=0; i< results['Search'].length; i++){
                rp(apiId+results['Search'][i]['imdbID']+apiKey)
                    .then(data => {
                        movieDetails.push(JSON.parse(data));
                        if(movieDetails.length === results['Search'].length){
                            res.render('movie',{results: results, keyword: req.query.movie, movieDetails: movieDetails});
                        }
                    })
            }
        }
        else{
            res.render('movie',{results: results, keyword: req.query.movie, movieDetails: movieDetails});
        }
    })
    .catch((err)=>{
        try{
            var displayError = JSON.parse(err['error']);
            console.log(displayError['Error']);
            res.render('movie',{results: {'Response': 'False', 'Error': displayError['Error']}, keyword: req.query.movie});
        }
        catch{
            console.log('Something went wrong');
        }
    });
});







app.listen(3000, ()=>{
    console.log("Listening on port 3000")
})

