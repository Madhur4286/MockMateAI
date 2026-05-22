export function getProfile(req, res) {
    res.status(200).json({
        user: req.user,
    });
}