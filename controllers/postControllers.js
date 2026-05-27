import { response } from "express";
import rawPosts from "../data/posts.js";


function multipleTagsSearch(stricts, flexibles, posts, response) {
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
    const posts = rawPosts.map(post => {
        const { id, created_at, published, ...rest } = post;
        return rest;
    });


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
            multipleTagsSearch(multipleTagsStrict, multipleTagsFlexible, posts, response);
            return;
        }
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

    /* if (request.query.published !== undefined) {
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
    } */
    console.log(request.query);


    const generalQuery = { ...request.query };

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

function showAndDeleteValidation(request, response) {
    const posts = rawPosts.map(post => {
        const { id, created_at, published, ...rest } = post;
        return rest;
    });
    const slug = (request.params.slug).trim();

    const searchedPost = posts.find(post => {
        return post.slug === slug;
    });
    

    return { searchedPost };
}


function show(request, response) {
    const { searchedPost } = showAndDeleteValidation(request, response);
    

    if (searchedPost) {
        response.status(200).json({
            message: "Ecco il post che cercavi",
            post: searchedPost
        })
    } else {
        response.status(404).json({
            message: "Post non trovato"
        })
    }

}

function createAndUpdateValidation(request, response) {
    const { id, created_at, published, slug, ...rest } = rawPosts[0]; //mi serve l'oggetto senza slug per la validazione
    const validImgFormats = ["jpg", "jpeg", "png", "webp", "gif", "svg", "tif", "tiff"];


    for (let prop in request.body) { //se si inserisce una proprietà non valida
        if (rest.hasOwnProperty(prop)) {

            continue;
        } else {
            response.status(400).json({
                message: `Non puoi inserire '${prop}' come proprietà`
            });
            return;
        }
    }

    if (Object.keys(request.body).length !== Object.keys(rest).length) { //se non ci sono tutte le proprietà
        response.status(400).json({
            message: `Mancano una o più proprietà`
        });
        return;
    }



    const splittedImgUrl = request.body.image.split('.');

    if (!validImgFormats.includes(splittedImgUrl[splittedImgUrl.length - 1])) {
        response.status(400).json({
            message: `Inserisci un formato immagine tra quelli supportati: 'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'tif', 'tiff'`
        });
        return;
    }

    if (typeof request.body.tags !== 'object' || request.body.tags.length === 0) {
        response.status(400).json({
            message: `Il valore di 'tags' deve essere un array di stringhe non vuoto`
        });
        return;
    }

    request.body.tags.forEach(tag => {
        if (typeof tag !== 'string') {
            response.status(400).json({
                message: `Puoi inserire solo stringhe all'interno di 'tags'`
            });
            return;
        }
    });

    if (typeof request.body.prep_time !== 'number') {
        response.status(400).json({
            message: `Il valore di 'prep_time' deve essere un numero`
        });
        return;
    }

    const sortedByIndex = rawPosts.toSorted(function (a, b) { return b.id - a.id });

    const newPostId = sortedByIndex[0] + 1;
    const date = new Date();
    const newPostDay = date.toLocaleDateString();
    const newPostTime = date.toLocaleTimeString();
    const newPostDate = `${newPostDay}T${newPostTime}Z`;
    const rawSlugArr = request.body.title.split(' ');
    let newPostSlug;

    newPostSlug = rawSlugArr.filter(current => {
        return current !== '';
    }).join('-').toLowerCase();

    let slugCounter = 1;
    let tempSlug = newPostSlug;                                                                          //positionToUpdate
    const positionToUpdate = rawPosts.findIndex((post) => {return post.slug === request.params.slug}); //serve per sovrascrivere il post precedente
    console.log(positionToUpdate);
    
    rawPosts.forEach(post => {
        if (tempSlug === post.slug) {
            tempSlug = `${newPostSlug}-${slugCounter}`;
            slugCounter++;
        }
    })

    newPostSlug = tempSlug;

    const newPost = {
        ...request.body,
        id: newPostId,
        created_at: newPostDate,
        slug: newPostSlug,
        published: true
    }

    return {newPost, positionToUpdate};
}

function create(request, response) {
    const { newPost } = createAndUpdateValidation(request, response)
    
    rawPosts.push(newPost);

    response.status(201).json({
        message: `Post creato correttamente con slug: '${newPost.slug}'`
    });
}

function update(request, response) {
    const {newPost: updatedPost, positionToUpdate} = createAndUpdateValidation(request, response);

    rawPosts.splice(positionToUpdate, 1, updatedPost);


    response.status(200).json({
        message: `post con slug: ${updatedPost.slug} updatato`
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
    const { searchedPost } = showAndDeleteValidation(request, response);
    const deletingId = rawPosts.findIndex((post) => {return post.slug === request.params.slug});

    rawPosts.splice(deletingId, 1);


    response.status(200).json({
        message: `post con slug: ${request.params.slug} eliminato`
    });

}



export { index, show, create, update, modify, destroy }