from flask import Flask, request, send_from_directory, Response
from flask import make_response, current_app
from functools import update_wrapper
import datetime
from datetime import timedelta
import os
import json

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

@app.route('/clips/<path:path>')
@crossdomain(origin='*')
def send_js(path):
    return send_from_directory('video-clips', path)

@app.route('/data')
@crossdomain(origin='*')
def data():
    start_time_str = request.args.get('start')
    stop_time_str = request.args.get('stop')
    start_time = datetime.datetime.strptime(start_time_str, "%Y-%m-%dT%H-%M-%SZ")
    stop_time = datetime.datetime.strptime(stop_time_str, "%Y-%m-%dT%H-%M-%SZ")
    print "start time: ", start_time
    clips = os.listdir("./video-clips")
    r = []
    for c in clips:
        if "out__" in c:
            dstr = c[5:25]
            d = datetime.datetime.strptime(dstr, "%Y-%m-%dT%H-%M-%SZ")
            if d >= start_time and d <= stop_time:
                r.append(c)
    j = json.dumps({"results": r})
    return Response(response=j, status=200, mimetype="application/json")

if __name__ == "__main__":
    app.run()
