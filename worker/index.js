export default {
  async fetch(request, env, ctx) {
    let headers = request.headers;
    let result = {};
    for (const [name, value] of headers.entries()) {
      if (name.startsWith('cf-') || name.startsWith('cf-'))
        result[name] = value;
    }
    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 200
    });
  },
};