document.addEventListener('DOMContentLoaded', () => {
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');

    function loadComments() {
        fetch('/comments.json')
            .then(response => response.json())
            .then(comments => {
                commentsList.innerHTML = '';
                comments.forEach(comment => {
                    const li = document.createElement('li');
                    li.textContent = `${comment.date} - ${comment.author}: ${comment.comment}`;
                    commentsList.appendChild(li);
                });
            });
    }

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = document.getElementById('author').value.trim();
        const commentText = document.getElementById('comment').value.trim();

        if (!author || !commentText) return alert('Uzupełnij wszystkie pola!');

        fetch('/add-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, comment: commentText })
        })
        .then(response => response.json())
        .then(() => {
            loadComments();
            commentForm.reset();
        });
    });

    loadComments();
});
