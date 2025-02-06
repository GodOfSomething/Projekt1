const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3972;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        let filePath = '.' + req.url;
        if (filePath === './') filePath = './index.html';

        const extname = path.extname(filePath);
        let contentType = 'text/html';

        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 - File Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });

    } else if (req.method === 'POST' && req.url === '/add-comment') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const newComment = JSON.parse(body);
            fs.readFile('comments.json', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Błąd serwera' }));
                    return;
                }

                const comments = JSON.parse(data);
                newComment.id = comments.length ? comments[comments.length - 1].id + 1 : 1;
                newComment.date = new Date().toISOString().split('T')[0];
                comments.push(newComment);

                fs.writeFile('comments.json', JSON.stringify(comments, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Błąd zapisu' }));
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newComment));
                });
            });
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Metoda niedozwolona');
    }
});

server.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
