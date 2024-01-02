import { addMovie } from "../repository/MovieRepository.js";

import fetch from 'node-fetch';
export default (req, res) =>{
   if(req.params.id){

        const url = `https://api.themoviedb.org/3/movie/${req.params.id}?language=fr-FR`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NjAzOTI4MmY1OWMzMTZkNmZlYjcxNTU1NjRiNmYzOCIsInN1YiI6IjY1NzZlNzNhZTkzZTk1MjE5MDBjODhhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wYdQvaIXhNw5RD-MUUKJCgrCc-MFojTeizQtFHCjmU4'
              }
        };
        fetch(url, options)
        .then(res => res.json())
        .then(movie => {
            let saveMovie={
                tmdb_id:req.params.id,
                title: movie.title,
                release_date: movie.release_date,
                note: movie.vote_average,
                poster: movie.poster_path,
                user_id:1

            }
            addMovie(saveMovie);
        })
        .catch(err => console.error('error:' + err));
   }else{
    res.render('admin/movie',{movie})
   }
}





