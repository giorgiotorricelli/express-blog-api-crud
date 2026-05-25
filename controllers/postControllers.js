import posts from "../data/posts.js";

function index(request, response) {
    response.status(200).json({
        message: "Ecco la lista dei post",
        posts: posts
    });
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
    response.status(200).json({
        message: 'post creato con id puppa'
    })
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

    response.status(200).json({
        message: `post con id ${realId} eliminato`
    })
}



export { index, show, create, update, modify, destroy }