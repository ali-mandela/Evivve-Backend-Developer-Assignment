const notFound = (req,res,next)=>{
    const error = new Error (`NOT FOUND - ${req.orignalUrl}`)
    res.status(400);
    next(error)
};

module.exports = {notFound};