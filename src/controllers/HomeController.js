class HomeController {

    index (request, response) {
        response.render('home/layout')
    }

};

export default new HomeController();