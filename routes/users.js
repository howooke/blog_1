const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../schemas/user")
const authMiddleware = require("../routes/auth-middleware")
const router = express.Router()
const Joi = require("joi")

const postUserSchema = Joi.object({
    nickname: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required(),
    confirmPassword: Joi.string().required()
})

//회원가입
router.post("/users", async (req, res)=> {
    try {
        const { nickname, password, confirmPassword } = await postUserSchema.validateAsync(req.body)
    
    
        if (password !== confirmPassword) {                                 //password랑 comfirmPassword가 같지 않으면 에러 출력
            res.status(400).send({
                errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다."
            })
            return
        }
    
        const existUsers = await User.find({nickname})
        if (existUsers.length) {
            res.status(400).send({                  //에러 메시지 ㄱ
                errorMessage: "중복된 닉네임입니다.",
            })
            return                                  //그리고 다시 돌아가
        }
    
        const user = new User({ nickname, password })        //없다면 , User를 생성하고 confirmPassword는 확인만 하는거니빼고
        await user.save()                                           // email, nickname, password 세개만 저장
    
        res.status(201).send({user})
        
    } catch (err) {
        console.log(err);
        res.status(400).send({
          errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
        });
    }
})


//로그인
router.post("/auth", async (req, res)=> {       //post메서드로 하는 이유는 로그인할 때 마다 마다 토큰을 생성하기때문
    const { nickname, password } = req.body

    const user = await User.findOne({ nickname, password }).exec()

    if (!user) {
        res.status(400).send({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요."
        })
        return
    }

    const token = jwt.sign({ userId: user.userId }, "whi-secret-key")
    res.send({
        token,
    })
})


//사용자 정보 조회
router.get("/users/me", authMiddleware , async (req, res)=> {
    const { user } = res.locals
    console.log(user)
    res.send({
        // user,
        user: {
            nickname: user.nickname,
        },
    })
})



module.exports = router

