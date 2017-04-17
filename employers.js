const mongoCollections = require("./mongoCollections");
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
                company: company
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
    }
/*  ,
    updateEmployer(id, name, breeds) {
        if (!id) 
            return Promise.reject("You must provide an id to search for");
        
        if (!breeds || !Array.isArray(breeds)) 
            return Promise.reject("You must provide an array of breeds");
        
        if (breeds.length === 0) 
            return Promise.reject("You must provide at least one breed.");
        
        return dogs().then((dogCollection) => {
            let updatedDog = {
                name: name,
                breeds: breeds
            };

            return dogCollection.updateOne({
                _id: id
            }, updatedDog).then(() => {
                return this.getDogById(id);
            });
        });
    }*/
}

module.exports = exportedMethods;