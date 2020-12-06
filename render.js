export const handlePostButtonPress = async function () {
  let tweetBody = $("textarea[name = tweetBody]").val();

  const result = await axios({
    method: "post",
    url: "https://comp426-1fa20.cs.unc.edu/a09/tweets",
    withCredentials: true,
    data: {
      body: `${tweetBody}`,
    },
  });

  let html = ``;

  if (result.request.status === 201) {
    html += `
    <div class="field" id="newTweetButton">
      <label class="label has-text-white">Tweet successful! Refresh to view.</label>
      <p class="control">
        <button class="button is-link" type="button">
          New Tweet
        </button>
      </p>
    </div>
    `;
  } else {
    html += `
    <div class="field" id="newTweetButton">
      <label class="label has-text-white">Tweet failed. Please try again.</label>
      <p class="control">
        <button class="button is-link" type="button">
          New Tweet
        </button>
      </p>
    </div>
    `;
  }

  $(`#newTweetTextArea`).replaceWith(html);
};

export const handleCancelButtonPress = async function () {
  let html = `
  <div class="field" id="newTweetButton">
    <p class="control">
      <button class="button is-link" type="button">
        New Tweet
      </button>
    </p>
  </div>
  `;

  $(`#newTweetTextArea`).replaceWith(html);
};

