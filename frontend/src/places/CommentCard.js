import React, { useContext } from 'react';
import { CurrentUser } from '../contexts/CurrentUser'; // Update the import path as necessary

function CommentCard({ comment, onDelete }) {
    const { currentUser } = useContext(CurrentUser);

    // Determine if the delete button should be shown
    const deleteButton = currentUser?.userId === comment.authorId ? (
        <button className="btn btn-danger" onClick={onDelete}>
            Delete Comment
        </button>
    ) : null;

    return (
        <div className="border col-sm-4">
            <h2 className="rant">{comment.rant ? 'Rant! 😡' : 'Rave! 😻'}</h2>
            <h4>{comment.content}</h4>
            <h3>
                <strong>- {comment.author.firstName} {comment.author.lastName}</strong>
            </h3>
            <h4>Rating: {comment.stars}</h4>
            {deleteButton}
        </div>
    );
}

export default CommentCard;
