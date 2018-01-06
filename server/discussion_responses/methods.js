/**
* Add new Response
* @function
* @name discussionResponse.insert
* @param { Object } data - Data
* @return {Boolean} true on success
*/
Meteor.methods({
  'discussionResponses.insert':function(data){
    // @todo : this
    check(data, {
      discussion_id: String,
      parent_id: String,
      text: String,
    });

    const actor = Meteor.user();

    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }else {

    }

    const author = {
      id: actor._id,
      username: actor.username,
      avatar: actor.profile.avatar.default
    }

    const discussionResponse = {
      discussion_id: data.discussion_id,
      parent_id: data.parent_id,
      text: data.text,
      author: author,
      created_at: new Date(),
      modified_at: null,
      visibility: true
    }


    const response_id = DiscussionResponses.insert(discussionResponse);


    if (response_id) {
      Discussions.update({_id: data.discussion_id}, {
        $addToSet: {
          subscribers: author,
          participants: author
        },
        $inc: {
          response_count: 1
        }
      });
    }

    // @todo : notify the participants/subscribers

    return true;

  }
});