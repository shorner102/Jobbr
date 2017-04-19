const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

let exportedMethods = {
    // This is a fun new syntax that was brought forth in ES6, where we can define
    // methods on an object with this shorthand!
    getUserById(id) {
        if (!id) 
            return Promise.reject("You must provide an id to search for");
        
        return users().then((userCollection) => {
            return userCollection.findOne({_id: id});
        });
    },
    addUser(name, email, username, password, location, skills, experience, field) {
      
        if (!name) 
            return Promise.reject("You must provide a name");
        if(!email)
            return Promise.reject("You must provide an email");
        if(!username)
            return Promise.reject("You must provide a username");
        if(!password)
            return Promise.reject("You must provide a password");
        if(!location)
            return Promise.reject("You must provide a location");
        if(!skills || !!Array.isArray(skills))
            return Promise.reject("You must provide an array of skills");
        if (!experience || !Array.isArray(experience)) 
            return Promise.reject("You must provide an array of experience");
        if(!field || !Array.isArray(field))
            return Promise.reject("You must provide an array of fields");
       
        
        return users().then((userCollection) => {
            let newUser = {
                name: name,
                email: email,
                username: username,
                password: password,
                location: location,
                skills: skills,
                experience: experience,
                field: field,
                likedPosts: []
            };

            return userCollection
                .insertOne(newUser)
                .then((newInsertInformation) => {
                    return newInsertInformation.insertedId;
                })
                .then((newId) => {
                    return this.getUserById(newId);
                });
        });
    },
    removeUser(id) {
        if (!id) 
            return Promise.reject("You must provide an id to search for");
        
        return users().then((userCollection) => {
            return userCollection
                .removeOne({_id: id})
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw(`Could not delete user with id of ${id}`)
                    }
                });
        });
    }
  ,
    addLikedPost(userId, postId) {
        if (!userId) 
            return Promise.reject("You must provide an user id to search for");
        if (!postId)
            return Promise.reject("You must provide an post id to add");
        
      return users.getUserById(userId).then((userWithLikedPost) =>{
        userWithLikedPost.likedPosts.push(postId);
        var u = {$set:userWithLikedPost};
        return userCollection.updateOne({ _id: userId }, u).then((result) => {
              return postId;
              });
        
      });
    }
}

module.exports = exportedMethods;