export const handleDeleteButtonPress = async function (event) {
  let tweetId = event.currentTarget.dataset.id;
  console.log(event);

  const result = await axios({
    method: "delete",
    url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetId}`,
    withCredentials: true,
  });

  let html = ``;

  if (result.request.status === 204) {
    html += `<p class="has-text-white">Tweet deleted successfully.</p>`;
  } else {
    html += `<p class="has-text-white">Failed to delete tweet. Please try again. <br></p>`;
  }

  $(`#${tweetId}`).replaceWith(html);
};

export const handleEditButtonPress = async function (event) {
  let tweetId = event.currentTarget.dataset.id;
  // grab specified tweet to pass to renderEditableTweet()
  const result = await axios({
    method: "get",
    url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetId}`,
    withCredentials: true,
  });

  let edittableTweet = renderEditableTweet(result.data);

  $(`#${tweetId}`).replaceWith(edittableTweet);
};

export const handleSaveButtonPress = async function (event) {
  let tweetId = event.currentTarget.dataset.id;
  let tweetBody = $("textarea[name = editBody]").val();
  //send updated tweet to server
  const result = await axios({
    method: "put",
    url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetId}`,
    withCredentials: true,
    data: {
      body: `${tweetBody}`,
    },
  });

  let html = ``;

  if (result.request.status === 200) {
    html += renderPersonalTweet(result.data);
  } else {
    html += "<p>Failed to update. Please refresh and try again.</p>";
  }

  $(`#${tweetId}`).replaceWith(html);
};

export const handleReplyButtonPress = async function (event) {
  let parentId = event.currentTarget.dataset.id;

  const parentTweet = await axios({
    method: "get",
    url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${parentId}`,
    withCredentials: true,
  });

  let replyForm = renderReplyForm(parentTweet.data);

  $(`#${parentId}`).replaceWith(replyForm);
};

export const handleReplyPostButtonPress = async function (event) {
  let parentId = event.currentTarget.dataset.id;
  let parentAuthor = event.currentTarget.dataset.author;
  let replyBody = $("textarea[name = replyBody]").val();

  const result = await axios({
    method: "post",
    url: "https://comp426-1fa20.cs.unc.edu/a09/tweets",
    withCredentials: true,
    data: {
      type: "reply",
      parent: parentId,
      body: `@${parentAuthor} ${replyBody}`,
    },
  });

  let html = ``;

  if (result.request.status === 201) {
    html += `<p id="replyFormArea">Reply successful!</p>`;
  } else {
    html += `<p id="replyFormArea">Reply failed. Please refresh and try again.</p>`;
  }

  $(`#replyForm`).replaceWith(html);
};

export const handleRetweetButtonPress = async function (event) {
  let parentId = event.currentTarget.dataset.id;

  const parentTweet = await axios({
    method: "get",
    url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${parentId}`,
    withCredentials: true,
  });

  let retweetForm = renderRetweetForm(parentTweet.data);

  $(`#${parentId}`).replaceWith(retweetForm);
};

export const handleRetweetPostButtonPress = async function (event) {
  let parentId = event.currentTarget.dataset.id;
  let parentAuthor = event.currentTarget.dataset.author;
  let parentBody = event.currentTarget.dataset.body;
  let retweetBody = $("textarea[name = retweetBody]").val();

  const result = await axios({
    method: "post",
    url: "https://comp426-1fa20.cs.unc.edu/a09/tweets",
    withCredentials: true,
    data: {
      type: "retweet",
      parent: parentId,
      body: `${retweetBody} <br> <strong>Retweeted @${parentAuthor}</strong> ${parentBody}`,
    },
  });

  let html = ``;

  if (result.request.status === 201) {
    html += `<p id="retweetFormArea">Retweet successful! Refresh to view it in the feed.</p>`;
  } else {
    html += `<p id="retweetFormArea">Retweet failed. Please refresh and try again.</p>`;
  }

  $(`#retweetForm`).replaceWith(html);
};

export const handleUnlikeButtonPress = async function (event) {
  let tweetId = event.currentTarget.dataset.id;

  // update using api feature
  let result = await axios({
    method: "put",
    url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetId}/unlike`,
    withCredentials: true,
  });
  // grab updated tweet
  result = await axios({
    method: "get",
    url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetId}`,
    withCredentials: true,
  });

  // render new tweet
  let newTweet = renderTweet(result.data);

  // uses div id to grab old tweet html
  let oldTweet = $(`#${tweetId}`);

  //replace old tweet html with new tweet html
  oldTweet.replaceWith(newTweet);
};

export const handleLikeButtonPress = async function (event) {
  let tweetId = event.currentTarget.dataset.id;

  // update using like api feature
  let result = await axios({
    method: "put",
    url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetId}/like`,
    withCredentials: true,
  });
  // grab updated tweet
  result = await axios({
    method: "get",
    url: `https://comp426-1fa20.cs.unc.edu/a09/tweets/${tweetId}`,
    withCredentials: true,
  });

  // render new tweet
  let newTweet = renderTweet(result.data);

  // uses div id to grab old tweet html
  let oldTweet = $(`#${tweetId}`);

  //replace old tweet html with new tweet html
  oldTweet.replaceWith(newTweet);
};

export const handleNewTweetButtonPress = function () {
  let html = `
  <div id="newTweetTextArea">
    <div class="field">
      <label class="label">New Tweet</label>
      <div class="control">
        <textarea class="textarea" placeholder="What's on your mind?" rows=1 name="tweetBody"></textarea>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <a class="button is-link is-small" id="postButton">
         Post
        </a>
        <a class="button is-light is-small" id="cancelButton">
          Cancel
        </a>
      </div>
    </div>
  </div>
  `;

  $(`#newTweetButton`).replaceWith(html);
};

export const renderNewsFeed = async function () {
  const result = await axios({
    method: "get",
    url: "https://comp426-1fa20.cs.unc.edu/a09/tweets",
    withCredentials: true,
  });

  let html = "";
  for (let i = 0; i < result.data.length; i++) {
    // check for personal tweet
    if (result.data[i].isMine === true) {
      html += renderPersonalTweet(result.data[i]);
    } else {
      html += renderTweet(result.data[i]);
    }
  }

  return html;
};

export const renderTweet = function (tweet) {
  let date = new Date(tweet.createdAt);

  let html = `
  <div class="box" id="${tweet.id}">
  <article class="media">
    <div class="media-content">
      <div class="content">
        <p>
          <strong>${tweet.author}</strong> <small>${date}</small>
          <br>
          ${tweet.body}         
        </p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item" aria-label="reply" id="replyButton" data-id="${tweet.id}">
            <span class="icon is-medium">
              <i class="fas fa-reply" aria-hidden="true"></i>
            </span>
          </a>
          <a class="level-item" aria-label="retweet" id="retweetButton" data-id="${tweet.id}">
            <span class="icon is-medium">
              <i class="fas fa-retweet" aria-hidden="true"></i>
            </span>
            <p>${tweet.retweetCount}</p>
          </a>
          `;

  if (!tweet.isLiked) {
    html += `
              <a class="level-item" aria-label="like" id="likeButton" data-id="${tweet.id}" data-is-liked="${tweet.isLiked}">
                <span class="icon is-medium">
                 <i class="fas fa-heart" aria-hidden="true"></i>
                </span>
                <p>${tweet.likeCount}</p>
              </a>
            </div>
          </nav>
        </div>
      </article>
      <div id="replyFormArea">
      </div>
      <div id="retweetFormArea">
      </div>
    </div>`;
  } else {
    html += `
              <a class="level-item" aria-label="like" id="unlikeButton" data-id="${tweet.id}" data-is-liked="${tweet.isLiked}">
                <span class="icon is-medium has-text-danger">
                  <i class="fas fa-heart" aria-hidden="true"></i>
                </span>
                <p>${tweet.likeCount}</p>
              </a>
            </div>
          </nav>
        </div>
      </article>
      <div id="replyFormArea">
      </div>
      <div id="retweetFormArea">
      </div>
    </div>`;
  }

  return html;
};

export const renderPersonalTweet = function (tweet) {
  let date = new Date(tweet.createdAt);

  let html = `
  <div class="box" id="${tweet.id}">
  <article class="media">
    <div class="media-content">
      <div class="content">
        <p>
          <strong>${tweet.author}</strong> <small>${date}</small>
          <br>
          ${tweet.body}         
        </p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item" aria-label="reply" id="replyButton" data-id="${tweet.id}">
            <span class="icon is-medium">
              <i class="fas fa-reply" aria-hidden="true"></i>
            </span>
          </a>
          <a class="level-item" aria-label="retweet" id="retweetButton" data-id="${tweet.id}">
            <span class="icon is-medium">
              <i class="fas fa-retweet" aria-hidden="true"></i>
            </span>
            <p>${tweet.retweetCount}</p>
          </a>
          <a class="level-item" aria-label="like" id="ownTeetLikeButton" data-id="${tweet.id}" data-is-liked="${tweet.isLiked}">
                <span class="icon is-medium">
                 <i class="fas fa-heart has-text-grey-lighter" aria-hidden="true"></i>
                </span>
                <p>${tweet.likeCount}</p>
              </a>
            </div>
          </nav>
        </div>
        <div class="media-right">
          <p class="buttons">
            <a class="level-item" aria-label="edit" id="editButton" data-id="${tweet.id}">
              <span class="icon is-medium">
                <i class="far fa-edit" aria-hidden="true"></i>
              </span>
            </a>
            <a class="level-item" aria-label="trash" id="deleteButton" data-id="${tweet.id}">
              <span class="icon is-medium">
                <i class="far fa-trash-alt has-text-danger" aria-hidden="true"></i>
              </span>
            </a>
          </p>
        </div>
      </article>
      <div id="replyFormArea">
        </div>
      <div id="retweetFormArea">
        </div>
    </div>`;

  return html;
};

export const renderEditableTweet = function (tweet) {
  let date = new Date(tweet.createdAt);

  let html = `
  <div class="box" id="${tweet.id}">
  <article class="media">
    <div class="media-content">
      <div class="content">
        <p>
          <strong>${tweet.author}</strong> <small>${date}</small>
        <br>
        <textarea class="textarea" name="editBody">${tweet.body}</textarea>
    </p>
      </div>
    </div>
        <div class="media-right">
            <a class="level-item" aria-label="edit" id="saveButton" data-id="${tweet.id}">
              <span class="icon is-medium">
                <i class="far fa-save" aria-hidden="true"></i>
              </span>
            </a>
        </div>
      </article>
    </div>`;

  return html;
};

export const renderReplyForm = function (parentTweet) {
  let date = new Date(parentTweet.createdAt);

  let html = `
  <div class="box" id="${parentTweet.id}">
  <article class="media">
    <div class="media-content">
      <div class="content">
        <p>
          <strong>${parentTweet.author}</strong> <small>${date}</small>
          <br>
          ${parentTweet.body}         
        </p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item" aria-label="reply" id="replyButton" data-id="${parentTweet.id}">
            <span class="icon is-medium">
              <i class="fas fa-reply" aria-hidden="true"></i>
            </span>
          </a>
          <a class="level-item" aria-label="retweet" id="retweetButton" data-id="${parentTweet.id}">
            <span class="icon is-medium">
              <i class="fas fa-retweet" aria-hidden="true"></i>
            </span>
            <p>${parentTweet.retweetCount}</p>
          </a>
          `;

  if (!parentTweet.isLiked) {
    html += `
              <a class="level-item" aria-label="like" id="likeButton" data-id="${parentTweet.id}" data-is-liked="${parentTweet.isLiked}">
                <span class="icon is-medium">
                 <i class="fas fa-heart" aria-hidden="true"></i>
                </span>
                <p>${parentTweet.likeCount}</p>
              </a>
            </div>
          </nav>
        </div>
      </article>
      <div id="replyForm">
  <div class="field">
    <div class="control">
      <textarea class="textarea is-small" placeholder="Reply to @${parentTweet.author}" rows=1 name="replyBody"></textarea>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <a class="button is-link is-small" id="replyPostButton" data-id="${parentTweet.id}" data-author="${parentTweet.author}">
       Post Reply
      </a>  
    </div>
  </div>
</div>
    </div>`;
  } else {
    html += `
              <a class="level-item" aria-label="like" id="unlikeButton" data-id="${parentTweet.id}" data-is-liked="${parentTweet.isLiked}">
                <span class="icon is-medium has-text-danger">
                  <i class="fas fa-heart" aria-hidden="true"></i>
                </span>
                <p>${parentTweet.likeCount}</p>
              </a>
            </div>
          </nav>
        </div>
      </article>
      <div id="replyForm">
  <div class="field">
    <div class="control">
      <textarea class="textarea is-small" placeholder="Reply to @${parentTweet.author}" rows=1 name="replyBody"></textarea>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <a class="button is-link is-small" id="replyPostButton" data-id="${parentTweet.id}" data-author="${parentTweet.author}">
       Post Reply
      </a>  
    </div>
  </div>
</div>
    </div>`;
  }

  return html;
};

export const renderRetweetForm = function (parentTweet) {
  let tweet = {
    id: parentTweet.id,
    type: parentTweet.type,
    body: parentTweet.body,
    author: parentTweet.author,
    parentId: parentTweet.parentId,
    isMine: parentTweet.isMine,
    isLiked: parentTweet.isLiked,
    retweetCount: parentTweet.retweetCount,
    replyCount: parentTweet.replyCount,
    likeCount: parentTweet.likeCount,
    someLikes: parentTweet.someLikes,
    replies: parentTweet.replies,
    createdAt: parentTweet.createdAt,
    updatedAt: parentTweet.updatedAt,
  };

  let date = new Date(parentTweet.createdAt);

  let html = `
  <div class="box" id="${parentTweet.id}">
  <article class="media">
    <div class="media-content">
      <div class="content">
        <p>
          <strong>${parentTweet.author}</strong> <small>${date}</small>
          <br>
          ${parentTweet.body}         
        </p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item" aria-label="reply" id="replyButton" data-id="${parentTweet.id}">
            <span class="icon is-medium">
              <i class="fas fa-reply" aria-hidden="true"></i>
            </span>
          </a>
          <a class="level-item" aria-label="retweet" id="retweetButton" data-id="${parentTweet.id}">
            <span class="icon is-medium">
              <i class="fas fa-retweet" aria-hidden="true"></i>
            </span>
            <p>${parentTweet.retweetCount}</p>
          </a>
          `;

  if (!parentTweet.isLiked) {
    html += `
              <a class="level-item" aria-label="like" id="likeButton" data-id="${parentTweet.id}" data-is-liked="${parentTweet.isLiked}">
                <span class="icon is-medium">
                 <i class="fas fa-heart" aria-hidden="true"></i>
                </span>
                <p>${parentTweet.likeCount}</p>
              </a>
            </div>
          </nav>
        </div>
      </article>
      <div id="retweetForm">
  <div class="field">
    <div class="control">
      <textarea class="textarea is-small" placeholder="What's on your mind?" rows=1 name="retweetBody"></textarea>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <a class="button is-link is-small" id="retweetPostButton" data-id="${parentTweet.id}" data-author="${parentTweet.author}" data-body="${parentTweet.body}">
       Post Retweet
      </a>  
    </div>
  </div>
</div>
    </div>`;
  } else {
    html += `
              <a class="level-item" aria-label="like" id="unlikeButton" data-id="${parentTweet.id}" data-is-liked="${parentTweet.isLiked}">
                <span class="icon is-medium has-text-danger">
                  <i class="fas fa-heart" aria-hidden="true"></i>
                </span>
                <p>${parentTweet.likeCount}</p>
              </a>
            </div>
          </nav>
        </div>
      </article>
      <div id="retweetForm">
  <div class="field">
    <div class="control">
      <textarea class="textarea is-small" placeholder="What's on your mind?" rows=1 name="retweetBody"></textarea>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <a class="button is-link is-small" id="retweetPostButton" data-id="${parentTweet.id}" data-author="${parentTweet.author}" data-body="${parentTweet.body}">
       Post Retweet
      </a>  
    </div>
  </div>
</div>
    </div>`;
  }

  return html;
};

export const loadTwitterIntoDOM = async function () {
  const $root = $("#root");
  const $newTweet = $("#newTweet");

  let twitterFeed = await renderNewsFeed();

  $root.append(twitterFeed);

  $root.on("click", "#likeButton", handleLikeButtonPress);
  $root.on("click", "#unlikeButton", handleUnlikeButtonPress);

  $root.on("click", "#editButton", handleEditButtonPress);
  $root.on("click", "#saveButton", handleSaveButtonPress);
  $root.on("click", "#deleteButton", handleDeleteButtonPress);

  $root.on("click", "#replyButton", handleReplyButtonPress);
  $root.on("click", "#replyPostButton", handleReplyPostButtonPress);

  $root.on("click", "#retweetButton", handleRetweetButtonPress);
  $root.on("click", "#retweetPostButton", handleRetweetPostButtonPress);

  $newTweet.on("click", "#newTweetButton", handleNewTweetButtonPress);
  $newTweet.on("click", "#postButton", handlePostButtonPress);
  $newTweet.on("click", "#cancelButton", handleCancelButtonPress);
};

$(function () {
  loadTwitterIntoDOM();
});
