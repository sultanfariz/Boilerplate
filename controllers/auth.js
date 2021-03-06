const User = require('../models/User');
const { isEmpty, response, hashPassword } = require('../helpers/bcrypt');
const { NotFoundError, WrongPasswordError } = require('../exceptions');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  register: async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password);

      const createdUser = await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword
      });

      const token = jwt.sign({ username: createdUser.username }, process.env.JWT_SECRET);

      res.cookie('token', token, { httpOnly: true });
      return response(res, {
        code: 201,
        success: true,
        message: 'Register successfuly!',
        content: {
          user: createdUser,
          token
        }
      });
    } catch (error) {
      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong!',
        content: error
      });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({
        $or: [
          {
            username
          },
          {
            email: username
          }
        ]
      });

      if (isEmpty(user)) throw new NotFoundError("Username or email doesn't exists!");

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) throw new WrongPasswordError('Your password not match with our records!');

      // create new jwt token
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
      // store the token in user browser cookie
      res.cookie('token', token, { httpOnly: true });
      return response(res, {
        code: 200,
        success: true,
        message: 'Login successfuly!',
        content: {
          user,
          token
        }
      });
    } catch (error) {
      if (error.name === 'NotFoundError' || error.name === 'WrongPasswordError') {
        return response(res, {
          code: 400,
          success: false,
          message: error.message
        });
      }

      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong',
        content: error
      });
    }
  },
  
  // logout user by deleting browser cookie
  logout: async (req, res) => {
    res.status(202).clearCookie('token');
    return response(res, {
      code: 202,
      success: true,
      message: 'Cookie has been cleared',
      content: null,
    });
  },
};
