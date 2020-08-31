const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/allpost', requireLogin, (req,res)=>{
    Post.find()
    .populate("postedBy", "id name")  //used to get details of postedBy user like name id email password
    .populate("comments.postedBy","_id name")
    .sort('-createdAt') //use for latest post top method
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

//API to get subscribed post
router.get('/getsubpost', requireLogin, (req,res)=>{
    Post.find({postedBy:{$in:req.user.following}}) //like in python if postedBy in following
    .populate("postedBy", "id name")  //used to get details of postedBy user like name id email password
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.get('/allpost', requireLogin, (req,res)=>{
    Post.find()
    .populate("postedBy", "id name")  //used to get details of postedBy user like name id email password
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost', requireLogin, (req,res)=>{
    const {title,body,pic} = req.body
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please add title or body"})
    }
    req.user.password = undefined   //to make password invisible in the post credentials
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user   //when we request the information of user we will get is stored in req.user function
    })
    post.save().then(result=>{
        res.json({post: result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost', requireLogin, (req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like', requireLogin, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}   //person who liked the post
    },{
        new:true   //to display new updated record not the old one
    }).populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}   //person who liked the post
    },{
        new:true   //to display new updated record not the old one
    }).populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, (req,res)=>{
    const comment ={
        text:req.body.text,  // to take text from frontend
        postedBy: req.user  //taking userdata from requireLogin.js
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}   //person who liked the post
    },{
        new:true   //to display new updated record not the old one
    }).populate("comments.postedBy","_id name")
    .populate("postedBy", "_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId', requireLogin, (req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id")
    .exec((err,post)=>{
        if(err|| !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

router.delete("/deletecomment/:postId/:commentId", requireLogin, (req, res) => {
    const comment = { _id: req.params.commentId };
    Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: { comments: comment },
      },
      {
        new: true, 
      }
    ) .populate("postId")
      .populate("comments.postedBy","_id name")
      .populate("postedBy", "_id name ")
      .exec((err, result) => {
        if (err) {
          return res.status(422).json({ error: err })
        } else {
          res.json(result)
        }
      })
  })

module.exports = router