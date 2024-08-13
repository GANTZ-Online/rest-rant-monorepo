import { useState } from "react";

function NewCommentForm({ place }) {
    const [comment, setComment] = useState({
        text: "",
        stars: 1,
    });

    async function createComment(commentAttributes) {
        const response = await fetch(`http://localhost:5000/places/${place.placeId}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
				
            },
            body: JSON.stringify(commentAttributes)
        });

        const newComment = await response.json();

        setPlace((prevPlace) => ({
            ...prevPlace,
            comments: [
                ...prevPlace.comments,
                newComment
            ]
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

    return (
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
    );
}

export default NewCommentForm;
