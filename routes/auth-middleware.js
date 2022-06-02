const jwt = require("jsonwebtoken")
const User = require("../schemas/user")

module.exports = (req, res, next)=> {
    const { authorization } = req.headers           //HTTP 헤더 중에 authorization이 있는데 그걸 불러오고 (브라우저에 토큰값을 주려고)
    const [tokenType, tokenValue] = authorization.split(' ')    //그래서 로그인을 하면 router.post("/auth" 에서 토큰값을 jwt.sign 해서 브라우저에 넣는다.
                                                    //jwt.sign으로 암호화된 값이 tokenType과 tokenValue로 되고 그걸 split" "공백으로 2개로 나눈다.
    if (tokenType !== "Bearer") {                   //tokenType인 Bearer가 아니면 에러메시지 ㄱ
        res.status(401).send({
            errorMessage: "로그인이 필요합니다."
        })
        return
    }

    try {
        const { userId } = jwt.verify(tokenValue, "whi-secret-key") //tokenValue랑 시크릿키를 jwt 검증을 해서 userId로 대입해보고

        User.findById(userId).exec().then((user)=> {    //db에 userId를 실행해서 user가 res.locals.user = user면 진행
            res.locals.user = user      //res.locals.user 라는 객체에 jwt.verify(검증된) user 값을 넣어놓고 편하게 locals.user만 불러와 사용할것임)
            next()                  //즉 locals.user는 jwt검증이 되있는것, 불러다 쓰기만 하면됨.
        })
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다."
        })
        return
    }

}