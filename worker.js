export default {
  async fetch(request, env) {

    const API_KEY = env.API_KEY;
    const auth = request.headers.get("Authorization");

    if (auth !== `Bearer ${API_KEY}`) {
      return Response.json({
        error: "Unauthorized"
      }, { status: 401 });
    }

    if (request.method !== "POST") {
      return Response.json({
        error: "Only POST allowed"
      }, { status: 405 });
    }

    try {

      const { prompt } = await request.json();

      if (!prompt) {
        return Response.json({
          error: "Prompt required"
        }, { status: 400 });
      }

      const result = await env.AI.run(
        "@cf/black-forest-labs/flux-1-schnell",
        {
          prompt,
          width: 1024,
          height: 1024,
          num_steps: 4
        }
      );

      // IMPORTANT
      return new Response(result, {
        headers: {
          "content-type": "image/png"
        }
      });

    } catch (e) {

      return Response.json({
        error: e.message
      }, { status: 500 });

    }
  }
}
