import React, { useState } from "react";

function PlaceDetails({ place, currentUser, editPlace, deletePlace }) {
    const [comment, setComment] = useState({
        text: "",
        stars: 1,
    });

    async function createComment(commentAttributes) {
        const response = await fetch(`http://localhost:5001/places/${place.placeId}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentAttributes),
        });

        const newComment = await response.json();

        setPlace((prevPlace) => ({
            ...prevPlace,
            comments: [
                ...prevPlace.comments,
                newComment,
            ],
        }));
    }

    function handleChange(event) {
        setComment({
            ...comment,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        await createComment(comment);
        setComment({ text: "", stars: 1 });
    }

    const comments = place.comments.map(comment => (
        <CommentCard
            key={comment.commentId}
            comment={comment}
            onDelete={() => deleteComment(comment)}
        />
    ));

    let placeActions = null;

    if (currentUser?.role === 'admin') {
        placeActions = (
            <>
                <a className="btn btn-warning" onClick={editPlace}>
                    Edit
                </a>
                <button type="button" className="btn btn-danger" onClick={deletePlace}>
                    Delete
                </button>
            </>
        );
    }

    return (
        <main>
            <div className="row">
                <h4>
                    Serving {place.cuisines}.
                </h4>
                <br />
                {placeActions}
            </div>
            <div className="row">
                {comments}
            </div>
            <form onSubmit={handleSubmit}>
                <textarea
                    name="text"
                    value={comment.text}
                    onChange={handleChange}
                    placeholder="Add your comment"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </main>
    );
}

export default PlaceDetails;

