const get = (req, res) => {
    console.log(req.body);
return res.status(200).render('chat');
};
module.exports = {
    get,
};