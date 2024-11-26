from flask import Flask, request, render_template, jsonify
import subprocess

app = Flask(__name__)
@app.route('/')
def index():
    return "Server is running"

@app.route('/webhook', methods=['POST'])
def webhook():
    if request.method == 'POST':
        subprocess.Popen(["sh", 'deploy.sh'])
        return 'Updated successfully', 200
    else:
        return 'Forbidden', 403

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)