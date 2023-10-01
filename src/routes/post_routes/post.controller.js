const { default: mongoose } = require('mongoose');
const PostModel = require('../../models/post');
const base_url = "http://localhost:3000/"

const createPost = async (req, res) => {
    try {
        const files = req.files

        const media = files.map((val, i) => {
            return {
                type: val.mimetype == "video/mp4" ? "video" : "image",
                url: base_url + val.filename
            }
        })
        req.body.media = media
        console.log(req.body)
        const result = await PostModel.create(req.body)
        res.send({
            data: result,
            status: true
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}

const allPosts = async (req, res) => {
    console.log("all post", req.query)

    const limit = parseInt(req.query.limit) || 10
    const page = parseInt(req.query.page) || 1
    const userId = req.query.userId

    const totalPosts = await PostModel.countDocuments({})
    console.log("totalPosts",totalPosts)

    const totalPages = Math.ceil(totalPosts/limit)
    const startIndex = (page - 1) * limit

        try {
            const result = await PostModel.aggregate([
                {
                    $lookup: {
                        from:"likes",
                        let: {postId: "$_id"},
                        pipeline: [
                            {
                            $match: {
                                $expr: {
                                    $and: [
                                        {$eq: ['$postId', '$$postId']},
                                        {$eq: ['$userId', new mongoose.Types.ObjectId(userId) ]}
                                    ]
                                },
                            },
                            },
                        ],
                        as: 'likes'
                    },
                },
                {
                    $addFields: {
                        isLike: {
                            $cond: {
                                if: { $gt: [{ $size: '$likes' }, 0] }, 
                                then: true,
                                else: false
                            }
                        }
                    }
                },
               {
                $project: {likes: 0}
               },
                {
                    $skip: startIndex,
                },
                {
                    $limit: limit,
                },
                {
                    $sort: {createdAt: -1},
                },
            ])
            res.send({
                data: result,
                status: true,
                totalPages: totalPages,
                page: page
            })
        } catch (error) {
            console.log("errorerror",error)
            res.status(403).json({status: false, error:error })
        }
}



module.exports = {
    createPost,
    allPosts
}