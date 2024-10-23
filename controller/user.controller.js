const User = require('../model/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'name, email, password를 모두 입력해주세요',
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ status: 'fail', message: '이미 가입한 유저입니다' });
    }
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hash });
    await newUser.save();
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'email, password를 모두 입력해주세요',
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = user.generateToken();
        return res.status(200).json({ status: 'success', user, token });
      }
      return res.status(400).json({
        status: 'fail',
        message: 'password가 일치하지 않습니다',
      });
    }
    return res.status(400).json({
      status: 'fail',
      message: 'email이 존재하지 않습니다',
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ status: 'fail', message: '유저가 존재하지 않습니다' });
    }
    res.status(200).json({ status: 'success', user });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

module.exports = userController;
