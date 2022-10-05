# To put in .env files

## Front-end

REACT_APP_API_URL = http://localhost:3001/api/v1

## Back-end

PORT = 3001
MONGO_URI = mongo atlas connection string/ local mongo
JWT_SECRET = your secret
JWT_EXPIRETIME = 12h

# Some todos.

## Front-End

- [ ] Separate toasts and create a general purpose toast with the following props: { Severity, ToastContent }
      this way its better and cleaner.
- [ ] Create a Toast instead of Alert in Comment when something goes wrong deleting a comment.
- [ ] Create a Toast instead of Alert after Updating Biography in Profile Page.
- [ ] Create a Toast after saving blogs instead of alert when something goes wrong.
- [ ] Discover Page, Where you can find and follow people.
- [ ] Profile Page where you can manage your data, see all saved blogs and your own blogs.

## Back-End

- [ ] Add Brief prop to User schema, where someone can talk about himself/herself briefly.
- [ ] Consider Adding Upvotes/Downvotes for Blogs, think of a way to add them/ do some research.
