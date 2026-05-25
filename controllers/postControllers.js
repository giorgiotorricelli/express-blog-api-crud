import { response } from "express";
import posts from "../data/posts.js";

function multipleTagsSearch(stricts, flexibles, response){
            if (stricts.length > 1 && flexibles.length > 1) { //nel caso l'utente inserisca ',' e '||' insieme
                response.status(400).json({
                    message: `Non puoi utilizzare strict mode e flexible mode insieme`
                });
                return resp;
            }
            if (stricts.length > 1) {
                const tagSearch = posts.filter(post => {
                    const tagsLower = post.tags.map(tag => {
                        return tag.toLowerCase();
                    })
                    return stricts.every(element => {
                        return tagsLower.includes(element)
                    });
                });
                response.status(200).json({
                    message: `Ecco la lista dei post contenenti OGNI tag inserito (strict mode)`,
                    posts: tagSearch
                });
            } else if (flexibles.length > 1) {
                const tagSearch = posts.filter(post => {
                    const tagsLower = post.tags.map(tag => {
                        return tag.toLowerCase();
                    })
                    return flexibles.some(element => {
                        return tagsLower.includes(element)
                    });
                });
                response.status(200).json({
                    message: `Ecco la lista dei post contenenti ALMENO UNO dei tag inseriti (flexible mode)`,
                    posts: tagSearch
                });
            }
}

function index(request, response) {


    if (request.query.tags !== undefined) {

        const multipleTagsStrict = request.query.tags.split(',').map(element => {
            return element.trim();
        });
        const multipleTagsFlexible = request.query.tags.split('||').map(element => {
            return element.trim();
        });


        if (multipleTagsStrict.length === 1 && multipleTagsFlexible.length === 1) {
            const tagSearch = posts.filter(post => {
                const tagsLower = post.tags.map(tag => {
                    return tag.toLowerCase();
                })
                return tagsLower.includes(request.query.tags);
            });
            response.status(200).json({
                message: "Ecco la lista dei post contenenti il tag",
                posts: tagSearch
            });
        } else {
            multipleTagsSearch(multipleTagsStrict, multipleTagsFlexible, response);
            return;
        }

        if (request.query.sort_quicker !== undefined) {
            const sortQuick = posts.toSorted(function (a, b) { return a.prep_time - b.prep_time });

            response.status(200).json({
                message: "Ecco la lista dei post in ordine di prep time (dal più veloce)",
                posts: sortQuick
            });
            return;

        }

        if (request.query.sort_slower !== undefined) {
            const sortSlow = posts.toSorted(function (a, b) { return b.prep_time - a.prep_time });

            response.status(200).json({
                message: "Ecco la lista dei post in ordine di prep time (dal più dispendioso)",
                posts: sortSlow
            });
            return;

        }

        if (request.query.published !== undefined) {
            if (request.query.published === 'true') {
                const pubFiltered = posts.filter(post => {
                    return post.published === true;
                });
                response.status(200).json({
                    message: "Ecco la lista dei post pubblicati",
                    posts: pubFiltered
                });
            } else if (request.query.published === 'false') {
                const pubFiltered = posts.filter(post => {
                    return post.published === false;
                });
                response.status(200).json({
                    message: "Ecco la lista dei post non pubblicati",
                    posts: pubFiltered
                });
            } else {
                response.status(400).json({
                    message: "Il valore di published deve essere un booleano"
                });
            }
            return;
        }


        const generalQuery = { ...request.query };

        function isVuoto(obj) {
            return Object.keys(obj).length === 0;
        }



        if (isVuoto(generalQuery)) {
            response.status(400).json({
                message: "Attenzione, stai inserendo una query vuota"
            });
            return;
        }

        for (let i in generalQuery) {
            if (generalQuery[i] === '') {
                response.status(400).json({
                    message: "Valore della query errato"
                });
                return;
            }
        }


        response.status(200).json({
            message: "Ecco la lista dei post",
            posts: posts
        });
    }
}

function show(request, response) {
    const id = request.params.id;
    const realId = Number(id);

    const searchedPost = posts.find(post => {
        return post.id === realId;
    })

    if (searchedPost) {
        response.status(200).json({
            message: "Ecco il post che cercavi",
            post: searchedPost
        })
    } else {
        response.status(404).json({
            message: "Id non presente o non valido"
        })
    }

}

function create(request, response) {
    console.log(request.body);
    
    response.status(201).json({
        message: "Stai provando a creare dei dati",
        dati: request.body 
    });
}

function update(request, response) {
    const id = request.params.id;
    const realId = Number(id.trim());



    if (isNaN(realId)) {
        response.status(400).json({
            message: `L'id deve avere un valore numerico`
        });
        return;
    }

    if (!realId) {
        response.status(400).json({
            message: `L'id non può essere nè zero nè vuoto`,
            id: realId
        });
        return;
    }

    if (realId < 0) {
        response.status(400).json({
            message: `L'id non può essere minore di 0`
        });
        return;
    }

    const searchedPost = posts.find(post => {
        return post.id === realId;
    })

    if (!searchedPost) {
        response.status(404).json({
            message: `Id: ${realId} non trovato`
        });
        return;
    }

    response.status(200).json({
        message: `post con id ${realId} updatato`
    })
}

function modify(request, response) {
    const id = request.params.id;
    const realId = Number(id.trim());



    if (isNaN(realId)) {
        response.status(400).json({
            message: `L'id deve avere un valore numerico`
        });
        return;
    }

    if (!realId) {
        response.status(400).json({
            message: `L'id non può essere nè zero nè vuoto`,
            id: realId
        });
        return;
    }

    if (realId < 0) {
        response.status(400).json({
            message: `L'id non può essere minore di 0`
        });
        return;
    }

    const searchedPost = posts.find(post => {
        return post.id === realId;
    })

    if (!searchedPost) {
        response.status(404).json({
            message: `Id: ${realId} non trovato`
        });
        return;
    }

    response.status(200).json({
        message: `post con id ${realId} modificato`
    })
}

function destroy(request, response) {
    const id = request.params.id;
    const realId = Number(id.trim());



    if (isNaN(realId)) {
        response.status(400).json({
            message: `L'id deve avere un valore numerico`
        });
        return;
    }

    if (!realId) {
        response.status(400).json({
            message: `L'id non può essere nè zero nè vuoto`,
            id: realId
        });
        return;
    }

    if (realId < 0) {
        response.status(400).json({
            message: `L'id non può essere minore di 0`
        });
        return;
    }

    const searchedPost = posts.find(post => {
        return post.id === realId;
    })

    if (!searchedPost) {
        response.status(404).json({
            message: `Id: ${realId} non trovato`
        });
        return;
    }

    const deletingId = posts.indexOf(searchedPost);

    posts.splice(deletingId, 1);


    response.status(200).json({
        message: `post con id ${realId} eliminato`
    })

    console.log(posts);

}



export { index, show, create, update, modify, destroy }