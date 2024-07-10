// Path: /plugins/strapi-gen/controllers/Workflow.js

module.exports = {
    async triggerWorkflow(ctx) {
      const githubToken = process.env.GITHUB_TOKEN;
      const dockerUsername = process.env.DOCKER_USERNAME;
      const dockerPassword = process.env.DOCKER_PASSWORD;
      const owner = 'ala-jaidi';
      const repo = 'dockerstrapi';
      const workflow_id = 'workflow.yml';
  
      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`;
        const body = {
          ref: 'main',
        };
  
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        });
  
        if (!response.ok) {
          const errorResponse = await response.json();
          console.error("GitHub API responded with error:", errorResponse);
          ctx.send({ error: `GitHub API error, status: ${response.status}`, details: errorResponse }, 500);
          return;
        }
  
        ctx.send({ message: "Workflow triggered successfully", dockerUsername, dockerPassword });
      } catch (error) {
        ctx.send({ error: error.message }, 500);
      }
    }
  };
  