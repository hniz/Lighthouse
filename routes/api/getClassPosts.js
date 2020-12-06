const e = require('express');
const { classes } = require('../../data/classes');
const Router = e.Router();

Router.get('/', async(req, res) => {
    const classId = req.body.id;
    try{
        const result = await classes.getClassById(classId);
        const { fetchedClass }  = result.class;
        if(fetchedClass.posts.length === 0){
            res.redirect('/dashboard'); //maybe an error message here of no posts available 
        }
        const allClassPosts = classes.getClassPosts(req.body.id);
        let postData = { postInfo: [ ] };
        allClassPosts.forEach(post =>{
            postData.postInfo.push({
                title: post.title,
                ids: post._id.str,
            });
        });
        res.render('display_class_posts', {
            data: postData,
        });

    } catch(e){
        res.status(e.statusCode).redirect('/dashboard');
    }
    

});

module.exports = Router;