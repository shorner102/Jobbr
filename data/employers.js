const mongoCollections = require("../config/mongoCollections");
const employers = mongoCollections.employers;

let exportedMethods = {
    // This is a fun new syntax that was brought forth in ES6, where we can define
    // methods on an object with this shorthand!
    getEmployerById(id) {
        if (!id) 
            return Promise.reject("You must provide an id to search for");
        
        return employers().then((employerCollection) => {
            return employerCollection.findOne({_id: id});
        });
    },
    addEmployer(name, location, email, username, password, company) {
        if (!name) 
            return Promise.reject("You must provide a name");
        if(!location)
            return Promise.reject("You must provide a location");
        if(!email)
            return Promise.reject("You must provide an email");
        if(!username)
            return Promise.reject("You must provide a username");
        if(!password)
            return Promise.reject("You must provide a password");
        if(!company)
            return Promise.reject("You must provide a company");

        
        return employers().then((employerCollection) => {
            let newEmployer = {
                name: name,
                location: location,
                email: email,
                username: username,
                password: password,
                company: company,
                likedUsers: []
            };

            return employerCollection
                .insertOne(newEmployer)
                .then((newInsertInformation) => {
                    return newInsertInformation.insertedId;
                })
                .then((newId) => {
                    return this.getEmployerById(newId);
                });
        });
    },
    removeEmployer(id) {
        if (!id) 
            return Promise.reject("You must provide an id to search for");
        
        return employers().then((employerCollection) => {
            return employerCollection
                .removeOne({_id: id})
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw(`Could not delete employer with id of ${id}`)
                    }
                });
        });
    },
    addLikedUser(employerId, userId) {
        if (!employerId) 
            return Promise.reject("You must provide an employer id to search for");
        if (!userId)
            return Promise.reject("You must provide an user id to add");
        
      return employers.getEmployerById(employerId).then((employerWithLikedUser) =>{
        employerWithLikedUser.likedUsers.push(userId);
        var e = {$set:employerWithLikedUser};
        return employerCollection.updateOne({ _id: employerId }, e).then((result) => {
              return userId;
              });
        
      });
    }
}

module.exports = exportedMethods;