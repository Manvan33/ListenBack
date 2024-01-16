export const prerender = false

export async function GET({params, request}) {
    let query = new URLSearchParams(request.url.split("?")[1]);
    return new Response(
        JSON.stringify({
            message: "Hello World",
            // Parse search params from request
            "params": query.get('artist'),
        }),
        {
            headers: {
                "content-type": "application/json;charset=UTF-8"
            }
        }
    )
}

var client_id = 'CLIENT_ID';
var client_secret = 'CLIENT_SECRET';

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var token = body.access_token;
  }
});