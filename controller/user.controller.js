const User = require('../model/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Error('이미 가입 됨');
    }
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hash });
    await newUser.save();
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'fail', err });
  }
};

userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      // 유저가 입력한 패스워드와 암호화된 패스워드를 비교해야함
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = user.generateToken();
        return res.status(200).json({ status: 'success', user, token });
      }
      throw new Error('아이디나 비밀번호가 일치하지 않음');
    }
  } catch (err) {
    res.status(400).json({ status: 'fail', err: err.message });
  }
};

module.exports = userController;
