const User = require('../models/userMode')

const isLogin = async (req,res,next)=>{
 try { 
     if(req.session && req.session.user_id)
    {
        const userData = await User.findById({ _id:req.session.user_id})
        if(userData.isBlocked === 1)
        {
            const userDeActive = await User.findOneAndUpdate({_id:req.session.user_id},{$set:{isActive:0}})
           delete req.session.user_id
            res.redirect('/')
        }
        else{
            next()
        }
        
    }else
    {
        res.redirect('/login')
    }
    
}catch(error)
{
    console.log(error.message);
}
}

const isLogout = (req,res,next)=>{
    try { 
        if(req.session && req.session.user_id)
       {
         return res.redirect('/')
       }
       else {
        
        next()
       }
   
   }catch(error)
   {
       console.log(error.message);
   }
   }

   module.exports ={
    isLogin,
    isLogout,
   }