export default {
    async fetch(request, env) {

        const API_KEY = env.API_KEY;
        const url = new URL(request.url);
        const auth = request.headers.get("Authorization");

        // API KEY CHECK
        if (auth !== `Bearer ${API_KEY}`) {
            return json({
                error: "Unauthorized"
            }, 401);
        }

        // ONLY ALLOW POST
        if (request.method !== "POST" || url.pathname !== "/") {
            return json({
                error: "Not allowed"
            }, 405);
        }

        try {

            const { prompt } = await request.json();

            if (!prompt) {
                return json({
                    error: "Prompt is required"
                }, 400);
            }

            // GENERATE IMAGE
            const result = await env.AI.run(
                "@cf/black-forest-labs/flux-1-schnell",
                {
                    prompt,
                    width: 1024,
                    height: 1024,
                    num_steps: 4
                }
            );

            // RETURN IMAGE
            return new Response(result, {
                headers: {
                    "Content-Type": "image/png"
                }
            });

        } catch (err) {

            return json({
                error: "Failed to generate image",
                details: err.message
            }, 500);

        }
    },
};

// JSON FUNCTION
function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json"
        },
    });
}
