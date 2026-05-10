export default {
  async fetch(request, env) {

    // API KEY CHECK
    const API_KEY = env.API_KEY;
    const auth = request.headers.get("Authorization");

    if (auth !== `Bearer ${API_KEY}`) {
      return json({
        success: false,
        error: "Unauthorized"
      }, 401);
    }

    // ONLY POST ALLOWED
    if (request.method !== "POST") {
      return json({
        success: false,
        error: "Only POST requests allowed"
      }, 405);
    }

    try {

      // GET BODY
      const body = await request.json();
      const prompt = body.prompt;

      if (!prompt) {
        return json({
          success: false,
          error: "Prompt is required"
        }, 400);
      }

      // GENERATE IMAGE
      const image = await env.AI.run(
        "@cf/black-forest-labs/flux-1-schnell",
        {
          prompt: prompt,

          // Optional settings
          width: 1024,
          height: 1024,
          num_steps: 4
        }
      );

      // RETURN IMAGE
      return new Response(image, {
        headers: {
          "Content-Type": "image/jpeg"
        }
      });

    } catch (err) {

      return json({
        success: false,
        error: err.message
      }, 500);

    }
  }
};

// JSON RESPONSE FUNCTION
function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
