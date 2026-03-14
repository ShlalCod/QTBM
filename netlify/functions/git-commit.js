// Netlify Function: Git Content API
// Commits content changes to the GitHub repository

exports.handler = async (event, context) => {
    const { user } = context.clientContext || {};
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (!user) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Unauthorized' })
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { content, message } = JSON.parse(event.body);
        
        // Get GitHub token from environment
        const githubToken = process.env.GITHUB_TOKEN;
        const repo = process.env.GITHUB_REPO; // e.g., "username/repo"
        const branch = process.env.GITHUB_BRANCH || 'main';
        
        if (!githubToken || !repo) {
            // Fall back to simple storage
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Content saved locally (Git not configured)',
                    storage: 'local'
                })
            };
        }

        // Get current file SHA
        const getFileUrl = `https://api.github.com/repos/${repo}/contents/data/content.json?ref=${branch}`;
        
        let sha = null;
        try {
            const fileResponse = await fetch(getFileUrl, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (fileResponse.ok) {
                const fileData = await fileResponse.json();
                sha = fileData.sha;
            }
        } catch (e) {
            console.log('File does not exist yet, will create it');
        }

        // Commit the new content
        const putUrl = `https://api.github.com/repos/${repo}/contents/data/content.json`;
        const commitData = {
            message: message || 'Update portfolio content via admin panel',
            content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
            branch: branch
        };
        
        if (sha) {
            commitData.sha = sha;
        }

        const commitResponse = await fetch(putUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commitData)
        });

        if (!commitResponse.ok) {
            throw new Error(`GitHub API error: ${commitResponse.status}`);
        }

        const result = await commitResponse.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Content committed to GitHub',
                commit: result.commit,
                storage: 'git'
            })
        };

    } catch (error) {
        console.error('Git commit error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to commit to GitHub',
                details: error.message
            })
        };
    }
};
