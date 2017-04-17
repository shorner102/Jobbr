const mongoCollections = require("./mongoCollections");
const jobposts = mongoCollections.jobposts;
const employers = require("./employers");

let exportedMethods = {
    getPostById(id) {
        return jobposts().then((postCollection) => {
            return postCollection.findOne({ _id: id });
        });
    },
    addPost(title, description, skills, employerId) {
        return jobposts().then((postCollection) => {
            return employers.getEmployerById(employerId)
                .then((employerThatPosted) => {
                    let newJob = {
                        title: title,
                        description: description,
                        skills: skills,
                        poster: {
                            id: employerId,
                            name: employerThatPosted.name
                        }
                    };

                    return postCollection.insertOne(newJob).then((newInsertInformation) => {
                        return newInsertInformation.insertedId;
                    }).then((newId) => {
                        return this.getPostById(newId);
                    });
                });
        });
    },
    removePost(id) {
        return jobposts().then((postCollection) => {
            return postCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete post with id of ${id}`)
                }
            });
        });
    }
/*  ,
    updatePost(id, title, description, skills, employerId) {
        return jobposts().then((postCollection) => {
            return employers.getEmployerById(employerId)
                .then((employerThatPosted) => {
                    let updatedPost = {
                        title: title,
                        description: description,
                        skills: skills,
                        poster: {
                            id: employerId,
                            name: employerThatPosted.name
                        }
                    };

                    return postCollection.updateOne({ _id: id }, updatedPost).then((result) => {
                        return this.getPostById(id);
                    });

                });
        });
    }*/
}

module.exports = exportedMethods;