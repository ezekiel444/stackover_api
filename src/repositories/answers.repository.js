const Sequelize = require('sequelize');
const { responseHandler } = require('../helpers/responseHelpers');
const conditionalHelper = require('../helpers/conditionalHelper');
const { UsersModelSequelize, AnswersModelSequelize } = require('../models/sequelize');

exports.create = async (newAnswer, result) => {
  await AnswersModelSequelize.create({
    body: newAnswer.body,
    user_id: newAnswer.user_id,
    post_id: newAnswer.post_id,
  })
    .then((response) => {
      result(
        null,
        responseHandler(true, 200, 'Answer Added', response.id),
      );
    })
    .catch((error) => {
      console.log(error);
      result(responseHandler(false, 500, 'Some error occurred while adding the answer.', null), null);
    });
};

exports.remove = async (id, result) => {
  await AnswersModelSequelize.destroy({
    where: { id },
  })
    .then(() => {
      result(null, responseHandler(true, 200, 'Answer Removed', null));
    })
    .catch((error) => {
      console.log(error.message);
      result(responseHandler(false, 404, 'This answer doesn\'t exists', null), null);
    });
};

exports.retrieveAll = async (postId, result) => {
  const queryResult = await AnswersModelSequelize.findAll({
    where: {
      post_id: postId,
    },
    attributes: [
      'id',
      'user_id',
      'post_id',
      'body',
      'created_at',
      [Sequelize.literal('user.username'), 'username'],
      [Sequelize.literal('user.gravatar'), 'gravatar'],
    ],
    include: {
      model: UsersModelSequelize,
      attributes: [],
    },
  }).catch((error) => {
    console.log(error);
    return result(responseHandler(false, 500, 'Something went wrong!', null), null);
  });

  if (conditionalHelper.isArrayEmpty(queryResult)) {
    console.log('error: ', 'There are no answers');
    return result(responseHandler(false, 404, 'There are no answers', null), null);
  }

  return result(null, responseHandler(true, 200, 'Success', queryResult));
};