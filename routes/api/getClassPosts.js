const e = require('express');
const classes = require('../../data/classes');
const Router = e.Router();

Router.get('/', async(req, res) => {
    const classId = req.query.id;
    try{
        const result = await classes.getClassById(classId);
        if(result.error){
            res.status(result.statusCode).render('partials/class_not_found', { layout: null });
        }
        const fetchedClass = result.class;
        if(fetchedClass.posts.length === 0){
            res.send('<p> No posts for this class found.</p>'); //maybe an error message here of no posts available 
        }
        const { classPosts } = await classes.getClassPosts(req.body.id);
        let postData = { postInfo: [ ] };
        console.log(classPosts);
        classPosts.forEach(post =>{
            postData.postInfo.push({
                title: post.title,
                ids: post._id.str,
            });
        });
        res.render('display_class_posts', {
            data: postData,
        });

    } catch(e){
        console.log(e);
        res.status(500).send('<p> Sorry, there was an error fetching the class posts.</p>');
    }
    

});

module.exports = Router;