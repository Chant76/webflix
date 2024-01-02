import fetch from 'node-fetch';

export default (req, res) => {
   let nameMovie = "";
   let movies = [];
   if(req.query.nameMovie){
        nameMovie= req.query.nameMovie

        const url = `https://api.themoviedb.org/3/search/movie?query=${nameMovie}&include_adult=false&language=en-US&page=1`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZmI0NDUyYThmNTA1MGNmNTNjNGNhZGE0OWY1ZTAzNyIsInN1YiI6IjVhZTMwODNhMGUwYTI2MmE2NzAzNmZiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L6WAW12Akm4a0FlbTGqUWNNOGgdCTlWJKUbJVXc0hHs'
        }
        };

        fetch(url, options)
        .then(res => res.json())
        .then(json => json.results.map(movie => { return {tmdb_id: movie.id,vote_average: movie.vote_average, release_date: movie.release_date, title: movie.title, poster_path: movie.poster_path } }))
        .then(movies => {
            res.render('admin',{nameMovie, movies})
        })
        .catch(err => console.error('error:' + err));
    }else{
        res.render('admin',{
            nameMovie, movies
        })
    }
        
}